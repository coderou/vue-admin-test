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
          :row="3"
          v-model="skuForm.skuDesc"
          placeholder="请输入SKU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        xxxx
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        xxxx
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          class="spu-table"
          :data="skuImageList"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-button type="primary" size="mini">设置默认图片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSku">确认</el-button>
        <el-button @click="$emit('update:isShowList', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
import moduleName from '@/api/category';

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
        skuAttrValueList: [], // sku属性值列表
        skuDefaultImg: '', // sku默认图片
        skuDesc: '', //
        skuName: '', // sku名称
        skuSaleAttrValueList: [], // sku销售属性列表
        tmId: '', // 品牌ID
        weight: '' //
      },
      skuImageList: [], // sku商品图片
      rules: {
        // form表单校验规则
        price: [{ required: true, message: '请输入值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 接收spuList传递过来的spuId等属性
    receiveSpuDataToSku(row) {
      this.spu=row
      // console.log(row)
    },
    // 点击确定,添加sku
    addSku() {}
  },
  mounted() {
    this.$bus.$on('receive', this.receiveSpuDataToSku)
  }
}
</script>

<style lang='sass' scoped>
</style>
