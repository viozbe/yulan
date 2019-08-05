import { get, post, patch, put} from './http'
import Axios from 'axios'

export function getCurtainOrders(data){
    return post('/CTM_ORDER/getCurtainOrders',data,'ASP').then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
export function orderSettlement(data){
    return post('/CTM_ORDER/orderSettlement',data,'ASP').then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}