<template>
  <a-flex :vertical="true">
    <a-button class="map-button zoom-plus" type="primary" :size="buttonSize" @click="zoomIn">
      <i class="fa-solid fa-plus"></i>
    </a-button>
    <a-button class="map-button zoom-minus" type="primary" :size="buttonSize" @click="zoomOut">
      <i class="fa-solid fa-minus"></i>
    </a-button>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref } from "vue";
import { mapState } from "../../stores/map-state.js";
export default defineComponent({
  props: {
    buttonSize: {
      type: String,
      default: "small",
    },
  },

  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  methods: {
    zoomIn() {
      //   console.log(this.map.getView().getZoom());
      //   this.map.getView().setZoom(this.map.getView().getZoom() + 1);
      this.map.getView().animate({
        center: this.map.getView().getCenter(),
        zoom: this.map.getView().getZoom() + 1,
        duration: 200,
      });
    },
    zoomOut() {
      this.map.getView().animate({
        center: this.map.getView().getCenter(),
        zoom: this.map.getView().getZoom() - 1,
        duration: 200,
      });
    },
  },
  mounted() {},
});
</script>

<style lang="scss"></style>
