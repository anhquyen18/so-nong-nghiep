<template>
  <div>
    <a-card
      :tab-list="tabList"
      :active-tab-key="key"
      @tabChange="(key) => onTabChange(key)"
      :bodyStyle="{ padding: 0, backgroundColor: '#ffffff !important' }"
      style="border: none"
      :headStyle="{ borderRadius: '0.5rem' }">
      <div v-if="key === 'layersTab'">
        <a-menu class="layers-visible-menu" mode="inline" :selectable="false" style="border: none; padding-top: 0.5rem">
          <a-sub-menu v-for="(data, departmentIndex) in mainLayerData" :key="departmentIndex">
            <template #title>
              <a-flex align="middle">
                <icon class="me-1">
                  <template #component>
                    <i :class="data.logo" class="fs-5"></i>
                  </template>
                </icon>
                <span class="menu-title">
                  {{ data.department }}
                </span>
              </a-flex>
            </template>

            <a-menu-item
              v-for="(layer, layerIndex) in data.layers"
              :key="layerIndex"
              style="padding: 0"
              @click="layerVisibleChange(layer.title, layer.visible, departmentIndex, layerIndex)">
              <a-tooltip color="#87d068" :mouseEnterDelay="1">
                <template #title>{{ layer.title }}</template>
                <a-row align="middle">
                  <a-col :span="4">
                    <a-switch v-model:checked="layer.visible" size="small" style="pointer-events: none" />
                  </a-col>
                  <a-col :span="20" class>
                    <a-flex class="pt-1" style="width: 10rem">
                      <a-typography-text :ellipsis="true" :tooltip="true" :content="layer.title"></a-typography-text>
                    </a-flex>
                  </a-col>
                </a-row>
              </a-tooltip>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>

      <div v-if="key === 'searchingTab'">
        <a-spin :spinning="searchSpinning">
          <a-row class="mt-2">
            <a-col :span="24">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search"
                @search="onSearch"
                :loading="searchInputDisabled" />
            </a-col>
          </a-row>
          <a-menu v-if="searchResult" mode="inline" :selectable="false" style="border: none; padding-top: 0.5rem">
            <a-sub-menu
              v-for="(featureCollection, index) in searchResult"
              :key="index"
              :class="{ 'menu-item-display': !featureCollection.features.data.length > 0 }">
              <template #title>
                <span>
                  <CloudFilled />
                  <span>{{ featureCollection.features.total }} {{ featureCollection.featureName }} </span>
                </span>
              </template>
              <!-- <template #expandIcon> aaa </template> -->
              <!-- <a-menu-item
                v-for="(feature, index) in featureCollection.features.data"
                :key="index"
                @click="showFeature(feature.gid, featureCollection.layer, featureCollection.featureName)">
                {{ feature.gid }}
              </a-menu-item> -->
            </a-sub-menu>
          </a-menu>
        </a-spin>
      </div>
    </a-card>
    <div class="maximize-drawer-button" v-if="minimizeDrawerState">
      <a-button type="default" :style="{ borderRadius: '0.5rem 0 0 0.5rem' }" @click="maximizeDrawer">
        <i class="fa-solid fa-angles-left"></i>
      </a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from "vue";
import Icon, { ShopOutlined, CloudFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapState } from "../../stores/map-state";
import * as VueLayer from "../../js/VueLayer.js";
import { getCenter } from "ol/extent.js";

export default defineComponent({
  name: "SideLayerMananger",
  components: {
    ShopOutlined,
    CloudFilled,
    Icon,
  },
  beforeRouteEnter(to, from, next) {
    // document.title = 'Forgot Password';
    next();
  },
  props: {},

  setup() {
    const tabList = [
      {
        key: "layersTab",
        tab: "Lớp dữ liệu",
      },
      {
        key: "searchingTab",
        tab: "Tìm kiếm  ",
      },
    ];
    const key = ref("layersTab");
    const onTabChange = (value) => {
      key.value = value;
    };
    const mainLayerData = inject("mainLayerData");
    const searchInputDisabled = inject("searchInputDisabled");
    const searchValue = ref("");
    const searchSpinning = ref(false);
    const searchResult = ref("");

    const detailDrawerOpen = ref(false);
    const detailDrawerTitle = ref("Drawer");
    const activeKey = ref([2]);
    const feature = ref("");
    const minimizeDrawerState = ref(false);
    return {
      tabList,
      key,
      onTabChange,
      searchInputDisabled,
      mainLayerData,
      searchValue,
      searchSpinning,
      searchInputDisabled,
      searchResult,
      detailDrawerOpen,
      detailDrawerTitle,
      activeKey,
      feature,
      minimizeDrawerState,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      items: Array.from({ length: 50 }, (_, i) => i + 1),
      layerIndex: 0,
      // hightlight: this.map,
      // highlightLayer: VueLayer.getLayerByTitle(this.map, 'Search hightlight layer'),
    };
  },

  methods: {
    layerVisibleChange(title, visible, departmentIndex, layerIndex, layerGroupIndex = 1) {
      // 1 là đại diện cho main group, được add sau base group (0)
      const layer = VueLayer.getLayerByTitle(this.map, title, layerGroupIndex);
      if (layer) {
        this.mainLayerData[departmentIndex].layers[layerIndex].visible = !visible;
        layer.setVisible(!visible);
        // console.log(layer, visible);
        // layer.setVisible(!visible);
      }
    },
    onSearch(searchValue) {
      // console.log(searchValue);
      this.key = "searchingTab";
      this.searchValue = searchValue;
      this.searchSpinning = true;
      this.searchInputDisabled = true;
      axios
        .post("http://127.0.0.1:8000/api/search-feature", {
          data: searchValue,
        })
        .then((response) => {
          console.log(response);
          this.searchResult = response.data;
          this.searchSpinning = false;
          this.searchInputDisabled = false;
        })
        .catch((error) => {
          console.log(error);
          this.searchSpinning = false;
          this.searchInputDisabled = false;
          message.error("Somethings wrong, please try again later.");
        });
    },

    showFeature(id, layer, name) {
      // Không lấy highlight layer được tạo ở feauture-info-popup để hiển thị
      // vi khi tìm kiếm click vào feature khác thì nó nhảy đi
      // không phù hớp với chức năng tìm kiếm này
      // vì vậy tạo thành 2 layer hightlight riêng biệt
      // Layer được tạo ở map.js
      // console.log(VueLayer.getLayerByTitle(this.map, 'Feature highlight layer'));
      this.activeKey = [2];
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = false;
      this.detailDrawerTitle = name + " " + id;
      const highlightLayer = VueLayer.getLayerByTitle(this.map, "Search hightlight layer");
      highlightLayer.getSource().clear();
      // console.log(this.map.getLayers());
      document.body.style.cursor = "progress";
      axios
        .post("http://127.0.0.1:8000/api/get-geoserver-feature-by-id", {
          id: id,
          layer: layer,
        })
        .then((response) => {
          console.log(response);
          this.feature = response.data.features[0];
          // const feature = new Feature({
          //   geometry: response.data.features[0].geometry,
          // });
          highlightLayer.getSource().addFeature(new GeoJSON().readFeature(this.feature));
          highlightLayer.setVisible(true);
          this.detailDrawerOpen = true;
          document.body.style.cursor = "auto";
        })
        .catch((error) => {
          console.log(error);
          message.error("Somethings wrong, please try again later.");
          this.detailDrawerOpen = false;
          document.body.style.cursor = "auto";
        });
    },

    detailDrawerClose() {
      VueLayer.getLayerByTitle(this.map, "Search hightlight layer").getSource().clear();
    },

    zoomInFeature() {
      // console.log(this.feature);
      if (this.feature.geometry.type === "Point") {
        this.map.getView().animate({
          center: this.feature.geometry.coordinates,
          duration: 1000,
          zoom: 20,
        });
      } else if (this.feature.geometry.type === "MultiLineString") {
        var coordinateArray = this.feature.geometry.coordinates[0];
        var featureExtent = [
          coordinateArray[0][0],
          coordinateArray[0][1],
          coordinateArray[coordinateArray.length - 1][0],
          coordinateArray[coordinateArray.length - 1][1],
        ];
        var extentCenter = getCenter(featureExtent);
        this.map.getView().animate({
          center: extentCenter,
          duration: 1000,
          zoom: 17,
        });
      } else if (this.feature.geometry.type === "MultiPolygon") {
        const extent = this.feature.properties["extent"].split(",");
        this.map.getView().fit(extent, { duration: 1000 });
      }
    },

    minimizeDrawer() {
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = true;
    },

    closeDrawer() {
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = false;
      VueLayer.getLayerByTitle(this.map, "Search hightlight layer").getSource().clear();
    },

    maximizeDrawer() {
      this.detailDrawerOpen = true;
      this.minimizeDrawerState = false;
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
// Dùng scoped là .ant-menu-item không hoạt động
.layers-visible-menu {
  & .ant-menu-item {
    padding-left: 1rem !important;
  }
  & .ant-menu-submenu-title {
    padding-left: 1rem !important;
  }
}

.menu-title {
  line-height: 1.2;
  white-space: normal;
  text-align: center;
  font-weight: bold;
}

.menu-item-display {
  display: none;
}

.detail-drawer {
  position: relative;
}

.maximize-drawer-button {
  position: fixed;
  top: 50%;
  right: 0rem;
  z-index: 100000;
  // transform: translateX(-100%);
  animation: slide 0.2s linear;
}

@keyframes slide {
  0% {
    right: -2rem;
  }

  100% {
    right: 0;
  }
}
</style>
