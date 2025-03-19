<template>
  <div>
    <a-button class="map-button" :type="status ? 'default' : 'primary'" :size="buttonSize" @click="statusSwitch">
      <i class="fa-solid fa-hand-pointer"></i>
    </a-button>

    <div ref="olPopup" id="popup" class="ol-popup" :class="status ? 'ol-popup__active' : ''" style="display: block">
      <a href="#" id="popup-closer" class="ol-popup-closer fs-6"></a>
      <div id="popup-content">
        <a-card
          size="small"
          style="width: 300px"
          :bodyStyle="{ padding: 0 }"
          :headStyle="{ paddingLeft: '8px', fontSize: '1rem' }"
          :bordered="false">
          <template #title>
            <div class="d-flex">
              <span style="font-weight: bold" class="me-2">{{ title }}</span>
            </div>
          </template>

          <a-table
            class="ant-table-striped"
            tableLayout="fixed"
            :columns="columns"
            :data-source="rows"
            size="small"
            :pagination="false"
            :showHeader="false"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            :style="{ fontSize: '0.8rem', borderRadius: '8px' }">
            <template #footer>
              <a-flex justify="space-around">
                <a-button type="primary" size="small" block @click="openDrawer">
                  <i class="fa-solid fa-circle-info me-1"></i> Thông tin chi tiết
                </a-button>
              </a-flex>
            </template>
          </a-table>
        </a-card>
      </div>
    </div>

    <a-drawer
      v-model:open="drawerOpen"
      placement="right"
      :get-container="mapContainer"
      :bodyStyle="{ padding: 0 }"
      :headerStyle="{ backgroundColor: 'var(--primary-color)', padding: '8px 16px 8px 16px' }"
      :closable="false"
      :mask="false"
      width="20vw"
      height="100vh">
      <template #title>
        <a-flex justify="space-between" align="center">
          <a-typography-text class="text-white" strong>Thông tin</a-typography-text>
          <a-button class="no-border-ant-button" type="primary" @click="closeDrawer">
            <i class="fa-solid fa-times fs-5"></i>
          </a-button>
        </a-flex>
      </template>
      <a-collapse v-model:activeKey="activeKey" :bordered="false" expand-icon-position="end" ghost>
        <a-collapse-panel key="1">
          <template #header>
            <a-flex class="mb-3" align="center">
              <i class="fa-solid fa-circle-info fs-5 me-2"></i>
              <a-typography-text strong>Chi tiết</a-typography-text>
            </a-flex>
            <a-typography-text strong style="color: #75d64e">{{ title }}</a-typography-text>
          </template>

          <div v-if="featureTitles[layerTitle]">
            <div v-for="(value, key, index) in datafields" :key="key">
              <a-flex v-if="layerTitle == 'Khu vực trồng trọt'" vertical>
                <a-typography-text>{{ featureTitles[layerTitle][index].title }}</a-typography-text>
                <a-typography-text type="secondary" strong>{{ value }}</a-typography-text>
                <a-divider dashed style="margin: 16px 0; border-color: #7cb305" />
              </a-flex>

              <a-flex v-else vertical>
                <!-- <a-typography-text v-if="key != 'Tên'">{{
                key + featureTitles[layerTitle][index].title
              }}</a-typography-text> -->
                <a-typography-text v-if="featureTitles[layerTitle][index + 1]">{{
                  featureTitles[layerTitle][index + 1].title
                }}</a-typography-text>
                <a-flex v-if="key == 'lich_su_canh_tac'">
                  <a-button type="primary" @click="openHistoryModal"> Xem lịch sử </a-button>
                </a-flex>
                <a-typography-text v-else type="secondary" strong>{{ value }}</a-typography-text>
                <a-divider dashed style="margin: 16px 0; border-color: #7cb305" />
              </a-flex>
            </div>
          </div>

          <div v-else>
            <div v-for="(value, key) in datafields" :key="key">
              <a-flex vertical>
                <a-typography-text>
                  {{ key }}
                </a-typography-text>

                <a-typography-text type="secondary" strong>{{ value }}</a-typography-text>
                <a-divider dashed style="margin: 16px 0; border-color: #7cb305" />
              </a-flex>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2">
          <template #header>
            <a-flex align="center">
              <i class="fa-solid fa-image fs-5 me-2"></i>

              <a-typography-text strong>Hình ảnh</a-typography-text>
            </a-flex>
          </template>
          Hình ảnh ...
        </a-collapse-panel>
        <a-collapse-panel key="3">
          <template #header>
            <a-flex align="center">
              <i class="fa-solid fa-paperclip fs-5 me-2"></i>
              <a-typography-text strong>Tài liệu đính kèm</a-typography-text>
            </a-flex>
          </template>
          Tài liệu 1
        </a-collapse-panel>
      </a-collapse>
    </a-drawer>

    <a-modal v-model:open="historyModalOpen" :footer="false">
      <template #title>
        <a-typography-text>
          <i class="fa-solid fa-history fs-5 me-2"></i> Lịch sử canh tác hộ {{ title }}
        </a-typography-text>
      </template>
      <a-table :columns="historyColumns" :data-source="farmerHistory"> </a-table>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "../../stores/map-state";
import VectorLayer from "ol/layer/Vector";
import { Vector as VectorSource } from "ol/source";
import { Feature, Overlay } from "ol";
import { Style, Stroke, Circle, Fill } from "ol/style.js";
import * as VueLayer from "@/js/VueLayer.js";
import { initStaticDataState } from "@/stores/init-static-data-state";

export default defineComponent({
  components: {},
  props: {
    buttonSize: {
      type: String,
      default: "small",
    },
  },
  setup() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        align: "center",
        width: 150,
      },
      {
        title: "Value",
        dataIndex: "value",
        align: "center",
        width: 147,
      },
    ];

    const historyColumns = [
      {
        title: "Năm",
        dataIndex: "nam",
      },
      {
        title: "Vụ mùa",
        dataIndex: "vu_mua",
      },
      {
        title: "Năng suất",
        dataIndex: "nang_suat",
      },
    ];
    return {
      columns,
      historyColumns,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
    featureTitles() {
      return initStaticDataState().getColumns;
    },
  },

  data() {
    return {
      featureProp: [],
      layerTitle: "",
      title: "",
      rows: [],
      datafields: {},
      status: false,
      drawerOpen: false,
      highlightLabelStyles: {
        MultiLineString: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 4,
            lineDash: [10],
          }),
        }),
        LineString: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 4,
            lineDash: [10],
          }),
        }),
        Point: new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "pink",
            }),
            stroke: new Stroke({
              color: "white",
              width: 1,
            }),
          }),
        }),
        MultiPolygon: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 2,
            lineDash: [10],
          }),
          fill: new Fill({
            color: "rgba(243, 138, 138, 0.5)",
          }),
        }),
        Polygon: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 3,
            lineDash: [10],
          }),
          fill: new Fill({
            color: "rgba(243, 138, 138, 0.5)",
          }),
        }),
        Circle: new Style({
          stroke: new Stroke({
            color: "cyan",
            width: 1,
            lineDash: [10],
          }),
          fill: new Fill({
            color: "rgba(243, 138, 138, 0.5)",
          }),
        }),
      },
      showPopupKey: null,
      mapContainer: null,
      activeKey: ["1"],
      farmerHistory: [],
      historyModalOpen: false,
    };
  },

  mounted() {
    const mapContainer = document.getElementById("map-container");
    this.mapContainer = mapContainer;
  },

  watch: {
    map: {
      // cái này chỉ dùng được khi khai báo ở home
      // khai báo ở các component con không hoạt động
      // chắc là do ở home là chỗ khai báo ol.Map
      handler() {
        this.addClick();
      },
      deep: false,
    },
  },

  methods: {
    statusSwitch() {
      this.status = !this.status;
      VueLayer.getLayerByTitle(this.map, "Feature highlight layer").getSource().clear();
      this.map.getOverlayById("featurePopupOverlay").setPosition(undefined);
      VueLayer.getLayerByTitle(this.map, "Feature highlight layer").setVisible(this.status);
    },

    stylePopup(feature) {
      return this.highlightLabelStyles[feature.getGeometry().getType()];
    },

    addClick() {
      let closer = document.getElementById("popup-closer");
      let highlightLayer = new VectorLayer({
        title: "Feature highlight layer",
        source: new VectorSource({}),
        style: this.stylePopup,
      });
      highlightLayer.setVisible(false);
      const overlay = new Overlay({
        title: "Feature popup",
        id: "featurePopupOverlay",
        element: document.getElementById("popup"),
        // autoPan: {
        //   animation: {
        //     duration: 250,
        //   },
        // },
      });

      closer.onclick = function () {
        highlightLayer.getSource().clear();
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.map.addOverlay(overlay);

      this.map.addLayer(highlightLayer);

      let that = this;

      this.showPopupKey = this.map.on("singleclick", function (evt) {
        that.featureProp = [];
        highlightLayer.getSource().clear();
        evt.target.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
          if (layer && highlightLayer.getVisible()) {
            let featureProp = {};
            featureProp.rows = [];
            featureProp.geom = "";
            let props = feature.getProperties();
            featureProp.title = props.name;
            featureProp.datafields = JSON.parse(feature.getProperties().datafields);

            if (featureProp.datafields != null && featureProp.datafields.hasOwnProperty("lich_su_canh_tac")) {
              that.farmerHistory = featureProp.datafields.lich_su_canh_tac;
            }
            that.layerTitle = layer.get("title");
            Object.keys(props).forEach((x, i, arr) => {
              if (x != "geometry" && x != "datafields") {
                featureProp.rows.push({
                  key: i + 1,
                  name: x.toUpperCase(),
                  value: props[x],
                });
              } else if (x == "geometry") {
                featureProp.geom = props[x];
              }
              if (i > 10) {
                arr.length = i + 1;
              }
            });

            if (featureProp.rows.length) {
              that.featureProp.push(featureProp);
            }
          } else {
            // highlightLayer.setVisible(false);
            // highlightLayer.getSource().clear();
          }
        });

        if (that.featureProp.length) {
          // Nếu click trúng nhiều thằng thì chỉ lấy thằng đầu tiên để hiển thị
          that.title = that.featureProp[0].title;
          that.rows = that.featureProp[0].rows;
          that.datafields = that.featureProp[0].datafields;
          let feature = new Feature({
            geometry: that.featureProp[0].geom,
          });
          // console.log(that.featureProp[0].rows);
          highlightLayer.getSource().addFeature(feature);
          const coordinate = evt.coordinate;
          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
          that.drawerOpen = false;
        }
      });
    },

    popupCloser() {
      console.log(this.$el.querySelector(".ol-popup"));
    },

    openDrawer() {
      this.drawerOpen = true;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
    openHistoryModal() {
      this.historyModalOpen = true;
    },
  },
});
</script>

<style scoped lang="scss">
.ol-popup {
  background: transparent;
  position: absolute;
  bottom: 12px;
  left: -50px;
}

.ol-popup__active {
  display: block;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  z-index: 1000;
}
.ol-popup-closer:after {
  content: "✖";
}

[data-doc-theme="light"] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
[data-doc-theme="dark"] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
