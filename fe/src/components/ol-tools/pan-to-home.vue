<template>
  <!-- <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
    <template #title>
      <p>Trở về</p>
    </template> -->
  <a-button class="map-button" type="primary" :size="buttonSize" @click="panToHome">
    <i class="fa-solid fa-house"></i>
  </a-button>
  <!-- </a-tooltip> -->
</template>

<script>
import { defineComponent } from "vue";
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
    panToHome() {
      this.map.getView().animate({
        // Đà nẵng
        center: [539030.0, 1773587.4],
        zoom: 13,
        duration: 1000,
      });
    },
  },
  mounted() {},
});
</script>

<style lang="scss">
.tool-container-tooltip {
  & .ant-tooltip-content .ant-tooltip-inner {
    min-height: auto !important;
    padding: 5px;
  }
}
</style>
