<template>
  <a-spin :spinning="loginSpinning" size="large" tip="Xin vui lòng đợi...">
    <a-layout style="overflow: auto; height: 100vh">
      <a-layout-header style="background: transparent; height: 10vh; padding: 0; line-height: normal">
        <a-row style="height: 100%">
          <a-col
            class="center-col mt-3"
            :xs="{ span: 5, offset: 0 }"
            :sm="{ span: 3, offset: 0 }"
            :xl="{ span: 2, offset: 0 }">
            <router-link :to="{ name: 'home-page' }">
              <a>
                <img v-if="!screens.xs" src="/logo/bo-nong-nghiep-logo.png" alt="" style="height: 5rem; width: 5rem" />
                <img class="mb-4" v-else src="/logo/bo-nong-nghiep-logo.png" alt="" style="height: 4rem; width: 4rem" />
              </a>
            </router-link>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content style="height: 90vh">
        <a-row style="height: 100%" justify="center">
          <a-col :xs="{ span: 18, offset: 0 }" :sm="{ span: 12, offset: 0 }" :xl="{ span: 5, offset: 0 }">
            <h1 class="mb-5" style="font-size: 2rem">
              Đăng nhập <br /><span style="font-size: 1.5rem"
                >Hệ thống quản lý GIS Sở nông nghiệp và Phát triển nông thôn</span
              >
            </h1>

            <a-flex
              v-if="this.loginErrors"
              class="mb-2"
              justify="left"
              align="center"
              style="
                background-color: var(--error-color);
                min-height: 50px;
                height: auto;
                padding: 5px 10px;
                font-weight: 500;
              ">
              <InfoCircleOutlined class="fs-5 me-3" />
              {{ this.loginErrors }}
            </a-flex>

            <a-form
              layout="vertical"
              :model="user"
              name="loginForm"
              :rules="loginFormRules"
              ref="loginFormRef"
              hideRequiredMark>
              <a-form-item name="username">
                <template #label>
                  <p class="form-item-title">Tên đăng nhập</p>
                </template>
                <a-input
                  ref="usernameInput"
                  v-model:value="user.username"
                  size="large"
                  placeholder="Tên đăng nhập"></a-input>
              </a-form-item>
              <a-form-item class="mt-2" name="password">
                <template #label>
                  <p class="form-item-title">Mật khẩu</p>
                </template>
                <a-input-password v-model:value="user.password" size="large" placeholder="Mật khẩu"></a-input-password>
              </a-form-item>

              <a-form-item class="mt-2">
                <a-flex horizontal align="center">
                  <a-checkbox v-model:checked="rememberme" size="small">
                    <p class="ms-2">Lưu đăng nhập</p>
                  </a-checkbox>
                </a-flex>
              </a-form-item>

              <a-form-item class="mt-2">
                <a-button
                  class="fw-bold"
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  html-type="submit"
                  @click="login">
                  Đăng nhập
                </a-button>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-flex justify="center">
                  <a-button class="no-border-ant-button">
                    <p style="text-decoration: underline">Quên mật khẩu?</p>
                  </a-button>
                </a-flex>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-divider style="border-color: var(--gray-color)" orientation="left"></a-divider>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-flex justify="center" align="center">
                  <p class="me-2">Chưa có tài khoản?</p>

                  <router-link :to="{ name: 'sign-up-page' }">
                    <a-button class="no-border-ant-button">
                      <p style="text-decoration: underline">Đăng ký tại đây</p>
                    </a-button>
                  </router-link>
                </a-flex>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-spin>

  <!-- <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      ref="loginFormRef"
      @finish="onFinish"
      @finishFailed="onFinishFailed">
      <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>
  
      <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
  
      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>
  
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" @click="submit">Submit</a-button>
      </a-form-item>
    </a-form> -->
</template>

<script>
import { defineComponent, ref } from "vue";
import { userState } from "@/stores/user-state";
import { useRoute } from "vue-router";
import { getItem, setItem, removeItem } from "@/js/localStorage.js";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { Grid } from "ant-design-vue";

export default defineComponent({
  components: {
    InfoCircleOutlined,
  },

  beforeRouteEnter(to, from, next) {
    if (getItem("accessToken") === "") {
      next((data) => {});
    } else {
      // next((data) => {
      //   const getAuthenticatedUser = () => {
      //     thuyLoiApi
      //       .post(
      //         '/get-authenticated-user',
      //         {},
      //         {
      //           headers: {
      //             Authorization: `Bearer ${getItem('accessToken')}`,
      //           },
      //         },
      //       )
      //       .then((response) => {
      //         if (response) {
      //           // console.log(response);
      //           userState().onAuthentication();
      //           data.homeSpinning = false;
      //           this.$router.push({ name: 'home-page' });
      //           setItem('user', JSON.stringify(response.data.user));
      //         }
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //         data.homeSpinning = false;
      //          removeItem('accessToken', '');
      //         removeItem('user', '');
      //         userState().onLogout();
      //       });
      //   };
      //   getAuthenticatedUser();
      // });

      const getAuthenticatedUser = () => {
        thuyLoiApi
          .get("/get-authenticated-user", {
            headers: {
              Authorization: `Bearer ${getItem("accessToken")}`,
            },
          })
          .then((response) => {
            if (response) {
              // console.log(response);

              userState().onAuthentication(response.data.user);

              // this.$router.push({ name: 'home-page' });
              next({ name: "home-page" });
              setItem("user", JSON.stringify(response.data.user));
            }
          })
          .catch((error) => {
            console.log(error);
            removeItem("accessToken");
            removeItem("user");
            userState().onLogout();
            next((data) => {});
          });
      };
      getAuthenticatedUser();
    }
  },

  setup() {
    const user = ref({
      username: "",
      password: "",
      rememberme: false,
    });
    const rememberme = ref(false);
    const loginFormRules = {
      username: [
        {
          required: true,
          message: "Vui lòng nhập tên đăng nhập.",
          trigger: "change",
        },
      ],
      password: [
        {
          required: true,
          message: "Vui lòng nhập mật khẩu.",
          trigger: "change",
        },
      ],
    };
    const loginFormRef = ref();
    const useBreakpoint = Grid.useBreakpoint;
    const screens = useBreakpoint();
    return {
      user,
      rememberme,
      loginFormRules,
      loginFormRef,
      screens,
    };
  },

  data() {
    return {
      loginSpinning: false,
      loginErrors: "",
      loginValidateErrors: "",
    };
  },

  computed: {},

  methods: {
    login() {
      this.loginFormRef
        .validate()
        .then(() => {
          this.loginSpinning = true;
          thuyLoiApi
            .post("/login", this.user)
            .then((response) => {
              console.log(response);
              setItem("accessToken", response.data.token);
              setItem("user", JSON.stringify(response.data.user));

              userState().onAuthentication(response.data.user);
              console.log(userState().getUserProfile);
              // this.loginSpinning = false;
              this.$router.push({ name: "home-page" });
              // this.loginSpinning = false;
            })
            .catch((error) => {
              console.log(error);
              // if (error.response.status == 400) this.loginErrors = error.response.data.message;
              // else if (error.response.status == 422) this.loginValidateErrors = error.response.data.errors;
              this.loginErrors = error.response.data.message;
              this.$message.error("Đăng nhập không thành công, vui lòng thử lại!");
              this.loginSpinning = false;
            });
        })
        .catch((error) => {
          console.log("error", error);
          this.loginSpinning = false;
        });

      // .catch((error) => {
      //   console.log(error);
      // });

      // this.loginFormRef.validateFields();
    },

    toSignup() {},
  },

  mounted() {
    this.$refs.usernameInput.focus();
  },
});
</script>

<style lang="scss">
.form-item-title {
  font-weight: bold;
}
</style>
