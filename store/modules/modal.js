export const state = () => ({
  modalVisible: false,
  modalComponent: null,
})

export const mutations = () => ({
  showModal(state, componentName) {
    state.modalVisible = true
    state.modalComponent = componentName
  },
  hideModal(state) {
    state.modalVisible = false
  },
})

export const actions = () => ({
  showModal({ commit }, componentName) {
    commit('showModal', componentName)
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

export default {
  state,
  mutations,
  actions,
  getters,
}
