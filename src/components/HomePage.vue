<template>
  <div class="container">
    <div class="mb-5">
      <div>Sort By</div>
      <b-nav card-header pills tabs>
        <b-nav-item
          v-for="(attribute, index) in attributes"
          :key="index"
          @click="sortUserLists(attribute)"
        >
          {{ attribute }}<b-icon icon="arrow-down"></b-icon>
          <b-icon icon="arrow-up"></b-icon>
        </b-nav-item>
      </b-nav>
    </div>
    <div>
      Joined Twitter Between

      <div class="mt-2 row">
        <div class="col-sm-6">
          <label for="example-datepicker">Start Date :</label>
          <Datepicker
            @selected="startDateSelected"
            v-model="selectedDates.startDate"
          ></Datepicker>
        </div>
        <div class="col-sm-6">
          <label for="example-datepicker">End Date :</label>
          <Datepicker
            v-model="selectedDates.endDate"
            :disabled="endDateDisabled"
          ></Datepicker>
        </div>
      </div>
      <user-lists
        :selectedDates="selectedDates"
        v-model="selectedDates.endDate"
        :sortingAttributeName="sortingAttributeName"
        ref="usersList"
      ></user-lists>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import UserLists from "./UserLists.vue";
export default {
  name: "HomePage",
  components: { Datepicker, UserLists },
  data() {
    return {
      attributes: ["Twubric Score", "Friends", "Influence", "Chirpiness"],
      selectedDates: { startDate: "", endDate: "" },
      endDateDisabled: true,
      sortingAttributeName: "",
    };
  },
  methods: {
    startDateSelected: function () {
      this.endDateDisabled = false;
    },
    sortUserLists: function (name) {
      name = name.toLowerCase();
      this.sortingAttributeName = name;
      let sortInfo = { sortOrder: "asc", sortBy: name };
      /* alert(name); */
      this.$refs.usersList.sort(sortInfo);
    },
  },
  /*  created() {
    axios
      .get(
        `https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`
      )
      .then((res) => console.log(res.data));
  }, */
};
</script>
<style scoped>
.container {
  text-align: left;
}
.sort-heading {
  text-align: left;
  margin: 5px;
}
</style>

