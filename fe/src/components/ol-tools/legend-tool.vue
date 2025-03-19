p
<template>
  <a-popover
    :align="{
      points: ['bl', 'tl'],
      offset: [0, 20], // the offset sourceNode by 10px in x and 20px in y,
      overflow: { adjustX: true, adjustY: true },
    }"
    v-bind:open="open"
    trigger=""
    :autoAdjustOverflow="false"
    :arrow="false"
    color="white"
    :overlayInnerStyle="{}">
    <template #content>
      <div style="position: relative; width: auto; text-wrap: wrap; word-wrap: break-word">
        <a class="close-button" @click="closeLegend" style="position: absolute; top: 0px; right: 0px">
          <i class="fa-solid fa-xmark"></i>
        </a>
        <p class="fw-bold mb-1">Chú thích</p>
        <div style="overflow-y: auto; overflow-x: hidden; width: 200px; max-height: 500px">
          <div v-for="(department, key) in mainLayerData" :key="key">
            <div v-for="(layer, key) in department.layers" :key="key">
              <div v-if="layer.items.length > 0 && layer.visible">
                <p style="color: var(--primary-color)">{{ layer.title }}</p>
                <a-row v-for="(item, key) in layer.items" :key="key" :gutter="[4, 0]" justify="center" align="middle">
                  <a-col :span="6">
                    <img :src="getImageUrl(item.iconPath)" width="25" height="20" />
                  </a-col>
                  <a-col :span="18">
                    <p class="small-p">{{ item.name }}</p>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <a-button
      id="legend-button"
      type="default"
      class="legend-button no-border-ant-button"
      :class="{ 'legend-button__hidden': open }"
      @click="showLegend"
      ghost>
      <i class="fa-solid fa-table-list fs-5"></i>
      <!-- <i class="fa-solid fa-receipt"></i> -->
    </a-button>
  </a-popover>
</template>

<script>
import { defineComponent, inject } from "vue";
import { mapState } from "../../stores/map-state";

export default defineComponent({
  setup() {
    //https://www.flaticon.com/free-icon/rectangle_7492899?term=rectangle&page=1&position=68&origin=search&related_id=7492899
    //https://www.flaticon.com/free-icon/remove_860821?term=line&page=1&position=6&origin=search&related_id=860821
    const mainLayerData = inject("mainLayerData");
    return {
      mainLayerData,
    };
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  methods: {
    getImageUrl(url) {
      return new URL(url, import.meta.url).href;
    },

    showLegend() {
      this.open = true;
      // this.$refs.legendButton.classList.add('legend-button__hidden');
      // console.log(this.$el.querySelector('.legend-button'));
      console.log(this.mainLayerData);
    },
    closeLegend() {
      this.open = false;

      // document.getElementsByClassName('.legend-button').classList
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.legend-button {
  position: absolute;
  bottom: 1vh;
  left: 0.5vw;
  padding: 0;
  line-height: normal;
  height: auto;
}

.legend-button__hidden {
  color: transparent !important;
}

.small-p {
  font-size: 0.8rem;
}
</style>
