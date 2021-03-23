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
        <!-- 
          1.限制上传图片大小的类型
            :before-upload="beforeAvatarUpload"
          2.限制上传图片的数量
            :limit="3" 限制数量
            :disabled="spuForm.spuImageList.length>=3" 禁用按钮
            :class="{ upload: spuForm.spuImageList.length >= 3 }" 隐藏按钮的样式
            <i class="el-icon-plus" v-show="spuForm.spuImageList.length < 3"></i> 隐藏按钮中图标
          3. 预览
             :on-preview="handlePictureCardPreview"
          4. 删除
            :on-remove="handleRemove"
         -->
        <el-upload
          action="http://39.98.123.211/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :limit="MAX_IMAGE_LENGTH"
          :disabled="spuForm.spuImageList.length >= MAX_IMAGE_LENGTH"
          :class="{ upload: spuForm.spuImageList.length >= MAX_IMAGE_LENGTH }"
        >
          <i
            class="el-icon-plus"
            v-show="spuForm.spuImageList.length < MAX_IMAGE_LENGTH"
          ></i>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 5.手机销售属性 -->
      <el-form-item label="销售属性">
        <!-- 6.展示销售属性(静态4个) -->
        <el-select
          :placeholder="saleAttrTip"
          v-model="spuForm.selectedSaleAttrId"
        >
          <el-option
            v-for="baseSaleAttr in selectedSaleAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="baseSaleAttr.id"
          ></el-option>
        </el-select>
        <!-- 添加销售属性按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="add-btn"
          :disabled="!spuForm.selectedSaleAttrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 7.展示基础销售属性的编辑表格 -->
        <el-table
          class="table"
          :data="spuSaleAttrList"
          border=""
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名"
            prop="saleAttrName"
            width="150"
          ></el-table-column>
          <el-table-column label="属性值列表" prop="spuSaleAttrValueList">
            <template v-slot="{ row, $index }">
              <el-tag
                class="tag"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="index"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                >{{ tag.saleAttrValueName }}</el-tag
              >

              <el-input
                class="input-newTag"
                v-if="isInputTag"
                :ref="`${row}`"
                v-model="newAttrTag"
                size="mini"
                @keyup.enter.native="leaveInput(row)"
                @blur="leaveInput(row)"
              ></el-input>

              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addSelectedAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <!-- 删除销售属性 -->
              <el-popconfirm
                class="spu-pop"
                :title="`确定要删除 xxx 属性值吗？`"
                @onConfirm="deleteattrValue(row)"
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
        <el-button type="primary" @click="addSpu">确定</el-button>
        <el-button @click="toSpuList">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
// api:获取所有品牌列表
import { reqGetAllTrademarkList } from '@/api/trademark'
// api:获取基础属性列表
import { reqGetBaseSaleAttrList, reqSetNewAttr } from '@api/spu'
import { mapState } from 'vuex'

export default {
  name: 'AddOrUpdateSpu',

  data() {
    return {
      // 工具人属性isInputTag
      isInputTag: false,
      // 工具人属性值tag
      newAttrTag: '',
      // 常量:限制图片的最大数量
      MAX_IMAGE_LENGTH: 10,
      // 1.基础销售属性(原数据)
      baseSaleAttrList: [],
      // 2.基础销售属性(编辑中)
      selectedSaleAttrList: [],
      isAddingSaleAttr: '',
      // 3.当前正在编辑的销售属性
      spuSaleAttrList: [
        // {
        //   saleAttrName: '版本/颜色/尺寸/类别',
        //   当前正在编辑的销售属性的属性值列表
        //   spuSaleAttrValueList: [
        //     {
        //       baseSaleAttrId: 1,
        //       saleAttrValueName: ''
        //       // isChecked:'', // 代表将来显示哪个是默认值
        //     }
        //   ]
        // }
      ],
      // 4.所有品牌数据
      trademarkList: [],
      // 5.收集表单数据
      spuForm: {
        spuName: '',
        tmId: '',
        description: '',
        spuImageList: [
          // {
          //   imgName: '',
          //   imageUrl: ''
          // }
        ],
        selectedSaleAttrId: '' // 选中的销售属性
      },
      // 6.校验表单的规则
      rules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' }
        ],
        tmId: [{ required: true, message: '请选择品牌' }],
        description: [
          { required: true, message: '请输入SPU描述', trigger: 'blur' }
        ],
        spuImageList: [{ required: true, validator: this.validator }]
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  computed: {
    saleAttrTip(row) {
      const { length } = this.selectedSaleAttrList
      return length === 0
        ? '这个人很懒,什么都没留下'
        : `还剩${length}个销售属性`
    },
    ...mapState({
      category3Id: (state) => state.category.category3Id
    })
  },
  methods: {
    toSpuList() {
      this.$emit('showSpuList')
    },
    // 光标离开输入框
    leaveInput(row) {
      console.log(row)
      const inputValue = this.$refs[`${row}`].value
      if (inputValue === '') {
        this.$message.error('请添加属性')
        return
      }
      // 将工具input的值赋值改row
      row.spuSaleAttrValueList.push({ saleAttrValueName: inputValue })
      // 清空工具值
      this.newAttrTag = ''
      this.isInputTag = false
    },
    // 添加选择的销售属性的属性值
    addSelectedAttrValue(row) {
      this.isInputTag = true
      // console.log(row)
      // console.log(row.isInputTag)
      if (this.isInputTag) {
        this.$message.error('请完成输入后再添加')
        return
      }
      // console.log(row) // 当前行
      // console.log(this.spuSaleAttrList) // 当前行对应的数据
      this.$nextTick(() => {
        this.$refs[`${row}`].focus()
      })
    },
    // 删除属性:coderou
    deleteattrValue(row) {
      // 点击删除的文字
      // const { saleAttrName } = row
      // 下拉框属性
      // const { selectedSaleAttrId } = this.spuForm
      // console.log(selectedSaleAttrId)

      // console.log(row) // 点击的行
      // console.log(this.spuForm) // 可获取下拉框的选中状态
      // console.log(this.baseSaleAttrList) // 所有列表
      // console.log(this.selectedSaleAttrList) // 当前下拉框可选择的列表
      // console.log(this.spuSaleAttrList) // 当前正在进行添加属性值的列表

      // 1..更新可选下拉框区域
      const item = this.baseSaleAttrList.find((i) => {
        // 获取item
        return i.name === row.saleAttrName
      })
      this.selectedSaleAttrList.push(item) // 添加item
      // 2..更新列表区域
      this.spuSaleAttrList = this.spuSaleAttrList.filter((i) => {
        //删除item
        return i.saleAttrName !== row.saleAttrName
      })
    },
    // 照片墙:预览图片
    handlePictureCardPreview() {},
    // 照片墙:删除图片
    handleRemove() {},
    // 添加销售属性
    addSaleAttr() {
      /*
        将现在选中的销售属性 spuForm.selectedSaleAttrId 从列表 selectedSaleAttrList 中移除
        将现在选中的销售属性 spuForm.selectedSaleAttrId 添加到table中显示 spuSaleAttrList
        将 spuForm.selectedSaleAttrId 变成 空
     */
      const { selectedSaleAttrId } = this.spuForm

      let saleAttrName

      this.selectedSaleAttrList = this.selectedSaleAttrList.filter(
        (saleAttr) => {
          if (saleAttr.id !== selectedSaleAttrId) {
            return true
          }

          saleAttrName = saleAttr.name
          return false
        }
      )

      this.spuSaleAttrList.push({
        saleAttrName,
        spuSaleAttrValueList: []
      })

      this.spuForm.selectedSaleAttrId = ''
    },
    // 最下面的确认按钮(最终校验,发送请求添加数据)
    addSpu() {
      this.$refs.spuForm.validate(async (status) => {
        try {
          // 整合data
          const data = {
            category3Id: this.category3Id,
            description: this.spuForm.description,
            spuImageList: this.spuForm.spuImageList,
            spuName: this.spuForm.spuName,
            spuSaleAttrList: this.spuSaleAttrList,
            tmId: this.spuForm.tmId
          }
          // 传递数据
          const res = await reqSetNewAttr(data)
          this.$message.success('添加成功')
          this.toSpuList()
          this.$bus.$emit('updateSpuList')
        } catch (e) {
          console.log(e)
        }
      })
    },
    // 图片数量校验
    validator(rule, value, callback) {
      if (value.length >= 1) {
        callback()
        return
      }
      callback('请上传至少一张图片')
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 删除图片
    handleRemove(file) {
      this.spuForm.spuImageList = this.spuForm.spuImageList.filter(
        (image) => image.imgUrl !== file.response.data
      )
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res 上传成功的响应
      console.log(res, file)
      if (res.code === 200) {
        this.spuForm.spuImageList.push({
          imgUrl: res.data,
          imgName: file.name
        })
        return
      }

      this.$message.error('上传图片失败~')
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const imagesWhiteList = ['image/jpg', 'image/jpeg', 'image/png']
      console.log(file)
      // 判断图片的类型
      const isImageOK = imagesWhiteList.indexOf(file.type) > -1
      // 判断图片的大小
      const isLt = file.size / 1024 < 500

      if (!isImageOK) {
        this.$message.error('上传品牌LOGO只能是 JPG 或 PNG 格式!')
      }
      if (!isLt) {
        this.$message.error('上传品牌LOGO大小不能超过 500KB!')
      }

      // 返回 true 才 ok
      // 返回 false 不 ok
      return isImageOK && isLt
    }
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
      this.selectedSaleAttrList = resArr[1].data // 更新基础实现选择列表(编辑状态)
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
.input-newTag
  width: 90px
  margin-right: 10px
  margin-left: 5px
  vertical-align: bottom
.tag
  margin: 0 5px
</style>
