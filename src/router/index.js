import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import DB from "../components/DB.vue";

Vue.use(VueRouter);
const routeJson = require("../../routes.json");
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/db",
    name: "db",
    component: DB,
  },
];
for (const r of routeJson) {
  routes.push({
    path: "/" + r.name.toLowerCase(),
    name: r.name,
    component: Vue.component(r.name, () => import("./" + r.file)),
  });
}
const router = new VueRouter({
  routes,
});

export default router;
