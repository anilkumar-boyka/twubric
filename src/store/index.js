import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        usersList: []
    },
    getters: {
        fetchUsersList: state => {
            return state.usersList;
        }
    },
    mutations: {
        assignFetchedUsersToState(state, data) {
            state.usersList = data;
        }
    },
    actions: {
        fetchUsers(context) {
            axios
                .get(
                    `https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`
                )
                .then((response) => {
                    context.commit('assignFetchedUsersToState', response.data)
                });
        }
    }
})
