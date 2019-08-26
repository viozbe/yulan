import Axios from 'axios'

//var baseUrl = 'http://localhost:49438/';
var baseUrl = 'http://47.107.56.156:568/';

/**
 * 封装get方法
 * @param url 
 * @param params 
 * @returns {Promise} 
 */
export function get(url, params = {}, config = {}) {
    Axios.defaults.withCredentials = false;
    return new Promise((resolve, reject) => {
        Axios.get(baseUrl + url, {
            params: params,
        }, config)
            .then(response => {
                Axios.defaults.withCredentials = true;
                resolve(response.data);
            })
            .catch(err => {
                Axios.defaults.withCredentials = true;
                reject(err)
            })
    })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
    Axios.defaults.withCredentials = false;
    return new Promise((resolve, reject) => {
        Axios.post(baseUrl + url, data, config)
            .then(response => {
                Axios.defaults.withCredentials = true;
                resolve(response.data);
            })
            .catch(error => {
                Axios.defaults.withCredentials = true;
                reject(error);
            })
    })
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}, config = {}) {
    Axios.defaults.withCredentials = false;
    return new Promise((resolve, reject) => {
        Axios.patch(baseUrl + url, data, config)
            .then(response => {
                Axios.defaults.withCredentials = true;
                resolve(response.data);
            })
            .catch(error => {
                Axios.defaults.withCredentials = true;
                reject(error);
            })
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}, config = {}) {
    Axios.defaults.withCredentials = false;
    return new Promise((resolve, reject) => {
        Axios.put(baseUrl + url, data, config)
            .then(response => {
                Axios.defaults.withCredentials = true;
                resolve(response.data);
            }, err => {
                Axios.defaults.withCredentials = true;
                reject(err)
            })
    })
}