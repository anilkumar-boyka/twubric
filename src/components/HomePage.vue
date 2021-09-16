<template>
  <div class="container px-2">
    <b-card>
      <div class="mb-2">
        <div class="sort-heading">Sort By</div>
        <b-nav card-header class="row">
          <b-nav-item
            class="col-lg-3 col-6 text-center"
            v-for="(attribute, index) in attributes"
            :key="index"
            @click="sortUserLists(attribute)"
          >
            <b-button block class="sort-attributes-buttons"
              >{{ attribute }}

              <b-icon
                icon="arrow-down"
                v-if="sortingInfo['sortIconDesc'][attribute.toLowerCase()]"
              ></b-icon>
              <b-icon
                icon="arrow-up"
                v-if="sortingInfo['sortIconAsc'][attribute.toLowerCase()]"
              ></b-icon
            ></b-button>
          </b-nav-item>
        </b-nav>
      </div>
      <hr />
      <div>
        <b-card>
          <span class="twitter-joining">Joined Twitter Between</span>

          <div class="mt-2 row">
            <div class="col-md-5">
              <label for="example-datepicker">Start Date :</label>
              <Datepicker
                @selected="startDateSelected()"
                v-model="selectedDates.startDate"
                :disabled-dates="startDisabledDates"
              ></Datepicker>
            </div>
            <div class="col-md-5">
              <label for="example-datepicker">End Date :</label>
              <Datepicker
                v-model="selectedDates.endDate"
                :disabled="endDateVisibility"
                :disabled-dates="endDisabledDates"
              ></Datepicker>
            </div>
            <div class="col-lg-2 col-sm-6">
              <b-button
                pill
                size="sm"
                class="remove-filter-button"
                @click="removeDateFilter"
                >Remove Filter</b-button
              >
            </div>
          </div>
        </b-card>
        <hr />
        <user-lists
          :selectedDates="selectedDates"
          v-model="selectedDates.endDate"
          v-on:removeDateFilter="removeDateFilter"
          ref="usersList"
        ></user-lists>
      </div>
    </b-card>
  </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import UserLists from "./UserLists.vue";
export default {
  name: "HomePage",
  components: { Datepicker, UserLists },
  data() {
    return {
      attributes: ["Twubric Score", "Friends", "Influence", "Chirpiness"],
      selectedDates: { startDate: "", endDate: "" },
      endDateVisibility: true,
      sortingInfo: {
        sortBy: "",
        sortOrder: "",
        sortIconDesc: {},
        sortIconAsc: {},
      },
      startDisabledDates: {
        from: new Date(),
      },
      endDisabledDates: { from: new Date() },
    };
  },
  created() {
    this.$store.dispatch("fetchUsers");
  },
  methods: {
    startDateSelected: function () {
      setTimeout(() => {
        this.endDateVisibility = false;
        this.endDisabledDates["to"] = new Date(this.selectedDates.startDate);
      }, 100);

      this.endDisabledDates["from"] = new Date();
    },
    sortUserLists: function (name) {
      name = name.toLowerCase();
      this.sortingInfo["sortIconDesc"] = {};
      this.sortingInfo["sortIconAsc"] = {};
      if (
        this.sortingInfo["sortBy"] == name &&
        this.sortingInfo["sortOrder"] == "asc"
      ) {
        this.sortingInfo["sortOrder"] = "desc";

        this.sortingInfo["sortIconAsc"][name] = false;
        this.sortingInfo["sortIconDesc"][name] = true;
      } else if (
        this.sortingInfo["sortBy"] == name &&
        this.sortingInfo["sortOrder"] == "desc"
      ) {
        this.sortingInfo["sortBy"] = "";
        this.sortingInfo["sortOrder"] = "";

        this.sortingInfo["sortIconAsc"][name] = false;
        this.sortingInfo["sortIconDesc"][name] = false;
      } else {
        this.sortingInfo["sortBy"] = name;
        this.sortingInfo["sortOrder"] = "asc";

        this.sortingInfo["sortIconAsc"][name] = true;
        this.sortingInfo["sortIconDesc"][name] = false;
      }
      this.$refs.usersList.sort(this.sortingInfo);
    },
    removeDateFilter: function () {
      this.selectedDates["startDate"] = "";
      this.selectedDates["endDate"] = "";
      this.endDateVisibility = true;
    },
  },
};
</script>
<style scoped>
.container {
  text-align: left;
}
.sort-heading,
.twitter-joining {
  text-align: left;
  margin: 5px;
  font-weight: 700;
  color: #563d7c;
}
.vdp-datepicker {
  display: inline-block;
}
.remove-filter-button {
  color: #715e8d;
  background-color: white;
  border: 2px solid #715e8d;
}

.sort-attributes-buttons {
  background-color: #715e8d;
  width: -moz-available;
}
/* #be98f7; */
</style>

