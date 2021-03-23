<template>
  <div>
    <!-- 三级导航 -->
    <CategorySelector :disabled="!isShowList && !isShowSpuList" />
    <!-- 商品展示 -->
    <SpuList v-show="isShowSpuList" @showAddList="showAddList" />
    <!-- 添加或者更新商品 -->
    <AddOrUpdateSpu v-show="!isShowSpuList" @showSpuList="showSpuList" />
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
    showSpuList() {
      this.isShowSpuList = true
    },
    showAddList() {
      this.isShowSpuList = false
    }
  }
}
</script>

<style lang='less' scoped>
</style>
