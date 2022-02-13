import store from '@/store'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getToken, setToken } from '@/utils/auth'
let reqConfig
let loadingE

const service = axios.create()
// request
service.interceptors.request.use(
  (req) => {
    // token setting
    req.headers['Authorization'] = getToken()
    /* download file*/
    if (req.isDownLoadFile) {
      req.responseType = 'blob'
    }
    /* upload file*/
    if (req.isUploadFile) {
      req.headers['Content-Type'] = 'multipart/form-data'
    }
    if (req.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: '数据载入中',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    /*
     *params会拼接到url上,such as  "a=1&b=2"
     * */
    if (req.isParams) {
      req.params = req.data
      req.data = {}
    }
    //save req for res to using
    reqConfig = req
    return req
  },
  (err) => {
    Promise.reject(err)
  }
)
//response
service.interceptors.response.use(
  (res) => {
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // direct return, when download file
    if (reqConfig.isDownLoadFile) {
      return res
    }
    // const {  code, isNeedUpdateToken, updateToken } = res.data
    //update token
    // if (isNeedUpdateToken) {
    //   setToken(updateToken)
    // }
    const code= res.status
    const successCode = '200,201,202,203,204'
    if (successCode.includes(code)) {
      //业务成功处理
      return res.data
    }
  },
  (err) => {
    // console.log("err---->: ",err)
    // console.log("err.response?.status---->: ",err.response?.status)
    // console.log("err.response?.data.message---->: ",err.response?.data.message)
    /*http错误处理，处理跨域，404，401，500*/
    if (loadingE) loadingE.close()
    ElMessage({
      message: err.response?.data.message,
      type: 'error',
      duration: 2 * 1000
    })
    //如果是跨域
    //Network Error,cross origin
    let errObj = {
      msg: err.toString(),
      reqUrl: reqConfig.baseURL + reqConfig.url,
      params: reqConfig.isParams ? reqConfig.params : reqConfig.data
    }
    return Promise.reject(JSON.stringify(errObj))
  }
)

export function axiosReq({
  url,
  data,
  method,
  isParams,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg
}) {
  return service({
    url: url,
    method: method ?? 'get',
    data: data ?? {},
    isParams: isParams ?? false,
    bfLoading: bfLoading ?? true,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg ?? true,
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL, // 设置基本基础url
    timeout: timeout ?? 15000 // 配置默认超时时间
  })
}
export default axiosReq
