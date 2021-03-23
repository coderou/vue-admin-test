<template>
  <el-card class="card">
    <el-form ref="spuForm" :model="spuForm" :rules="rules" label-width="80px">
      <!-- 1.收集SPU名称 -->
      <el-form-item label="SPU名称" prop="spuName">
        <el-input
          placeholder="请输入spu名称"
          v-model="spuForm.spuName"
        ></el-input>
      </el-form-item>
      <!-- 2.收集品牌 -->
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spuForm.tmId">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :label="trademark.tmName"
            :value="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 3.收集SPU描述信息 -->
      <el-form-item label="SPU描述" prop="description">
        <el-input
          v-model="spuForm.description"
          type="textarea"
          :rows="2"
          placeholder="请输入spu名称"
        ></el-input>
      </el-form-item>
      <!-- 4.收集SPU图片 -->
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog> -->
      </el-form-item>
      <!-- 5.手机销售属性 -->
      <el-form-item label="销售属性">
        <!-- 6.展示销售属性(静态4个) -->
        <el-select :placeholder="`还剩${baseSaleAttrList.length}个销售属性`" v-model="isAddingSaleAttr">
          <!-- 遍历baseSaleAttrList的属性,而不是base -->
          <el-option
            v-for="baseSaleAttr in baseSaleAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="baseSaleAttr.id"
          ></el-option>
        </el-select>
        <!-- 添加销售属性按钮 -->
        <el-button type="primary" icon="el-icon-plus" class="add-btn"
          >添加销售属性</el-button
        >
        <!-- 7.展示基础销售属性的编辑表格 -->
        <el-table
          class="table"
          :data="saleAttrList"
          border=""
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50px"
          ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column
            label="属性值列表"
            prop="spuSaleAttrValueList"
          ></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <!-- 删除销售属性 -->
              <el-popconfirm
                class="spu-pop"
                :title="`确定要删除 xxx 属性值吗？`"
              >
                <!-- 必须使用具名插槽 -->
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 8.确定和取消 -->
      <el-form-item>
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
// api:获取所有品牌列表
import { reqGetAllTrademarkList } from '@/api/trademark'
// api:获取基础属性列表
import { reqGetBaseSaleAttrList } from '@api/spu'

export default {
  name: 'AddOrUpdateSpu',
  data() {
    return {
      // 1.基础销售属性(原数据)
      baseSaleAttrList: [],
      // 2.基础销售属性(编辑中)
      saleAttrList: [],
      isAddingSaleAttr:'',
      // 3.table要显示的销售属性和销售属性值列表
      spuSaleAttrList: [
        {
          saleAttrName: 'xxx',
          spuSaleAttrValueList: [
            {
              baseSaleAttrId: 1,
              saleAttrValueName: ''
              // isChecked:'', // 代表将来显示哪个是默认值
            }
          ]
        }
      ],
      // 4.所有品牌数据
      trademarkList: [],
      // 5.收集表单数据
      spuForm: {
        spuName: '',
        tmId: '',
        descripting: ''
      },
      // 6.校验表单的规则
      rules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' }
        ],
        tmId: [{ required: true, message: '请选择品牌' }],
        description: [
          { required: true, message: '请输入SPU描述', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    // 照片墙:预览图片
    handlePictureCardPreview() {},
    // 照片墙:删除图片
    handleRemove() {},
    // 挂载:获取商标&基础属性
  },
  async mounted() {
      try {
        // Promise.all 方法特点：所有都成功，才成功，只要有一个失败就失败
        const resArr = await Promise.all([
          reqGetAllTrademarkList(),
          reqGetBaseSaleAttrList()
        ])

        this.trademarkList = resArr[0].data // 更新商标列表
        this.baseSaleAttrList = resArr[1].data // 更新基础实现选择列表(原数据)
        // this.saleAttrList = resArr[1].data // 更新基础实现选择列表(编辑状态)
      } catch {
        this.$message.error('获取数据失败，请刷新试试~')
      }
      // Promise.allSettled 方法特点：不管成功或失败，都会返回一个成功的Promise对象，并且包含成功和失败的结果
      // const res2 = await Promise.allSettled([
      //   reqGetAllTrademarkList(),
      //   reqGetBaseSaleAttrList(),
      // ]);
    }
}
</script>

<style lang="sass" scoped>
.card
  margin: 10px
.table
  margin-top: 10px
.add-btn
  margin-left: 10px
</style>
