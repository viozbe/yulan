import Axios from 'axios'

const CODE_OK = 0;
Axios.defaults.baseURL = 'http://14.29.223.114:10250/yulan-order';
//Axios.defaults.baseURL = 'http://106.14.159.244:8080/yulan-capital';
Axios.defaults.withCredentials = true;
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
/* 添加一个请求拦截器
Axios.interceptors.request.use(function (config) {  
    if(config.method=="post" || config.method=="put"){
        config.data=qs.stringify(config.data);
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
*/

/**
 * 封装get方法
 * @param url 
 * @param params 
 * @returns {Promise} 
 */
export function get(url,params={}){
    return new Promise((resolve,reject) => {
        Axios.get(url,{
            params:params
        })
        .then(response => {
            if(response.data.code === CODE_OK){
                resolve(response.data);
            }
            else{
                reject(response.data);
            }
        })
        .catch(err => {
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
export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        Axios.post(url,data)
        .then(response => {
            if(response.data.code === CODE_OK){
                resolve(response.data);
            }
            else{
                reject(response.data);
            }
        })
        .catch( error => {
            reject(error);
        })
        // ,err => {
        //         reject(err)
        //     })
    })
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url,data = {}){
    return new Promise((resolve,reject) => {
        Axios.patch(url,data)
        .then(response => {
            if(response.data.code === CODE_OK){
                resolve(response.data);
            }
            else{
                reject(response.data);
            }
        })
        .catch(error => {
            reject(error);
        })
            // ,err => {
            //     reject(err)
            // })
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url,data = {}){
    return new Promise((resolve,reject) => {
        Axios.put(url,data)
            .then(response => {
                if(response.data.code === CODE_OK){
                    resolve(response.data);
                }
                else{
                    reject(response.data);
                }
            },err => {
                reject(err)
            })
    })
}