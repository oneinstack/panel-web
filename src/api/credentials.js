import request from '@/utils/axiosReq'

export function credentialListReq(data) {
  return request({
    url: '/credentials',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function credentialCreateReq(data) {
  return request({
    url: '/credentials',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function credentialDeleteBatchReq(data) {
  return request({
    url: `/credentials`,
    data,
    method: 'delete',
    bfLoading: true
  })
}

export function credentialUpdateReq(id,data) {
  return request({
    url: `/credentials/${id}`,
    data,
    method: 'put',
    bfLoading: true
  })
}
