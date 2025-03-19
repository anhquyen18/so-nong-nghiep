<template>
  <a-button class="map-button" :type="buttonType" :size="buttonSize" @click="startMeasure">
    <i class="fa-solid fa-draw-polygon"></i>
  </a-button>
  <div
    ref="controlPanel"
    class="ol-tool-control-panel measure-control-panel"
    :style="{ display: measureControlPanelDisplay }">
    <a-card
      title="Đo đạc"
      size="small"
      :bodyStyle="{ padding: '5px', width: '150px', maxHeight: '150px', overflow: 'hidden' }">
      <template #extra>
        <a class="close-button" @click="stopMeasure"><i class="fa-solid fa-xmark"></i></a>
      </template>
      <a-select
        v-model:value="measureType"
        style="width: 100%"
        :options="measureTypes"
        @change="measureTypeChange"
        size="small"
        :dropdownMatchSelectWidth="false"></a-select>
      <a-row class="mt-1">
        <a-col :span="6" :offset="2">
          <!-- <a-select
              size="small"
              v-model:value="measureStatus"
              :options="mesureStatuses"
              style="width: 100%"
              @change="measureStatusChange"></a-select> -->
          <a-switch v-model:checked="measureStatus" size="small" @change="measureStatusChange"> </a-switch>
        </a-col>
        <a-col :span="6" :offset="4">
          <a-button type="primary" size="small" @click="clearMeasure">Xoá đo</a-button>
        </a-col>
      </a-row>

      <!-- <div class="row mt-2 justify-content-center align-items-center">
          <a-button type="text" size="small" danger style="width: 50%" @click="stopMeasure">
            <i class="fa-solid fa-ban me-1" style="font-size: 0.8rem"></i>Stop
          </a-button>
        </div> -->
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapState } from "../../stores/map-state.js";
import { Vector as VectorSource } from "ol/source.js";
import { Circle, Fill, Stroke, Style, RegularShape, Text } from "ol/style.js";
import { Modify, Draw } from "ol/interaction.js";
import * as Sphere from "ol/sphere.js";
import { LineString, Point } from "ol/geom.js";
import * as VueLayer from "../../js/VueLayer.js";

export default defineComponent({
  component: {},
  props: {
    buttonSize: {
      type: String,
      default: "small",
    },
  },
  setup() {
    const modalOpen = ref(false);

    return {
      modalOpen,
    };
  },
  data() {
    return {
      measureSource: new VectorSource(),
      measureStyle: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgba(38, 111, 247, 0.8)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          fill: new Fill({
            color: "rgba(38, 111, 247, 0.5)",
          }),
        }),
      }),

      measureLabelStyle: new Style({
        text: new Text({
          font: "14px Calibri,sans-serif",
          fill: new Fill({
            color: "rgba(255, 255, 255, 1)",
          }),
          backgroundFill: new Fill({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          padding: [3, 3, 3, 3],
          textBaseline: "bottom",
          offsetY: -15,
        }),
        image: new RegularShape({
          radius: 8,
          points: 3,
          angle: Math.PI,
          displacement: [0, 10],
          fill: new Fill({
            color: "rgba(0, 0, 0, 0.7)",
          }),
        }),
      }),

      measureTipStyle: new Style({
        text: new Text({
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "rgba(255, 255, 255, 1)",
          }),
          backgroundFill: new Fill({
            color: "rgba(0, 0, 0, 0.4)",
          }),
          padding: [2, 2, 2, 2],
          textAlign: "left",
          offsetX: 15,
        }),
      }),

      measureModifyStyle: new Style({
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          fill: new Fill({
            color: "rgba(0, 0, 0, 0.4)",
            color: "rgba(38, 111, 247, 0.8)",
          }),
        }),
        text: new Text({
          text: "Kéo để tùy chỉnh",
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "rgba(255, 255, 255, 1)",
          }),
          backgroundFill: new Fill({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          padding: [2, 2, 2, 2],
          textAlign: "left",
          offsetX: 15,
        }),
      }),

      measureSegmentStyle: new Style({
        text: new Text({
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "rgba(255, 255, 255, 1)",
          }),
          backgroundFill: new Fill({
            color: "rgba(0, 0, 0, 0.4)",
          }),
          padding: [2, 2, 2, 2],
          textBaseline: "bottom",
          offsetY: -12,
        }),
        image: new RegularShape({
          radius: 6,
          points: 3,
          angle: Math.PI,
          displacement: [0, 8],
          fill: new Fill({
            color: "rgba(0, 0, 0, 0.4)",
          }),
        }),
      }),

      tipPoint: null,
      measureModify: new Modify({
        source: new VectorSource(),
      }),
      drawMeasure: null,

      // control panel------------------------------------------------
      measureType: "LineString",
      measureTypes: [
        {
          value: "LineString",
          label: "Khoảng cách (m)",
        },
        {
          value: "Polygon",
          label: "Vùng (m2)",
        },
      ],
      mesureStatuses: [
        {
          value: "active",
          label: "Đo",
        },
        {
          value: "inactive",
          label: "Tạm dừng",
        },
      ],
      measureStatus: false,
      measureControlPanelDisplay: "none",
      buttonType: "primary",
      buttonStatus: false,
    };
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  methods: {
    measureFormatLength(line) {
      const length = Sphere.getLength(line);
      let output;

      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " km";
      } else {
        output = Math.round(length * 100) / 100 + " m";
      }
      return output;
    },
    measureFormatArea(polygon) {
      const area = Sphere.getArea(polygon);
      // const perimeter = ol.sphere.getLength(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
      } else {
        output = Math.round(area * 100) / 100 + " m\xB2";
      }
      return output;
    },
    measureStyleFunction(feature, segments, drawType, tip) {
      const styles = [this.measureStyle];
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      const measureSegmentStyles = [this.measureSegmentStyle];

      let point, label, line;
      if (!drawType || drawType === type) {
        if (type === "Polygon") {
          point = geometry.getInteriorPoint();
          label = this.measureFormatArea(geometry);
          line = new LineString(geometry.getCoordinates()[0]);
        } else if (type === "LineString") {
          point = new Point(geometry.getLastCoordinate());
          label = this.measureFormatLength(geometry);
          line = geometry;
        }
      }
      if (segments && line) {
        let count = 0;
        let that = this;
        line.forEachSegment(function (a, b) {
          const segment = new LineString([a, b]);
          const label = that.measureFormatLength(segment);
          if (measureSegmentStyles.length - 1 < count) {
            measureSegmentStyles.push(that.measureSegmentStyle.clone());
          }
          const segmentPoint = new Point(segment.getCoordinateAt(0.5));
          measureSegmentStyles[count].setGeometry(segmentPoint);
          measureSegmentStyles[count].getText().setText(label);
          styles.push(measureSegmentStyles[count]);
          count++;
        });
      }
      if (label) {
        this.measureLabelStyle.setGeometry(point);
        this.measureLabelStyle.getText().setText(label);
        styles.push(this.measureLabelStyle);
      }
      if (tip && type === "Point" && !this.measureModify.getOverlay().getSource().getFeatures().length) {
        this.tipPoint = geometry;
        this.measureTipStyle.getText().setText(tip);
        styles.push(this.measureTipStyle);
      }
      return styles;
    },
    getMeasureStyle(feature) {
      return this.measureStyleFunction(feature, true);
    },
    measureAddInteraction(measureType) {
      const activeTip = "Click trái đề tiếp tục vẽ" + (measureType === "Polygon" ? " vùng" : " đoạn thẳng");
      const idleTip = "Click trái để bắt đầu đo";
      let tip = idleTip;
      let that = this;

      this.drawMeasure = new Draw({
        source: that.measureSource,
        type: measureType,
        style: function (feature) {
          return that.measureStyleFunction(feature, true, measureType, tip);
        },
      });
      this.drawMeasure.on("drawstart", function () {
        that.measureModify.setActive(false);
        tip = activeTip;
      });
      this.drawMeasure.on("drawend", function () {
        that.measureModify.setActive(true);
        that.map.once("pointermove", function () {
          that.measureModifyStyle.setGeometry();
        });
        tip = idleTip;
      });

      this.measureModify.setActive(true);
      this.map.addInteraction(this.drawMeasure);
    },

    // control panel---------------------------------------------------
    clearMeasure() {
      this.measureSource.clear();
      this.measureModify.setActive(false);
    },
    measureTypeChange() {
      this.map.removeInteraction(this.drawMeasure);
      this.measureAddInteraction(this.measureType);
    },
    measureStatusChange() {
      if (this.measureStatus) {
        this.map.addInteraction(this.drawMeasure);
      } else {
        this.map.removeInteraction(this.drawMeasure);
      }
    },
    stopMeasure() {
      // this.$refs.measureToolRef.stopMeasure();
      // this.measurePopupVisible = false;
      this.measureControlPanelDisplay = "none";
      this.measureSource.clear();
      this.map.removeInteraction(this.drawMeasure);
      this.map.removeInteraction(this.measureModify);
      this.drawMeasure = null;
      this.measureStatus = false;

      this.buttonType = "primary";
      this.buttonStatus = false;
      // console.log(this.map.getInteractions());
      // this.measureModify.setActive(false);
    },
    startMeasure() {
      // console.log(data, this.measurePopupVisible);
      // this.measurePopupVisible = data;
      // console.log(this.drawMeasure);
      if (!this.drawMeasure) {
        // console.log(this.map.getInteractions());
        this.measureControlPanelDisplay = "block";

        this.buttonType = "default";
        this.buttonStatus = true;

        this.measureStatus = true;
        VueLayer.getLayerByTitle(this.map, "Measure layer").setSource(this.measureSource);
        VueLayer.getLayerByTitle(this.map, "Measure layer").setStyle(this.getMeasureStyle);
        this.measureModify = new Modify({
          source: this.measureSource,
          style: this.measureModifyStyle,
        });
        // console.log(this.map.getInteraction);
        this.map.addInteraction(this.measureModify);
        this.measureAddInteraction("LineString");
      } else {
        this.stopMeasure();
      }
    },
  },

  mounted() {
    const container = document.getElementById("map-container");
    container.appendChild(this.$refs.controlPanel);
  },
});
</script>

<style lang="scss">
.measure-control-panel {
  // width: 500px;
  max-height: 200px;
}

.close-button {
  &:hover {
    color: var(--error-color) !important;
  }
}
</style>
