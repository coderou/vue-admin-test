<template>
  <!-- 写元素属性的时候,默认值不写就是true inline:横向排列-->
  <el-card class="category-selector">
    <el-form inline class="category-selector-form">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择分类"
          :value="category1Id"
          @change="getCategory2List"
          :disabled="disabled"
        >
          <!-- 
            tip:value是select收集到的数据
            label 是展示的内容
           -->
          <el-option
            v-for="c1 in category1List"
            :label="c1.name"
            :key="c1.id"
            :value="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择分类"
          :value="category2Id"
          @change="getCategory3List"
          :disabled="disabled"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择分类"
          :value="category3Id"
          @change="setCategory3Id"
          :disabled="disabled"
        >
          <el-option
            v-for="c3 in category3List"
            :label="c3.name"
            :key="c3.id"
            :value="c3.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'CategorySelector',
  props: {
    disabled: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      // 选中的分配Id
      category1Id: (state) => state.category.category1Id,
      category2Id: (state) => state.category.category2Id,
      category3Id: (state) => state.category.category3Id,
      // 展示的分类列表
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List
    })
  },
  methods: {
    ...mapActions([
      'category/getCategory1List',
      'category/getCategory2List',
      'category/getCategory3List'
    ]),
    ...mapMutations(['category/SET_CATEGORY3ID']),
    getCategory2List(c1Id) {
      this['category/getCategory2List'](c1Id)
    },
    getCategory3List(c2Id) {
      this['category/getCategory3List'](c2Id)
    },
    setCategory3Id(c3Id) {
      this['category/SET_CATEGORY3ID'](c3Id)
    }
  },
  mounted() {
    this['category/getCategory1List']()
    // this.$store.dispatch('category/getCategory1List')
  }
}
</script>

<style lang="sass" scoped>
.category-selector
  padding: 20px 10px 5px
.category-selector-form
  margin: 10px 0 -5px
</style>
