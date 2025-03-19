<template>
  <a-button class="map-button" :type="type" :size="buttonSize" @click="geolocationClick">
    <i class="fa-solid fa-street-view"></i>
  </a-button>
</template>

<script>
import { defineComponent, inject } from "vue";
import { mapState } from "../../stores/map-state";
import * as VueLayer from "../../js/VueLayer.js";
import * as proj from "ol/proj.js";
import { Point, Circle } from "ol/geom";
import { Feature } from "ol";
export default defineComponent({
  props: {
    buttonSize: {
      type: String,
      default: "small",
    },
  },

  setup() {
    const geolocation = "";

    return {
      geolocation,
    };
  },

  data() {
    return {
      geolocation: null,
      status: false,
      type: "primary",
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  methods: {
    successCallback(position) {
      // Hiển thị kinh độ và vĩ độ
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      const coords = proj.transform([longitude, latitude], "WGS84", "EPSG:5899");
      this.map.getView().animate({
        center: coords,
        zoom: 18,
        duration: 500,
      });
      const myPoint = new Point(coords);
      const myCircle = new Circle(coords, 100);
      VueLayer.getLayerByTitle(this.map, "Geolocation layer").getSource().addFeature(new Feature(myPoint));
      VueLayer.getLayerByTitle(this.map, "Geolocation layer").getSource().addFeature(new Feature(myCircle));
    },

    errorCallback(error) {
      // Xử lý lỗi
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Bạn đã từ chối chia sẻ vị trí!");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Vị trí không khả dụng!");
          break;
        case error.TIMEOUT:
          alert("Hết thời gian chờ!");
          break;
      }
    },
    geolocationClick() {
      if (this.status) {
        VueLayer.getLayerByTitle(this.map, "Geolocation layer").getSource().clear();
        this.status = !this.status;
        this.type = "primary";
      } else {
        navigator.geolocation.getCurrentPosition(this.successCallback, this.errorCallback);
        this.status = !this.status;
        this.type = "default";
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
