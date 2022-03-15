import request from '@/utils/axiosReq'

export function envsGetReq(params) {
  return axiosReq({
    url: '/envs',
    method: 'get',
    isParams: true,
    data: params,
    bfLoading: true,
  })
}


export function envCreateReq(data) {
  return axiosReq({
    url: '/envs',
    method: 'post',
    data,
    bfLoading: true,
  })
}


export function envDeleteBatchReq(id) {
  return request({
    url: `/envs/${id}`,
    method: 'delete',
    bfLoading: true
  })
}

export function envUpdateReq(id,data) {
  return request({
    url: `/envs/${id}`,
    data,
    method: 'put',
    bfLoading: true
  })
}