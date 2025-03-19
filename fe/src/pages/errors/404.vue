<template>
  <div style="display: flex; height: 100vh; width: 100vw; justify-content: center; align-items: ">
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button type="primary">Back Home</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped></style>
