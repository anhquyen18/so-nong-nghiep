<template>
  <a-flex class="account-overview" vertical gap="20" align="center">
    <a-card :bordered="false" class="account-manager-card">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-3 fw-bold mb-1">{{ userProfile.name }}</p>
        <a-row>
          <a-col flex="1 1 300px">
            <a-skeleton :loading="pageLoading" active>
              <span>
                <p class="fw-bold mt-1">Tổ chức:</p>
                <p v-if="userProfile.organization_name">{{ userProfile.organization_name }}</p>
                <p v-else>Không</p>
              </span>
              <span>
                <p class="fw-bold mt-1">Phòng ban:</p>
                <p v-if="userProfile.department_name">{{ userProfile.department_name }}</p>
                <p v-else>Không</p>
              </span>
            </a-skeleton>
          </a-col>
          <a-col flex="1 0 200px" style="padding: 10px 0 0 20px">
            <a-skeleton :loading="pageLoading" active avatar>
              <a-image v-if="avatar" style="width: 250px; height: auto" :src="avatar" />
              <img v-else style="width: 250px; height: auto" src="/others/no_avatar.jpg" />
            </a-skeleton>
          </a-col>
        </a-row>
      </a-skeleton>
    </a-card>
    <a-card :bordered="false" class="account-manager-card">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-3 fw-bold mb-4">Tài khoản</p>
        <a-flex vertical :gap="8">
          <!-- <router-link :to="{ name: 'account-manager-edit-user-info' }"> -->
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-pen me-3 fs-4" style="width: 30px"></i>
                <p class="fw-bold text-wrap">Chỉnh sửa hồ sơ</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->

          <a-upload
            class="avatar-upload"
            v-model:file-list="avatarFile"
            :show-upload-list="false"
            :action="avatarUploadAction"
            :headers="{ Authorization: `Bearer ${accessToken}` }"
            crossOrigin="anonymous"
            :before-upload="beforeAvatarUpload"
            @change="avatarUploadChange">
            <a-button
              class="no-border-ant-button background-hover-button fs-6"
              block
              style="height: auto; padding: 15px"
              ghost>
              <a-row justify="space-between" align="middle">
                <a-col class="center-col">
                  <i class="fa-solid fa-image-portrait me-3 fs-4" style="width: 30px"></i>
                  <p class="fw-bold text-wrap">Đổi ảnh đại diện</p>
                </a-col>
                <a-col class="center-col">
                  <i class="fa-solid fa-angles-right"></i>
                </a-col>
              </a-row>
            </a-button>
          </a-upload>

          <!-- <router-link :to="{ name: 'account-manager-change-user-password' }"> -->
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-lock me-3 fs-4" style="width: 30px"></i>
                <p class="fw-bold text-wrap">Đổi mật khẩu</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->

          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-comment-dots account-manager-button-icon"></i>
                <p class="fw-bold text-wrap">Yêu cầu quyền truy cập</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
        </a-flex>
      </a-skeleton>
    </a-card>

    <a-card :bordered="false" class="account-manager-card">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-3 fw-bold mb-4">Tổ chức</p>

        <a-flex vertical :gap="8">
          <!-- <router-link :to="{ name: 'account-manager-departments' }"> -->
          <a-button
            v-if="userProfile.allPolicies.find((policy) => policy.id === 2 || policy.id === 1)"
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px">
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-users-viewfinder account-manager-button-icon"></i>
                <p class="fw-bold text-wrap">Phòng ban</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->

          <!-- <router-link :to="{ name: 'account-manager-department-detail', params: { departmentId: routeDepartmentId } }"> -->
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-user-group account-manager-button-icon"></i>
                <p class="fw-bold text-wrap">Phòng ban của tôi</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->

          <!-- <router-link :to="{ name: 'account-manager-users' }"> -->
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-building-user account-manager-button-icon"></i>
                <p class="fw-bold text-wrap">Người dùng</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->

          <!-- <router-link :to="{ name: 'account-manager-my-policies' }"> -->
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            block
            style="height: auto; padding: 15px"
            ghost>
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-building-shield account-manager-button-icon"></i>
                <p class="fw-bold text-wrap">Quyền hạn của tôi</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
          <!-- </router-link> -->
        </a-flex>
      </a-skeleton>
    </a-card>

    <a-card :bordered="false" class="account-manager-card">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-3 fw-bold mb-4">Lớp bản đồ Chi cục trồng trọt và bảo vệ thực vật</p>

        <a-flex vertical :gap="8">
          <router-link :to="{ name: 'account-manager-layer-change-fields' }">
            <a-button
              class="no-border-ant-button background-hover-button fs-6"
              block
              style="height: auto; padding: 15px"
              ghost>
              <a-row justify="space-between" align="middle">
                <a-col class="center-col">
                  <i class="fa-solid fa-user-group account-manager-button-icon"></i>
                  <p class="fw-bold text-wrap">Thay đổi trường dữ liệu</p>
                </a-col>
                <a-col class="center-col">
                  <i class="fa-solid fa-angles-right"></i>
                </a-col>
              </a-row>
            </a-button>
          </router-link>
        </a-flex>
      </a-skeleton>
    </a-card>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref } from "vue";
import { getItem, setItem, removeItem } from "@/js/localStorage.js";
import { userState } from "@/stores/user-state";

export default defineComponent({
  setup() {
    const pageLoading = inject("pageLoading");
    const userProfile = inject("userProfile");
    // const userProfile = JSON.parse(getItem('user'));

    const avatar = inject("avatar");
    const pageSpinning = inject("pageSpinning");
    const accessToken = getItem("accessToken");
    let avatarUploadAction = "";

    // if (userState().getLogin) {
    //   avatarUploadAction = `${import.meta.env.VITE_APP_API_URL}/upload-user-avatar/${userState().getUserProfile.id}`;
    // }

    return {
      pageLoading,
      userProfile,
      avatar,
      accessToken,
      avatarUploadAction,
      pageSpinning,
    };
  },

  data() {
    return {
      avatarFile: [],
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          this.avatarUploadAction = `${import.meta.env.VITE_APP_API_URL}/upload-user-avatar/${this.userProfile.id}`;
        } else {
          this.avatarUploadAction = "";
        }
      },
      deep: false,
      // once: true,
    },
  },

  computed: {
    loginState() {
      // return userState().getLogin;
    },
    routeDepartmentId() {
      if (this.userProfile.department_id) {
        return this.userProfile.department_id;
      } else {
        return "no-department";
      }
    },
  },

  methods: {
    beforeAvatarUpload(file) {
      const acceptList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
      if (acceptList.indexOf(file.type) !== -1) {
        return true;
      } else {
        this.$message.error("Ảnh không phù hợp. Vui lòng chọn ảnh khác.");
        return false;
      }
    },

    avatarUploadChange(info) {
      if (info.file.status === "uploading") {
        this.pageSpinning = true;
      }
      if (info.file.status === "done") {
        console.log(this.avatarFile[0]);
        this.avatar = this.avatarFile[0].response.avatar;
        this.$message.success(this.avatarFile[0].response.message, 3);
        this.avatarFile = [];
        this.pageSpinning = false;
      }
      if (info.file.status === "error") {
        console.log(info);
        this.pageSpinning = false;
        this.$message.error("Ảnh không phù hợp. Vui lòng chọn ảnh khác.");

        // this.$message.error(this.avatarFile[0].response.message, 3);
      }
    },

    hasPermissions(policies) {
      if (this.loginState) {
        return policies.some((policy) => {
          // return userState().getUserProfile.allPolicies.some((userPolicy) => userPolicy.id == policy);
        });
      } else {
        return false;
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.avatar-upload {
  & .ant-upload {
    width: 100%;
  }
}
</style>
