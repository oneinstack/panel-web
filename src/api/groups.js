import request from '@/utils/axiosReq'

export function groupListReq(data) {
  return request({
    url: '/groups',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function groupCreateReq(data) {
  return request({
    url: '/groups',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function groupUpdateReq(id,data) {
  return request({
    url: `/groups/${id}`,
    method: 'put',
    data,
    bfLoading: true,
  })
}

export function groupDeleteBatchReq(id) {
  return request({
    url: `/groups/${id}`,
    method: 'delete',
    bfLoading: true
  })
}
