import request from '@/utils/axiosReq'
import exp from 'constants'

export function projectsListReq(params) {
  return request({
    url: '/groups/projects',
    method: 'get',
    isParams: true,
    data: params,
    bfLoading: true,
  })
}

export function projectsSearchReq(id) {
  return request({
    url: `/groups/projects/${id}`,
    method: 'get',
    bfLoading: true,
  })
}

export function projectsCreateReq(data) {
  return request({
    url: '/groups/projects',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function projectsDeleteBatchReq(id) {
  return request({
    url: `/groups/projects/${id}`,
    method: 'delete',
    bfLoading: true
  })
}

export function projectsUpdateReq(id, data) {
    return request({
        url: `/groups/projects/${id}`,
        method: 'put',
        data,
        bfLoading: true,
    })
}