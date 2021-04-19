<template>
  <el-dialog
    :title="`SKU列表 =>${spuName}`"
    :visible.sync="visible"
    width="50%"
  >
    <el-table
      :data="skuList"
      v-loading="loading"
      border
      style="width: 100%"
      max-height="300px"
    >
      <el-table-column label="SPU名称" prop="skuName" width="150">
      </el-table-column>
      <el-table-column label="价格(元)" prop="price" width="80">
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight" width="80">
      </el-table-column>
      <el-table-column label="默认图片" prop="skuDefaultImg">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" :alt="row.skuName" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { reqGetSkuBySpuId } from '@/api/sku'

export default {
  name: 'SkuList',
  data() {
    return {
      visible: false,
      skuList: [],
      spuName: '',
      loading: false
    }
  },
  methods: {
    async handleSku({ spuId, spuName }) {
      // 1.sku列表可见&更新数据
      this.visible = true
      this.spuName = spuName
      this.loading = true
      // 2.请求sku数据
      const res = await reqGetSkuBySpuId(spuId)
      // 3.更新skuList数据
      this.skuList = res.data
      this.loading = false
    }
  },
  mounted() {
    this.$bus.$on('receiveSku', this.handleSku)
  }
}
</script>

<style lang='sass' scoped>
</style>
