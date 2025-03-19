<template>
  <a-modal
    v-model:open="isModalOpen"
    width="100%"
    wrap-class-name="full-modal"
    :keyboard="false"
    :zIndex="1000"
    :footer="false">
    <template #title>
      <a-flex align="center" style="color: #3b9e05">
        <i class="fa-solid fa-tree-city fs-3 me-2"></i>
        <h2>Chi cục trồng trọt và bảo vệ thực vật</h2>
      </a-flex>
    </template>
    <a-select ref="select" v-model:value="modalOptionValue" size="large" style="width: 100%" :options="options">
    </a-select>
    <a-table :columns="columns" :data-source="data">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span> Name </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link"> More actions </a>
          </span>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { defineComponent, ref, inject } from "vue";

export default defineComponent({
  props: {
    modalOpen: {
      type: Boolean,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  setup() {
    const mainLayerData = inject("mainLayerData");
    const options = ref([
      {
        value: "vbvtv",
        label: "Quản lý Vùng bảo vệ thực vật",
      },
      {
        value: "tbvtv",
        label: "Quản lý Trạm bảo vệ thực vật",
      },
      {
        value: "vsxnntc",
        label: "Quản lý Vùng Sản xuất Nông nghiệp tiêu chuẩn",
      },
      {
        value: "kltpb",
        label: "Quản lý Kho lưu trữ Phân bón, Vật tư nông nghiệp",
      },
      {
        value: "vdh",
        label: "Quản lý Vùng dịch hại",
      },
    ]);

    const columns = [
      {
        name: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
      },
      {
        title: "Action",
        key: "action",
      },
    ];
    const data = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ];

    return {
      mainLayerData,
      options,
      columns,
      data,
    };
  },
  data() {
    return {
      toolHover: true,
      modalOptionValue: "vbvtv",
      isModalOpen: this.modalOpen,
    };
  },
  methods: {},
});
</script>

<style lang="scss">
.xl-button {
  width: 2rem;
  height: 2rem;
  & i {
    font-size: 1rem;
  }
}

.user-app {
  width: 100%;
  position: relative;
  &:hover {
    background-color: #cdeac8;
    border-radius: 5px;
    & p {
      background-color: #cdeac8;
      border-radius: 5px;
    }
  }
}

.user-app__name {
  & p {
    position: absolute;
    top: 3.5rem;
    left: 0;
    z-index: 5000;
    width: 100%;
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
