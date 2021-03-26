<template>
  <div>
    <CategorySelector :disabled="isShowList !== 0" />
    <SpuList :isShowList.sync="isShowList" />
    <AddOrUpdateSpu :isShowList.sync="isShowList" />
    <AddSku :isShowList.sync="isShowList" />
    <SkuList />
  </div>
</template>

<script type="text/ecmascript-6">
import SpuList from './SpuList'
import AddOrUpdateSpu from './AddOrUpdateSpu'
import AddSku from './AddSku'
import SkuList from './SkuList'

export default {
  name: 'Spu',
  components: { SpuList, AddOrUpdateSpu, AddSku, SkuList },
  data() {
    return {
      isShowList: 0 // 0:显示SpuList 1:显示AddOrUpdateSpu 2.显示AddSku
      // isShowList: false,
      // isShowSpuList: true
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
