<template>
  <div class="trademark">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="showAddOrUpdateTrademark(true)"
    >添加一条</el-button>

    <el-dialog
      :title="`${isAddtrademark ? '添加' : '修改'}品牌`"
      :visible.sync="visible"
    >
      <!-- 表单 -->
      <el-form
        ref="form"
        :rules="rules"
        :model="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName" class="trademark-input" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="http://39.98.123.211/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <span>只能上传jpg/png文件，且不超过500kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTrademark"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      v-loading="loading"
      :data="trademark"
      style="width: 100%"
      class="trademark-table"
      border
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <!--
          通过作用域插槽得到当前行所有数据 scope
            scope.row 当前行所有数据
            scope.$index 当前数据的下标
        -->
        <template slot-scope="{ row }">
          <!-- {{ JSON.stringify(scope.row.logoUrl) }}
          {{ JSON.stringify(scope.$index) }} -->
          <img class="trademark-img" :src="row.logoUrl" :alt="row.tmName">
        </template>
      </el-table-column>
      <el-table-column label="操作" current-row-key="index">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="showAddOrUpdateTrademark(false, row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTradmark(row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { reqGetTradmark, reqAddTradmark, reqDeletTradmark, reqUpdateTradmark } from '@/api/Product/trademark'

export default {
  name: 'Trademark',
  data() {
    return {
      trademark: [
      ],
      currentPage: 1,
      pageSize: 3,
      total: 30,
      dialogFormVisible: false,
      visible: false, // dialog显示&隐藏
      isAddtrademark: true,
      // 添加&修改表单的数据 是v-model绑定的
      trademarkForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单校验规则
      rules: {
        tmName: [
          // { required: true, message: "请输入品牌名称", trigger: "blur" },
          // { min: 2, max: 6, message: "请输入2-6位品牌名称", trigger: "blur" },
          { required: true, validator: this.validator, trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  async mounted() {
    const res = await this.getGoods()
    this.trademark = res.data.records
    console.log(res)
  },
  methods: {
    showAddOrUpdateTrademark(isAdd, trademarkForm = { tmName: '', logoUrl: '' }) {
      this.visible = true
      this.isAddtrademark = isAdd
      this.trademarkForm = trademarkForm
      this.$refs.form && this.$refs.form.clearValidate() // 清空校验结果
    },
    // 2.添加&修改Trademark
    addOrUpdateTrademark() {
      // 校验表单
      this.$refs.form.validate(async(status) => {
        /*
          参数1:status 代表校验是否成功的布尔值
            true:成功
            false:失败
          参数2:校验失败的错误对象
            {} 校验成功
            {xxx:[],yyy:[]} 校验失败
        */
        if (status) {
          // 校验通过
          try {
            // 收集数据
            const { logoUrl, tmName, id } = this.trademarkForm
            if (this.isAddtrademark) {
              await reqAddTradmark(logoUrl, tmName)
            } else {
              await reqUpdateTradmark({ logoUrl, tmName, id })
            }
            // 发送请求-更新故武器数据
            // await reqAddTradmark(logoUrl, tmName)
            // 更新-前台数据
            /* 两种方法
              1.判断 this.trademark.length<this.pageSize
                如果是,就添加到页面上
                  this.trademark.push({...})
                如果不是,啥也不做
                优点:不用发送多余七里渠
                缺点:代码稍微麻烦,数据有可能会更新不同步(实际开发不可能,因为是一人操作一个)
              2.重新请求当前页面的数据
                优点:简单粗暴
                缺点:会发送额外请求
            */
            /* if (this.trademark.length < this.pageSize) {
              this.trademark.push({
                id: Date.now(),
                tmName, logoUrl
              })
            } */

            this.getGoods()
            this.$message.success(`${this.isAddtrademark ? '添加' : '修改'}成功`)
          } catch (e) {
            this.$message.error(e.message || '未知错误')
          }
        }
      })

      setTimeout(() => {
        this.visible = false
      }, 1000)
    },
    // 1.请求商品
    async getGoods() {
      try {
        this.loading = true
        // throw new Error('a')
        const { currentPage, pageSize } = this
        const res = await reqGetTradmark(currentPage, pageSize)
        this.trademark = res.data.records
        this.total = res.data.total
        // console.log(res)
        return res
      } catch (e) {
        // console.log(e)
        this.$message.error(e.message || '未知错误')
      } finally {
        // 不管成功\失败都会进来
        this.loading = false
      }
    },
    // 3.改变每页展示条数
    handleSizeChange(newVal) {
      this.pageSize = newVal
      this.getGoods()
    },
    // 4.改变当前页
    handleCurrentChange(newVal) {
      this.currentPage = newVal
      this.getGoods()
    },
    // 5.删除trademark
    async deleteTradmark(id) {
      try {
        await reqDeletTradmark(id) // 发送删除请求
        // console.log(res) // 打印删除的结果
        let{ currentPage } = this
        // 如果删除了之后当前页面是没有数据的,更新当前页减一
        if (this.trademark.length === 1) {
          currentPage = currentPage - 1 <= 0 ? 1 : currentPage - 1
          // 更新currentPage:解决后面获取数据当前页面不对的问题
          this.currentPage = currentPage
        }
        this.getGoods() // 重新获取数据
      } catch (e) {
        this.$message.error(e.message || '未知错误')
      }
    },
    /** 品牌名称的校验函数
     * 表单校验回调函数
     * @params rule 表单项信息（表单名称等）
     * @params value 表单项值
     * @params callback 校验成功、失败的方法（注意必须调用）
     */
    validator(rule, value, callback) {
      // console.log(rule, value)
      if (!value) {
        callback('请输入品牌名称')
        return
      }

      if (value.length < 2 || value.length > 6) {
        callback('请输入2-6位品牌名称')
        return
      }

      // 校验成功
      callback()
      // 校验失败
      // callback('error');
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // 上传成功的响应
      // console.log(res, file)
      if (res.code === 200) {
        this.trademarkForm.logoUrl = res.data
        return
      }
      this.$message.error('上传图片失败~')
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const imagesWhiteList = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      // 判断图片类型
      const isImageOK = imagesWhiteList.indexOf(file.type) > -1
      // 判断图片大小(单位字节)
      const isLt = file.size / 1024 < 500

      if (!isImageOK) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
      }
      // 返回值 true 才 ok
      return isImageOK && isLt
    }
  }
}
</script>

<style lang="sass" scoped>
.trademark
  padding: 20px
.trademark-table
  margin: 10px 0
.trademark-img
  // width: 150px
  height: 100px
</style>
