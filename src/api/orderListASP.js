import { get, post, patch, put} from './httpASP'

export function getCurtainOrders(data){
    return post('/CTM_ORDER/getCurtainOrders',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
export function getAllOrders(data){
    return post('/CTM_ORDER/getAllOrders',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
export function orderSettlement(data){
    return post('/CTM_ORDER/orderSettlement',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}

export function updateCurtainOrder(data){
    return post('/CTM_ORDER/updateCurtainOrder',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}