import { FormValues } from './data.d';
import { extend } from 'umi-request'
import { message } from 'antd'

// 拦截处理
const errorHandler = function (err: any) {
  if (err.response) {
    if (err.response.status > 400) {
      message.error(err.data.message ? err.data.message : err.data)
    }
  } else {
    message.error('Network Error')
  }
}

const extendRequest = extend({ errorHandler })


export const getRemoteList = async ({ page, per_page }) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users?page=${page}&per_page=${per_page}`, {
    method: 'get'
  })
    .then((res) => { return res })
    .catch(() => { return false })
}

export const editRecord = async ({ id, values }: { id: number, values: FormValues }) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'put',
    data: values
  })
    .then((res) => { return true })
    .catch(() => { return false })
}

export const deleteRecord = async (id: number) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'delete',
  })
    .then((res) => { return true })
    .catch(() => { return false })
}

export const addRecord = async ({ values }: { values: FormValues }) => {
  return extendRequest(`http://public-api-v1.aspirantzhang.com/users/`, {
    method: 'post',
    data: values
  })
    .then((res) => { return true })
    .catch(() => { return false })
}

