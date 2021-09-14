<template>
  <div class="row mt-5">
    {{ sortingAttributeName }}
    <div
      class="col-md-3 mb-5 me-3 border rounded"
      v-for="(user, index) in usersList"
      :key="index"
    >
      <div class="row">
        <div class="col-9 user-name p-1">
          <span>{{ user.username }}</span>
        </div>
        <div class="col-3 total-score text-end">
          <span>{{ user.twubric.total }}</span>
        </div>
      </div>
      <div class="row attributes">
        <div class="col-4 text-center border">
          {{ user.twubric.friends }}
          <div>Friends</div>
        </div>
        <div class="col-4 text-center border">
          {{ user.twubric.influence }}
          <div>Influence</div>
        </div>
        <div class="col-4 text-center border">
          {{ user.twubric.chirpiness }}
          <div>Chirpiness</div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 join-date text-center">
          {{ user.join_date | unixTostandardDateFormat }}
        </div>
        <div
          class="col-8 text-end text-danger remove-text"
          @click="removeUserFromList(user.uid)"
        >
          Remove
          <!--  <b-button pill size="sm" variant="danger">Remove</b-button> -->
        </div>
      </div>
    </div>
    <!-- <div>No User Found!</div> -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserLists",
  props: ["selectedDates", "sortingAttributeName"],
  data() {
    return {
      usersList: [],
    };
  },
  watch: {
    selectedDates: {
      deep: true,
      handler: function () {
        this.applyDatesFilter();
      },
    },
  },
  filters: {
    unixTostandardDateFormat: function (unixTimestamp) {
      let standardDateFormat;
      standardDateFormat = new Date(unixTimestamp * 1000).toDateString();
      standardDateFormat = standardDateFormat.substring(3);
      return standardDateFormat;
    },
  },
  created() {
    this.fetchUsersList();
  },
  methods: {
    fetchUsersList: function () {
      axios
        .get(
          `https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`
        )
        .then((response) => {
          this.usersList = response.data;
        });
    },
    removeUserFromList: function (userId) {
      let index = this.usersList.findIndex((element) => element.uid === userId);
      this.usersList.splice(index, 1);
    },
    applyDatesFilter: function () {
      let startDateUnixTimestamp =
        new Date(this.selectedDates.startDate).getTime() / 1000;
      this.usersList = this.usersList.filter((e) => e.uid === 1);
    },
    sort: function (sortInfo) {
      let currentSortingAttribute = sortInfo.sortBy;
      console.log(sortInfo);
      console.log(this.usersList);
      this.friends = this.usersList.sort(
        (a, b) => a.twubric.friends - b.twubric.friends
      );
      console.log(a);
    },
  },
};
</script>
<style scoped>
.remove-text {
  cursor: pointer;
}
.attributes {
  font-size: small;
}
.join-date {
  font-size: smaller;
  font-weight: 500;
}
.user-name,
.total-score {
  font-weight: 600;
}
</style>