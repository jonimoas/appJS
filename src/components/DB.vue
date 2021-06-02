<template>
  <div>
    <vc-toolbar>
      <vc-toolbar-icon-left icon="menu" @click="changeSize" />
      <vc-toolbar-title>App</vc-toolbar-title>
      <vc-toolbar-controls-right> </vc-toolbar-controls-right>
    </vc-toolbar>
    <vc-layout style="padding: 20px">
      <vc-col
        :span="colSpan == 0 ? 1 : colSpan"
        sm12
        xs24
        align="center"
        style="padding: 5px;"
        v-if="sideBar"
      >
        <vc-collapsible name="collapsible-3" :multiple="false">
          <vc-collapsible-item label="User Options">
            <vc-list>
              <vc-list-item @click="changeSize">{{ sizeText }}</vc-list-item>
              <vc-list-item @click="logout">Logout</vc-list-item></vc-list
            >
          </vc-collapsible-item>
          <vc-collapsible-item label="Admin Options"
            ><vc-list>
              <vc-list-item @click="editor">Editor</vc-list-item></vc-list
            >
          </vc-collapsible-item>
        </vc-collapsible>
      </vc-col>
      <vc-col :span="24 - colSpan" sm12 xs24 style="padding: 5px;"
        ><component v-bind:is="compo"></component>
      </vc-col>
    </vc-layout>
  </div>
</template>

<script>
import Editor from "./Editor.vue";
export default {
  data() {
    return {
      colSpan: 0,
      sizeText: ">>",
      compo: "",
      sideBar: false,
    };
  },
  components: { Editor },
  mounted() {},
  methods: {
    changeSize: function() {
      if (this.colSpan == 0) {
        this.sideBar = true;
        this.colSpan = 6;
        this.sizeText = "<<";
      } else {
        this.colSpan = 0;
        this.sideBar = false;
        this.sizeText = ">>";
      }
    },
    logout: async function() {
      this.$store.commit("logout");
      this.$router.replace({
        name: "Login",
      });
    },
    editor: function() {
      this.compo = "Editor";
    },
  },
};
</script>

<style>
.vc-select-item-selected {
  width: 100%;
}
</style>
