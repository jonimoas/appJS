<template>
  <div align="center">
    <vc-notification
      :vertical="'top'"
      :horizontal="'right'"
      :name="'notification'"
    />
    <vc-tabstrip name="tabstrip-0">
      <vc-tabstrip-pane label="Entity">
        <vc-tabstrip name="tabstrip-0">
          <vc-tabstrip-pane label="List">
            <vc-collapsible name="collapsible-1">
              <vc-collapsible-item v-for="e in entities" :label="e.name">
                <table>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                  <tr v-for="s in e.schema">
                    <td>{{ s.name }}</td>
                    <td>{{ s.type }}</td>
                    <td><vc-button color="error">Delete</vc-button></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td><vc-button color="primary">Add</vc-button></td>
                  </tr>
                </table>
              </vc-collapsible-item>
            </vc-collapsible>
          </vc-tabstrip-pane>
          <vc-tabstrip-pane label="Add"
            ><vc-text
              type="text"
              v-model="newEntityName"
              :placeholder="'Name'"
              :name="'newEntityName'"
              color="primary"
            /><vc-button color="primary" @click="addField">Add Field</vc-button
            ><vc-list
              ><vc-list-item v-for="e in entityFields">
                <vc-button-split
                  color="black"
                  :dark="true"
                  :items="fieldTypes"
                  header-click-value="Field Type"
                  mode="menu"
                  :dropdown-z-index="500"
                  v-model="e.type"
                  >{{ e.type != "" ? e.type : "Field Type" }}</vc-button-split
                ><vc-button color="primary" @click="removeField(e)"
                  >Remove</vc-button
                ><vc-text
                  type="text"
                  v-model="e.name"
                  :placeholder="'Field Name'"
                  :key="entityFields.length.toString()"
                  :name="entityFields.length.toString()"
                  color="primary"/></vc-list-item></vc-list
            ><vc-button color="primary" @click="saveEntity">Save</vc-button>
          </vc-tabstrip-pane>
        </vc-tabstrip>
      </vc-tabstrip-pane>
      <vc-tabstrip-pane label="Table"
        ><vc-tabstrip name="tabstrip-0">
          <vc-tabstrip-pane label="List"> </vc-tabstrip-pane>
          <vc-tabstrip-pane label="Add"> </vc-tabstrip-pane>
        </vc-tabstrip>
      </vc-tabstrip-pane>
      <vc-tabstrip-pane label="Form"
        ><vc-tabstrip name="tabstrip-0">
          <vc-tabstrip-pane label="List"> </vc-tabstrip-pane>
          <vc-tabstrip-pane label="Add"> </vc-tabstrip-pane>
        </vc-tabstrip>
      </vc-tabstrip-pane>
    </vc-tabstrip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newEntityName: "",
      entityFields: [],
      fieldTypes: [
        {
          label: "Integer",
          value: "integer",
        },
        {
          label: "Decimal",
          value: "decimal",
        },
        {
          label: "String",
          value: "string",
        },
        {
          label: "Boolean",
          value: "bool",
        },
      ],
      entities: [],
    };
  },
  methods: {
    showNotify: function(text) {
      console.log(text);
      this.$root.$emit("vc:notification", {
        text: text,
        delay: 20,
        name: "notification",
      });
    },
    addField: function() {
      this.entityFields.push({ type: "", name: "" });
    },
    removeField: function(field) {
      this.entityFields = this.entityFields.filter((r) => r.name != field.name);
    },
    saveEntity: async function() {
      if (
        this.entityName == "" ||
        this.entityFields.length == 0 ||
        this.entityFields.filter((r) => r.name == "" || r.type == "").length > 0
      ) {
        this.showNotify("Invalid config");
      } else {
        let response = await fetch(
          "http://localhost:8000/entity/create?token=" +
            this.$store.getters.getSession,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              name: this.newEntityName,
              columns: this.entityFields,
            }),
          }
        );
        this.showNotify(await response.text());
        this.entityname = "";
        this.entityFields = [];
      }
    },
  },
  async mounted() {
    let response = await fetch(
      "http://localhost:8000/entity/getAll?token=" +
        this.$store.getters.getSession
    );
    this.entities = await response.json();
  },
};
</script>
<style></style>
