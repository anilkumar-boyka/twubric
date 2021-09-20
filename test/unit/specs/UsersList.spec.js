import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
///import axios 
import UsersList from '@/components/UsersList'

Vue.use(BootstrapVue)
Vue.use(Vuex)

describe('HomePage.vue', () => {
    let getters;
    let store;
    let wrapper;

    beforeEach(() => {
        getters = {
            fetchUsersList: jest.fn(),
        }
        store = new Vuex.Store({
            getters
        })
        wrapper = shallowMount(UsersList, { store })
    })

    it('fetching usersList from vuex store correctly', () => {
        // console.log(wrapper.vm.usersList)

    })
})