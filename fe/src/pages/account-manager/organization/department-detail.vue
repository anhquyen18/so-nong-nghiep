<template>
  <a-flex v-if="departmentId == 'no-department'" vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="pageLoading" active>
        <a-flex justify="space-between">
          <h3 class="text-white fs-5">Không tìm thấy phòng ban.</h3>
        </a-flex>
      </a-skeleton>
    </div>
  </a-flex>

  <a-flex v-else vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex justify="space-between">
        <h3 v-if="department" class="text-white fs-2">{{ department.name }}</h3>
        <!-- <a-button type="default">Xoá</a-button> -->
      </a-flex>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-flex justify="space-between">
          <p class="fs-5 fw-bold">Thông tin chung</p>
          <a-button class="account-manager-text-ant-button" type="default" @click="showEditInfoModal">
            Chỉnh sửa
          </a-button>
        </a-flex>
        <a-divider vertical style="border-color: #fff"></a-divider>
        <a-row v-if="department" justify="space-around" :wrap="true" :gutter="[8, 24]">
          <a-col :xs="24" :md="8">
            <p class="fw-bold mb-2">Tên phòng ban</p>
            <p>{{ department.name }}</p>
          </a-col>
          <a-col :xs="24" :md="8">
            <p class="fw-bold mb-2">Mô tả</p>
            <p>{{ department.description }}</p>
          </a-col>
          <a-col :xs="24" :md="8">
            <p class="fw-bold mb-2">Ngày được tạo</p>
            <p>{{ new Date(department.created_at) }}</p>
          </a-col>
        </a-row>
      </a-skeleton>
    </a-card>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-tabs :activeKey="tabActiveKey" @change="tabChange">
          <a-tab-pane key="users" tab="Thành viên">
            <a-table
              class="account-manager-table"
              rowKey="id"
              :row-selection="{ selectedRowKeys: userSelectedRowKeys, onChange: onUserSelectChange }"
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
                      Thành viên trong phòng ban
                      <span v-if="this.userOriginDataSource" style="color: lightgray">
                        ({{ this.userOriginDataSource.length }})
                      </span>
                    </p>
                  </a-col>
                  <a-col flex="">
                    <a-flex gap="middle">
                      <a-button class="account-manager-text-ant-button" type="default" ghost @click="reloadUserTable">
                        <i class="fa-solid fa-rotate-right"></i>
                      </a-button>

                      <a-button
                        v-if="hasOrganizationPolicy"
                        class="account-manager-text-ant-button"
                        type="default"
                        @click="removeUsers"
                        :disabled="this.userSelectedRowKeys.length <= 0"
                        :loading="removeUsersLoading">
                        Xoá
                      </a-button>

                      <router-link
                        :to="{
                          name: 'account-manager-department-detail-add-users',
                          parmas: { departmentId: this.departmentId },
                          query: { removeUsersStatus: removeUsersStatus },
                        }">
                        <a-button v-if="hasOrganizationPolicy" class="account-manager-text-ant-button" type="primary">
                          Thêm thành viên
                        </a-button>
                      </router-link>
                    </a-flex>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="mt-1" :xs="24"></a-col>
                  <a-col :xs="24" :md="16">
                    <a-input
                      v-model:value="userSearchValue"
                      class="mt-2"
                      placeholder="Tìm kiếm"
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
          </a-tab-pane>

          <a-tab-pane key="policies" tab="Quyền hạn" force-render>
            <a-table
              class="account-manager-table"
              rowKey="id"
              :row-selection="{ selectedRowKeys: policySelectedRowKeys, onChange: onPolicySelectChange }"
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
                      Quyền hạn phòng ban
                      <span v-if="this.policyOriginDataSource" style="color: lightgray">
                        ({{ this.policyOriginDataSource.length }})
                      </span>
                    </p>
                  </a-col>
                  <a-col flex="">
                    <a-flex gap="middle">
                      <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadPolicyTable">
                        <i class="fa-solid fa-rotate-right"></i>
                      </a-button>

                      <a-button
                        v-if="hasOrganizationPolicy"
                        class="account-manager-text-ant-button"
                        type="default"
                        @click="removePolicies"
                        :disabled="!this.policySelectedRowKeys.length > 0"
                        :loading="removePoliciesLoading">
                        Xoá
                      </a-button>

                      <router-link
                        :to="{
                          name: 'account-manager-department-detail-add-policies',
                          parmas: { departmentId: this.departmentId },
                          query: { removePoliciesStatus: removePoliciesStatus },
                        }">
                        <a-button v-if="hasOrganizationPolicy" class="account-manager-text-ant-button" type="primary">
                          Thêm quyền hạn
                        </a-button>
                      </router-link>
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
          </a-tab-pane>
        </a-tabs>
      </a-skeleton>
    </a-card>

    <a-modal v-model:open="editInfoModalOpen" :closable="false">
      <template #title>
        <a-flex justify="space-between">
          <span class="fs-5 pb-2 pt-2"> Chỉnh sửa phòng ban </span>

          <a class="close-button me-2" @click="editInfoModalCancel"><i class="fa-solid fa-xmark"></i></a>
        </a-flex>
      </template>
      <template #footer>
        <a-button class="account-manager-text-ant-button" key="back" @click="editInfoModalCancel">Huỷ</a-button>
        <a-button
          class="account-manager-text-ant-button"
          key="submit"
          type="primary"
          @click="editInfoModalOk"
          :loading="editInfoModalOkLoading">
          Lưu thay đổi
        </a-button>
      </template>
      <a-form
        :hideRequiredMark="true"
        autocomplete="off"
        layout="vertical"
        ref="editInfoFormRef"
        name="basic"
        :model="editInfoState"
        :rules="editInfoFormRules">
        <a-form-item name="name">
          <template #label>
            <p class="fw-bold">Tên phòng ban</p>
          </template>
          <a-input v-model:value="editInfoState.name" placeholder="Tên phòng ban" />
        </a-form-item>

        <a-form-item name="description">
          <template #label>
            <p class="fw-bold">Mô tả</p>
          </template>
          <a-textarea v-model:value="editInfoState.description" placeholder="Mô tả" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref, reactive, provide } from "vue";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { userState } from "@/stores/user-state";
import { getItem } from "@/js/utils/localStorage.js";
import { getLastTime, removeAccents } from "@/js/utils/utils.js";
import { useRouter } from "vue-router";

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // console.log(from);
    if (from.name === "account-manager-department-detail-add-users" && to.query.addUsersComplete == "true") {
      next((data) => {
        data.reloadUserTable();
        // data.preRoute =
      });
    } else if (
      from.name === "account-manager-department-detail-add-policies" &&
      to.query.addPoliciesComplete == "true"
    ) {
      next((data) => {
        data.reloadPolicyTable();
      });
    } else {
      next((data) => {
        data.preRoute = from;
      });
    }
  },

  setup() {
    const pageLoading = inject("pageLoading");
    const userProfile = inject("userProfile");
    const router = useRouter();
    const departmentId = ref(router.currentRoute.value.params.departmentId);
    const tabActiveKey = ref("users");
    const currentQuery = { ...router.currentRoute.query };
    currentQuery.section = tabActiveKey.value;
    router.replace({ query: currentQuery });

    const department = ref();
    provide("department", department);

    const departmentDate = ref();
    const userOriginDataSource = ref();
    const userDataSource = ref();
    const policyOriginDataSource = ref();
    const policyDataSource = ref();
    const editInfoState = reactive({
      name: "",
      description: "",
    });

    const getDataFromDepartment = (department) => {
      if (department) {
        departmentDate.value = new Date(department.created_at);

        userOriginDataSource.value = department.users;
        userDataSource.value = userOriginDataSource.value;
        policyOriginDataSource.value = department.policies;
        policyDataSource.value = policyOriginDataSource.value;

        editInfoState.name = department.name;
        editInfoState.description = department.description;
      }
    };

    // Cần lấy thông tin để hiện thị là đang add vào Department nào
    const getDepartment = () => {
      pageLoading.value = true;
      thuyLoiApi
        .get("/departments/" + departmentId.value, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          userState().setMyDepartment(response.data.department);
          department.value = userState().getMyDepartment;
          getDataFromDepartment(department.value);

          pageLoading.value = false;
        })
        .catch((error) => {
          departmentId.value = "no-department";
          console.log(error);
          pageLoading.value = false;
        });
    };

    if (userState().getLogin && departmentId.value != "no-department") {
      // Kiểm tra đăng nhập và người đùng đang có trong nhóm nào không
      // Không trong nhóm thì không request gì cả
      if (!userState().getMyDepartment) {
        getDepartment();
      } else {
        department.value = userState().getMyDepartment;
        getDataFromDepartment(department.value);
      }
    }

    const myGetLastTime = getLastTime;

    const editInfoModalOkLoading = ref(false);
    const nameValidator = async (_rule, value) => {
      const nameRegex = /^[\p{L}\d\s]+$/u;
      // if (value == department.value.name) {
      // editInfoModalOkDisabled.value = true;
      // return;
      // } else {
      // editInfoModalOkDisabled.value = false;

      if (nameRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject("Tên phòng ban không hợp lệ!");
        // }
      }
    };
    const editInfoFormRef = ref();
    const editInfoFormRules = {
      name: [
        {
          validator: nameValidator,
          trigger: ["blur", "change"],
        },
      ],
    };

    return {
      pageLoading,
      userProfile,
      department,
      departmentId,
      tabActiveKey,
      getDepartment,
      userOriginDataSource,
      userDataSource,
      policyOriginDataSource,
      policyDataSource,
      myGetLastTime,
      currentQuery,
      editInfoState,
      editInfoFormRef,
      editInfoFormRules,
      editInfoModalOkLoading,
    };
  },

  data() {
    return {
      userSelectedRowKeys: [],
      userColumns: [
        {
          title: "Tên người dùng",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title: "Ngày được tạo",
          dataIndex: "created",
          key: "created",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      userTableSpinning: false,
      userSearchValue: "",

      policySelectedRowKeys: [],
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
      policyTableSpinning: false,
      policySearchValue: "",

      editInfoModalOpen: false,
      removeUsersLoading: false,
      removeUsersStatus: false,
      removePoliciesLoading: false,
      removePoliciesStatus: false,

      preRoute: "",
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !userState().getMyDepartment) {
          this.getDepartment();
          // this.dataSource.users[0];
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {
    hasOrganizationPolicy() {
      return this.userProfile.allPolicies.find((policy) => policy.id === 2 || policy.id === 1);
    },
    // editInfoState() {
    //   return {
    //     name: this.department.name,
    //     description: this.department.description,
    //   };
    // },
  },

  methods: {
    backward() {
      const overviewName = "account-manager-overview";
      const departmentsName = "account-manager-departments";
      if (this.preRoute.name == departmentsName) {
        this.$router.push(this.preRoute);
      } else {
        this.$router.push({ name: overviewName });
      }
    },

    onUserSelectChange(selectedRowKeys) {
      this.userSelectedRowKeys = selectedRowKeys;
    },

    onPolicySelectChange(selectedRowKeys) {
      this.policySelectedRowKeys = selectedRowKeys;
    },

    reloadUserTable() {
      this.getDepartment();
    },
    reloadPolicyTable() {
      this.getDepartment();
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

    tabChange(activeKey) {
      this.tabActiveKey = activeKey;
      this.currentQuery.section = activeKey;
      this.$router.replace({ query: this.currentQuery });
    },

    removeUsers() {
      this.removeUserLoading = true;

      thuyLoiApi
        .put(
          `/departments/${this.departmentId}/remove-users`,
          { users: this.userSelectedRowKeys },
          {
            headers: {
              Authorization: `Bearer ${getItem("accessToken")}`,
            },
          },
        )
        .then((response) => {
          // console.log(response);
          this.$message.success(response.data.message);
          this.selectedRowKeys = [];
          this.removeUserLoading = false;
          this.removeUsersStatus = true;
          this.reloadUserTable();
        })
        .catch((error) => {
          console.log(error);
          this.removeUserLoading = false;
          this.$message.error(error.response.data.message);
        });
    },

    removePolicies() {
      this.removePoliciesLoading = true;
      thuyLoiApi
        .delete(`/departments/${this.departmentId}/remove-policies?id=${this.policySelectedRowKeys.join(",")}`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          this.policySelectedRowKeys = [];
          this.removePoliciesLoading = false;
          this.removePoliciesStatus = true;
          this.$message.success(response.data.message);
          this.reloadPolicyTable();
        })
        .catch((error) => {
          this.removePoliciesLoading = false;
          console.log(error);
          this.$message.error(error.response.data.message);
        });
    },

    showEditInfoModal() {
      this.editInfoModalOpen = true;
    },

    editInfoModalCancel() {
      this.editInfoModalOpen = false;
    },

    editInfoModalOk() {
      this.editInfoModalOkLoading = true;

      this.editInfoFormRef
        .validate()
        .then((response) => {
          thuyLoiApi
            .put(`/departments/${this.departmentId}/update-info`, this.editInfoState, {
              headers: {
                Authorization: `Bearer ${getItem("accessToken")}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              this.getDepartment();
              this.editInfoModalOkLoading = false;
              this.editInfoModalOpen = false;
            })
            .catch((error) => {
              console.log(error);
              this.editInfoModalOkLoading = false;
              // this.editInfoModalOpen = false;
            });
        })
        .catch((error) => {
          console.log(error);
          this.editInfoModalOkLoading = false;
        });
    },
  },

  mounted() {
    const section = this.$route.query.section;
    const sections = ["policies", "users"];
    if (section === sections[0]) {
      this.tabActiveKey = sections[0];
      this.currentQuery.section = sections[0];
      this.$router.replace({ query: this.currentQuery });
    }

    if (userState().getMyDepartment) {
      const idRequested = this.$router.currentRoute.value.params.departmentId;
      const idStored = userState().getMyDepartment.id;
      if (idRequested != idStored) this.getDepartment();
    }
  },
});
</script>

<style lang="scss"></style>
