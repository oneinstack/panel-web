import { groupListReq, groupCreateReq, groupUpdateReq, groupDeleteBatchReq} from '@/api/groups'


const state = {
  names: []
}

const mutations = {
  M_names: (state, names) => {
    state.names = names
  },
}

const actions = {
  async getNames() {
      return state.names
  },
  setNames({commit }, data) {
    return new Promise((resolve, reject) => {
      commit('M_names', data)
      resolve()
    }
  )}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
