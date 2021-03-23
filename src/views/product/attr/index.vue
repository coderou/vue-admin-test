<template>
  <div>
    <!-- 🥗三级导航选择 -->
    <CategorySelector :disabled="!isShowList" />
    <el-card class="attr-card">
      <!-- 🥗属性展示卡片 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="isShowList = false"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table
          class="attr-table"
          :data="attrs"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50%"
          ></el-table-column>
          <el-table-column label="属性名称" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                class="attr-tag"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="changeAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAttr(row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 🥗添加\修改属性卡片 -->
      <div v-show="!isShowList">
        <!-- 1.表单名称,一行,校验规则,数据attr -->
        <el-form inline :rules="rules" :model="attr">
          <el-form-item label="属性名" prop="attrName">
            <el-input v-model="attr.attrName" />
          </el-form-item>
        </el-form>
        <!-- 2.按钮:添加属性[上面表单没写->禁用,点击->添加一个新的对象用于显示数据] -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attr.attrName"
          @click="showAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <!-- 3.展示添加/修改属性的表单[数据为table遍历显示属性值列表,已在attr外层单独定义] -->
        <el-table
          class="attr-table"
          :data="attrValueList"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <!-- 4.操作表单属性 -->
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="属性值名称">
            <!-- tip:row代表 attrValueList 每一行的数据 -->
            <template v-slot="{ row, $index }">
              <!-- 
                tip:v-model绑定的是attr里面的单个属性值,因为每次点击修改的时候都会将改属性值清空[编辑工具人] 
                tip:只有当input状态才会v-model,span状态是row的
                数据结构:
                  attr:{
                    attrName:'',
                    isEdit:false/true,
                    valueName:'', // 只是编辑的时候才有值
                  }
              -->
              <el-input
                placeholder="请输入属性值名称"
                :ref="$index"
                size="mini"
                v-model="attr.valueName"
                @blur="addAttrValue(row)"
                @keyup.enter.native="addAttrValue(row)"
                v-show="row.isEdit"
              />
              <!-- 🍟🍟.native - 监听组件根元素的原生事件。 -->
              <span
                style="display: block"
                @click="toEdit(row, $index)"
                v-show="!row.isEdit"
              >
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 删除编辑模式的某一个属性 -->
            <template v-slot="{ $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAttrInEdit($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 5.保存\取消 -->
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqGetAttrList, reqAddAttr, reqDeleteAttr } from '@api/attr'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      attrs: [], // 展示界面数据
      loading: false,
      isEdit: false, // 代表是否有进入编辑模式的
      attrValueList: [], // 属性值列表
      // 要收集的属性对象
      attr: {
        // id:0, // 属性名Id
        attrName: '', // 属性名称
        // attrValueList: [], // 属性值列表
        valueName: '', // 单个属性值
        categoryId: 0,
        categoryLevel: 3 //肯定是3级列表,想都不用想,因为只有3级确定了才可以进入编辑模式
      },
      isShowList: true,
      // 输入属性名表单校验规则
      rules: {
        attrName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      category1Id: (state) => state.category.category1Id,
      category2Id: (state) => state.category.category2Id,
      category3Id: (state) => state.category.category3Id
    })
  },
  watch: {
    // 3Id变化,重新请求数据
    category3Id() {
      this.getDate()
    },
    isShowList(newVal) {
      // 如果是取消推出编辑状态
      if (newVal === true) {
        this.toView()
      }
    }
  },
  methods: {
    // 点击取消按钮
    cancel() {
      this.isShowList = true
      this.isEdit = false
    },
    // 删除编辑input模式时候的框框
    deleteAttrInEdit(index) {
      this.attrValueList.splice(index, 1)
    },
    // 进入编辑模式的input的编辑模式
    toEdit(row, index) {
      if (this.isEdit) return
      row.isEdit = true
      this.isEdit = true
      // 进入编辑状态,将row的值赋值给工具人attr.attrValue
      this.attr.valueName = row.valueName
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 切换到视图(清空数据)
    toView() {
      // 清空保存的属性列表
      this.attrValueList = []
      // 清空attr
      this.attr = {
        attrName: '',
        attrValue: '',
        categoryId: 0,
        categoryLevel: 3
      }
    },
    // 失去焦点\enter键
    addAttrValue(row) {
      // 值不能为空
      const { valueName } = this.attr
      if (!valueName) {
        this.$message.warning('请输入属性值')
        return
      }

      /* 
        初始:[{valueName:'aaa'}]
        新增1:[{valueName:'aaa'},{ valueName:'aaa' }]
        新增2:[{valueName:'aaa'}]
        解释:如果数组找到2个,重复了
            找到1个,不重复
            即:先更新再判断
            思考:先判断再更新可不可以? --不好做
      */
      // 更新row的valueName[span状态显示的是row的valueName]
      row.valueName = valueName

      // 也不能重复[编辑状态的value在attr.valueName  保存的数据在this.valueNameList]
      const isRepeatCount = this.attrValueList.reduce((p, c) => {
        return p + (c.valueName === valueName ? 1 : 0)
      }, 0)
      if (isRepeatCount > 1) {
        this.$message.warning('属性值不可以重复')
        return
      }
      // 2.清空attr工具人的attrValue,等待下一次编辑
      this.attr.valueName = ''
      row.isEdit = false // 退出编辑状态,显示span
      this.isEdit = false
    },
    // 点击添加属性值
    showAttrValue() {
      if (this.isEdit) return
      // :每点击一次添加,向attrValueList添加一个对象,用于保存新添加的数据
      // :push方法返回值是数组的长度
      const length = this.attrValueList.push({ isEdit: true })
      // 进入编辑模式
      this.isEdit = true
      // 让输入框获取焦点[更新是异步的,所以要等dom]
      this.$nextTick(() => {
        // 让输入框获取焦点
        this.$refs[length - 1].focus()
      })
    },
    // 删除attr
    deleteAttr(id) {
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await reqDeleteAttr(id)
          this.$message.success('删除成功')
          this.getDate()
        })
        .catch((e) => {
          // console.log(e)
          this.$message('取消')
        })
    },
    // 改变attr
    changeAttr(row) {
      // console.log(row)
      this.isShowList = false
      // console.log(row)
      this.attr = {
        attrName: row.attrName,
        valueName: '',
        categoryId: 0,
        categoryLevel: 3,
        id: row.id
      }
      // this.attr=cloneDeep(row)
      // this.attrValueList = [...row.attrValueList]
      this.attrValueList = cloneDeep(row.attrValueList)
      // console.log(this.attr)
      // this.attrValueList.forEach((i) => {
      //   this.$set(i, 'isEdit', false)
      // })
    },
    // 获取data函数
    async getDate() {
      try {
        const { category1Id, category2Id, category3Id } = this
        // 如果c3Id没有值,不请求数据&清空列表
        if (!category3Id) {
          this.attrs = []
          return
        }
        const res = await reqGetAttrList({
          category1Id,
          category2Id,
          category3Id
        })
        this.attrs = res.data
      } catch (e) {
        this.$message.error('请求属性列表数据失败')
      }
    },
    // 点击保存
    async save() {
      // 1.检查是否输入属性值,属性值是否为空
      if (
        this.attrValueList.length === 0 ||
        this.attrValueList[0].valueName === undefined
      ) {
        this.$message.warning('请输入属性值')
        return
      }
      // 2.批量删除isEdit工具属性
      const attrValueList = this.attrValueList.map((i) => {
        // i.valueName = i.attrValue
        // delete i.attrValue
        delete i.isEdit
        return i
      })
      // 3.检查属性值是否重复&批量删除isEdit工具属性
      // .🍟🍟🍟🍟🍟[发现一个面试题]:如何快速判断一个数组是否有重复项
      const Prearr = this.attrValueList.map((i) => {
        return i.valueName
      })
      const AfterArr = [...new Set(Prearr)]
      if (Prearr.length !== AfterArr.length) {
        this.$message.warning('请不要输入重复的属性')
        return
      }

      const data = {
        attrName: this.attr.attrName,
        attrValueList,
        categoryId: this.category3Id,
        categoryLevel: 3,
        id: this.attr.id || ''
      }
      // console.log(data)
      const res = await reqAddAttr(data)
      this.$message.success('添加成功')
      this.isShowList = true // 跳转到显示界面
      this.toView() // 清空数据
      this.getDate() // 重新获取数据
    }
  }
}
</script>

<style lang="sass" scoped>
.attr-card
  margin-top: 10px
  // margin:10px 10px
.attr-table
  margin-top: 20px
  margin-bottom: 20px
.attr-tag
  margin-right: 10px
  margin-botton: 10px
</style>
