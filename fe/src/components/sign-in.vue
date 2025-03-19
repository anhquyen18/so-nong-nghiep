<template>
  <a-row>
    <a-col :xl="12" :xs="24">
      <a-popover trigger="click" placement="bottomRight" v-model:open="signOutVisible" :arrow="false">
        <template #content>
          <a @click="signOut">Đăng xuất</a>
        </template>
        <a-button v-if="signInState" ghost :type="buttonType" shape="circle" size="large" :style="{ border: 0 }">
          <i class="fa-regular fa-circle-user fs-5"></i>
        </a-button>
      </a-popover>

      <router-link :to="{ name: 'sign-in-page' }">
        <a-button
          v-if="!signInState"
          type="primary"
          :style="{ padding: '0px 10px', fontSize: '0.8rem', borderRadis: '0', fontWeight: 'Bold' }">
          Đăng nhập
        </a-button>
      </router-link>
    </a-col>

    <!-- <a-col :xl="12" :xs="0" v-if="getSignInState == false">
      <a-button
        class="ms-2"
        danger
        type="primary"
        @click="signUpShower"
        :style="{ padding: '0px 10px', fontSize: '0.8rem', borderRadis: '0' }">
        Đăng ký
      </a-button>
    </a-col> -->
  </a-row>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject, h } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { getCookie } from "@/js/util.js";
import { userState } from "@/stores/user-state.js";
export default defineComponent({
  components: {
    CaretDownOutlined,
    LoadingOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const user = inject("userData");

    let accessToken = {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    };

    var buttonType = ref("default");

    return {
      buttonType,
    };
  },
  // props: ["homeSignInState"],
  data() {
    return {
      signOutVisible: false,
    };
  },
  created() {
    // console.log(this.homeSignInState); //prints out an empty string
    // console.log(this.signInState + ' sign in');
  },

  methods: {
    signOut() {
      // this.signOutVisible = false;
      console.log("sign out");
    },
  },

  computed: {
    signInState: function () {
      return userState().getSignInState;
    },
    // getGeoserverAccount: function () {
    //   return userState().getGeoserverAccount;
    // },
  },

  mounted() {
    // this.state.signInState = this.userState().getSignInState;
    // console.log(this.signInState);
    // console.log(userState().getSignInState);
    // this.signInState = userState().getSignInState;
  },
});
</script>

<style lang="scss"></style>
