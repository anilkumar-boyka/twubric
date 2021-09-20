<template>
  <div class="container-fluid">
    <b-card class="main-card">
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
        <b-card class="twitter-head-card">
          <div class="twitter-joining">Joined Twitter Between</div>

          <div class="mt-2 row">
            <div class="col-lg-4 start-date">
              <label for="example-datepicker">Start Date :</label>
              <Datepicker
                @selected="startDateSelected()"
                v-model="selectedDates.startDate"
                :disabled-dates="startDisabledDates"
              ></Datepicker>
            </div>
            <div class="col-lg-4 end-date">
              <label for="example-datepicker">End Date :</label>
              <Datepicker
                v-model="selectedDates.endDate"
                :disabled="endDateVisibility"
                :disabled-dates="endDisabledDates"
              ></Datepicker>
            </div>
            <div class="col-lg-2 remove-filter">
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
        <users-list
          :selectedDates="selectedDates"
          v-model="selectedDates.endDate"
          v-on:removeDateFilter="removeDateFilter"
          ref="usersList"
        ></users-list>
      </div>
    </b-card>
  </div>
</template>
<script>
import Datepicker from "vuejs-datepicker";
import UsersList from "./UsersList.vue";
import axios from "axios";
export default {
  name: "HomePage",
  components: { Datepicker, UsersList },
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
    this.fetchUsers();
  },
  methods: {
    /**
     * Method to filter dispatch fn to fetch users list in store(vuex)
     */
    fetchUsers: function () {
      this.$store.dispatch("fetchUsers");
    },
    /**
     * Method to filter users and according to date
     */
    startDateSelected: function () {
      setTimeout(() => {
        this.endDateVisibility = false;
        this.endDisabledDates["to"] = new Date(this.selectedDates.startDate);
      }, 100);

      this.endDisabledDates["from"] = new Date();
    },
    /**
     * Method to sort users and show sorting icons accordingly
     * @param {string} name - attribute name to be sort.
     */
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

    /**
     * Method to remove date filter
     */
    removeDateFilter: function () {
      this.selectedDates["startDate"] = "";
      this.selectedDates["endDate"] = "";
      this.endDateVisibility = true;
    },
  },
};
</script>
<style scoped>
.main-card,
.twitter-head-card {
  background-color: #cfc1f8;
}
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
@media screen and (max-width: 890px) {
  .remove-filter,
  .start-date,
  .end-date {
    margin-top: 12px !important;
  }
  @media screen and (max-width: 390px) {
    .sort-attributes-buttons {
      min-width: 101px;
      height: 48px;
    }
  }
}
</style>
