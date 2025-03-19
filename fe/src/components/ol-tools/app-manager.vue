<template>
  <div>
    <a-popover trigger="click" :arrow="false" placement="bottomRight" :arrowPointAtCenter="true" :zIndex="999">
      <template #content>
        <a-row :gutter="[8, 8]" class="mb-3" style="min-width: 300px; max-width: 300px">
          <a-col :span="8">
            <div
              class="user-app d-flex flex-column align-items-center p-2"
              @mouseenter="addTextTruncate"
              @mouseleave="removeTextTruncate">
              <router-link
                :to="{
                  name: 'account-manager-page',
                }">
                <a-button type="primary" shape="circle" size="large" class="xl-button mb-2">
                  <i class="fa-solid fa-people-group mt-1"></i>
                </a-button>
              </router-link>
              <span class="user-app__name">
                <p class="text-center ps-2 pe-2 text-truncate">Quản lý tài khoản</p>
              </span>
            </div>
          </a-col>

          <a-col :span="8" v-for="(department, index) in departments" :key="index">
            <div
              class="user-app d-flex flex-column align-items-center p-2 mb-3"
              @mouseenter="addTextTruncate"
              @mouseleave="removeTextTruncate">
              <a-button
                type="primary"
                shape="circle"
                size="large"
                class="xl-button mb-2"
                @click="openModal(department, index)">
                <i :class="mainLayerData[index].logo" class="mt-1"></i>
              </a-button>
              <span class="user-app__name">
                <p class="text-center ps-2 pe-2 text-truncate">{{ department.name }}</p>
              </span>
            </div>
          </a-col>
        </a-row>
      </template>

      <a-button ghost class="me-4" size="small" shape="circle" style="border: 0">
        <i class="fa-solid fa-table-cells" style="font-size: large"></i>
      </a-button>
    </a-popover>

    <a-modal
      :open="layerModalOpen"
      width="100%"
      wrap-class-name="full-modal"
      :keyboard="false"
      :zIndex="1000"
      :footer="false">
      <template #title>
        <a-flex align="center" style="color: #3b9e05">
          <i :class="layerModalIcon" class="fs-3 me-2"></i>
          <h2>{{ layerModalTitle }}</h2>
        </a-flex>
      </template>
      <template #closeIcon>
        <a-button type="primary" size="small" @click="closeModal"><i class="fa-solid fa-xmark"></i></a-button>
      </template>

      <a-row>
        <a-col :xl="12">
          <a-select
            ref="select"
            v-model:value="layerOptionValue"
            size="large"
            style="width: 100%"
            :options="layerOptions"
            @change="layerOptionChange">
          </a-select>
        </a-col>
        <a-col :offset="1" :xl="4">
          <a-flex justify="space-around">
            <a-tooltip title="Thêm mới">
              <a-button type="primary" @click="addOne"><i class="fa-solid fa-plus"></i></a-button>
            </a-tooltip>
            <a-tooltip title="Chỉnh sửa">
              <a-button type="primary" @click="openEditModal"><i class="fa-solid fa-file-pen"></i></a-button>
            </a-tooltip>
            <a-upload
              v-model:file="csvFile"
              accept=".csv"
              name="file"
              :showUploadList="false"
              :maxCount="1"
              :before-upload="csvFileChange">
              <a-tooltip title="Thêm mới hàng loạt">
                <a-button type="primary"><i class="fa-solid fa-file-import"></i></a-button>
              </a-tooltip>
            </a-upload>

            <a-tooltip title="Xoá đối tượng">
              <a-button type="primary" danger @click="deleteObject"><i class="fa-solid fa-trash"></i></a-button>
            </a-tooltip>
          </a-flex>
        </a-col>
      </a-row>
      <a-table
        v-model:columns="currentColumns"
        v-model:data-source="dataSource"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: layerTableState.selectedRowKeys,
          onChange: onLayerTableSelectChange,
        }">
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'lich_su_canh_tac'">
            <span> </span>
          </template>
        </template>

        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'lich_su_canh_tac'"> </template>
        </template>
      </a-table>
    </a-modal>

    <a-modal v-model:open="addObjectModalOpen" :zIndex="20000" :maskClosable="false">
      <template #title>
        <p>Thêm mới</p>
      </template>
      <a-flex class="mb-3" v-for="(obj, key) in columns[layerOptionValue]" :key="key" vertical>
        <p class="fw-bold">{{ obj.title }}</p>
        <a-input v-model:value="addOneModel[obj.dataIndex]"></a-input>
      </a-flex>
      <template #footer>
        <a-button key="back" @click="addObjectModalCancel">Huỷ</a-button>
        <a-button key="submit" type="primary" @click="addObjectModalConfirm">Xác nhận</a-button>
      </template>
    </a-modal>

    <a-modal v-model:open="editObjectModalOpen" :zIndex="20000" :maskClosable="false">
      <template #title>
        <p>Chỉnh sửa</p>
      </template>
      <a-flex class="mb-3" v-for="(obj, key) in columns[layerOptionValue]" :key="key" vertical>
        <p class="fw-bold">{{ obj.title }}</p>
        <a-input v-model:value="editModel[obj.key]"></a-input>
      </a-flex>
      <template #footer>
        <a-button key="back" @click="editObjectModalCancel">Huỷ</a-button>
        <a-button key="submit" type="primary" @click="editObjectModalConfirm">Lưu</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, inject, ref, reactive, toRaw } from "vue";
import soNongNghiepApi from "@/js/axios/so-nong-nghiep-api";
import { departmentState } from "@/stores/department-state";
import { initStaticDataState } from "@/stores/init-static-data-state";
import { storeToRefs } from "pinia";
import Papa from "papaparse";
export default defineComponent({
  setup() {
    const user = inject("userData");
    const mainLayerData = inject("mainLayerData");
    const { columns, objectData, layerOptions } = initStaticDataState();

    const layerTableState = reactive({
      selectedRowKeys: [],
      loading: false,
    });
    const onLayerTableSelectChange = (selectedRowKeys) => {
      layerTableState.selectedRowKeys = selectedRowKeys;
    };
    return {
      user,
      mainLayerData,
      layerTableState,
      onLayerTableSelectChange,
      columns,
      objectData,
      layerOptions,
    };
  },
  data() {
    return {
      layerModalOpen: false,
      layerModalTitle: "",
      layerModalIcon: "",
      layerOptionValue: "Khu vực trồng trọt",
      department: "",
      dataSource: [],
      addObjectModalOpen: false,
      editObjectModalOpen: false,
      addOneModel: {},
      editModel: {},
      currentColumns: [],
      csvFile: null,
    };
  },

  computed: {
    departments() {
      return departmentState().getDepartments;
    },
  },
  methods: {
    addTextTruncate(event) {
      event.target.getElementsByTagName("p")[0].classList.toggle("text-truncate");
    },
    removeTextTruncate(event) {
      event.target.getElementsByTagName("p")[0].classList.toggle("text-truncate");
    },

    getLayerObjects(layerId) {
      //Chờ làm việc với db rồi sử dụng
      // soNongNghiepApi
      //   .get(`/departments/${this.department.id}/layers/${layerId}/objects`)
      //   .then((response) => {
      //     if (response) {
      //       this.dataSource = response.data.data;
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      this.dataSource = this.objectData[this.layerOptionValue].objects;
      // console.log(this.columns);
      this.currentColumns = this.columns[this.layerOptionValue];
    },

    openModal(department, index) {
      this.layerModalOpen = true;
      this.department = department;
      this.layerModalTitle = department.name;
      this.layerModalIcon = this.mainLayerData[index].logo;
      this.getLayerObjects(this.layerOptionValue);
      // soNongNghiepApi
      //   .get(`/departments/${department.id}/layers`)
      //   .then((response) => {
      //     if (response) {
      //       this.layerOptions = response.data.data;
      //       this.layerOptionValue = this.layerOptions[0].id;

      //       this.getLayerObjects(this.layerOptionValue);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },

    closeModal() {
      this.layerModalOpen = false;
    },

    layerOptionChange(value) {
      this.getLayerObjects(value);
      this.layerTableState.selectedRowKeys = [];
    },

    addOne() {
      this.addObjectModalOpen = true;
      this.addOneModel = JSON.parse(JSON.stringify(this.objectData[this.layerOptionValue].emptyObject));
    },

    deleteObject() {
      this.objectData[this.layerOptionValue].objects = this.objectData[this.layerOptionValue].objects.filter(
        (obj) => obj.key !== this.layerTableState.selectedRowKeys[0],
      );
      this.dataSource = this.dataSource.filter((obj) => obj.key !== this.layerTableState.selectedRowKeys[0]);
      // console.log(this.layerTableState.selectedRowKeys);
      // console.log(this.layerTableState.selectedRowKeys[0]);
    },

    addObjectModalCancel() {
      this.addObjectModalOpen = false;
    },
    addObjectModalConfirm() {
      this.addObjectModalOpen = false;
      this.dataSource.push({ key: this.dataSource.length + 1, ...this.addOneModel });
      this.addOneModel = JSON.parse(JSON.stringify(this.objectData[this.layerOptionValue].emptyObject));
    },
    editObjectModalCancel() {
      this.editObjectModalOpen = false;
    },
    editObjectModalConfirm() {
      this.editObjectModalOpen = false;
      this.objectData[this.layerOptionValue].objects[this.layerTableState.selectedRowKeys[0] - 1] = this.editModel;
      this.editModel = {};
    },

    csvFileChange(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        Papa.parse(csvText, {
          header: true, // Tự động nhận diện cột tiêu đề
          skipEmptyLines: true, // Bỏ qua dòng trống
          complete: (result) => {
            this.jsonData = result.data.map((item) => {
              let geometry = null;
              try {
                geometry = JSON.parse(item.geometry);
              } catch (error) {
                console.error("Lỗi parse geometry:", error);
              }
              return { ...item, geometry };
            });

            this.objectData[this.layerOptionValue].objects.push(...this.jsonData);

            console.log(this.objectData[this.layerOptionValue].objects);
          },
        });
      };
      reader.readAsText(file);
      return false; // Ngăn Ant Upload tự động tải file lên server
    },

    openEditModal() {
      this.editObjectModalOpen = true;
      this.editModel = JSON.parse(
        JSON.stringify(this.objectData[this.layerOptionValue].objects[this.layerTableState.selectedRowKeys[0] - 1]),
      );
    },
  },
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

.editable-row-operations a {
  margin-right: 8px;
}
</style>
