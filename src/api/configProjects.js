import request from '@/utils/axiosReq'

export function projectsConfigListReq(params) {
  return request({
    url: '/configs/projects',
    method: 'get',
    isParams: true,
    data: params,
    bfLoading: true,
  })
}

export function projectsConfigCreateReq(data) {
  return request({
    url: '/configs/projects',
    method: 'post',
    data,
    bfLoading: true,
  })
}

export function projectsConfigDeleteBatchReq(id) {
  return request({
    url: `/configs/projects/${id}`,
    method: 'delete',
    bfLoading: true
  })
}

export function projectsConfigUpdateReq(id, data) {
    return request({
        url: `/configs/projects/${id}`,
        method: 'put',
        data,
        bfLoading: true,
    })
}