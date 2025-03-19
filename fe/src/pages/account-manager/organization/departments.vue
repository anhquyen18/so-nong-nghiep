<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <!-- <div class="account-manager-transparent-card"> -->
    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: tableState.selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="dataSource"
          :loading="tableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4 fw-bold">
                  Phòng ban
                  <span class="fs-4 fw-bold" v-if="this.dataSource" style="color: lightgray">
                    ({{ this.dataSource.length }})
                  </span>
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                  <a-button class="ps-3 pe-3 fw-bold" type="default" @click="deleteDepartments">Xoá</a-button>

                  <router-link :to="{ name: 'account-manager-department-create' }">
                    <a-button class="ps-3 pe-3 fw-bold" type="primary">Tạo phòng ban</a-button>
                  </router-link>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">
                  Một phòng ban là một tập hợp người dùng được trao cho những quyền hạn nhất định.
                </p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="departmentSearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm phòng ban"
                  @change="departmentSearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <router-link :to="{ name: 'account-manager-department-detail', params: { departmentId: record.id } }">
                <a-button class="no-border-ant-button" ghost>
                  <u style="text-underline-offset: 3px">
                    {{ record.name }}
                  </u>
                </a-button>
              </router-link>
            </template>

            <template v-else-if="column.key === 'organization_name'">
              <span v-if="record.organization_name">{{ record.organization_name }}</span>
              <span v-else>
                <a-tag color="warning">
                  <template #icon>
                    <ExclamationCircleOutlined />
                  </template>
                  Chưa xác định
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.key === 'users_count'">
              <span v-if="record.users_count > 0">
                {{ record.users_count }}
              </span>

              <span v-else class="text-warning">
                {{ record.users_count }}
                <ExclamationCircleOutlined />
              </span>
            </template>

            <template v-else-if="column.key === 'policies_count'">
              <a-tag v-if="record.policies_count > 0" color="success">
                <template #icon>
                  <CheckCircleOutlined />
                </template>
                Đã phân quyền
              </a-tag>

              <a-tag v-else color="warning">
                <template #icon>
                  <ExclamationCircleOutlined />
                </template>
                Chưa xác định
              </a-tag>
            </template>

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }} </span> <br />
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>
    <!-- </div> -->
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref, provide } from "vue";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { userState } from "@/stores/user-state";
import { getItem } from "@/js/utils/localStorage.js";
import { getLastTime, removeAccents } from "@/js/utils/utils.js";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
  },

  setup() {
    const pageLoading = inject("pageLoading");
    const userProfile = inject("userProfile");
    const reloadDepartmentDataSource = inject("reloadDepartmentDataSource");

    const tableState = ref({
      selectedRowKeys: [],
      loading: false,
    });

    const onSelectChange = (selectedRowKeys) => {
      tableState.value.selectedRowKeys = selectedRowKeys;
    };

    const originDataSource = ref();
    const dataSource = ref();
    const allOrganizationAccess = ref();

    const getDepartments = (organizationId) => {
      pageLoading.value = true;
      thuyLoiApi
        .get(`/organization/${organizationId}/departments`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          userState().setDepartments(response.data.departments);
          originDataSource.value = userState().getDepartments;
          dataSource.value = userState().getDepartments;

          allOrganizationAccess.value = response.data.allAccess;
          pageLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          pageLoading.value = false;
        });
    };

    if (userState().getLogin) {
      if (!userState().getDepartments || reloadDepartmentDataSource.value) {
        getDepartments(userProfile.value.organization.id);
        reloadDepartmentDataSource.value = false;
      } else {
        dataSource.value = userState().getDepartments;
      }
    }

    const myGetLastTime = getLastTime;
    return {
      pageLoading,
      tableState,
      onSelectChange,
      userProfile,
      getDepartments,
      dataSource,
      originDataSource,
      allOrganizationAccess,
      myGetLastTime,
    };
  },

  data() {
    return {
      columns: [
        {
          title: "Tên",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: "Tổ chức",
          dataIndex: "organization_name",
          key: "organization_name",
          sorter: (a, b) => {
            // console.log(a.organization_name, b.organization_name);
            const none = "Chưa xác định";
            if (!a.organization_name && b.organization_name) {
              return none.length - b.organization_name.length;
            } else if (!b.organization_name && a.organization_name) {
              return a.organization_name - none.length;
            } else if (!a.organization_name && !b.organization_name) {
              return none.length - none.length;
            } else {
              return a.organization_name - b.organization_name;
            }
          },
        },
        {
          title: "Số lượng",
          dataIndex: "users_count",
          key: "users_count",
          sorter: (a, b) => a.users_count - b.users_count,
          width: 100,
        },
        {
          title: "Quyền hạn",
          dataIndex: "policies_count",
          key: "policies_count",
          sorter: (a, b) => a.policies_count - b.policies_count,
        },
        {
          title: "Ngày được tạo",
          dataIndex: "created",
          key: "created",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      tableLoading: false,
      departmentSearchValue: "",
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !userState().getDepartments) {
          this.getDepartments(this.userProfile.organization.id);
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
      this.$router.push({ name: "account-manager-page" });
    },

    reloadTable() {
      this.tableLoading = true;
      thuyLoiApi
        .get(`/organization/${this.userProfile.organization.id}/departments`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          // console.log(response);
          userState().setDepartments(response.data.departments);
          this.originDataSource = userState().getDepartments;
          this.dataSource = userState().getDepartments;
          this.allOrganizationAccess = response.data.allAccess;
          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false;
        });
    },

    deleteDepartments() {
      this.tableLoading = true;
      const departmentIds = this.tableState.selectedRowKeys.join(",");
      thuyLoiApi
        .delete(`/departments/delete?id=${departmentIds}`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          // console.log(response);
          this.reloadTable();
          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false;
        });
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    departmentSearchChange() {
      this.dataSource = this.filterTable(this.departmentSearchValue, this.originDataSource);
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
