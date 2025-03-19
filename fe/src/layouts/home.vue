<template>
  <a-spin :spinning="homeSpinning" tip="Loading..." size="large">
    <a-layout style="overflow: hidden">
      <a-layout-sider
        breakpoint="lg"
        class="home-sider"
        :collapsed="siderCollapsed"
        theme="light"
        :width="siderWidth"
        :collapsed-width="collapsedWidth"
        @breakpoint="onBreakpoint"
        :class="{ 'zero-width': collapsedWidth === 80 }">
        <a-row class="mt-2" align="middle">
          <a-col :span="6">
            <router-link :to="{ name: 'home-page' }">
              <img src="/logo/bo-nong-nghiep-logo.png" alt="logo" style="width: 4rem; height: 4rem" />
            </router-link>
          </a-col>
          <a-col v-if="!siderCollapsed" :span="16">
            <p
              style="
                text-align: center;
                font-weight: bold;
                font-size: 1rem;
                text-transform: uppercase;
                color: rgb(91, 91, 91);
              ">
              Sở Nông nghiệp <br />
              và Phát triển nông thôn
            </p>
          </a-col>
        </a-row>
        <SiderLayerManager ref="siderLayerManagerRef" class="mt-3"></SiderLayerManager>
      </a-layout-sider>

      <a-layout-content style="height: 100vh; overflow: hidden">
        <div class="content-container h-100" id="map-container" style="position: relative">
          <div id="map" class="map h-100"></div>
          <a-row justify="start" class="top-left-nav align-items-center" style="width: 90%">
            <a-col :xl="1" :xs="2">
              <a-button size="large" shape="circle" @click="siderCollapsedChange">
                <i class="fa-solid fa-bars"></i>
              </a-button>
            </a-col>
            <a-col :xl="6" :md="10" :xs="0">
              <a-input-search
                :value="searchValue"
                class="ms-3 rounded"
                placeholder="Search"
                @search="onSearch()"
                :disabled="searchInputDisabled"
                :enter-button="!searchInputDisabled"
                :loading="searchInputDisabled" />
            </a-col>
          </a-row>

          <div class="top-right-nav d-inline-flex align-items-center align-content-end">
            <!-- <AppManager v-if="getSignInState === true" /> -->
            <AppManager />
            <SignIn />
          </div>

          <div class="bottom-right-nav align-items-center">
            <FloatingToolbox class=""></FloatingToolbox>
            <!-- <ToolBox class=""></ToolBox> -->
            <BasemapTool class="mt-2"></BasemapTool>
          </div>

          <LegendTool></LegendTool>
        </div>
      </a-layout-content>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref, provide } from "vue";

import runMap from "../js/map.js";
import { userState } from "../stores/user-state";
import { departmentState } from "../stores/department-state";
import { mapState } from "../stores/map-state";
import { storeToRefs } from "pinia";
import * as customCRS from "../js/CustomCRS.js";
import AppManager from "../components/ol-tools/app-manager.vue";
import BasemapTool from "../components/ol-tools/basemap-tool.vue";
import SiderLayerManager from "../components/ol-tools/sider-layer-manager.vue";
import { setCookie, getCookie } from "../js/util";
import soNongNghiepApi from "@/js/axios/so-nong-nghiep-api.js";
import { Map, View } from "ol";
import FloatingToolbox from "../components/ol-tools/floating-toolbox.vue";
import SignIn from "@/components/sign-in.vue";
import LegendTool from "@/components/ol-tools/legend-tool.vue";
export default defineComponent({
  components: {
    AppManager,
    BasemapTool,
    SiderLayerManager,
    FloatingToolbox,
    SignIn,
    LegendTool,
  },

  data() {
    return {
      test: false,
    };
  },

  beforeRouteEnter(to, from, next) {
    if (getCookie("accessToken") === "") {
      next((data) => {
        data.homeSpinning = false;
      });
    } else {
      next((data) => {
        const getSignedIn = () => {
          axios
            .post(
              "http://127.0.0.1:8000/api/signed-in",
              { accountId: "" },
              {
                headers: {
                  Authorization: `Bearer ${getCookie("accessToken")}`,
                },
              },
            )
            .then((response) => {
              if (response) {
                console.log(response);
                userState().onAuthentication();
                data.homeSpinning = false;
                data.userData = JSON.parse(getCookie("user"));
                setCookie("user", JSON.stringify(response.data.user));
              }
            })
            .catch((error) => {
              console.log(error);
              data.homeSpinning = false;
              setCookie("accessToken", "");
              setCookie("user", "");
              userState().onLogOut();
            });
        };
        getSignedIn();
      });
    }
  },

  setup() {
    const store = userState();
    const departmentStore = departmentState();
    // console.log(JSON.parse(getCookie('user')));
    // xem cái userData này có giống accountInfo bên account không

    const homeSpinning = ref(true);
    provide("homeSpinning", homeSpinning);

    const userData = ref();
    provide("userData", userData);

    const siderCollapsed = ref(false);
    const siderWidth = ref(250);
    const collapsedWidth = ref(80);
    const onBreakpoint = (broken) => {
      // console.log(broken);
      if (broken) {
        collapsedWidth.value = 0;
        // console.log(collapsedWidth.value);
      } else {
        collapsedWidth.value = 80;
        // console.log(collapsedWidth.value);
      }
    };
    const mainLayerData = ref([
      // title các layer phải trùng với title đã khai báo ở map.js
      {
        department: "Chi cục trồng trọt và bảo vệ thực vật",
        logo: "fa-solid fa-tree-city",
        layers: [
          {
            title: "Khu vực trồng trọt",
            imagePath: "",
            visible: true,
            items: [
              { name: "Ngô", iconPath: "/legend-icon/kvtt-corn-color-128.png" },
              { name: "Lúa nước", iconPath: "/legend-icon/kvtt-rice-color-128.png" },
              { name: "Khác", iconPath: "/legend-icon/kvtt-others-color-128.png" },
            ],
          },
          {
            title: "Vùng bảo vệ thực vật",
            imagePath: "",
            visible: true,
            items: [
              { name: "Nghiêm trọng", iconPath: "/legend-icon/vbvtv-danger-128.png" },
              { name: "Nguy cơ", iconPath: "/legend-icon/vbvtv-medium-128.png" },
              { name: "An toàn", iconPath: "/legend-icon/vbvtv-safe-128.png" },
            ],
          },
          {
            title: "Hộ nông dân",
            imagePath: "",
            visible: true,
            items: [{ name: "Hộ nông dân", iconPath: "/icon/ho-nong-dan-icon.svg" }],
          },
          {
            title: "Trạm bảo vệ thực vật",
            imagePath: "",
            visible: true,
            items: [{ name: "Trạm bảo vệ", iconPath: "/icon/tram-bao-ve-thuc-vat-icon.svg" }],
          },
          {
            title: "Vùng Sản xuất Nông nghiệp tiêu chuẩn",
            imagePath: "",
            visible: true,
            items: [
              { name: "GlobalGAP", iconPath: "/legend-icon/vsxnntc-global-64.png" },
              { name: "VietGAP", iconPath: "/legend-icon/vsxnntc-viet-64.png" },
            ],
          },
          {
            title: "Kho lưu trữ Phân bón, Vật tư nông nghiệp",
            imagePath: "",
            visible: true,
            items: [
              {
                name: "Kho",
                iconPath: "/icon/kho-luu-tru-phan-bon-va-vat-tu-nong-nghiep-icon.svg",
              },
            ],
          },
          {
            title: "Vùng dịch hại",
            imagePath: "",
            visible: true,
            items: [{ name: "Vùng dịch hại", iconPath: "/legend-icon/vdh-128.png" }],
          },
        ],
      },
      {
        department: "Chi cục Chăn nuôi thú y",
        logo: "fa-solid fa-cow",
        layers: [
          {
            title: "Cơ sở chăn nuôi",
            imagePath: "",
            visible: true,
            items: [
              { name: "Heo", iconPath: "/icon/cscn-pig-256.png" },
              { name: "Gà", iconPath: "/icon/cscn-chicken-256.png" },
              { name: "Bò", iconPath: "/icon/cscn-cow-256.png" },
              { name: "Khác", iconPath: "/icon/cscn-animal-256.png" },
            ],
          },
          {
            title: "Ổ dịch chăn nuôi",
            imagePath: "",
            visible: true,
            items: [{ name: "Ổ dịch", iconPath: "/icon/odcn-64.png" }],
          },
          {
            title: "Vùng an toàn chăn nuôi",
            imagePath: "",
            visible: true,
            items: [{ name: "Vùng an toàn", iconPath: "/icon/vatcn-64.png" }],
          },
          {
            title: "Điểm lấy mẫu",
            imagePath: "",
            visible: true,
            items: [{ name: "Điểm lấy mẫu", iconPath: "/icon/diem-lay-mau.svg" }],
          },
          {
            title: "Tuyến đường vận chuyển động vật",
            imagePath: "",
            visible: true,
            items: [{ name: "Tuyến đường vận chuyển", iconPath: "/icon/tdvcdv-64.png" }],
          },
        ],
      },
      {
        department: "Quản lý Chất lượng nông lâm và thuỷ sản",
        logo: "fa-solid fa-fish-fins",
        layers: [
          {
            title: "Doanh nghiệp lâm thuỷ sản",
            imagePath: "",
            visible: true,
            items: [],
          },
          {
            title: "Vùng thuỷ sản",
            imagePath: "",
            visible: true,
            items: [],
          },
        ],
      },
      {
        department: "Văn phòng điều phối chương trình",
        logo: "fa-solid fa-building-circle-arrow-right",
        layers: [
          {
            title: "Khu vực",
            imagePath: "",
            visible: true,
            items: [],
          },
          {
            title: "Dự án đang xây dựng",
            imagePath: "",
            visible: true,
            items: [],
          },
          {
            title: "Hợp tác xã",
            imagePath: "",
            visible: true,
            items: [],
          },
          {
            title: "Làng nghề",
            imagePath: "",
            visible: true,
            items: [],
          },
        ],
      },
      {
        department: "Trung tâm khuyến nông",
        logo: "fa-solid fa-tractor",
        layers: [],
      },
    ]);
    provide("mainLayerData", mainLayerData);
    const searchValue = ref("");
    const searchInputDisabled = ref(false);
    provide("searchInputDisabled", searchInputDisabled);

    // Lấy các department để hiển thị
    soNongNghiepApi
      .get("/departments")
      .then((response) => {
        if (response) {
          departmentStore.setDepartments(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      userData,
      homeSpinning,
      ...storeToRefs(store),
      siderCollapsed,
      siderWidth,
      collapsedWidth,
      onBreakpoint,
      searchValue,
      searchInputDisabled,
    };
  },

  computed: {
    map() {
      // const mapStore = mapState();
      // const { getMap, setMap } = mapStore;
      return mapState().getMap;
    },
    // getGeoserverAccount: function () {
    //   return userState().getGeoserverAccount;
    // },
  },

  mounted() {
    // console.log(this.anhquyen);
    const mapStore = mapState();
    const { getMap, setMap } = mapStore;

    const map = new Map({
      target: "map",
      view: new View({
        // projection: 'EPSG:4326',
        projection: customCRS.addCustomCrs("EPSG:5899"),

        minZoom: 5,
        maxZoom: 22,
      }),
    });
    mapState().setMap(map);
    runMap(map);
  },

  methods: {
    getLayers() {
      console.log(this.map.getLayers().getArray());
    },

    getLayerByTitle(title) {
      var layer;
      this.map
        .getLayers()
        .getArray()
        .forEach((element) => {
          if (element.get("title") == title) {
            layer = element;
          }
        });
      // return layer;
      // console.log(layer.getSource().getFeatures());
      var data = [];
      layer
        .getSource()
        .getFeatures()
        .forEach((v) => {
          // console.log(v.getGeometry().getType());
          // console.log(v.getGeometry().getCoordinates());
          data.push(v.getGeometry().getCoordinates());
        });

      axios
        .get("http://127.0.0.1:8000/api/download-shapefile")
        .then((response) => {
          if (response) {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    decryptAccount(username, userkey) {
      var bytes = CryptoJS.AES.decrypt(username, userkey);
      var code = bytes.toString(CryptoJS.enc.Utf8);
      return code;
    },

    siderCollapsedChange() {
      this.siderCollapsed = !this.siderCollapsed;
      // console.log(this.siderCollapsed);
    },

    onSearch() {
      // console.log(this.searchValue);
      this.$refs.siderLayerManagerRef.onSearch(this.searchValue);
      // console.log(this.$refs);
    },
  },
});
</script>

<style lang="scss">
.map-container {
  position: relative;
}
.map .ol-zoom {
  position: absolute;
  top: 35vh;
  left: auto;
  right: 2.5vw;
}

.top-left-nav {
  position: absolute;
  top: 2vh;
  left: 2vw;
}
.top-right-nav {
  position: absolute;
  top: 2vh;
  right: 2vw;
}

.bottom-right-nav {
  position: absolute;
  bottom: 2vh;
  right: 0.5vw;
  display: flex;
  flex-direction: column;
}

.ol-control.ol-layerswitcher-image button::after {
  right: 2rem;
}

.ol-tool-control-panel {
  position: absolute;
  top: 12vh;
  left: 2vw;
  width: auto;
  height: auto;
}

.home-sider {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  &.zero-width {
    border: 1px solid rgb(203, 203, 203);
    padding: 0.5rem;
    height: 100vh;
    max-height: 100vh;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 3px;
  }
  &:hover {
    // overscroll-behavior-y: overlay;
  }
}
</style>
