<template>
  <a-flex vertical gap="20" align="center" flex="1">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex>
        <h3 class="fs-1">Thay đổi trường dữ liệu</h3>
      </a-flex>
      <a-row class="mb-3">
        <a-col :span="16">
          <a-select
            v-model:value="layerOptionValue"
            :options="layerOptions"
            size="large"
            style="width: 100%"></a-select>
        </a-col>
        <a-col :offset="1" :span="7">
          <a-flex :gap="8">
            <a-button type="primary" size="large" block @click="openAddFieldModal">Thêm</a-button>
            <a-button type="primary" size="large" block danger @click="removeField">Xóa</a-button>
          </a-flex>
        </a-col>
      </a-row>
      <a-table
        :columns="tableColumns"
        :data-source="columns[layerOptionValue]"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onChange: onKeySelectChange,
        }"
        bordered></a-table>
    </div>

    <a-modal v-model:open="addFieldModalOpen" :zIndex="20000" :maskClosable="false">
      <template #title>
        <p>Thêm mới trường dữ liệu</p>
      </template>

      <a-flex vertical :gap="20">
        <a-flex vertical>
          <p class="fw-bold">Tên hiển thị</p>
          <a-input v-model:value="nameValue"></a-input>
        </a-flex>
        <a-flex vertical>
          <p class="fw-bold">Mã nhận dạng</p>
          <a-input v-model:value="codeValue"></a-input>
        </a-flex>
        <a-flex vertical>
          <p class="fw-bold">Mô tả</p>
          <a-input v-model:value="descriptionValue"></a-input>
        </a-flex>
      </a-flex>

      <template #footer>
        <a-button key="back" @click="addCancel">Huỷ</a-button>
        <a-button key="submit" type="primary" @click="addConfirm">Lưu</a-button>
      </template>
    </a-modal>
  </a-flex>
</template>

<script>
import { defineComponent, ref } from "vue";
import { initStaticDataState } from "@/stores/init-static-data-state";

export default defineComponent({
  setup() {
    const { columns, layerOptions } = initStaticDataState();
    const tableColumns = [
      {
        title: "Tên hiển thị",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Mã nhận dạng",
        dataIndex: "dataIndex",
        key: "dataIndex",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
      },
    ];
    const dataSource = ref([]);

    const selectedRowKeys = ref([]);
    const onKeySelectChange = (keys) => {
      console.log(keys);
      selectedRowKeys.value = keys;
    };

    return {
      columns,
      layerOptions,
      tableColumns,
      dataSource,
      selectedRowKeys,
      onKeySelectChange,
    };
  },

  data() {
    return {
      layerOptionValue: "Khu vực trồng trọt",
      addFieldModalOpen: false,
      nameValue: "",
      codeValue: "",
      descriptionValue: "",
    };
  },

  watch: {},

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: "account-manager-page" });
    },

    removeField() {
      console.log(this.selectedRowKeys[0]);
      this.columns[this.layerOptionValue] = this.columns[this.layerOptionValue].filter(
        (item) => item.dataIndex !== this.selectedRowKeys[0],
      );
    },

    openAddFieldModal() {
      this.addFieldModalOpen = true;
    },

    addCancel() {
      this.addFieldModalOpen = false;
    },

    addConfirm() {
      this.addFieldModalOpen = false;
      this.columns[this.layerOptionValue].push({
        title: this.nameValue,
        dataIndex: this.codeValue,
        description: this.descriptionValue,
      });

      this.nameValue = "";
      this.codeValue = "";
      this.descriptionValue = "";
    },
  },

  mounted() {},
});
</script>

<style lang="scss" scoped></style>
