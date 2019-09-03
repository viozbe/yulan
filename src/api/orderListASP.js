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
//窗帘订单提交，再次提交
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
//墙纸和软装的订单提交
export function normalOrderSettlement(data, config = {}) {
    return post('/CTM_ORDER/normalOrderSettlement', data, config).then((res) => {
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
//作废订单
export function cancelOrderNew(data, config = {}) {
    return post('/CTM_ORDER/cancelOrder', data, config).then((res) => {
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
//优惠券使用记录
export function getUseRecord(data, config = {}) {
    return post('/SAL_REBATE_CERTIFICATE_RECORD/getUseRecord', data, config).then((res) => {
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
//使用记录汇总
export function getTotalRecordSum(data, config = {}) {
    return post('/SAL_REBATE_CERTIFICATE_RECORD/getTotalRecordSum', data, config).then((res) => {
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
//复制购物车数据
export function copyCartItem(data, config = {}) {
    return post('/COMMODITY_ORDER/copyCartItem', data, config).then((res) => {
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
//获得ITEM
export function getItemById(data, config = {}) {
    return post('/ITEM/getItemById', data, config).then((res) => {
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
//根据客户id查询客户
export function getCustomerInfo(data, config = {}) {
    return post('/CUSTOMER/getCustomerInfo', data, config).then((res) => {
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
//出货详情
export function getPackDetailInfo(data, config = {}) {
    return post('/PACK_DETAIL/getPackDetailInfo', data, config).then((res) => {
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