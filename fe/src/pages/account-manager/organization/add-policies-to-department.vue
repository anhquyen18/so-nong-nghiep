<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="pageLoading" active>
        <a-flex justify="space-between">
          <h3 v-if="department" class="text-white fs-2">Thêm quyền hạn cho {{ department.name }}</h3>
        </a-flex>
      </a-skeleton>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
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
                  Quyền hạn
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
              <a-col class="mt-1" :xs="24"> </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="policySearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm người dùng"
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

          <a-button
            type="primary"
            shape="round"
            size="large"
            @click="save"
            :disabled="this.policySelectedRowKeys.length <= 0"
            :loading="addPoliciesLoading">
            Thêm quyền hạn
          </a-button>
        </a-flex>
      </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref, reactive } from "vue";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { userState } from "@/stores/user-state";
import { getItem } from "@/js/utils/localStorage.js";
import { getLastTime, removeAccents } from "@/js/utils/utils.js";
import { useRouter } from "vue-router";

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    if (from.name === "account-manager-department-detail" && to.query.removePoliciesStatus == "true") {
      next((data) => {
        data.reloadPolicyTable();
      });
    } else {
      next();
    }
  },

  setup() {
    const router = useRouter();

    const pageLoading = inject("pageLoading");
    const userProfile = inject("userProfile");
    const departmentId = ref(router.currentRoute.value.params.departmentId);
    const department = ref();
    const policyOriginDataSource = ref();
    const policyDataSource = ref();
    const policyTableSpinning = ref();

    const getDepartment = () => {
      pageLoading.value = true;
      thuyLoiApi
        .get("/departments/" + departmentId.value, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          userState().setMyDepartment(response.data.department);
          department.value = userState().getMyDepartment;

          pageLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          router.push({ name: "account-manager-overview" });
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
        // getDataFromDepartment(department.value);
      }
    }

    const getPolicies = () => {
      policyTableSpinning.value = true;
      thuyLoiApi
        .get(`/departments/${departmentId.value}/get-policies-not-in-department`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
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

    const myGetLastTime = getLastTime;

    return {
      pageLoading,
      userProfile,
      department,
      departmentId,
      getDepartment,
      policyOriginDataSource,
      policyDataSource,
      policyTableSpinning,
      myGetLastTime,
      getPolicies,
    };
  },

  data() {
    return {
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
      policySearchValue: "",

      addPoliciesLoading: false,
      addPoliciesComplete: false,
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

  computed: {},

  methods: {
    backward() {
      this.$router.push({
        name: "account-manager-department-detail",
        params: { departmentId: this.departmentId },
        query: { section: "policies", addPoliciesComplete: this.addPoliciesComplete },
      });
    },
    onPolicySelectChange(selectedRowKeys) {
      this.policySelectedRowKeys = selectedRowKeys;
    },
    reloadPolicyTable() {
      this.getPolicies();
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    policySearchChange() {
      this.policyDataSource = this.filterTable(this.policySearchValue, this.policyOriginDataSource);
    },

    save() {
      this.addPoliciesLoading = true;
      thuyLoiApi
        .post(
          `/departments/${this.departmentId}/add-policies`,
          { policies: this.policySelectedRowKeys },
          {
            headers: {
              Authorization: `Bearer ${getItem("accessToken")}`,
            },
          },
        )
        .then((response) => {
          this.$message.success(response.data.message);
          this.addPoliciesComplete = true;
          this.policySelectedRowKeys = [];
          this.addPoliciesLoading = false;
          this.reloadPolicyTable();
        })
        .catch((error) => {
          this.addPoliciesLoading = false;
          console.log(error);

          this.$message.error(error.response.data.message);
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
