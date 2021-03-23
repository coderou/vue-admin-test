import request from "@/utils/request";

// 1.获取SPU列表
export const reqGetSpuList = ({ page, limit, category3Id }) => {
  return request({
    method: "GET",
    url: `/admin/product/${page}/${limit}`,
    params: {
      // query参数
      category3Id
    }
  });
};

// 2.获取基础销售属性列表
export const reqGetBaseSaleAttrList = () => {
  return request({
    method: "GET",
    url: `/admin/product/baseSaleAttrList`
  });
};
