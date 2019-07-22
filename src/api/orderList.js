import { get, post, patch, put} from './http'
import Axios from 'axios'

//获取订单列表 
export function getOrderlist(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//增加收货地址
export function addAddress(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//编辑收货地址
export function editAddress(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//删除收货地址
export function deleteAddress(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//结算订单
export function submitOrder(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//活动总价
export function activityPrice(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//查询用户优惠券
export function searchTickets(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//查询余额
export function queryCash(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//经办人查询
export function querycharge(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


//使用优惠券
export function usetheCoupon(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//订单作废
export function cancelOrder(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


//重新提交
export function payAgain(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


//获取提货单
export function getShipment(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//管理优惠券
export function manageCoupon(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//查看使用记录
export function CouponUseRecord(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//查看返利记录
export function CouponbackRecord(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//提交订单后删除购物车信息
/* export function DeleteShopRecord(url1,data1){
    return post(url1,data1).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
} */



export function DeleteShopRecord(data){
    return Axios({
    method: 'post',
    url: '/commodity/alterCommodityStatus.do',
    data: data,
    headers: {
    'Content-Type': 'application/json'
    }
    }).then(res =>{
    return Promise.resolve(res.data);
    }).catch((err) =>{
    return Promise.reject(err);
    })
}

export function passExamine(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//订单详情新接口
export function orderDetail(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//审核人员获取订单
export function getExamineOrder(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//窗帘提交审核【妈耶没想到这里是另一个接口】
export function curtainPay(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//玉兰退回或修改
export function defeatChange(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


//任务查询
export function searchAssignments(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//对账单查询
export function checkBill(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//对账单详细信息
export function billDetail(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//对账单用户反馈
export function userReturn(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


//
export function statementDetail(url,data){
    return post(url,data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}


