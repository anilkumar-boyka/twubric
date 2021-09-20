import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import HomePage from '@/components/HomePage'
import UsersList from '@/components/UsersList'


Vue.use(BootstrapVue)
Vue.use(Vuex)

describe('HomePage.vue', () => {
  let actions, store, wrapper;

  beforeEach(() => {

    actions = {
      fetchUsers: jest.fn(),
    }

    store = new Vuex.Store({
      actions,

    })
    wrapper = shallowMount(HomePage, { store })
  })

  it('should dispatch fetchUsers correctly', () => {
    expect(actions.fetchUsers).toBeCalled()
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
