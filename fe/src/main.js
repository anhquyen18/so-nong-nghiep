import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import {
  Button,
  message,
  Row,
  Col,
  Input,
  InputNumber,
  Layout,
  Drawer,
  Popover,
  Form,
  Checkbox,
  Collapse,
  Tooltip,
  Divider,
  Card,
  Table,
  ConfigProvider,
  Switch,
  Modal,
  Select,
  SelectOption,
  Radio,
  DatePicker,
  Menu,
  Breadcrumb,
  Avatar,
  Dropdown,
  Result,
  Spin,
  Tag,
  FloatButton,
  Flex,
  Typography,
  Skeleton,
  Image,
  Upload,
  Popconfirm,
} from "ant-design-vue";
import App from "./App.vue";
import axios from "axios";
window.axios = axios;

import "../node_modules/bootstrap/dist/css/bootstrap-grid.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap-utilities.min.css";
import "../node_modules/dayjs/dayjs.min.js";
import "../node_modules/ol/dist/ol.js";
import "../node_modules/ol/ol.css";
import "@/css/custom-template/ant-custom-style.scss";
import "@/css/custom-template/vuejs-transition.scss";

import "@/css/custom-openlayers.scss";

// import '../node_modules/ol-ext/dist/ol-ext.js';
// import '../node_modules/ol-ext/dist/ol-ext.css';

const app = createApp(App);
app.config.productionTip = false;
app.use(createPinia());
app.use(router);
router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title;
  next();
});

app.use(Button);
app.use(Layout);
app.use(Row);
app.use(Col);
app.use(Input);
app.use(InputNumber);
app.use(Drawer);
app.use(Popover);
app.use(Form);
app.use(Checkbox);
app.use(Collapse);
app.use(Tooltip);
app.use(Divider);
app.use(Card);
app.use(Table);
app.use(ConfigProvider);
app.use(Switch);
app.use(Modal);
app.use(Select);
app.use(SelectOption);
app.use(Radio);
app.use(DatePicker);
app.use(Menu);
app.use(Breadcrumb);
app.use(Avatar);
app.use(Dropdown);
app.use(Result);
app.use(Spin);
app.use(Tag);
app.use(FloatButton);
app.use(Flex);
app.use(Typography);
app.use(Skeleton);
app.use(Image);
app.use(Upload);
app.use(Popconfirm);
app.mount("#app");

app.config.globalProperties.$message = message;
