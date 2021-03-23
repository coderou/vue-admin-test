import request from '@/utils/request'

export const reqGetAttrList = ({ category1Id, category2Id, category3Id }) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET'
  })
}
export const reqAddAttr = (data) => {
  return request({
    url: `/admin/product/saveAttrInfo`,
    method: 'POST',
    data
  })
}
export const reqDeleteAttr = (attrId) => {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'DELETE',
  })
}
