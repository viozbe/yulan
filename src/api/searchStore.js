import { get, post, patch, put} from './http'
import Axios from 'axios'

//获取对应墙纸的库存
export function getWallPaperStore(data){
    return post('/item/getStockShow.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//加入购物车时的库存判断
export function checkStore(data){
    return post('/item/judgeStockShow.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}