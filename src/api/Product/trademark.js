import request from '@/utils/request'

export function reqGetTradmark(page, num) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${num}`,
    method: 'get'
  })
}
// 2.添加Trademark/修改Trademark
export function reqAddTradmark(logoUrl, tmName) {
  // return request.post(
  //   '/admin/product/baseTrademark/save',
  //   trademark
  // )
  return request({
    url: `/admin/product/baseTrademark/save`,
    method: 'POST',
    data: {
      logoUrl,
      tmName
    }
  })
}
// 3.修改
export function reqUpdateTradmark({ id, logoUrl, tmName }) {
  return request({
    url: `/admin/product/baseTrademark/update`,
    method: 'PUT',
    data: {
      id,
      logoUrl,
      tmName
    }
  })
}
// 4.删除
export function reqDeletTradmark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
