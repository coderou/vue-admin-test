<template>
  <el-card v-show="isShowList === 2">
    <el-form ref="skuForm" :model="skuForm" :rules="rules" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <!-- 数据结构
        price: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        skuSaleAttrValueList: [],
        tmId: "",
        weight: "",
       -->

      <el-form-item label="SKU名称" prop="skuName">
        <el-input
          v-model="skuForm.skuName"
          placeholder="请输入SKU名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input-number
          class="input-number"
          v-model="skuForm.price"
          controls-position="right"
          placeholder="请输入价格"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量" prop="weight">
        <el-input-number
          class="input-number"
          v-model="skuForm.weight"
          controls-position="right"
          placeholder="请输入重量"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="SKU描述" prop="skuDesc">
        <el-input
          type="textarea"
          :row="5"
          v-model="skuForm.skuDesc"
          placeholder="请输入SKU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="skuAttrValueList">
        <!-- 平台属性 -->
        <el-form :inline="true">
          <el-form-item
            v-for="i in skuForm.skuAttrValueList"
            :key="i.id"
            :label="i.attrName"
          >
            <el-select v-model="i.coderou">
              <el-option
                v-for="j in i.attrValueList"
                :key="j.id"
                :label="j.valueName"
                :value="j.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- end:平台属性 -->
      </el-form-item>

      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <!-- 销售属性 -->
        <el-form :inline="true">
          <el-form-item
            v-for="i in skuForm.skuSaleAttrValueList"
            :key="i.id"
            :label="i.saleAttrName"
          >
            <el-select v-model="i.coderou">
              <el-option
                v-for="j in i.spuSaleAttrValueList"
                :key="j.id"
                :label="j.saleAttrValueName"
                :value="j.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- end:销售属性 -->
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          class="spu-table"
          :data="skuImageList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                v-show="!row.isDefault"
                size="mini"
                @click="setDefault(row)"
                >设为默认</el-button
              >
              <el-button type="success" v-show="row.isDefault" size="mini"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 确认 -->
      <el-form-item>
        <el-button type="primary" @click="addSku">确认</el-button>
        <el-button @click="$emit('update:isShowList', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
// 获取平台属性API(通过属性管理添加)[c1Id,c2Id,c3Id]
import { reqGetAttrList } from '@/api/attr'
// 获取销售属性API[id]
import { reqGetSpuSaleAttrList } from '@/api/spu'
// 获取图片[id]
import { reqGetSpuImageList } from '@api/spu'
import { reqAddSku } from '@api/sku'
import { mapState } from 'vuex'

export default {
  name: 'AddSku',
  props: ['isShowList'],
  data() {
    // 数据结构:
    // #region
    /* 
      {
      "category3Id": 0,
      "createTime": "2021-03-24T05:44:30.646Z",
      "id": 0,
      "isSale": 0,
      "price": 0,
      "skuAttrValueList": [
        {
          "attrId": 0,
          "attrName": "string",
          "id": 0,
          "skuId": 0,
          "valueId": 0,
          "valueName": "string"
        }
      ],
      "skuDefaultImg": "string",
      "skuDesc": "string",
      "skuImageList": [
        {
          "id": 0,
          "imgName": "string",
          "imgUrl": "string",
          "isDefault": "string",
          "skuId": 0,
          "spuImgId": 0
        }
      ],
      "skuName": "string",
      "skuSaleAttrValueList": [
        {
          "id": 0,
          "saleAttrId": 0,
          "saleAttrName": "string",
          "saleAttrValueId": 0,
          "saleAttrValueName": "string",
          "skuId": 0,
          "spuId": 0
        }
      ],
      "spuId": 0,
      "tmId": 0,
      "weight": "string"
    }
    */
    // #endregion
    return {
      spu: {}, // SPU属性
      skuForm: {
        // SPU对应的SKU表单
        price: '', // 价格
        skuAttrValueList: [], // 平台属性
        skuDefaultImg: '', // 默认图片
        skuDesc: '', // 商品描述(description)
        skuName: '', // sku名称
        skuSaleAttrValueList: [], // 销售属性
        tmId: '', // 品牌ID
        weight: '' //
      },
      skuImageList: [], // 商品图片
      rules: {
        // form表单校验规则
        price: [{ required: true, message: '请输入值', trigger: 'blur' }]
      },
      // 选择的图片
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      category1Id: (state) => state.category.category1Id,
      category2Id: (state) => state.category.category2Id,
      category3Id: (state) => state.category.category3Id
    })
  },
  methods: {
    // 设置图片为默认
    setDefault(row) {
      console.log(row)
      this.skuImageList.forEach((i) => {
        i.isDefault = 0
      })
      row.isDefault = 1
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 接收spuList传递过来的spuId等属性
    async receiveSpuDataToSku(row) {
      const { category1Id, category2Id, category3Id } = this
      this.spu = row // 保存传递的row
      // 1:获取平台属性
      const p1 = reqGetAttrList({
        category1Id,
        category2Id,
        category3Id
      })
      // 2:获取销售属性
      const p2 = reqGetSpuSaleAttrList(row.id)
      // 3:获取图片
      const p3 = reqGetSpuImageList(row.id)

      const res = await Promise.all([p1, p2, p3])
      console.log(res)
      this.skuForm.skuAttrValueList = res[0].data
      // console.log(this.skuForm)
      this.skuForm.skuSaleAttrValueList = res[1].data
      this.skuImageList = res[2].data
      const _this = this
      this.skuImageList.forEach((i) => {
        // 图片
        // i.isDefault = 0
        i.spuImgId = i.id // 处理id
        delete i.id // 删除id
        _this.$set(i, 'isDefault', 0)
      })
      this.skuForm.tmId = row.tmId // 品牌(trademark)
    },
    // 点击确定,添加sku
    async addSku() {
      // 1.处理默认图片地址
      const { imgUrl } = this.skuImageList.find((i) => {
        return i.isDefault
      })
      // 2.处理平台属性
      const skuAttrValueList = this.skuForm.skuAttrValueList.map((i) => {
        return {
          attrId: i.id,
          valueId: i.coderou
        }
      })
      // 3.处理销售属性
      const skuSaleAttrValueList = this.skuForm.skuSaleAttrValueList.map(
        (i) => {
          return {
            saleAttrId: i.id,
            saleAttrValueId: i.coderou
          }
        }
      )
      // 4.整合data
      const data = {
        spuId: this.spu.id, // SPUID
        tmId: this.skuForm.tmId, // 品牌Id
        skuName: this.skuForm.skuName, // 商品名称
        price: this.skuForm.price, // 价格
        weight: this.skuForm.weight, // 重量
        category3Id: this.category3Id, // c3Id
        skuAttrValueList, // 平台属性
        skuSaleAttrValueList, // 销售属性
        skuDesc: this.skuForm.skuDesc, // 商品描述(description)
        skuImageList: this.multipleSelection, // 商品图片
        skuDefaultImg: imgUrl // 默认图片
      }
      try {
        const res = await reqAddSku(data)
        console.log(res)
        this.$message.success('添加SKU成功')

        this.$bus.$emit('updateSpuList')
        this.$emit('update:isShowList', 0) // 回到spuList
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.$bus.$on('receive', this.receiveSpuDataToSku)
  }
}
</script>

<style lang='sass' scoped>
</style>
