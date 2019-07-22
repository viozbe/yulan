import { get, post, patch, put} from './http'

//获取单个墙纸信息
export function getShopsWallPaperMsg(data){
    return post('/item/getWallpaperInfo.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//获取窗帘分页的信息
export function getCurtainMsg(data){
    return post('/item/getCurtainType.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//窗帘的模糊搜索
export function getShopSingleCurtain(data){
    return post('/item/getCurtainBySearch.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//获取全部软装的信息（分产品类型）
export function getShopsAllSoftSuitMsg(data){
    return post('/item/getSoftDecorationInfo.do',data).then((res) => {
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
//软装单个产品的模糊查询
export function getShopsSingleSoftSuit(data){
    return post('/item/getSoftInfoSingle.do',data).then((res) =>{
        return Promise.resolve(res);
    }).catch((err) =>{
        return Promise.reject(err);
    })
}
