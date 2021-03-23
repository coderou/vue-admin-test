import request from '@/utils/request'

/*
  改造登录为真实接口

  api/user.js
    将接口改成真实接口
    info接口不需要额外参数
  utils/request.js
    请求拦截器 添加的参数是 token
    响应拦截器 响应code 20000和200都是成功
  vue.config.js
    proxy 去掉了端口号
    去掉mock的配置
  main.js
    去掉mock的配置
 */
// 1.登录
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 2.获取基本信息
export function getInfo() {
  return request({
    url: '/admin/acl/index/info',
    method: 'get'
  })
}
// 3.登出
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}

// 4.获取左侧侧边栏的api
export function getmenu() {
  return request({
    url: '/admin/acl/index/menu',
    method: 'get'
  })
}
