import { get, post, patch, put } from './httpASP'

//窗帘审核订单数据
export function getCurtainOrders(data, config = {}) {
    return post('/CTM_ORDER/getCurtainOrders', data, config).then((res) => {
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
//我的订单数据
export function getAllOrders(data, config = {}) {
    return post('/CTM_ORDER/getAllOrders', data, config).then((res) => {
        if (res.code === 0 || res.success) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//订单提交，再次提交
export function orderSettlement(data, config = {}) {
    return post('/CTM_ORDER/orderSettlement', data, config).then((res) => {
        if (res.code === 0 || res.success) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//修改，退回，客户修改，审核通过
export function updateCurtainOrder(data, config = {}) {
    return post('/CTM_ORDER/updateCurtainOrder', data, config).then((res) => {
        if (res.code === 0 || res.success) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//插入操作记录
export function InsertOperationRecord(data, config = {}) {
    return post('/ORDER_OPERATION_RECORD/InsertModel', data, config).then((res) => {
        if (res.code === 0 || res.success) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
//获得拼接好的操作记录
export function getOperationRecord(data, config = {}) {
    return post('/ORDER_OPERATION_RECORD/getOperationRecord', data, config).then((res) => {
        if (res.code === 0 || res.success) {
            return Promise.resolve(res);
        }
        else {
            return Promise.reject(res);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}