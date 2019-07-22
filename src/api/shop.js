import { get, post, patch, put} from './http'
import Axios from 'axios'

//获取用户的购物车信息
export function getUserMarket(data){
    return Axios.get('/cart/getAllCartByCID.do',{
        params: data
    }).then(res =>{
        return Promise.resolve(res);
    }).catch(err =>{
        console.log(err);
    })
}
//添加入购物车
export function addShoppingCar(data){
    return Axios.post('/cart/addCartItem.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//修改购物车信息
export function updateShoppingCar(data){
    return post('/cart/updateCartItem.do',data).then((res)=>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//修改购物车墙纸、软装产品价格(电商类)
export function updateShopPrice(data){
    return post('/cart/alterCommodityPrice.do',data).then((res)=>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
