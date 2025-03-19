<template>
  <a-flex vertical gap="20" align="center" flex="1">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex>
        <h3 class="text-white fs-1">Chỉnh sửa hồ sơ</h3>
      </a-flex>
      <a-skeleton :loading="pageLoading" active>
        <a-form
          class="white-text-form"
          layout="vertical"
          :model="editUserInfoForm"
          name="editUserInfoForm"
          :rules="editUserInfoRules"
          ref="editUserInfoFormRef"
          hideRequiredMark>
          <a-form-item class="mt-4">
            <template #label>
              <p class="fw-bold text-white me-2">Tên tài khoản</p>
              <a-tooltip v-if="userProfile.status_id == 1" overlayClassName="tool-container-tooltip" color="geekblue">
                <template #title>
                  <p>Tài khoản này được phép truy cập vào tất cả các quyền được cấp.</p>
                </template>
                <a-tag color="success"> Hoạt động </a-tag>
              </a-tooltip>

              <a-tooltip v-else overlayClassName="tool-container-tooltip" color="geekblue">
                <template #title>
                  <p>Tài khoản này bị hạn chế hoạt động. Vui lòng liên hệ hỗ trợ để biết thêm thông tin.</p>
                </template>
                <a-tag color="warning"> Hạn chế </a-tag>
              </a-tooltip>
            </template>
            <p>{{ userProfile.username }}</p>
          </a-form-item>

          <a-form-item class="mt-3" name="name">
            <template #label>
              <p class="fw-bold text-white">Tên người dùng</p>
            </template>
            <a-input v-model:value="editUserInfoForm.name" size="large" placeholder="Tên người dùng"></a-input>
          </a-form-item>

          <a-form-item class="mt-3" name="email">
            <template #label>
              <p class="fw-bold text-white">Email</p>
            </template>
            <a-input v-model:value="editUserInfoForm.email" size="large" placeholder="Email"></a-input>
          </a-form-item>

          <a-form-item class="mt-3" name="phoneNumber">
            <template #label>
              <p class="fw-bold text-white">Số điện thoại</p>
            </template>
            <!-- <a-input></a-input> -->
            <a-input v-model:value="editUserInfoForm.phone_number" size="large" placeholder="Số điện thoại" />
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold text-white">Mật khẩu</p>
            </template>
            <a-input-password size="large" disabled></a-input-password>
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold" name="gender">Giới tính</p>
            </template>
            <a-select v-model:value="editUserInfoForm.gender" size="large" :options="genderOptions" style="width: 100%">
            </a-select>
          </a-form-item>

          <a-row class="mt-3" :gutter="[16, 8]">
            <a-col :flex="1">
              <a-form-item name="dayOfBirth">
                <template #label>
                  <p class="fw-bold">Ngày sinh</p>
                </template>
                <a-input v-model:value="editUserInfoForm.dayOfBirth" size="large"> </a-input>
              </a-form-item>
            </a-col>

            <a-col :flex="12">
              <a-form-item name="monthOfBirth">
                <template #label>
                  <p class="fw-bold">&nbsp;</p>
                </template>
                <a-select v-model:value="editUserInfoForm.monthOfBirth" :options="monthOptions" size="large">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item name="yearOfBirth">
                <template #label>
                  <p class="fw-bold">&nbsp;</p>
                </template>
                <a-input v-model:value="editUserInfoForm.yearOfBirth" size="large"> </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- </a-form-item> -->

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold">Tổ chức</p>
            </template>
            <!-- <a-input size="large" :value="this.userProfile.organization_name" style="width: 100%" disabled> </a-input> -->
            <p>{{ this.userProfile.organization_name }}</p>
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold">Phòng ban</p>
            </template>
            <!-- <a-input size="large" :value="this.userProfile.department_name" style="width: 100%" disabled> </a-input> -->
            <p>{{ this.userProfile.department_name }}</p>
          </a-form-item>
        </a-form>

        <a-flex class="p-5 pe-0" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button type="primary" shape="round" size="large" @click="save">Lưu hồ sơ</a-button>
        </a-flex>
      </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
      <a-skeleton :loading="pageLoading" active> </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, ref, inject } from "vue";
import { userState } from "@/stores/user-state";
import thuyLoiApi from "@/js/axios/so-nong-nghiep-api";
import { getItem, setItem, removeItem } from "@/js/utils/localStorage.js";

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // console.log(from);
    // console.log(to);
    next((data) => {
      window.scrollTo(0, 0);
      // console.log(userState().getLogin);
      // console.log('đã load edit info');
    });
  },

  setup() {
    const userProfile = inject("userProfile");
    const pageLoading = inject("pageLoading");
    const pageSpinning = inject("pageSpinning");

    const editUserInfoFormRef = ref();
    // const editUserInfoForm = inject('editUserInfoForm');
    const editUserInfoForm = ref({});
    if (userState().getLogin) {
      editUserInfoForm.value = {
        name: userProfile.value.name,
        email: userProfile.value.email,
        phone_number: userProfile.value.phone_number,
        gender: userProfile.value.gender,
        dayOfBirth: "",
        monthOfBirth: "",
        yearOfBirth: "",
      };
      if (userProfile.value.birthday) {
        editUserInfoForm.value.dayOfBirth = userProfile.value.birthday.split("-")[2];
        editUserInfoForm.value.monthOfBirth = userProfile.value.birthday.split("-")[1];
        editUserInfoForm.value.yearOfBirth = userProfile.value.birthday.split("-")[0];
      }
    }

    const numberValidator = async (_rule, value) => {
      const phoneNumberRegex = /^\d{10}$/;
      const phoneNumberRegex1 = /^\d{11}$/;
      const numberRegex = /[^0-9]/;
      if (!value) {
      } else if (!numberRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject("Số điện thoại không hợp lệ!");
      }
    };

    const editUserInfoRules = {
      email: [
        {
          type: "email",
          message: "Email không hợp lệ!",
          trigger: "change",
        },
      ],
      name: [
        {
          max: 50,
          message: "Vui lòng nhập tên không quá 50 ký tự!",
          trigger: "change",
        },
      ],
      phoneNumber: [
        {
          validator: numberValidator,
          trigger: "change",
        },
      ],
      dayOfBirth: [
        {
          validator: numberValidator,
          trigger: "change",
        },

        {
          max: 2,
          message: "Ngày sinh không hợp lệ!",
          trigger: "change",
        },
      ],

      yearOfBirth: [
        {
          validator: numberValidator,
          trigger: "change",
        },

        {
          max: 4,
          min: 4,
          message: "Năm sinh không hợp lệ!",
          trigger: "change",
        },
      ],
    };

    const genderOptions = ref([
      {
        value: "Nữ",
        label: "Nữ",
      },
      {
        value: "Nam",
        label: "Nam",
      },
      {
        value: "Khác",
        label: "Khác",
      },
    ]);

    const monthOptions = ref([
      {
        value: "01",
        label: "Tháng 1",
      },
      {
        value: "02",
        label: "Tháng 2",
      },
      {
        value: "03",
        label: "Tháng 3",
      },
      {
        value: "04",
        label: "Tháng 4",
      },
      {
        value: "05",
        label: "Tháng 5",
      },
      {
        value: "06",
        label: "Tháng 6",
      },
      {
        value: "07",
        label: "Tháng 7",
      },
      {
        value: "08",
        label: "Tháng 8",
      },
      {
        value: "09",
        label: "Tháng 9",
      },
      {
        value: "10",
        label: "Tháng 10",
      },
      {
        value: "11",
        label: "Tháng 11",
      },
      {
        value: "12",
        label: "Tháng 12",
      },
    ]);

    return {
      userProfile,
      editUserInfoRules,
      editUserInfoFormRef,
      genderOptions,
      monthOptions,
      pageLoading,
      editUserInfoForm,
      pageSpinning,
    };
  },

  data() {
    return {};
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          this.editUserInfoForm = {
            name: this.userProfile.name,
            email: this.userProfile.email,
            phone_number: this.userProfile.phone_number,
            gender: this.userProfile.gender,
            dayOfBirth: "",
            monthOfBirth: "",
            yearOfBirth: "",
          };

          if (this.userProfile.birthday) {
            this.editUserInfoForm.dayOfBirth = this.userProfile.birthday.split("-")[2];
            this.editUserInfoForm.monthOfBirth = this.userProfile.birthday.split("-")[1];
            this.editUserInfoForm.yearOfBirth = this.userProfile.birthday.split("-")[0];
          }
          // this.editUserInfoForm.phoneNumber = this.userProfile.phone_number;
        } else {
          this.editUserInfoForm = {};
        }
        // this.addFeatureSelectEvent();
      },
      deep: false,
      // once: true,
    },
  },

  computed: {
    // editUserInfoForm(){
    //   name: userProfile.name,
    //   email: userProfile.email,
    //   phoneNumber: userProfile.phoneNumber,
    //   gender: userProfile.gender,
    // };
  },

  methods: {
    backward() {
      this.$router.push({ name: "account-manager-page" });
    },

    save() {
      this.pageSpinning = true;

      this.editUserInfoFormRef
        .validate()
        .then((response) => {
          if (
            this.editUserInfoForm.yearOfBirth &&
            this.editUserInfoForm.monthOfBirth &&
            this.editUserInfoForm.dayOfBirth
          ) {
            this.editUserInfoForm.birthday =
              this.editUserInfoForm.yearOfBirth +
              "-" +
              this.editUserInfoForm.monthOfBirth +
              "-" +
              this.editUserInfoForm.dayOfBirth;
          } else {
            this.editUserInfoForm.birthday = "";
          }

          thuyLoiApi
            .put("/update-user-info/" + this.userProfile["id"], this.editUserInfoForm, {
              headers: {
                Authorization: `Bearer ${getItem("accessToken")}`,
              },
            })
            .then((response) => {
              const { name, email, phone_number, gender, dayOfBirth, monthOfBirth, yearOfBirth } =
                this.editUserInfoForm;
              this.userProfile.name = name;
              this.userProfile.email = email;
              this.userProfile.phone_number = phone_number;
              this.userProfile.gender = gender;
              this.userProfile.birthday = `${yearOfBirth}-${monthOfBirth}-${dayOfBirth}`;

              this.$message.success(response.data.message, 3);
              this.pageSpinning = false;
            })
            .catch((error) => {
              console.log(error);
              // if (error.code == 'ERR_CANCELED') {
              //   this.$message.error(error.message, 3);
              // } else {
              this.$message.error(error.response.data.message, 3);
              // }
              this.pageSpinning = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
