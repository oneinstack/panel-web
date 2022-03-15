import request from '@/utils/axiosReq'

export function userListReq(data) {
  return request({
    url: '/users',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function userCreateReq(data) {
  return request({
    url: '/users',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function userDeleteBatchReq(data) {
  return request({
    url: `/users`,
    data,
    method: 'delete',
    bfLoading: true
  })
}

export function loginReq(data) {
  return request({
    url: '/users/login',
    data,
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

export function getuserParamReq() {
  return request({
    url: `/users/param`,
    method: 'get'
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

export function userUpdateInfoReq(data) {
  return request({
    url: '/users/profile',
    data,
    method: 'put',
    bfLoading: true
  })
}

export function userUpdateStatusBatchReq(data) {
  return request({
    url: '/users/status',
    data,
    method: 'put',
    bfLoading: true
  })
}

export function userUpdateTokenReq() {
  return request({
    url: `/users/token`,
    method: 'put'
  })
}

export function userDetailReq(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function userUpdateReq(id,data) {
  return request({
    url: `/users/${id}`,
    data,
    method: 'put',
    bfLoading: true
  })
}

export function userDeleteReq(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete',
    bfLoading: true
  })
}