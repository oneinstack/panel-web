import request from '@/utils/axiosReq'

export function deployListReq(data) {
  return request({
    url: '/deploy/orders',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function deployCreateReq(data) {
  return request({
    url: '/deploy/orders',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function deployDeleteBatchReq(id,data) {
  return request({
    url: `/deploy/orders/${id}`,
    data,
    method: 'delete',
    bfLoading: true
  })
}

export function deployUpdateReq(id,data) {
  return request({
    url: `/deploys/${id}`,
    data,
    method: 'put',
    bfLoading: true
  })
}
