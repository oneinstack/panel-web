import request from '@/utils/axiosReq'

export function loginReq(data) {
  return request({
    url: '/users/login',
    data,
    method: 'post',
    bfLoading: false,
    isParams: false,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/users/profile',
    bfLoading: false,
    method: 'get',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
