<template>
  <a-spin :spinning="signupLoading" size="large" tip="Xin vui lòng đợi...">
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
                <img
                  v-if="!screens.xs"
                  src="/logo/bo-nong-nghiep-logo.png"
                  alt=""
                  style="height: 5rem; width: 5rem" />
                <img
                  class="mb-4"
                  v-else
                  src="/logo/bo-nong-nghiep-logo.png"
                  alt=""
                  style="height: 4rem; width: 4rem" />
              </a>
            </router-link>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content style="height: 90vh">
        <a-row v-if="!signupSuccess" style="height: 100%" justify="center">
          <!-- <a-col :span="15"> </a-col> -->
          <a-col :xs="{ span: 18, offset: 0 }" :sm="{ span: 12, offset: 0 }" :xl="{ span: 5, offset: 0 }">
            <h1 class="mb-5" style="font-size: 2rem">
              Đăng ký tài khoản <br />
              <span style="font-size: 1.5rem"> Hệ thống quản lý GIS Sở nông nghiệp và Phát triển nông thôn </span>
            </h1>

            <a-flex
              v-if="signupErrorMessage"
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
              {{ signupErrorMessage }}
            </a-flex>

            <a-form
              layout="vertical"
              :model="user"
              name="signupForm"
              :rules="signupFormRules"
              ref="signupFormRef"
              hideRequiredMark>
              <a-form-item name="username" hasFeedback>
                <template #label>
                  <p class="form-item-title">Tên đăng nhập</p>
                </template>
                <a-input v-model:value="user.username" size="large" placeholder="Tên đăng nhập" clear></a-input>
              </a-form-item>

              <a-form-item class="mt-2" name="email" hasFeedback>
                <template #label>
                  <p class="form-item-title">Email</p>
                </template>
                <a-input v-model:value="user.email" size="large" placeholder="Email"></a-input>
              </a-form-item>

              <a-form-item class="mt-2" name="password" hasFeedback>
                <template #label>
                  <p class="form-item-title">Mật khẩu</p>
                </template>
                <a-input-password v-model:value="user.password" size="large" placeholder="Mật khẩu"></a-input-password>
              </a-form-item>

              <a-flex vertical v-if="user.password">
                <a-typography-text :type="tenCharacters ? 'success' : 'danger'">
                  <CheckCircleFilled v-if="tenCharacters" />
                  <CloseCircleFilled v-else />
                  Chứa ít nhất chứa 10 kí tự
                </a-typography-text>
                <a-typography-text :type="capitalCharacters ? 'success' : 'danger'">
                  <CheckCircleFilled v-if="capitalCharacters" />
                  <CloseCircleFilled v-else />
                  Chứa kí tự in hoa
                </a-typography-text>
                <a-typography-text :type="numberOrSpecialCharacters ? 'success' : 'danger'">
                  <CheckCircleFilled v-if="numberOrSpecialCharacters" />
                  <CloseCircleFilled v-else />
                  Chứa số hoặc kí tự đặc biệt (VD: % ? ! *)
                </a-typography-text>
              </a-flex>

              <a-form-item class="mt-2" name="confirmPassword" hasFeedback>
                <template #label>
                  <p class="form-item-title">Nhập lại mật khẩu</p>
                </template>
                <a-input-password
                  v-model:value="user.confirmPassword"
                  size="large"
                  placeholder="Nhập lại mật khẩu"></a-input-password>
              </a-form-item>

              <a-form-item class="mt-5">
                <a-button
                  class="fw-bold"
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  @click="signup"
                  :loading="signupLoading">
                  Đăng kí
                </a-button>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-divider style="border-color: var(--gray-color)" orientation="left"></a-divider>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-flex justify="center" align="center">
                  <p class="me-2">Đã có tài khoản?</p>

                  <router-link :to="{ name: 'sign-in-page' }">
                    <a-button class="no-border-ant-button">
                      <p style="text-decoration: underline">Đăng nhập tại đây</p>
                    </a-button>
                  </router-link>
                </a-flex>
              </a-form-item>
            </a-form>
            <!-- </a-flex> -->
          </a-col>
        </a-row>

        <a-row v-else justify="center">
          <a-col :xs="{ span: 18, offset: 0 }" :sm="{ span: 12, offset: 0 }" :xl="{ span: 5, offset: 0 }">
            <h2 class="mb-4" style="font-size: 2rem; color: white">Đăng ký thành công <br /></h2>
            <a-flex vertical>
              <p class="text-white mb-2">
                Bạn đã đăng kí thành công tài khoản <i>{{ user.username }}.</i>
              </p>

              <p class="text-white mb-2">Vui lòng đăng nhập tại đây:</p>

              <router-link :to="{ name: 'sign-in-page' }">
                <a-button type="primary" size="large" shape="round" block @click="changeState">
                  Đăng nhập tài khoản
                </a-button>
              </router-link>
            </a-flex>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { Grid } from "ant-design-vue";
import { CheckCircleFilled, CloseCircleFilled, InfoCircleOutlined } from "@ant-design/icons-vue";
import router from "@/router";

export default defineComponent({
  components: {
    CheckCircleFilled,
    CloseCircleFilled,
    InfoCircleOutlined,
  },

  setup() {
    const user = ref({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    });

    const signupFormRef = ref();

    const tenCharacters = ref(false);
    const capitalCharacters = ref(false);
    const numberOrSpecialCharacters = ref(false);

    const validatePass = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("Vui lòng nhập mật khẩu");
      }
      tenCharacters.value = value.length > 10;
      capitalCharacters.value = /[A-Z]/.test(value);
      numberOrSpecialCharacters.value = /[0-9@$!%*?&]/.test(value);

      if (tenCharacters.value == true && capitalCharacters.value == true && numberOrSpecialCharacters.value == true) {
        if (user.value.password !== "") {
          signupFormRef.value.validateFields("confirmPassword");
        }
        return Promise.resolve();
      } else {
        return Promise.reject("Mật khẩu không hợp lệ.");
      }
    };

    const validatePassConfirmPass = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("Vui lòng xác nhận mật khẩu.");
      } else if (value !== user.value.password) {
        return Promise.reject("Mật khẩu không xác nhận chính xác.");
      } else {
        return Promise.resolve();
      }
    };
    const signupFormRules = {
      username: [
        {
          required: true,
          message: "Vui lòng nhập tên đăng nhập.",
          trigger: "change",
        },
        {
          min: 8,
          message: "Tên người dùng ít nhất chứa 8 kí tự.",
          trigger: "change",
        },
      ],
      password: [
        {
          validator: validatePass,
          trigger: ["change", "blur"],
        },
      ],
      confirmPassword: [
        {
          validator: validatePassConfirmPass,
          trigger: "change",
        },
      ],
      email: [
        {
          required: true,
          message: "Vui lòng nhập email.",
          trigger: "change",
        },
        {
          type: "email",
          message: "Email không hợp lệ.",
          trigger: "change",
        },
      ],
    };
    const useBreakpoint = Grid.useBreakpoint;
    const screens = useBreakpoint();
    return {
      user,
      signupFormRules,
      signupFormRef,
      screens,
      tenCharacters,
      capitalCharacters,
      numberOrSpecialCharacters,
    };
  },

  data() {
    return {
      signupLoading: false,
      signupErrorMessage: "",
      signupSuccess: false,
    };
  },

  computed: {},

  methods: {
    signup() {
      this.signupFormRef
        .validate()
        .then((response) => {
          this.signupLoading = true;
          thuyLoiApi
            .post("/signup", this.user)
            .then((response) => {
              console.log(response);
              this.signupLoading = false;
              this.signupSuccess = true;

              this.signupFormRef.resetFields();
            })
            .catch((error) => {
              console.log(error);
              if (error.response.data.message) {
                this.signupErrorMessage = error.response.data.message;
              }
              this.signupLoading = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    changeState() {
      setTimeout(() => {
        this.signupSuccess = false;
      }, 1000);
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.form-item-title {
  font-weight: bold;
}
</style>
