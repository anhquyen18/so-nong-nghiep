<template>
  <a-flex vertical gap="20" align="center" flex="1">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex>
        <h3 class="text-white fs-1">Đổi mật khẩu của bạn</h3>
      </a-flex>
      <a-skeleton :loading="pageLoading" active>
        <a-form
          class="white-text-form"
          :hideRequiredMark="true"
          autocomplete="off"
          layout="vertical"
          ref="setPasswordFormRef"
          name="basic"
          :model="setPasswordForm"
          :rules="setPasswordFormRules">
          <a-form-item class="mt-4" name="currentPass" has-feedback>
            <template #label>
              <p class="fw-bold">Mật khẩu hiện tại</p>
            </template>
            <a-input-password
              :class="{ 'input-error': false }"
              size="large"
              v-model:value="setPasswordForm.currentPass" />
          </a-form-item>

          <a-form-item class="mt-4" name="newPass" has-feedback>
            <template #label>
              <p class="fw-bold">Mật khẩu mới</p>
            </template>
            <a-input-password size="large" v-model:value="setPasswordForm.newPass" />
          </a-form-item>
          <a-form-item class="mt-4" name="checkPass" has-feedback>
            <template #label>
              <p class="fw-bold">Nhập lại mật khẩu mới</p>
            </template>
            <a-input-password size="large" v-model:value="setPasswordForm.checkPass" />
          </a-form-item>
        </a-form>
      </a-skeleton>
      <a-skeleton :loading="pageLoading" active>
        <a-flex class="p-5 pe-0" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button type="primary" shape="round" size="large" @click="save">Cài đặt mật khẩu mới</a-button>
        </a-flex>
      </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref } from "vue";
import { userState } from "@/stores/user-state";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { getItem } from "@/js/utils/localStorage";

export default defineComponent({
  setup() {
    // const userProfile = JSON.parse(getItem('user'));
    const userProfile = inject("userProfile");
    const pageLoading = inject("pageLoading");
    const pageSpinning = inject("pageSpinning");
    const setPasswordFormRef = ref({});
    const errors = ref({ password: false });

    const setPasswordForm = ref({
      currentPass: "",
      newPass: "",
      checkPass: "",
    });

    const validateCurrentPass = async (_rule, value) => {
      if (!errors.value.password) {
        if (value === "") {
          return Promise.reject("Vui lòng nhập mật khẩu!");
        } else {
          return Promise.resolve();
        }
      } else if (errors.value.password) {
        errors.value.password = false;
        return Promise.reject("Sai mật khẩu!");
      } else {
        return Promise.resolve();
      }
    };
    const validatePass = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("Vui lòng nhập mật khẩu!");
      } else {
        if (setPasswordForm.value.checkPass !== "") {
          setPasswordFormRef.value.validateFields("checkPass");
        }
        return Promise.resolve();
      }
    };
    const validatePass2 = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("Vui lòng nhập mật khẩu!");
      } else if (value !== setPasswordForm.value.newPass) {
        return Promise.reject("Xác nhận mật khẩu không chính xác!");
      } else {
        return Promise.resolve();
      }
    };

    const setPasswordFormRules = {
      currentPass: [
        {
          required: true,
          validator: validateCurrentPass,
          trigger: ["blur", "change"],
        },
      ],
      newPass: [
        {
          required: true,
          validator: validatePass,
          trigger: ["blur", "change"],
        },
        {
          min: 8,
          message: "Mật khẩu cần ít nhất 8 kí tự!",
          trigger: ["blur", "change"],
        },
      ],
      checkPass: [
        {
          required: true,
          validator: validatePass2,
          trigger: "change",
        },
      ],
    };

    return {
      pageLoading,
      pageSpinning,
      errors,
      setPasswordFormRef,
      setPasswordForm,
      setPasswordFormRules,
      userProfile,
    };
  },

  data() {
    return {};
  },

  watch: {},

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: "account-manager-page" });
    },

    save() {
      this.pageSpinning = true;
      let accessToken = {
        headers: {
          Authorization: `Bearer ${getItem("accessToken")}`,
        },
      };

      this.setPasswordFormRef
        .validate()
        .then((response) => {
          thuyLoiApi
            .put(`/update-user-password/${this.userProfile.id}`, this.setPasswordForm, accessToken)
            .then((response) => {
              console.log(response);
              this.$message.success(response.data.message);
              this.setPasswordFormRef.resetFields();
              this.pageSpinning = false;
            })
            .catch((error) => {
              console.log(error);
              if (error.response.status === 401) location.reload();
              else {
                this.errors.password = true;
                this.setPasswordFormRef
                  .validate()
                  .then(() => {})
                  .catch((error) => {});
              }
              this.pageSpinning = false;
            });
        })
        .catch((error) => {
          console.log(error);
          this.pageSpinning = false;
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
