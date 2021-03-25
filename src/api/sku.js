import request from '@/utils/request'

// 1.添加sku
export const reqAddSku = (data) => {
  return request({
    method: 'post',
    url: `/admin/product/saveSkuInfo`,
    data
  })
}

// 2.
