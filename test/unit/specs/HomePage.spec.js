import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import HomePage from '@/components/HomePage'
import UsersList from '@/components/UsersList'
import axios from 'axios'

Vue.use(BootstrapVue)
Vue.use(Vuex)

let usersList = [{
  "uid": 1,
  "username": "sampleuser1",
  "image": "https://lh3.googleusercontent.com/-I1BJYh52Vvc/AAAAAAAAAAI/AAAAAAAAAAA/8bkN374vtYk/s32-c/photo.jpg",
  "fullname": "Sample User One",
  "twubric": {
    "total": 3.5,
    "friends": 1,
    "influence": 1,
    "chirpiness": 1.5
  },
  "join_date": 1358899200
},
{
  "uid": 2,
  "username": "sampleuser2",
  "image": "https://lh3.googleusercontent.com/-I1BJYh52Vvc/AAAAAAAAAAI/AAAAAAAAAAA/8bkN374vtYk/s32-c/photo.jpg",
  "fullname": "Sample User Two",
  "twubric": {
    "total": 5,
    "friends": 1,
    "influence": 1,
    "chirpiness": 1.5
  },
  "join_date": 1355270400

}]
jest.mock("axios", () => ({
  get: jest.fn(() => {
    Promise.resolve({
      data:
      {
        data: [{ name: "anil" }]
      }
    })
  })
}))

describe('HomePage.vue', () => {
  let actions, store, wrapper, mutations, state;

  beforeEach(() => {
    state = {
      usersList: []
    },
      actions = {
        fetchUsers: jest.fn(),
      }
    mutations = {
      assignFetchedUsersToState(state,) {

      }
    }
    store = new Vuex.Store({
      actions,
      mutations,
      state
    })
    wrapper = mount(HomePage, { store })
  })

  it('should dispatch fetchUsers correctly', async () => {
    const context = jest.fn()
    await actions.fetchUsers({ context })


    //await expect(axios.get).toHaveBeenCalledWith(`https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`)

    //expect(p).toHaveBeenCalledWith(`r/users`);


    await expect(actions.fetchUsers).toHaveBeenCalled()
    console.log(axios.get.mock.calls.length)
    expect(axios.get).toHaveBeenCalledWith(`https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`)

  })

  it('mutating state correctly', () => {

    //console.log(mutations.assignFetchedUsersToState)
    /*  axios
       .get(
         `https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/9667fc19a0f89193e894da7aaadf6a4b7758b45e/twubric.json`
       )
       .then((response) => {
         console.log("res", response);
       }); */

  })

  it('renders content correctly', () => {
    expect(wrapper.vm.attributes.length).toEqual(4)
    const sortHeading = wrapper.find('.sort-heading')
    expect(wrapper.vm.selectedDates['startDate']).toBe('')
    expect(wrapper.vm.selectedDates['endDate']).toBe('')
    expect(sortHeading.text()).toBe('Sort By')
    for (let i = 0; i < wrapper.vm.attributes.length; i++) {
      let sortAttributesButtons = wrapper.findAll('.sort-attributes-buttons').at(i)
      expect(sortAttributesButtons.text()).toBe(wrapper.vm.attributes[i])
    }
  })
  it('renders child component correctly ', () => {
    expect(wrapper.findComponent(UsersList).exists()).toBe(true)
  })
})
