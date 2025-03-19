import { defineStore } from "pinia";

export const mapState = defineStore("map", {
  state: () => ({
    map: null,
  }),

  actions: {
    setMap(map) {
      this.map = map;
    },
  },

  getters: {
    getMap() {
      return this.map;
    },
  },
});
