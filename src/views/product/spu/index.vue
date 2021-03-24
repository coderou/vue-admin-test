<template>
  <div>
    <!-- 三级导航 -->
    <CategorySelector :disabled="!isShowList && !isShowSpuList" />
    <!-- 商品展示 -->
    <SpuList v-show="isShowSpuList" @showAddList="showAddList" :isShowSpuList.sync="isShowSpuList" />
    <!-- 添加或者更新商品 -->
    <AddOrUpdateSpu v-show="!isShowSpuList" @showSpuList="showSpuList" />
    <!--
      v-bind:xxx.sync
        即传递数据，也传递更新数据的方法

      :isShowSpuList="isShowSpuList"  会给组件只会传递一个 isShowSpuList 属性
      :isShowSpuList.sync="isShowSpuList"
        即会给组件传递一个 isShowSpuList 属性
        也会给组件传递一个 更新 isShowSpuList 属性的自定义事件 @update:isShowSpuList
          注意方法父组件不需要定义
     -->
  </div>
</template>

<script type="text/ecmascript-6">
import SpuList from './SpuList'
import AddOrUpdateSpu from './AddOrUpdateSpu'

export default {
  name: 'Spu',
  components: { SpuList, AddOrUpdateSpu },
  data() {
    return {
      isShowList: false,
      isShowSpuList: true
    }
  },
  methods: {
    // 显示SPU列表
    showSpuList() {
      this.isShowSpuList = true
    },
    // 显示添加\修改按钮
    showAddList() {
      this.isShowSpuList = false
    }
  }
}
</script>

<style lang='less' scoped>
</style>
