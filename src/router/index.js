import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import WallPaper from '@/components/shops/wallPaper'
import Curtain from '@/components/shops/curtain'
import SoftSuit from '@/components/shops/softSuit'
import BankProof from '@/components/bankProof'
import painting from '@/components/painting'
import yulanPainting from '@/components/yulanPainting'
import DeputeBrush from '@/components/deputeBrush'
import DownloadSpace from '@/components/downloadSpace'
import MarketInfo from '@/components/marketInfo'
import RefundCompensation from '@/components/refundCompensation'
import Statement from '@/components/statement'
import Shopping from '@/components/shoppingCar/shopping'
import MyOrder from '@/components/order/myOrder'
import ImageShop from '@/components/design/imageShop'
import LanJu from '@/components/design/lanJu'
import DetailWallPaper from '@/components/detail/detailWallPaper'
import DetailCurtain from '@/components/detail/detailCurtain'
import DetailSoftSuit from '@/components/detail/detailSoftSuit'
import ShoppingCurtainDetail from '@/components/shops/shoppingCurtainDetail'
import orderDetail from '@/components/order/orderDetail'
import payment from '@/components/order/payment'
import checkOrder from '@/components/order/checkOrder'
import mycomplaint from '@/components/order/mycomplaint'
import complaintResult from '@/components/order/complaintResult'
import logistics from '@/components/order/logistics'
import shipment from '@/components/order/shipment'
import examine from '@/components/order/examine'
import ExamineDetail from '@/components/order/examineDetail'
import checkExamine from '@/components/order/checkExamine'
import myCoupon from '@/components/center/myCoupon'
import DetailRefund from '@/components/detail/detailRefund'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      redirect: '/shops/wallPaper',
      children: [{
        path: '/shops/curtain',
        name: 'curtain',
        component: Curtain,
        meta:{
          keepAlive: true
        }
      },{
        path: '/shops/wallPaper',
        name: 'wallPaper',
        component: WallPaper,
        meta:{
          keepAlive: true
        }
      },{
        path: '/shops/softSuit',
        name: 'softSuit',
        component: SoftSuit,
        meta:{
          keepAlive: true
        }
      },{
        path: '/shops/shoppingCurtainDetail',
        name: 'shoppingCurtainDetail',
        component: ShoppingCurtainDetail
      },{
        path: '/bankProof',
        name: 'bankProof',
        component: BankProof
      },{
        path: '/painting',
        name: 'painting',
        component: painting
      },{
        path: '/yulanPainting',
        name: 'yulanPainting',
        component: yulanPainting
      },{
        path: '/deputeBrush',
        name: 'deputeBrush',
        component: DeputeBrush
      },{
        path: '/downloadSpace',
        name: 'downloadSpace',
        component: DownloadSpace
      },{
        path: '/marketInfo',
        name: 'marketInfo',
        component: MarketInfo
      },{
        path: '/refundCompensation',
        name: 'refundCompensation',
        component: RefundCompensation,
        meta:{
          keepAlive: true
        }
      },{
        path: '/detail/detailRefund',
        name: 'detailRefund',
        component: DetailRefund
      },{
        path: '/statement',
        name: 'statement',
        component: Statement,
      },{
        path: '/shoppingCar/shopping',
        name: 'shopping',
        component: Shopping
      },{
        path: '/detail/detailCurtain',
        name: 'detailCurtain',
        component: DetailCurtain
      },{
        path: '/detail/detailSoftSuit',
        name: 'detailSoftSuit',
        component: DetailSoftSuit
      },{
        path: '/detail/detailWallPaper',
        name: 'detailWallPaper',
        component: DetailWallPaper
      },{
        path: '/order/myOrder',
        name: 'myOrder',
        component: MyOrder,
        meta:{
          keepAlive: true
        }
      },{
        path: '/design/imageShop',
        name: 'imageShop',
        component: ImageShop
      },{
        path: '/design/lanJu',
        name: 'lanJu',
        component: LanJu
      },{
        path: '/order/mycomplaint',
        name: 'mycomplaint',
        component: mycomplaint
      },{
        path: '/order/complaintResult',
        name: 'complaintResult',
        component: complaintResult
      },{
        path: '/order/orderDetail',
        name: 'orderDetail',
        component: orderDetail
      },{
        path: '/order/examine',
        name: 'examine',
        component: examine,
        meta:{
          keepAlive: true
        }
      },{
        path: '/order/examineDetail',
        name: 'examineDetail',
        component: ExamineDetail
      },{
        path: '/order/checkExamine',
        name: 'checkExamine',
        component: checkExamine
      },{
        path: '/order/payment',
        name: 'payment',
        component: payment
      },{
        path: '/order/checkOrder',
        name: 'checkOrder',
        component: checkOrder
      },{
        path: '/order/logistics',
        name: 'logistics',
        component: logistics
      },{
        path: '/order/shipment',
        name: 'shipment',
        component: shipment
      },{
        path: '/myZone/myCoupon',
        name: 'MyCoupon',
        component: myCoupon
      }]
    }
  ]
})

import Cookies from 'js-cookie'
//路由守卫
router.beforeEach( (to, from, next) => {
  console.log(to.meta.keepAlive)
  if ( !Cookies.get('cid') && !Cookies.get('customerType') && to.name != 'login') {
    next('/login')
  } else {
    next();
  }
})

export default router;
