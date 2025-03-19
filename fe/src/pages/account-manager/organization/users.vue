<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="usersLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="allAccessOrganizations ? columns : columns1"
          :data-source="dataSource"
          :loading="tableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :scroll="{ x: 800 }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p v-if="allAccessOrganizations" class="fs-4 fw-bold">
                  Người dùng
                  <span class="fs-4 fw-bold" v-if="this.dataSource" style="color: lightgray">
                    ({{ this.dataSource.length }})
                  </span>
                </p>

                <p v-else class="fs-4 fw-bold">
                  Thành viên {{ userProfile.organization_name }}
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
                  <!-- <a-button class="ps-3 pe-3 fw-bold" type="default" @click="deleteDepartments">Xoá</a-button> -->

                  <router-link :to="{ name: '' }">
                    <a-button class="ps-3 pe-3 fw-bold" type="primary">Thêm người dùng mới</a-button>
                  </router-link>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem"></p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input v-model:value="searchValue" class="mt-2" placeholder="Tìm kiếm" @change="searchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <router-link :to="{ name: 'account-manager-user-profile', params: { id: record.id } }">
                <a-button class="no-border-ant-button" ghost>
                  <u style="text-underline-offset: 3px">
                    {{ record.name }}
                  </u>
                </a-button>
              </router-link>
            </template>

            <template v-else-if="column.key === 'department'">
              <span v-if="record.department">{{ record.department.name }}</span>
            </template>

            <template v-else-if="column.key === 'organization'">
              <span v-if="record.organization">{{ record.organization.name }}</span>
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
    const usersLoading = ref(true);
    const userProfile = inject("userProfile");

    const originDataSource = ref();
    const dataSource = ref();

    const getUsers = () => {
      usersLoading.value = true;
      thuyLoiApi
        .get(`/get-users`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          userState().setUsers(response.data.users);
          originDataSource.value = userState().getUsers;
          dataSource.value = originDataSource.value;

          usersLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          usersLoading.value = false;
        });
    };
    if (userState().getLogin) {
      if (!userState().getUsers) {
        getUsers();
      } else {
        originDataSource.value = userState().getUsers;
        dataSource.value = originDataSource.value;
        usersLoading.value = false;
      }
    }

    const myGetLastTime = getLastTime;
    return {
      pageLoading,
      usersLoading,
      userProfile,
      getUsers,
      dataSource,
      originDataSource,
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
          minWidth: 300,
        },

        {
          title: "Phòng ban",
          dataIndex: "department",
          key: "department",
          sorter: (a, b) => {
            const none = "Chưa xác định";
            if (!a.department && b.department) {
              return none.length - b.department.name.length;
            } else if (!b.department && a.department) {
              return a.department.name.length - none.length;
            } else if (!a.department && !b.department) {
              return none.length - none.length;
            } else {
              return a.department.name.length - b.department.name.length;
            }
          },
        },
        {
          title: "Tổ chức",
          dataIndex: "organization",
          key: "organization",
          sorter: (a, b) => {
            const none = "Chưa xác định";
            if (!a.organization && b.organization) {
              return none.length - b.organization.name.length;
            } else if (!b.organization && a.organization) {
              return a.organization.name.length - none.length;
            } else if (!a.organization && !b.organization) {
              return none.length - none.length;
            } else {
              return a.organization.name.length - b.organization.name.length;
            }
          },
          visible: false,
        },
        {
          title: "Ngày được tạo",
          dataIndex: "created",
          key: "created",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      columns1: [
        {
          title: "Tên",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.length - b.name.length,
          minWidth: 300,
        },

        {
          title: "Phòng ban",
          dataIndex: "department",
          key: "department",
          sorter: (a, b) => {
            const none = "Chưa xác định";
            if (!a.department && b.department) {
              return none.length - b.department.name.length;
            } else if (!b.department && a.department) {
              return a.department.name.length - none.length;
            } else if (!a.department && !b.department) {
              return none.length - none.length;
            } else {
              return a.department.name.length - b.department.name.length;
            }
          },
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
      searchValue: "",
      selectedRowKeys: [],
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !userState().getUsers) {
          this.getUsers();
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {
    allAccessOrganizations() {
      const allAccessOrganizationsPolicy = 2;
      return this.userProfile.allPolicies.find((policy) => policy.id == allAccessOrganizationsPolicy);
    },
  },

  methods: {
    backward() {
      this.$router.push({ name: "account-manager-page" });
    },

    reloadTable() {
      this.getUsers();
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    searchChange() {
      this.dataSource = this.filterTable(this.searchValue, this.originDataSource);
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
