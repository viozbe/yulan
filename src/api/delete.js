import { get, post, patch, put} from './http'

//删除选中的商品(同一组)
export function deleteItems(data){
    return post('/cart/deleteCommodities.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//删除一整组的商品
export function deleteGroup(data){
    return post('/cart/deleteCartItems.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}