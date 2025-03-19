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
          <h3 v-if="department" class="text-white fs-2">Thêm thành viên vào {{ department.name }}</h3>
        </a-flex>
      </a-skeleton>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
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
                  Người dùng chưa có phòng ban
                  <span v-if="this.userOriginDataSource" style="color: lightgray">
                    ({{ this.userOriginDataSource.length }})
                  </span>
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

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="pageLoading" active>
        <a-flex class="p-2 pe-0 mb-3" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button
            type="primary"
            shape="round"
            size="large"
            @click="save"
            :disabled="this.userSelectedRowKeys.length <= 0"
            :loading="addUserLoading">
            Thêm thành viên
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
    if (from.name === "account-manager-department-detail" && to.query.removeUsersStatus == "true") {
      next((data) => {
        data.reloadUserTable();
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
    const userOriginDataSource = ref();
    const userDataSource = ref();
    const userTableSpinning = ref();

    // Cần lấy thông tin để hiện thị là đang add vào Department nào.
    // Ở đây khi add-users không nằm trong layout của create-department, mà không nằm trong nó  nên khi load
    // add-users không thể lấy thông tin từ department-detail mà phải request mới.
    // Thực tế nó là con của layout account-manager
    // còn cho add-users trở thành con của department-detail thì không route view đến được.
    // Tương tự với add-policies.
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

    const getNoDepartmentUser = () => {
      userTableSpinning.value = true;
      thuyLoiApi
        .get(`/get-no-department-user`, {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        })
        .then((response) => {
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

    const myGetLastTime = getLastTime;

    return {
      pageLoading,
      userProfile,
      department,
      departmentId,
      getDepartment,
      userOriginDataSource,
      userDataSource,
      userTableSpinning,
      myGetLastTime,
      getNoDepartmentUser,
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
          title: "Ngày được tạo",
          dataIndex: "created",
          key: "created",
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      userSearchValue: "",

      addUserLoading: false,
      addUsersComplete: false,
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
        query: { section: "users", addUsersComplete: this.addUsersComplete },
      });
    },
    onUserSelectChange(selectedRowKeys) {
      this.userSelectedRowKeys = selectedRowKeys;
    },
    reloadUserTable() {
      this.getNoDepartmentUser();
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    userSearchChange() {
      this.userDataSource = this.filterTable(this.userSearchValue, this.userOriginDataSource);
    },

    save() {
      this.addUsersLoading = true;
      thuyLoiApi
        .put(
          `/departments/${this.departmentId}/add-users`,
          { users: this.userSelectedRowKeys },
          {
            headers: {
              Authorization: `Bearer ${getItem("accessToken")}`,
            },
          },
        )
        .then((response) => {
          this.$message.success(response.data.message);
          this.addUsersComplete = true;
          this.userSelectedRowKeys = [];
          this.addUsersLoading = false;
          // this.backward();
        })
        .catch((error) => {
          this.addUsersLoading = false;
          console.log(error);

          this.$message.error(error.response.data.message);
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
