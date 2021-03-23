// 导入api接口函数
import {
  reqGetCategory1List,
  reqGetCategory2List,
  reqGetCategory3List
} from '@/api/category'

const state = {
  // 选中的分配Id
  category1Id: '',
  category2Id: '',
  category3Id: '',
  // 展示的分类列表
  category1List: [],
  category2List: [],
  category3List: []
}

const actions = {
  async getCategory1List({ commit }) {
    // 一般都加return
    const res = await reqGetCategory1List()
    commit('GET_CATEGORY1_LIST', res.data)
  },
  async getCategory2List({ commit }, category1Id) {
    // 通过category1Id 拿到category2List
    const res = await reqGetCategory2List(category1Id)
    commit('GET_CATEGORY2_LIST', { category1Id, category2List: res.data })
  },
  async getCategory3List({ commit }, category2Id) {
    // 通过category2Id 拿到category3List
    const res = await reqGetCategory3List(category2Id)
    commit('GET_CATEGORY3_LIST', { category2Id, category3List: res.data })
  }
}
const mutations = {
  GET_CATEGORY1_LIST: (state, category1List) => {
    state.category1List = category1List
  },
  GET_CATEGORY2_LIST: (state, { category1Id, category2List }) => {
    /*
      获取2级分类列表数据
        1.请求2级分类列表数据
        2.清空3级分类列表数据
        3.清空2级id和3级id
    */
    //  1.请求2级分类列表数据
    state.category2List = category2List
    state.category1Id = category1Id
    // 2.清空3级分类列表数据
    state.category3List = []
    // 3.清空2级id和3级id
    state.category2Id = ''
    state.category3Id = ''
  },
  GET_CATEGORY3_LIST: (state, { category2Id, category3List }) => {
    /* 
    tip:触发这里函数的时候,拿到了c3List,需要更新c3List,同时更新c2Id
      获取3级分类列表数据:
        1.清空2级分类列表数据
        2.清空3级id
    */
    state.category3List = category3List
    state.category2Id = category2Id
    // 2.清空3级id
    state.category3Id = ''
  },
  SET_CATEGORY3ID: (state, category3Id) => {
    state.category3Id = category3Id
  }
}

export default {
  // 启用命名空间
  // 🥖🥖🥖将来使用actions时候需要加上模块名
  namespaced: true,
  state,
  mutations,
  actions
}
