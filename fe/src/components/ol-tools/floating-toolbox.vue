<template>
  <a-config-provider
    :theme="{
      token: {
        // colorPrimary: '#8c8c8c',
        sizeStep: 4,
        sizeUnit: 4,
      },
    }">
    <a-flex gap="3" :vertical="true">
      <ZoomTool buttonSize="small" />
      <FeatureInfoPopup buttonSize="small" />
      <MeasureTool buttonSize="small" />
      <PanToHome buttonSize="small" />
      <GeolocationTool buttonSize="small" />
    </a-flex>
  </a-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import PanToHome from "./pan-to-home.vue";
import GeolocationTool from "./geolocation-tool.vue";
import MeasureTool from "./measure-tool.vue";
import ZoomTool from "./zoom-tool.vue";
import FeatureInfoPopup from "./feature-info-popup.vue";
export default defineComponent({
  components: {
    PanToHome,
    GeolocationTool,
    MeasureTool,
    ZoomTool,
    FeatureInfoPopup,
  },
  setup() {
    return {};
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},
});
</script>

<style lang="scss">
.map-button {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0 !important;
  &.zoom-plus {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.zoom-minus {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
