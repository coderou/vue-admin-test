<template>
  <el-card class="card" v-show="isShowList === 1">
    <el-form ref="spuForm" :model="spuForm" :rules="rules" label-width="80px">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input
          placeholder="请输入SPU名称"
          v-model="spuForm.spuName"
        ></el-input>
      </el-form-item>
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
      <el-form-item label="SPU描述" prop="description">
        <el-input
          v-model="spuForm.description"
          type="textarea"
          :rows="2"
          placeholder="请输入SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
        <!--
          1. 限制上传图片大小的类型
            :before-upload="beforeAvatarUpload"
          2. 限制上传图片的数量
            :limit="3" 限制数量
            :disabled="spuForm.spuImageList.length >= 3" 禁用按钮
              当上传图片达到最大时，禁用按钮会禁用删除功能
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
          :file-list="formatSpuImageList"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :limit="MAX_IMAGE_LENGTH"
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
      <el-form-item label="销售属性">
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
        <el-button
          class="add-btn"
          type="primary"
          icon="el-icon-plus"
          :disabled="!spuForm.selectedSaleAttrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >

        <el-table
          class="table"
          :data="spuSaleAttrList"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column width="150" label="属性名" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值列表" prop="spuSaleAttrValueList">
            <template v-slot="{ row, $index }">
              <el-tag
                style="margin-right: 10px"
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.saleAttrValueName"
                closable
                @close="delAttrValue(row, index)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>

              <el-button
                v-show="!row.isEdit"
                size="mini"
                icon="el-icon-plus"
                @click="showEditAttrValue(row, $index)"
                >添加</el-button
              >
              <el-input
                :ref="$index"
                style="width: 100px"
                v-show="row.isEdit"
                size="mini"
                @blur="addAttrValue(row)"
                @keyup.enter.native="addAttrValue(row)"
                v-model="spuForm.attrValue"
                placeholder="添加属性值"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-tooltip
                content="删除销售属性"
                placement="bottom"
                effect="light"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delAttr($index)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { reqGetAllTrademarkList } from "@api/trademark";
import {
  reqGetBaseSaleAttrList,
  reqSaveSaleAttr,
  reqUpdateSaleAttr,
  reqGetSpuImageList,
  reqGetSpuSaleAttrList,
} from "@api/spu";

export default {
  name: "AddOrUpdateSpu",
  props: ["isShowList"],
  data() {
    return {
      imaList: [],
      // 全局进入编辑模式的标识
      isEdit: false,
      MAX_IMAGE_LENGTH: 10,
      // 基础销售属性
      baseSaleAttrList: [
        // {
        //   id: 0,
        //   name: "xxx",
        // },
      ],
      // 正在选择的基础销售属性列表
      // selectedSaleAttrList: [],
      // 销售属性和销售属性值列表
      spuSaleAttrList: [
        // {
        //   saleAttrName: "xxxx",
        //   spuSaleAttrValueList: [
        //     {
        //       baseSaleAttrId: 1,
        //       saleAttrValueName: "xxxx",
        //     },
        //   ],
        // },
      ],
      // 所有品牌数据
      trademarkList: [],

      // 收集表单数据
      spuForm: {
        spuName: "",
        tmId: "",
        description: "",
        spuImageList: [
          // {
          //   imgName: '',
          //   imageUrl: ''
          // }
        ],
        selectedSaleAttrId: "", // 选中的销售属性
        attrValue: "", // 正在输入属性值
      },
      spu: {},
      // 校验表单的规则
      rules: {
        spuName: [
          { required: true, message: "请输入SPU名称", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请选择品牌" }],
        description: [
          { required: true, message: "请输入SPU描述", trigger: "blur" },
        ],
        spuImageList: [{ required: true, validator: this.validator }],
      },
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    ...mapState({
      category3Id: (state) => state.category.category3Id,
    }),
    saleAttrTip() {
      const { length } = this.selectedSaleAttrList;
      return length === 0 ? "没有啦~~~" : `还剩${length}个销售属性`;
    },
    formatSpuImageList() {
      console.log(this.spuForm.spuImageList);
      return this.spuForm.spuImageList.map((image) => {
        return {
          uid: image.id,
          name: image.imgName,
          url: image.imgUrl,
        };
      });
    },

    selectedSaleAttrList() {
      // selectedSaleAttrList要展示数据，应该是baseSaleAttrList所有数据，去掉spuSaleAttrList
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        return !this.spuSaleAttrList.some(
          (saleAttr) => saleAttr.baseSaleAttrId === baseSaleAttr.id
        );
      });
    },
  },
  methods: {
    cancel() {
      this.reset_data();
      this.$emit("update:isShowList", 0);
    },
    receiveSpuData(spu) {
      this.spu = spu;
      // 请求图片列表和销售属性列表
      Promise.all([reqGetSpuImageList(spu.id), reqGetSpuSaleAttrList(spu.id)])
        .then((res) => {
          console.log("--------");
          console.log(res);
          this.spuSaleAttrList = res[1].data;
          res[0].data.forEach((i) => {
            i.uid = i.id;
            delete i.id;
          });
          this.spuForm = {
            id: spu.id, // 只有修改操作才有id
            spuName: spu.spuName,
            tmId: spu.tmId,
            description: spu.tmId,
            spuImageList: res[0].data,
            selectedSaleAttrId: "", // 选中的销售属性
            attrValue: "", // 正在输入属性值
          };
        })
        .catch(() => {
          this.$message.error("获取数据列表失败");
        });
    },
    // 删除整行销售属性
    delAttr(index) {
      // 得到要删除的当前行数据
      this.spuSaleAttrList.splice(index, 1);

      // 计算属性已经做好了
      // const [spuSaleAttr] = this.spuSaleAttrList.splice(index, 1);
      // const { saleAttrName } = spuSaleAttr;
      // 找到原数组对应的销售属性数据（因为只有原数据才有id）
      // const saleAttr = this.baseSaleAttrList.find(
      //   (baseSaleAttr) => baseSaleAttr.name === saleAttrName
      // );
      // 添加到选择的数组中
      // this.selectedSaleAttrList.push(saleAttr);
    },
    // 删除单个销售属性值
    delAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 显示编辑
    showEditAttrValue(row, index) {
      if (this.isEdit) {
        this.$message.info("请先编辑未完成属性值");
        return;
      }
      row.isEdit = true;
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 添加销售属性值
    addAttrValue(row) {
      const attrValue = this.spuForm.attrValue.trim();
      // 不能为空
      if (!attrValue) {
        row.isEdit = false;
        this.isEdit = false;
        return;
      }

      // 遍历函数返回是true，some返回就是true，所有false才是false
      const isRepeat = row.spuSaleAttrValueList.some((saleAttrValue) => {
        return saleAttrValue.saleAttrValueName === attrValue;
      });

      // 不能重复
      if (isRepeat) {
        this.$message.warning("输入的属性值不能重复");
        return;
      }

      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: attrValue,
      });
      row.isEdit = false;
      this.spuForm.attrValue = "";
      this.isEdit = false;
    },
    // 添加销售属性
    addSaleAttr() {
      /*
        将现在选中的销售属性 spuForm.selectedSaleAttrId 从列表 selectedSaleAttrList 中移除
        将现在选中的销售属性 spuForm.selectedSaleAttrId 添加到table中显示 spuSaleAttrList
        将 spuForm.selectedSaleAttrId 变成 空
     */
      const { selectedSaleAttrId } = this.spuForm;

      let selectedSaleAttr;

      this.selectedSaleAttrList = this.selectedSaleAttrList.filter(
        (saleAttr) => {
          if (saleAttr.id !== selectedSaleAttrId) {
            return true;
          }

          selectedSaleAttr = saleAttr;
          return false;
        }
      );

      this.spuSaleAttrList.push({
        baseSaleAttrId: selectedSaleAttr.id,
        saleAttrName: selectedSaleAttr.name, // 属性名
        spuSaleAttrValueList: [], // 属性值列表
        isEdit: false, // 代表是否在编辑模式
      });

      this.spuForm.selectedSaleAttrId = "";
    },
    addOrUpdateSpu() {
      this.$refs.spuForm.validate(async (status) => {
        if (status) {
          // 收集数据
          const { tmId, spuName, description, spuImageList, id } = this.spuForm;
          const { category3Id, spuSaleAttrList } = this;

          /*
            {
            "category3Id": 0,
            "description": "string",
            "id": 0,
            "spuImageList": [
              {
                "id": 0,
                "imgName": "string",
                "imgUrl": "string",
                "spuId": 0
              }
            ],
          "spuName": "string",
          "spuSaleAttrList": [
            {
              "baseSaleAttrId": 0,
              "id": 0,
              "saleAttrName": "string",
              "spuId": 0,
              "spuSaleAttrValueList": [
                {
                  "baseSaleAttrId": 0,
                  "id": 0,
                  "isChecked": "string",
                  "saleAttrName": "string",
                  "saleAttrValueName": "string",
                  "spuId": 0
                }
              ]
            }
          ],
          "tmId": 0
        }
          */
          try {
            if (id) {
              // 更新
              await reqUpdateSaleAttr({
                id,
                tmId,
                spuName,
                description,
                spuImageList,
                category3Id,
                spuSaleAttrList,
              });
            } else {
              // 添加数据
              await reqSaveSaleAttr({
                tmId,
                spuName,
                description,
                spuImageList,
                category3Id,
                spuSaleAttrList,
              });
            }

            // 清空数据
            this.reset_data();

            this.$message.success(`${id ? "更新" : "添加"}SPU成功`);

            this.$emit("update:isShowList", 0);
          } catch {
            this.$message.error("添加SPU失败");
          }
        }
      });
    },
    // 清空表单数据
    reset_data() {
      this.$refs.spuForm.clearValidate();
      this.spuForm = {
        id: "",
        spuName: "",
        tmId: "",
        description: "",
        spuImageList: [
          // {
          //   imgName: '',
          //   imageUrl: ''
          // }
        ],
        selectedSaleAttrId: "", // 选中的销售属性
        attrValue: "", // 正在输入属性值
      };

      this.spuSaleAttrList = [];
    },
    validator(rule, value, callback) {
      if (value.length >= 1) {
        callback();
        return;
      }
      callback("请上传至少一张图片");
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除图片
    handleRemove(file) {
      // console.log(file); // 删除的文件
      // 通过删除的文件的属性,找到其对应的数组中的下标
      let index = this.spuForm.spuImageList.findIndex((image) => {
        return image.imgUrl !== file.url;
      });
      // 获取图片的数组
      const imgList = this.spuForm.spuImageList;
      // 强行使用Array的方法删除
      Array.prototype.splice.call(imgList, index, 1);
        console.log(this.spuForm.spuImageList);
      // 图片列表
      // this.spuForm.spuImageList.splice(index, 1);
      // this.spuForm.spuImageList.length = this.spuForm.spuImageList.length - 1;

      /*
        似乎必须绕开底层的一些重写的数组方法,用类似:[1,2,3]  [1,empty,3] [1,3,empty] ,[1,3] 的数组方法才可以,如果lodash没有,那就只能自己写了
      */

      // let arr = [...this.spuForm.spuImageList];
      // arr.splice(index, 1);
      // arr[index] = null;
      // this.spuForm.spuImageList = arr;

      //
      // this.spuForm.spuImageList = this.spuForm.spuImageList.filter(
      //   (image) => image.imgUrl !== file.url
      // );
      // this.spuForm.spuImageList
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res 上传成功的响应
      // console.log(res, file);
      if (res.code === 200) {
        const obj = {
          spuId: this.spu.id,
          uid: file.uid,
          imgUrl: res.data,
          imgName: file.name,
        };
        // push方法被Vue底层重写,因为数据是响应式的,会导致图片添加进去之前的呈现删除动画,因为底层是用到了=号赋值,就会调用底层的set,更新响应式
        // 只要绕不开底层的等号,绕不开数据劫持,就会导致这个问题
        // 解决方法是直接通过.操作符访问数组中的某个对象,强行更新数据,绕过对数组的监视
        // this.spuForm.spuImageList.push({
        //   // 加上uid，防止上传图片闪现
        //   spuId: this.spu.id,
        //   uid: file.uid,
        //   imgUrl: res.data,
        //   imgName: file.name,
        // });
        const length = this.spuForm.spuImageList.length;
        this.spuForm.spuImageList[length] = obj;
        console.log(this.spuForm.spuImageList);
        return;
      }

      this.$message.error("上传图片失败~");
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const imagesWhiteList = ["image/jpg", "image/jpeg", "image/png"];
      console.log(file);
      // 判断图片的类型
      const isImageOK = imagesWhiteList.indexOf(file.type) > -1;
      // 判断图片的大小
      const isLt = file.size / 1024 < 500;

      if (!isImageOK) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 500KB!");
      }

      // 返回 true 才 ok
      // 返回 false 不 ok
      return isImageOK && isLt;
    },
  },
  async mounted() {
    this.$bus.$on("receiveSpuData", this.receiveSpuData);

    try {
      // Promise.all 方法特点：所有都成功，才成功，只要有一个失败就失败
      const resArr = await Promise.all([
        reqGetAllTrademarkList(),
        reqGetBaseSaleAttrList(),
      ]);

      this.trademarkList = resArr[0].data;
      this.baseSaleAttrList = resArr[1].data;
      // selectedSaleAttrList要展示数据，应该是baseSaleAttrList所有数据，去掉spuSaleAttrList
      // this.selectedSaleAttrList = resArr[1].data;
    } catch {
      this.$message.error("获取数据失败，请刷新试试~");
    }
    // Promise.allSettled 方法特点：不管成功或失败，都会返回一个成功的Promise对象，并且包含成功和失败的结果
    // const res2 = await Promise.allSettled([
    //   reqGetAllTrademarkList(),
    //   reqGetBaseSaleAttrList(),
    // ]);
  },
};
</script>

<style lang="sass" scoped>
.card
  margin: 10px
.table
  margin-top: 10px
.add-btn
  margin-left: 10px
</style>
