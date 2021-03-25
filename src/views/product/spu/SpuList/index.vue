<template>
  <el-card v-show="isShowList === 0">
    <!-- 1.点击添加spu跳转到添加界面 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="$emit('update:isShowList', 1)"
      >添加SPU</el-button
    >
    <!-- 2.展示spu的列表 -->
    <el-table
      class="spu-table"
      :data="spuList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="spu名称" prop="spuName" />
      <el-table-column label="spu描述" prop="description" />
      <!-- 各种操作按钮 -->
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <!-- 1.添加按钮 -->
          <el-tooltip content="添加SKU" placement="bottom" effect="light"
            ><el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="showAddSku(row)"
            ></el-button
          ></el-tooltip>
          <!-- 2.修改按钮 -->
          <el-tooltip content="修改SPU" placement="bottom" effect="light"
            ><el-button
              type="warning"
              size="mini"
              icon="el-icon-edit"
              @click="showUpdateSpu(row)"
            ></el-button
          ></el-tooltip>
          <!-- 3.查看按钮 -->
          <el-tooltip content="查看sku列表" placement="bottom" effect="light"
            ><el-button
              type="info"
              size="mini"
              icon="el-icon-info"
              @click="showSku(row)"
            ></el-button
          ></el-tooltip>
          <!-- 4.删除按钮 -->
          <!-- element-ui文档写错了 onConfirm -->
          <el-tooltip content="删除SPU" placement="bottom" effect="light">
            <el-popconfirm
              class="spu-pop"
              :title="`确定要删除 xxx 属性值吗？`"
              @onConfirm="deleteSpu(row)"
            >
              <!-- 必须使用具名插槽 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { reqGetSpuList, reqDeleteSpu } from '@api/spu'
import { reqGetSkuBySpuId } from '@/api/sku'

export default {
  name: 'SpuList',
  props: ['isShowList'],
  data() {
    return {
      spuList: [
        // {
        //   id: 838,
        //   spuName: "Sony/索尼A7S3",
        //   description:
        //     "新品 Sony/索尼A7S3全画幅微单相机A7SM3单机4K国行 ILCE-7S3现货 A7S3现货+大师70-200F2.8国行",
        //   category3Id: 178,
        //   tmId: 6533, // 品牌id
        //   spuSaleAttrList: null,
        //   spuImageList: null,
        // },
      ],
      loading: false,
      total: 1,
      currentPage: 1,
      pageSize: 3
    }
  },
  watch: {
    // 当isShowList发生变化,表示从其他页面回来了,更新界面
    // isShowList(isShowList){
    //   if(isShowList){
    //     this.getSpuList()
    //   }
    // }
  },
  // 映射:category3Id
  computed: {
    ...mapState({
      category3Id: (state) => state.category.category3Id
    })
  },
  // 监视:category3Id
  watch: {
    category3Id(category3Id) {
      // 1.如果category3Id存在
      if (!category3Id) {
        // 初始化数据
        this.spuList = [] // 数据:spu列表
        this.total = 0 // 分页器:spu总数
        this.currentPage = 1 // 分页器:当前页面
        this.pageSize = 3 // 分页器:每页数量
        return
      }
      // 2.调用方法,获取数据
      this.getSpuList(this.currentPage, this.pageSize)
    }
  },
  // 方法:[]
  methods: {
    async showSku(row) {
      // console.log(row);
      const res = await reqGetSkuBySpuId(row.id)
      console.log(res);
    },
    // 修改SKU信息
    showAddSku(row) {
      this.$emit('update:isShowList', 2)
      this.$bus.$emit('receive', row)
    },
    // 修改SPU信息
    showUpdateSpu(spu) {
      this.$emit('update:isShowList', 1)
      this.$bus.$emit('receive', spu)
    },
    // 分页器:改变当前页数据量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSpuList()
    },
    // 分页器:改变当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getSpuList()
    },
    // 数据:获取数据
    async getSpuList() {
      try {
        const { currentPage, pageSize } = this
        // 开启加载动画
        this.loading = true
        const res = await reqGetSpuList({
          page: currentPage, // 当前页
          limit: pageSize, // 当前页数据
          category3Id: this.category3Id // c3Id
        })
        // console.log(res)
        this.total = res.data.total // 更新总数量
        this.spuList = res.data.records // 更新spu列表
      } catch {
        this.$message.error('获取SPU列表失败')
      } finally {
        // 关闭加载动画
        this.loading = false
      }
    },
    // 改变了012选择显示,不需要了
    // addSpu() {
    //   this.$emit('showAddList')
    // },
    async deleteSpu(row) {
      const res = await reqDeleteSpu(row.id)
      this.$message.success('删除成功') // 提示删除成功
      this.getSpuList() // 更新界面
    }
  },
  mounted() {
    this.getSpuList() // 更新界面
    this.$bus.$on('updateSpuList', this.getSpuList)
  }
}
</script>

<style lang="sass" scoped>
.spu-table
  margin: 10px 0
.spu-pop
  margin-left: 10px
</style>
