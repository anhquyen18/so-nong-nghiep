<template>
  <a-popover trigger="click" placement="topRight" color="white">
    <template #content>
      <div style="max-width: 70vw">
        <a-divider style="border-color: black" orientation="left">Basemaps</a-divider>
        <a-row class="basemap-layer" :gutter="[0, 8]">
          <a-col :xl="4" :xs="6" v-for="(layer, key) in basemapLayerData" :key="key">
            <a-tooltip>
              <template #title>{{ layer.title }}</template>
              <div class="layer-image">
                <a-button
                  @click="changeBaseMap(layer.imagePath, layer.title)"
                  type="primary"
                  shape="circle"
                  block
                  class="h-100">
                  <img
                    :public="layer.imagePath"
                    alt=""
                    width="57"
                    height="57"
                    class="layer-image__image position-absolute rounded-circle" />
                </a-button>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
    </template>
    <div class="layer-image">
      <a-button type="primary" shape="circle" block class="h-100">
        <img
          :public="layerManagerImage"
          alt=""
          width="57"
          height="57"
          class="layer-image__image position-absolute rounded-circle" />
      </a-button>
    </div>
  </a-popover>
</template>

<script>
import { defineComponent, ref, inject } from "vue";

import { mapState } from "../../stores/map-state";
import * as VueLayer from "../../js/VueLayer";
import { InfoCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    InfoCircleOutlined,
  },
  setup() {
    const basemapLayerData = [
      {
        title: "Open Street Map",
        imagePath: "/public/layer-image/Openstreetmap_logo.png",
      },
      {
        title: "Google Map",
        imagePath: "/public/layer-image/googlemap.jpg",
      },
      // {
      //   title: 'Water Color',
      //   imagePath: '/public/layer-image/watercolor.png',
      // },
      {
        title: "Toner",
        imagePath: "/public/layer-image/toner.png",
      },
      {
        title: "Topo Map",
        imagePath: "/public/layer-image/topo.jpg",
      },
      {
        title: "Streets Map",
        imagePath: "/public/layer-image/streets.png",
      },
      {
        title: "No Basemap",
        imagePath: "/public/layer-image/nobasemap.png",
      },
    ];

    const mainLayerData = inject("mainLayerData");

    // default basemap
    var layerManagerImage = ref(basemapLayerData[4].imagePath);
    const layersInfoOpen = ref(false);
    const test = ref(false);

    return {
      basemapLayerData,
      layerManagerImage,
      mainLayerData,
      layersInfoOpen,
      test,
    };
  },

  computed: {
    getSignInState: function () {
      return userState().getSignInState;
    },
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    changeBaseMap(image, title) {
      this.layerManagerImage = image;
      const baseLayers = this.map.getLayers().getArray()[0].getLayers().getArray();
      baseLayers.forEach((element) => {
        element.setVisible(false);
        if (element.get("title") == title) {
          element.setVisible(true);
        }
      });
    },
    changeLayerVisible(layerName, index) {
      var layer = VueLayer.getLayerByTitle(this.map, layerName, 1);
      if (layer.getVisible()) {
        this.mainLayerData[index].visible = false;
        layer.setVisible(false);
      } else if (!layer.getVisible()) {
        layer.setVisible(true);
        this.mainLayerData[index].visible = true;
      }
    },
    showLayersInfoModal() {
      this.layersInfoOpen = true;
    },
    layersInfoModalOk() {
      this.layersInfoOpen = false;
    },
  },
});
</script>

<style scoped lang="scss">
.layer-image {
  position: relative;
  width: 55px;
  height: 55px;
  &__image {
    top: -2px;
    left: -2px;
    border: 3px solid #ffffff;
    &--active {
      // top: -1px;
      // left: -1px;
      border: 3px solid #4eee60;
    }
  }
}
</style>
