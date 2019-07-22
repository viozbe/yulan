import { get, post, patch, put} from './http'
import Axios from 'axios'

const baseUrl = 'http://106.14.159.244:8080/yulan-capital';

//通过cid查询用户基本信息
export function getSaleManData(data){
    return Axios.get(baseUrl+'/customer/getSimpleCustomerByID.do',{
        params: data
    }).then((res) =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//通过itemNo获取产品基本信息
export function getProductData(data){
    return Axios.get(baseUrl+'/simpleItem/getSimpleItemByItemNo.do',{
        params: data
    }).then((res) =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

//创建赔偿确认书
export function addRefund(data){
    return post(baseUrl+'/returnCompensationBill/addReturnCompensationBill.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//条件查询客户所有赔偿确认书
export function getAllRefund(data){
    return get(baseUrl+'/returnCompensationBill/getReturnCompensationBills.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//编号查询特定的赔偿确认书
export function getRefundById(data){
    return get(baseUrl+'/returnCompensationBill/getReturnCompensationBillByID.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//删除某个赔偿确认书(内部人员)
export function deleteRefund(data){
    return post(baseUrl+'/returnCompensationBill/deleteReturnCompensationBill.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//修改赔偿书的内容(内部人员)
export function updateRefund(data){
    return post(baseUrl+'/returnCompensationBill/updateReturnCompensationBill.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//修改赔偿书的状态(客户)
export function updataRefundStatus(data){
    return post(baseUrl+'/returnCompensationBill/updateReturnCompensationBillState.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}