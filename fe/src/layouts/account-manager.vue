<template>
  <a-spin :spinning="pageSpinning" size="large">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="account-manager-header">
        <a-row style="height: 80%">
          <a-col class="all-h-100" :xs="0" :sm="{ span: 0, offset: 0 }" :xl="{ span: 3, offset: 2 }">
            <a-flex justify="left" align="center">
              <router-link :to="{ name: 'home-page' }">
                <a>
                  <img class="ms-4 mt-2" src="/logo/bo-nong-nghiep-logo.png" alt="" style="width: auto" />
                </a>
              </router-link>
            </a-flex>
          </a-col>

          <a-col
            class="all-h-100"
            :xs="{ span: 15, offset: 0 }"
            :sm="{ span: 6, offset: 0 }"
            :xl="{ span: 0, offset: 0 }">
            <a-flex justify="left" align="center">
              <router-link :to="{ name: 'home-page' }">
                <a style="height: 80%">
                  <img
                    class="ms-4"
                    src="/logo/bo-nong-nghiep-logo.png"
                    alt=""
                    style="width: auto; height: 100%" />
                </a>
              </router-link>
            </a-flex>
          </a-col>

          <a-col v-show="!pageLoading" :xs="0" :sm="{ span: 10, offset: 2 }" :xl="{ span: 6, offset: 9 }">
            <a-flex class="h-100" justify="right" align="center">
              <a-button class="no-border-ant-button fw-bold fs-6 me-4">Trang chủ</a-button>

              <a-button class="no-border-ant-button fw-bold fs-6 me-4">Hỗ trợ</a-button>
              <a-button class="no-border-ant-button fw-bold fs-6">Yêu cầu</a-button>
            </a-flex>
          </a-col>
          <a-col
            v-show="!pageLoading"
            class="all-h-100"
            :xs="{ span: 0, offset: 0 }"
            :sm="{ span: 1, offset: 0 }"
            :xl="{ span: 1, offset: 0 }">
            <a-flex justify="center" align="center">
              <a-divider type="vertical" style="height: 20%; background-color: darkgray; margin-top: 5px" />
            </a-flex>
          </a-col>

          <a-col
            v-show="!pageLoading"
            :xs="{ span: 9, offset: 0 }"
            :sm="{ span: 3, offset: 0 }"
            :xl="{ span: 3, offset: 0 }"
            class="center-col"
            style="justify-content: left; padding-left: 25px">
            <a-popover
              trigger="click"
              :arrowPointAtCenter="true"
              placement="bottomRight"
              :align="{
                offset: [41, 5], // the offset sourceNode by 10px in x and 20px in y,
                overflow: { adjustX: true, adjustY: true },
              }">
              <a-button
                class="no-border-ant-button no-wave fw-bold fs-6 ms-4"
                style="position: relative; box-shadow: none !important">
                <!-- <img class="account-manager-avatar" src="/20230522_144015000_iOS.jpg" /> -->
                <img v-if="avatar" class="account-manager-avatar" :src="avatar" />

                <img v-else class="account-manager-avatar" src="/others/no_avatar.jpg" />
                Hồ sơ
                <i class="fa-solid fa-caret-down ms-2"></i>
              </a-button>

              <template #content>
                <a-flex vertical>
                  <router-link :to="{ name: 'account-manager-page' }">
                    <a-button class="no-border-ant-button fw-bold"> Tài khoản </a-button>
                  </router-link>

                  <a-config-provider
                    :theme="{
                      token: {
                        colorTextBase: '#1C1C1C',
                      },
                    }">
                    <a-button class="no-border-ant-button fw-bold" @click="logout"> Đăng xuất </a-button>
                  </a-config-provider>
                </a-flex>
              </template>
            </a-popover>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref, provide } from "vue";
import { userState } from "@/stores/user-state";
import { getItem, setItem, removeItem } from "@/js/localStorage.js";

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // if (userState().getLogin) {
    if (true) {
      next((data) => {
        // data.userProfile = JSON.parse(getItem('user'));
        data.userProfile = userState().getUserProfile;
        data.pageLoading = false;
        data.avatar = data.userProfile.avatar_base64;
      });
    } else if (!userState().getLogin) {
      if (getItem("accessToken") === "") {
        // next({ name: "login-page" });
      } else {
        next((data) => {
          const getAuthenticatedUser = () => {
            thuyLoiApi
              .get("/get-authenticated-user", {
                headers: {
                  Authorization: `Bearer ${getItem("accessToken")}`,
                },
              })
              .then((response) => {
                if (response) {
                  console.log(response.data);
                  setItem("user", JSON.stringify(response.data.user));
                  userState().onAuthentication(response.data.user);

                  data.userProfile = userState().getUserProfile;
                  data.avatar = data.userProfile.avatar_base64;

                  data.pageLoading = false;
                }
              })
              .catch((error) => {
                console.log(error);
                removeItem("accessToken");
                removeItem("user");
                userState().onLogout();
                location.reload();
              });
          };

          if (getItem("accessToken") === "") data.pageLoading = false;
          else getAuthenticatedUser();
        });
      }
    }
  },

  setup() {
    const userProfile = ref();
    provide("userProfile", userProfile);

    const pageLoading = ref(true);
    provide("pageLoading", pageLoading);

    const avatar = ref();
    provide("avatar", avatar);

    const pageSpinning = ref(false);
    provide("pageSpinning", pageSpinning);

    const reloadDepartmentDataSource = ref(false);
    provide("reloadDepartmentDataSource", reloadDepartmentDataSource);

    return {
      userProfile,
      pageLoading,
      avatar,
      pageSpinning,
    };
  },

  data() {
    return {};
  },

  computed: {
    loginState: function () {
      // return userState().getLogin;
    },
  },

  methods: {
    logout() {
      // userState().onLogout();
      removeItem("accessToken");
      removeItem("user");
      location.reload();
    },
  },

  mounted() {
    // const element = document.querySelector(".account-manager-card");
    // if (element) {
    //   element.style.backgroundColor = "#118b50"; // Đặt lại nếu cần
    // }
  },
});
</script>

<style lang="scss">
.account-manager-header {
  background-color: transparent !important;
  height: 15vh !important;
  padding: 0 !important;
}

.account-manager-transparent-card {
  margin: 0 10px;
}

.account-manager-card {
  color: white;
  background-color: #118b50;
  margin: 0 10px;
  // & .ant-tabs-tab-btn {
  //   color: white;
  //   font-weight: bold;
  // }
}

.account-manager-button-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 1.8rem;
}

.account-manager-text-ant-button {
  font-weight: bold;
  padding-inline: 1rem;
}

.account-manager-avatar {
  position: absolute;
  top: -2px;
  left: -45px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.background-hover-button {
  transition: 0.3s;
  &:hover {
    background-color: rgb(255, 255, 255) !important;
  }
}

@media (max-width: 576px) {
  .account-manager-card,
  .account-manager-transparent-card {
    width: calc(100% - 15px);
    margin: 0 10px;
  }
}

@media (min-width: 576px) {
  .account-manager-card,
  .account-manager-transparent-card {
    width: 80%;
  }
}

@media (min-width: 1200px) {
  .account-manager-card,
  .account-manager-transparent-card {
    width: 55%;
    &.account-manager-table-card {
      width: 80%;
    }
  }
}
</style>
