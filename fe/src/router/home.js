const home = [
  {
    path: "/",
    name: "home-page",
    component: () => import("../layouts/home.vue"),
    // meta: { title: "Home" },
  },
  {
    path: "/account",
    name: "account-manager-page",
    component: () => import("../layouts/account-manager.vue"),
    meta: { title: "Quản lý tài khoản" },
    redirect: "/account/overview",
    children: [
      {
        path: "overview",
        name: "account-manager-overview",
        component: () => import("../pages/account-manager/overview.vue"),
        meta: { title: "Quản lý tài khoản" },
      },
      // Profile
      // {
      //   path: "profile/edit-user-info",
      //   name: "account-manager-edit-user-info",
      //   component: () => import("../pages/account-manager/profile/edit-user-info.vue"),
      //   meta: { title: "Chỉnh sửa hồ sơ" },
      // },

      // Layer
      {
        path: "layer/change-fields",
        name: "account-manager-layer-change-fields",
        component: () => import("../pages/account-manager/layer/change-fields.vue"),
        meta: { title: "Thay đổi trường dữ liệu" },
      },
    ],
  },

  {
    path: "/sign-in",
    name: "sign-in-page",
    component: () => import("../pages/sign-in/sign-in.vue"),
    meta: { title: "Đăng nhập" },
  },
  {
    path: "/sign-up",
    name: "sign-up-page",
    component: () => import("../pages/sign-in/sign-up.vue"),
    meta: { title: "Đăng ký" },
  },
  {
    path: "/:catchAll(.*)",
    name: "error-page",
    component: () => import("../pages/errors/404.vue"),
    meta: { title: "Page Not Found" },
  },
];

export default home;
