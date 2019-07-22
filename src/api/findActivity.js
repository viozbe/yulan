import { get, post, patch, put} from './http'
import Axios from 'axios'

//查询产品对应活动
export function findItemActivity(data){
    return Axios.get('/salPromotion/selectSalPromotion.do',{
        params: data
    }).then(res =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//通过活动号查询活动
export function getActivityFromName(data){
    return Axios.get('/activityGroupType/getActivityGroupTypeByName.do',{
        params: data
    }).then(res =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//根据商品ID查询活动
export function getActivityById(data){
    return Axios.get('/salPromotion/getSalPromotionByID.do',{
        params: data
    }).then(res =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//通过产品ID查询分组信息
export function getGroupById(data){
    return Axios.get('/productGroupType/getProductGroupTypeByName.do',{
        params: data
    }).then(res =>{
        return Promise.resolve(res.data);
    }).catch(err =>{
        return Promise.reject(err);
    });
}
//根据活动号数组查询活动名
export function getActivityByList(data){
    return Axios({
        method: 'post',
        url: '/salPromotion/getSalPromotionsByIDs.do',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>{
        return Promise.resolve(res.data);
    }).catch((err) =>{
        return Promise.reject(err);
    })
    // return Axios.post('/salPromotion/getSalPromotionsByIDs.do', data).then(res =>{
    //     return Promise.resolve(res.data);
    // }).catch((err) =>{
    //     return Promise.reject(err);
    // })
}