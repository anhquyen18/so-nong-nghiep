import { defineStore } from "pinia";

export const departmentState = defineStore("departmentStateId", {
  state: () => ({
    departments: [],
  }),

  actions: {
    setDepartments(departments) {
      this.departments = departments;
    },
  },

  getters: {
    getDepartments() {
      return this.departments;
    },
  },
});
