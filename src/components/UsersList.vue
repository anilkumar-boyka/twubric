<template>
  <div class="row mt-5">
    {{ fetchUsersList }}
    <div
      class="col-lg-4 col-md-6 mb-3 spacing"
      v-for="(user, index) in usersList"
      :key="index"
    >
      <div class="row border rounded">
        <div class="col-9 user-name p-1">
          <span>{{ user.username }}</span>
        </div>
        <div class="col-3 total-score text-end pt-1">
          <span>{{ user.twubric.total }}</span>
        </div>
      </div>
      <div class="row attributes">
        <div class="col-4 text-center border">
          {{ user.twubric.friends }}
          <div class="text-muted">Friends</div>
        </div>
        <div class="col-4 text-center border">
          {{ user.twubric.influence }}
          <div class="text-muted">Influence</div>
        </div>
        <div class="col-4 text-center border">
          {{ user.twubric.chirpiness }}
          <div class="text-muted">Chirpiness</div>
        </div>
      </div>
      <div class="row border rounded">
        <div class="col-4 join-date text-center">
          {{ user.join_date | unixTostandardDateFormat }}
        </div>
        <div
          class="col-8 text-end text-danger remove-text"
          @click="removeUserFromList(user.uid)"
        >
          <span class="badge badge-danger">Remove</span>
          <!--  <b-button pill size="sm" variant="danger">Remove</b-button> -->
        </div>
      </div>
    </div>
    <div v-if="!usersList.length">No User Found!</div>
  </div>
</template>

<script>
export default {
  name: "UserLists",
  props: ["selectedDates"],
  data() {
    return {
      show: true,
      usersList: [],
      currentSortingInfo: { sortByAttribute: "", sortOrder: "" },
      selectedUserDivClassIndex: 0,
      arrowKeysPressed: { left: false, right: false },
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
  mounted() {
    window.addEventListener("keyup", (e) => {
      let totalClassesForUsers = document.querySelectorAll(".spacing").length;
      let selectedClass = document.querySelectorAll(".spacing");
      let classIndexToRemove;
      if (this.usersList.length) {
        if (e.keyCode === 37) {
          if (this.arrowKeysPressed["left"]) {
            this.selectedUserDivClassIndex =
              this.selectedUserDivClassIndex === 0
                ? totalClassesForUsers - 1
                : this.selectedUserDivClassIndex - 1;

            classIndexToRemove =
              this.selectedUserDivClassIndex === totalClassesForUsers - 1
                ? 0
                : this.selectedUserDivClassIndex + 1;

            selectedClass[classIndexToRemove].style.backgroundColor = "#cfc1f8";
            selectedClass[
              this.selectedUserDivClassIndex
            ].style.backgroundColor = "lightGrey";
          } else {
            selectedClass[
              this.selectedUserDivClassIndex
            ].style.backgroundColor = "lightGrey";

            this.arrowKeysPressed["right"] = this.arrowKeysPressed[
              "left"
            ] = true;
          }
        } else if (e.keyCode === 39) {
          if (this.arrowKeysPressed["right"]) {
            this.selectedUserDivClassIndex =
              this.selectedUserDivClassIndex === totalClassesForUsers - 1
                ? 0
                : this.selectedUserDivClassIndex + 1;
            classIndexToRemove =
              this.selectedUserDivClassIndex === 0
                ? totalClassesForUsers - 1
                : this.selectedUserDivClassIndex - 1;

            selectedClass[classIndexToRemove].style.backgroundColor = "#cfc1f8";
            selectedClass[
              this.selectedUserDivClassIndex
            ].style.backgroundColor = "lightGrey";
          } else {
            selectedClass[
              this.selectedUserDivClassIndex
            ].style.backgroundColor = "lightGrey";
            this.arrowKeysPressed["right"] = this.arrowKeysPressed[
              "left"
            ] = true;
          }
        }
        //}
        if (e.keyCode === 46) {
          this.removeUserByKey(this.selectedUserDivClassIndex);
        }
      }
    });
  },
  computed: {
    fetchUsersList: function () {
      this.usersList = this.$store.getters.fetchUsersList;
    },
  },
  methods: {
    removeUserFromList: function (userId) {
      console.log(userId);
      let index = this.usersList.findIndex((element) => element.uid === userId);
      let name = this.usersList[index].username;
      this.usersList.splice(index, 1);
      this.$toasted.show(`User "${name}" has been removed successfully!`, {
        duration: 1500,
        type: "success",
      });
    },
    removeUserByKey: function (index) {
      if (index != null) {
        let user = this.usersList.filter((e, i) => i === index);
        this.usersList.splice(index, 1);
        this.$toasted.show(
          `User "${user[0].username}" has been removed successfully!`,
          {
            duration: 1500,
            type: "success",
          }
        );
      }
    },
    applyDatesFilter: function () {
      let startDateUnixTimestamp =
        new Date(this.selectedDates.startDate).getTime() / 1000;
      startDateUnixTimestamp = startDateUnixTimestamp - 32880;
      let endDateUnixTimestamp =
        new Date(this.selectedDates.endDate).getTime() / 1000;
      endDateUnixTimestamp = endDateUnixTimestamp - 32880;
      if (startDateUnixTimestamp && endDateUnixTimestamp) {
        this.usersList = this.usersList.filter((e) => {
          return (
            e.join_date >= startDateUnixTimestamp &&
            e.join_date <= endDateUnixTimestamp
          );
        });
      } else if (!(endDateUnixTimestamp && startDateUnixTimestamp)) {
        this.usersList = this.$store.getters.fetchUsersList;
      }
    },
    sort: function (sortInfo) {
      this.currentSortingInfo["sortByAttribute"] = sortInfo.sortBy;
      this.currentSortingInfo["sortOrder"] = sortInfo.sortOrder;
      if (this.currentSortingInfo["sortByAttribute"] === "twubric score")
        this.currentSortingInfo["sortByAttribute"] = "total";
      if (this.currentSortingInfo["sortOrder"] === "asc") {
        this.usersList.sort(
          (a, b) =>
            a.twubric[this.currentSortingInfo["sortByAttribute"]] -
            b.twubric[this.currentSortingInfo["sortByAttribute"]]
        );
      } else if (this.currentSortingInfo["sortOrder"] === "desc") {
        this.usersList.sort(
          (a, b) =>
            b.twubric[this.currentSortingInfo["sortByAttribute"]] -
            a.twubric[this.currentSortingInfo["sortByAttribute"]]
        );
      } else {
        this.usersList = this.$store.getters.fetchUsersList;
        this.$emit("removeDateFilter");
      }
    },
  },
};
</script>
<style scoped>
.remove-text {
  cursor: pointer;
  font-size: 15px;
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
  font-weight: 550;
  font-size: 15px;
  color: #563d7c;
}
.spacing {
  box-sizing: border-box !important;
  border: 15px solid transparent !important;
  background-clip: padding-box !important;
}
.border {
  border: 1px solid #715e8d !important;
}
.badge-danger {
  background-color: #df8c6b;
}
</style>