import request from '@/utils/axiosReq'
import exp from 'constants'

export function globalListReq(data) {
  return request({
    url: '/configs/globals',
    method: 'get',
    isParams: true,
    data: data,
    bfLoading: true,
  })
}

export function globalCreateReq(data) {
  return request({
    url: '/configs/globals',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function globalDeleteBatchReq(id) {
  return request({
    url: `/configs/globals/${id}`,
    method: 'delete',
    bfLoading: true
  })
}

export function globalUpdateReq(id, data) {
    return request({
        url: `/configs/globals/${id}`,
        method: 'put',
        data,
        bfLoading: true,
    })
}