<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex>
        <h3 class="text-white fs-1">Tạo phòng ban</h3>
      </a-flex>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-5 fw-bold">Thông tin phòng ban</p>
        <a-divider vertical style="border-color: #fff"></a-divider>
        <a-form
          class="white-text-form"
          :hideRequiredMark="true"
          autocomplete="off"
          layout="vertical"
          ref="departmentFormRef"
          name="basic"
          :model="departmentForm"
          :rules="departmentFormRules">
          <a-form-item name="departmentName" has-feedback>
            <template #label>
              <p class="fw-bold">Tên phòng ban</p>
            </template>
            <a-input v-model:value="departmentForm.departmentName" />
          </a-form-item>

          <a-form-item v-if="hasOrganizationsPolicy">
            <template #label>
              <a-checkbox v-model:checked="departmentForm.hasOrganization"><p class="fw-bold">Tổ chức</p></a-checkbox>
            </template>
            <a-select
              v-model:value="departmentForm.organizationId"
              :options="organizationOptions"
              :field-names="{ label: 'name', value: 'id' }"
              :loading="organizationSelectLoading"
              :disabled="!departmentForm.hasOrganization">
            </a-select>
          </a-form-item>

          <a-form-item>
            <template #label>
              <p class="fw-bold">Mô tả</p>
            </template>
            <a-textarea v-model:value="departmentForm.description" placeholder="Mô tả phòng ban" :rows="3" />
          </a-form-item>
        </a-form>
      </a-skeleton>
    </a-card>
    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: userTableState.selectedRowKeys, onChange: onUserSelectChange }"
          :columns="userColumns"
          :data-source="userDataSource"
          :loading="userTableSpinning"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-5 fw-bold">
                  Thêm người dùng vào phòng ban - <i>Tuỳ chọn</i>
                  <span v-if="this.userOriginDataSource" style="color: lightgray">
                    ({{ this.userOriginDataSource.length }})</span
                  >
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadUserTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24"> </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="userSearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm người dùng"
                  @change="userSearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-button class="no-border-ant-button" ghost>
                <u style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
              </a-button>
            </template>

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: policyTableState.selectedRowKeys, onChange: onPolicySelectChange }"
          :columns="policyColumns"
          :data-source="policyDataSource"
          :loading="policyTableSpinning"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-5 fw-bold">
                  Gán quyền hạn - <i>Tuỳ chọn</i>
                  <span v-if="this.policyOriginDataSource" style="color: lightgray">
                    ({{ this.policyOriginDataSource.length }})</span
                  >
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadPolicyTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24"></a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="policySearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm"
                  @change="policySearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-button class="no-border-ant-button" ghost>
                <u style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
              </a-button>
            </template>

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="pageLoading" active>
        <a-flex class="p-2 pe-0 mb-3" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button type="primary" shape="round" size="large" @click="save">Tạo phòng ban</a-button>
        </a-flex>
      </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, ref, inject, reactive } from "vue";
import { getLastTime, removeAccents } from "@/js/utils/utils.js";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { userState } from "@/stores/user-state";
import { getItem, setItem, removeItem } from "@/js/utils/localStorage";

export default defineComponent({
  setup() {
    const pageLoading = inject("pageLoading");
    const pageSpinning = inject("pageSpinning");
    const userProfile = inject("userProfile");
    const reloadDepartmentDataSource = inject("reloadDepartmentDataSource");
    const userTableSpinning = ref(true);
    const policyTableSpinning = ref(true);
    const departmentForm = reactive({
      departmentName: "",
      hasOrganization: false,
      organizationId: "",
      description: "",
    });
    const departmentFormRef = ref();

    const nameValidator = async (_rule, value) => {
      const nameRegex = /^[\p{L}\d\s]+$/u;
      if (nameRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject("Tên phòng ban không hợp lệ!");
      }
    };

    const departmentFormRules = {
      departmentName: [
        {
          validator: nameValidator,
          trigger: ["blur", "change"],
        },
      ],
    };

    const organizationOptions = ref();

    const userTableState = reactive({
      selectedRowKeys: [],
    });

    const policyTableState = reactive({
      selectedRowKeys: [],
    });

    const onUserSelectChange = (selectedRowKeys) => {
      userTableState.selectedRowKeys = selectedRowKeys;
    };

    const onPolicySelectChange = (selectedRowKeys) => {
      policyTableState.selectedRowKeys = selectedRowKeys;
    };
    const myGetLastTime = getLastTime;

    const userOriginDataSource = ref();
    const userDataSource = ref();

    const policyOriginDataSource = ref();
    const policyDataSource = ref();

    const organizationSelectLoading = ref(true);

    const hasOrganizationsPolicy = ref();
    if (userState().getLogin) {
      // Kiểm tra toàn quyền quản lí tổ chức
      hasOrganizationsPolicy.value = userProfile.value.allPolicies.find((policy) => policy.id === 2);
    }

    const page = 1;
    const pageSize = 10;
    const getNoDepartmentUser = () => {
      userTableSpinning.value = true;
      thuyLoiApi
        .get(
          // `/get-no-department-user?page=${page}`,
          `/get-no-department-user`,
          {
            headers: {
              Authorization: `Bearer ${getItem("accessToken")}`,
            },
          },
        )
        .then((response) => {
          // console.log(response);
          userState().setNoDepartmentUsers(response.data.users);
          userOriginDataSource.value = userState().getNoDepartmentUsers;
          userDataSource.value = userState().getNoDepartmentUsers;
          userTableSpinning.value = false;
        })
        .catch((error) => {
          userTableSpinning.value = false;

          console.log(error);
        });
    };

    if (userState().getNoDepartmentUsers) {
      userOriginDataSource.value = userState().getNoDepartmentUsers;
      userDataSource.value = userState().getNoDepartmentUsers;
      userTableSpinning.value = false;
    } else {
      getNoDepartmentUser();
    }

    const getPolicies = () => {
      policyTableSpinning.value = true;
      thuyLoiApi
        .get(`/get-policies`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          userState().setAvailablePolicies(response.data.policies);
          policyOriginDataSource.value = userState().getAvailablePolicies;
          policyDataSource.value = userState().getAvailablePolicies;
          policyTableSpinning.value = false;
        })
        .catch((error) => {
          policyTableSpinning.value = false;

          console.log(error);
        });
    };

    if (userState().getAvailablePolicies) {
      policyOriginDataSource.value = userState().getAvailablePolicies;
      policyDataSource.value = userState().getAvailablePolicies;
      policyTableSpinning.value = false;
    } else {
      getPolicies();
    }

    return {
      pageLoading,
      pageSpinning,
      userProfile,
      userTableSpinning,
      reloadDepartmentDataSource,
      policyTableSpinning,
      departmentForm,
      departmentFormRef,
      departmentFormRules,
      organizationOptions,
      userTableState,
      onUserSelectChange,
      myGetLastTime,
      policyTableState,
      onPolicySelectChange,
      userOriginDataSource,
      userDataSource,
      policyDataSource,
      policyOriginDataSource,
      hasOrganizationsPolicy,
      getNoDepartmentUser,
      getPolicies,
      organizationSelectLoading,
    };
  },

  data() {
    return {
      userColumns: [
        {
          title: "Tên người dùng",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: "Ngày được tạo",
          dataIndex: "created",
          key: "created",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      policyColumns: [
        {
          title: "Tên quyền hạn",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          key: "description",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
      ],

      userPaginationConfig: {
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} người dùng`,
        showSizeChanger: true,
        // total: this.userDataSource.total,
        // onChange: (page, pageSize) => this.userPageChange(page, pageSize),
        // onShowSizeChange: (current, size) => this.userPageChange(current, size),
      },

      userSearchValue: "",
      policySearchValue: "",
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          // Kiểm tra toàn quyền quản lí tổ chức
          this.hasOrganizationsPolicy = this.userProfile.allPolicies.find((policy) => policy.id === 2);
          if (this.hasOrganizationsPolicy) {
          }
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: "account-manager-departments" });
    },

    reloadUserTable() {
      this.getNoDepartmentUser();
    },
    reloadPolicyTable() {
      this.getPolicies();
    },

    save() {
      console.log(this.departmentForm.organizationId);

      this.pageSpinning = true;
      this.departmentFormRef
        .validate()
        .then((response) => {
          if (!this.departmentForm.hasOrganization) {
            this.departmentForm.organizationId = "";
          }
          thuyLoiApi
            .post(
              `/departments/create`,
              {
                info: this.departmentForm,
                users: this.userTableState.selectedRowKeys,
                policies: this.policyTableState.selectedRowKeys,
              },
              {
                headers: {
                  Authorization: `Bearer ${getItem("accessToken")}`,
                },
              },
            )
            .then((response) => {
              console.log(response);
              this.$message.success(response.data.message, 3);
              this.pageSpinning = false;
              this.reloadDepartmentDataSource = true;
              this.$router.push({ name: "account-manager-departments" });
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message, 5);
              this.pageSpinning = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    userPageChange(page, pageSize) {
      console.log(page, pageSize);
      // currentPageSize.value = pageSize;
      // thuyLoiApi
      //   .post(
      //     `/get-no-department-user?page=${page}`,
      //     { pageSize: pageSize },
      //     accessToken,
      //   )
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    userSearchChange() {
      this.userDataSource = this.filterTable(this.userSearchValue, this.userOriginDataSource);
    },

    policySearchChange() {
      this.policyDataSource = this.filterTable(this.policySearchValue, this.policyOriginDataSource);
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
