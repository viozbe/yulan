import { get, post, patch, put } from './httpASP'

//通过productType和授权的仓库查询物料
export function GetItemByProductType(data, config = {}) {
    return post('/ITEM/GetItemByProductType', data, config).then((res) => {
        if (res.code === 0 || res.success) {//放到外面判断，有些返回不会返回是否成功，直接返回数据
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//根据userid查询仓库权限
export function GetStockByUser(data, config = {}) {
    return post('/STOCK_USER/GetStockByUser', data, config).then((res) => {
        if (res.code === 0 || res.success) {//放到外面判断，有些返回不会返回是否成功，直接返回数据
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}