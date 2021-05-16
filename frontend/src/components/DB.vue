<template>
  <div>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto|Material+Icons"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/2.0.46/css/materialdesignicons.min.css"
    />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons-wind.min.css"
    />
    <link
      rel="stylesheet"
      href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
    />
    <link rel="stylesheet" href="https://afeld.github.io/emoji-css/emoji.css" />
    <vc-layout style="padding: 20px">
      <vc-col
        :span="colSpan"
        sm12
        xs24
        align="center"
        style="border-style: solid; padding: 5px"
      >
        <vc-collapsible name="collapsible-3" :multiple="false">
          <vc-collapsible-item label="User Options">
            <vc-list>
              <vc-list-item @click="changeSize">{{ sizeText }}</vc-list-item>
              <vc-list-item @click="logout">Logout</vc-list-item></vc-list
            >
          </vc-collapsible-item>
          <vc-collapsible-item label="Admin Options" disabled>
            <vc-lorem-ipsum :repeats="1" />
          </vc-collapsible-item>
        </vc-collapsible>
      </vc-col>
      <vc-col :span="24 - colSpan" sm12 xs24> </vc-col>
    </vc-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colSpan: 4,
      sizeText: ">>"
    };
  },
  mounted() {},
  methods: {
    changeSize: function() {
      if (this.colSpan == 4) {
        this.colSpan = 12;
        this.sizeText = "<<";
      } else {
        this.colSpan = 4;
        this.sizeText = ">>";
      }
    },
    logout: async function() {
      this.$store.commit("logout");
      this.$router.replace({
        name: "Login"
      });
    }
  }
};
</script>

<style>
td,
th {
  border-style: solid;
  border-width: 1px;
}

.vc-select-item-selected {
  width: 100%;
}
</style>
