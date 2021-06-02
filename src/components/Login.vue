<template>
  <div align="center">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <vc-col :span="8" sm12 xs24>
      <vc-text
        type="text"
        :placeholder="'User'"
        v-model="user"
        name="user"
      ></vc-text>
      <vc-text
        type="password"
        :placeholder="'Password'"
        v-model="password"
        name="password"
      ></vc-text>
      <br />
      <vc-button @click="login">Login</vc-button>
    </vc-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "",
      password: "",
    };
  },
  methods: {
    // @input event handler
    onInput(event) {
      console.log(this.dialect);
    },
    login: async function() {
      const mainPort = 8000;
      console.log(window.location);
      let response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ username: this.user, password: this.password }),
      });
      response = await response.text();
      console.log(response);
      this.$store.commit("session", response);
      this.$router.replace({ name: "db" });
    },
  },
};
</script>
<style></style>
