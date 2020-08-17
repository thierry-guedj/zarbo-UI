import Vue from 'vue'
import Vuex from 'vuex'
// import loginmodal from './modules/loginmodal'
// import modal from './modules/modal'

Vue.use(Vuex)
const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      modalVisible: false,
      modalComponent: null,
      folder: null,
      snackbarVisible: false,
      idDesign: null,
      style: null,
      modalDesignVisible: false,
      modalDesignComponent: null,
    }),

    mutations: {
      showModal(state, payload) {
        state.modalVisible = true
        state.modalComponent = payload.componentName
        state.folder = payload.folder
        state.idDesign = payload.idDesign
        state.style = payload.style
      },
      hideModal(state) {
        state.modalVisible = false
        state.modalComponent = null
        state.folder = null
        state.idDesign = null
        state.style = null
      },
      showDesignModal(state, payload) {
        state.modalDesignVisible = true
        state.modalDesignComponent = payload.componentName
        state.idDesign = payload.idDesign
        state.style = payload.style
      },
      hideDesignModal(state) {
        state.modalDesignComponent = false
        state.modalDesignComponent = null
        state.idDesign = null
        state.style = null
      },
      showSnackbar(state) {
        state.snackbarVisible = true
      },
      hideSnackbar(state) {
        state.snackbarVisible = false
      },
    },

    actions: {
      showModal({ commit }, payload) {
        commit('showModal', payload)
      },
      hideModal({ commit }) {
        commit('hideModal')
      },
      showDesignModal({ commit }, payload) {
        commit('showDesignModal', payload)
      },
      hideDesignModal({ commit }) {
        commit('hideDesignModal')
      },
      showSnackbar({ commit }) {
        commit('showSnackbar')
      },
      hideSnackbar({ commit }) {
        commit('hideSnackbar')
      },
    },
    getters: {
      visible(state) {
        return state.modalVisible
      },
      visibleDesign(state) {
        return state.modalDesignVisible
      },
      modalComponent(state) {
        return state.modalComponent
      },
      folder(state) {
        return state.folder
      },
      visibleSnackbar(state) {
        return state.snackbarVisible
      },
      getIdDesign(state) {
        return state.idDesign
      },
      getStyle(state) {
        return state.style
      },
    },
  })
}
export default createStore
/* export const store = new Vuex.Store({
      modules: {
        modal,
      },
    }) */
/* Vue.use(Vuex)
    export const store = new Vuex.Store({
      state: {
        modalVisible: true,
        modalComponent: null,
      },
    
      mutations: {
        showModal(state, componentName) {
          state.modalVisible = true
          state.modalComponent = componentName
        },
        hideModal(state) {
          state.modalVisible = false
        },
      },
    
      actions: {
        showModal({ commit }, componentName) {
          commit('showModal', componentName)
        },
        hideModal({ commit }) {
          commit('hideModal')
        },
      },
      getters: {
        getVisible(state) {
          return state.modalVisible
        },
      },
  })
}
/* export const state = () => ({
  modalVisible: false,
  modalComponent: null,
})

export const mutations = () => ({
  showModal(state) {
    state.modalVisible = true
    // state.modalComponent = componentName
  },
  hideModal(state) {
    state.modalVisible = false
  },
})

export const actions = () => ({
  showModal({ commit }) {
    commit('showModal')
  },
  hideModal({ commit }) {
    commit('hideModal')
  },
})
export const getters = () => ({
  getVisible(state) {
    return state.modalVisible
  },
})

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
}) */
/* export const store = new Vuex.Store({
  modules: {
    modal,
  },
}) */
/* Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    modalVisible: true,
    modalComponent: null,
  },

  mutations: {
    showModal(state, componentName) {
      state.modalVisible = true
      state.modalComponent = componentName
    },
    hideModal(state) {
      state.modalVisible = false
    },
  },

  actions: {
    showModal({ commit }, componentName) {
      commit('showModal', componentName)
    },
    hideModal({ commit }) {
      commit('hideModal')
    },
  },
  getters: {
    getVisible(state) {
      return state.modalVisible
    },
  },
})
 */
