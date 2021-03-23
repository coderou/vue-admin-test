import request from '@/utils/request'

export const reqGetCategory1List = () => {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'GET'
  })
}
export const reqGetCategory2List = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'GET'
  })
}
export const reqGetCategory3List = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'GET'
  })
}
