import request from '@/utils/request'

// 1.获取SPU列表
export const reqGetSpuList = ({ page, limit, category3Id }) => {
  return request({
    method: 'GET',
    url: `/admin/product/${page}/${limit}`,
    params: {
      // query参数
      category3Id
    }
  })
}

// 2.获取基础销售属性列表
export const reqGetBaseSaleAttrList = () => {
  return request({
    method: 'GET',
    url: `/admin/product/baseSaleAttrList`
  })
}
// 3.保存新的Spu
export const reqSetNewAttr = (data) => {
  return request({
    method: 'POST',
    url: `/admin/product/saveSpuInfo`,
    data
  })
}
// 3.1更新Spu
export const reqUpdateNewAttr = (data) => {
  return request({
    method: 'POST',
    url: `/admin/product/updateSpuInfo`,
    data
  })
}
// 3.删除SPU
export const reqDeleteSpu = (spuId) => {
  return request({
    method: 'DELETE',
    url: `/admin/product/deleteSpu/${spuId}`
  })
}

// 4.根据SPUID获取最新的spu信息
export const reqGetSpu = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/getSpuById/${spuId}`
  })
}
// 5.根据SPUID获取最新的spu信息
export const reqGetSpuImageList = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/spuImageList/${spuId}`
  })
}

// 5.获取图片列表
// export const reqGetSpuImageList = spuId => {
//   return request({
//     method: "GET",
//     url: `/admin/product/spuImageList/${spuId}`
//   });
// };

// 6.获取销售属性列表数据
export const reqGetSpuSaleAttrList = spuId => {
  return request({
    method: "GET",
    url: `/admin/product/spuSaleAttrList/${spuId}`
  });
};