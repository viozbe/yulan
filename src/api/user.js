import { get, post, patch, put } from './http'
import Axios from 'axios'
//用户登录
export function userLogin(data) {
    return post('/web_user/login.do', data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//获取用户当前余额情况
export function getUserMoney(data, config = {}) {
    return post('/order/getResidemoney.do', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}