import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import DB from "../components/DB.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/db",
    name: "db",
    component: DB
  }
];

const router = new VueRouter({
  routes
});

export default router;
