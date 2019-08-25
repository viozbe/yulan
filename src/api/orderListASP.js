import { get, post, patch, put } from './httpASP'

export function getCurtainOrders(data, config = {}) {
    return post('/CTM_ORDER/getCurtainOrders', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export function getAllOrders(data, config = {}) {
    return post('/CTM_ORDER/getAllOrders', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export function orderSettlement(data, config = {}) {
    return post('/CTM_ORDER/orderSettlement', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export function updateCurtainOrder(data, config = {}) {
    return post('/CTM_ORDER/updateCurtainOrder', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export function InsertOperationRecord(data, config = {}) {
    return post('/ORDER_OPERATION_RECORD/InsertModel', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}
export function getOperationRecord(data, config = {}) {
    return post('/ORDER_OPERATION_RECORD/getOperationRecord', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}