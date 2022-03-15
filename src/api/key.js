import request from '@/utils/axiosReq'
import exp from 'constants'

export function keyListReq(data) {
  return request({
    url: '/configs/keys',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function keyCreateReq(data) {
  return request({
    url: '/configs/keys',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function keyDeleteBatchReq(id) {
  return request({
    url: `/configs/keys/${id}`,
    method: 'delete',
    bfLoading: true
  })
}

export function keyUpdateReq(id, data) {
    return request({
        url: `/configs/keys/${id}`,
        method: 'put',
        data,
        bfLoading: true,
    })
}