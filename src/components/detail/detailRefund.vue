<template>
    <div id="detailRefund" class="rel">
        <el-card shadow="hover">
            <div id="printTable" class="f16" style="width: 1064px; border:1px solid #000; margin: -1px;">
                <h3 class="mt5 tc rel">
                    客户确认书【{{getNameByState(baseData.state)}}】
                    <i v-if="baseData.state === 'APPROVED' || (baseData.state === 'CANCELED' && identity === 'SALEMAN')"
                        class="icon-print el-icon-printer cpoi"
                        @click="printRefund"></i>
                </h3>
                <br>
                <p class="ovh">
                    <el-button class="l" size="small">重要文件</el-button>
                    <a v-if="baseData.method === 'edit' || (baseData.method === 'new' && item.length !== 0)"
                        @click="updateOrDelete(1)" class="r cpoi">
                        <i :class="[(item.length===0)?'el-icon-error error-icon':'el-icon-success success-icon']">
                            {{judgeOpa}}
                        </i>
                    </a>
                    <a v-else-if="baseData.method === 'see' && baseData.state === 'CUSTOMERAFFIRM' && baseData.cid === cid">
                        <i @click="userOperation(0)" class="el-icon-error error-icon r cpoi mr10">不同意</i>
                        <i @click="userOperation(1)" class="el-icon-success success-icon r cpoi mr10">同意</i>
                    </a>
                </p>
                <section class="mt10">
                    <p class="uli">TO：{{baseData.cname}}</p>
                    <p class="t-indent">我公司现收到以下拟申请退货产品，经调查、检测核实，作如下处理：</p>
                </section>
                <el-table id="refundTable" stripe
                    :data="item" class="border-t border-b"
                    style="width: 100%;">
                    <el-table-column
                        prop="productionVersion"
                        label="产品/项目">
                    </el-table-column>
                    <el-table-column
                        prop="itemNo"
                        label="型号">
                    </el-table-column>
                    <el-table-column
                        prop="unit"
                        label="单位">
                    </el-table-column>
                    <el-table-column
                        prop="qty"
                        align="right"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        prop="totalmoney"
                        align="right"
                        label="金额">
                    </el-table-column>
                    <el-table-column
                        prop="notes"
                        label="质量问题">
                    </el-table-column>
                    <el-table-column
                        prop="process"
                        label="处理意见">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        v-if="baseData.method !== 'see' && baseData.erpCreator === cid">
                        <template slot-scope="scope">
                            <i class="el-icon-close cpoi" @click="deleteItem(scope.$index)"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <table id="moneyTable" border="0" style="width: 100%;" v-if="item.length > 0">
                    <tr>
                        <td width="12.5%">金额（小写）</td>
                        <td width="50%" class="tr">{{totalMoney}}</td>
                        <td :width="(baseData.method === 'see')?'25%':'37.5%'" rowspan="2"></td>
                    </tr>
                    <tr>
                        <td width="12.5%">金额（大写）</td>
                        <td width="50%" class="tr">{{totalMoneyUpper}}</td>
                    </tr>
                </table>
                <section class="f14">
                    <p @click="addItem" class="tc f16 p20 cpoi border-b p-click" v-if="baseData.method !== 'see'">
                        添加退换货品
                        <i class="el-icon-circle-plus success-icon f24 r"></i>
                    </p>
                    <section class="t-dec" style="padding:10px 0 10px 40px;">
                        注意：1、若您未在我公司发出的《客户确认书》之日起15日内确认、提出异议的，则视为放弃赔偿权利<br>
                        2、玉兰公司支付的退货金额，仅限于本确认书的金额，不承担其他费用；<br>
                        3、请您仔细阅读本确认书相关信息，一旦确认，视为同意我公司的处理本方案。<br>
                        公司名称：广东玉兰集团股份有限公司&emsp;&emsp;&emsp;&emsp;地址：东莞市莞城莞龙路段狮龙路莞城科技园内<br>
                        电话:0769-23321708&emsp;&emsp;邮政编码:523119&emsp;&emsp;&emsp;&emsp;&emsp;邮箱：yulan315@yulangroup.cn<br>
                    </section>
                    <section class="tc ovh">
                        <div class="t-com dib border-r l">
                            广东玉兰集团股份有限公司<br>
                            市场部<br>
                            {{new Date(baseData.createTs).getFullYear()}}年
                            {{addZeroIfNeed(new Date(baseData.createTs).getMonth()+1)}}月
                            {{addZeroIfNeed(new Date(baseData.createTs).getDate())}}日
                        </div>
                        <div class="t-com dib r">
                            经销商
                            <span v-if="baseData.state === 'APPROVED'">:{{baseData.cname}}</span><br>
                            （盖章）<br>
                            <span v-if="baseData.state !== 'APPROVED'"> 年 月 日</span>
                            <span v-else>
                                {{new Date(baseData.reassureTs).getFullYear()}}年
                                {{addZeroIfNeed(new Date(baseData.reassureTs).getMonth()+1)}}月
                                {{addZeroIfNeed(new Date(baseData.reassureTs).getDate())}}日
                            </span>
                        </div>
                    </section>
                    <section class="t-foot border-t tr">
                        <span v-if="baseData.method !== 'new'">编号：{{baseData.id}}</span>
                        <span>确认人：{{baseData.erpCreatorname}}</span>
                        <span>建立时间：{{toLocaleTime}}&emsp;</span>
                    </section>
                </section>
            </div>
            <div class="tc mt20">
                <el-button v-if="baseData.method !== 'see'"
                    type="danger" 
                    style="margin-right: 20px;" 
                    width="130px"
                    :disabled="item.length === 0"
                    @click.native="updateOrDelete(0)">
                    保存修改
                </el-button>
                <el-button type="info" style="margin-left: 20px;" width="130px"
                    @click.native="returnBack">
                    返回
                </el-button>
            </div>
        </el-card>
        <el-dialog title="填写货品信息"
            width="500px"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form label-width="100px" :model="itemMsg">
                <el-form-item label="型号">
                    <el-input style="width:300px;" v-model="itemMsg.itemNo" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品/项目">
                    <el-input style="width:300px;" v-model="itemMsg.productionVersion" readonly></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input style="width:300px;" v-model="itemMsg.unit" readonly></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <currency-input
                        v-model="itemMsg.qty"
                        :placeholder="''"
                        :customStyle="'width: 300px; height: 40px;'">
                    </currency-input>
                </el-form-item>
                <el-form-item label="金额">
                    <currency-input
                        v-model="itemMsg.totalmoney"
                        :placeholder="''"
                        :customStyle="'width: 300px; height: 40px;'">
                    </currency-input>
                </el-form-item>
                <el-form-item label="质量问题">
                    <el-input style="width:300px;" v-model="itemMsg.notes"></el-input>
                </el-form-item>
                <el-form-item label="处理意见">
                    <el-select v-model="itemMsg.process" placeholder="请选择处理意见">
                        <el-option label="赔偿" value="赔偿"></el-option>
                        <el-option label="退货" value="退货"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="tc">
                <el-button @click="saveDialog" type="success">保 存</el-button>
                <el-button @click="closeDialog" type="danger">放 弃</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import print from 'print-js'
import '@/assets/css/base.css'
import {
    digitUppercase
} from '@/common/js/money.js'
import {
    toLocale
} from '@/common/js/date.js'
import {
    getSaleManData,
    getProductData,
    addRefund,
    getRefundById,
    deleteRefund,
    updataRefundStatus,
    updateRefund
} from '@/api/refund'
import Cookies from 'js-cookie'
import { mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
    name: 'detailRefund',
    data(){
        return{
            cid: Cookies.get('cid'),
            identity: Cookies.get('identity'),
            baseData: {},       //存放赔偿的详细数据
            //商品表格
            item: [], 
            dialogFormVisible: false,   //是否打开弹框
            //商品信息
            itemMsg:{
                itemNo: '',            //当前商品的型号
                productionVersion: '', //商品的型号
                unit: '',              //商品单位
                qty: '',               //商品数量
                totalmoney: '',        //总金额
                notes: '',             //备注
                process: ''            //处理意见：赔偿/退货
            }
        }
    },
    methods:{
        //页面初始化
        async init(){
            let method = this.baseData.method
            if(method !== 'new'){
                let obj = { id: this.baseData.id }
                console.log(obj);
                let _data = await getRefundById(obj)
                _data.method = method
                _data.rtcbItems.forEach(item =>{
                    if(item.unit === '°ü')  item.unit = '包'
                })
                this.baseData = _data
                this.item = _data.rtcbItems
                console.log(this.baseData)
            }
            else{
                this.baseData.erpCreatorname = Cookies.get('realName')
                if(!this.baseData.createTs){
                    this.baseData.createTs = new Date().getTime()
                    sessionStorage.setItem('refund',JSON.stringify(this.baseData))
                }
            }
        },
        //添加退货商品
        addItem(){
            this.$prompt('请输入完整型号：','货品信息',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({value}) =>{
                getProductData({ itemNo: value }).then(res =>{
                    if(res.code === 1){ throw 'cannot get message' }
                    this.clearItemMsg()
                    this.itemMsg.itemNo = res.itemNo
                    this.itemMsg.productionVersion = res.productVersionName
                    this.itemMsg.unit = (res.unit === '°ü')?'包':res.unit
                    this.dialogFormVisible = true
                }).catch(err =>{
                    this.$alert(`${value}--未查询到货品信息`,'提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).catch(() =>{})
                })
            }).catch(() =>{})
        },
        //保存货品信息表
        saveDialog(){
            let key = Object.values(this.itemMsg)
            let property = ['型号','产品','单位','数量','金额','质量问题','处理意见']
            let tip = ''
            for(let i = 0; i < key.length; i++){
                if(key[i] === ''){
                    (tip!=='')?tip+=`、${property[i]}`: tip+=`${property[i]}`
                }
            }
            if(tip !== ''){
                this.$alert(`请确保该表单的 ${tip} 已经输入！`,'提示',{
                    type: 'warning',
                    confirmButtonText: '好的'
                }).catch(() =>{})
                return
            }
            //插入
            this.item.push(this.itemMsg)
            this.dialogFormVisible = false
            this.clearItemMsg()
        },
        //关闭货品信息表
        closeDialog(){
            this.dialogFormVisible = false
            this.clearItemMsg()
        },
        //删除表格单项商品
        deleteItem(index){
            this.item.splice(index,1)
        },
        //清空货品信息表
        clearItemMsg(){
            this.itemMsg = {
                itemNo: '',
                productionVersion: '',
                unit: '',
                qty: '',
                totalmoney: '',
                notes: '',
                process: ''
            }
        },
        //返回退货赔偿页面
        returnBack(){
            this.closeToTab({
                oldUrl: 'detail/detailRefund',
                newUrl: 'refundCompensation'
            });
        },
        //提交或者删除确认书
        updateOrDelete(status){
            //判断商品个数,0--删除，!0--提交
            if(this.item.length === 0){
                let obj = {
                    id: this.baseData.id
                }
                deleteRefund(obj).then(res =>{
                    this.$alert('删除成功','提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).then(() =>{
                        this.returnBack()
                    }).catch(() =>{
                        this.returnBack()
                    })
                }).catch(err =>{
                    this.$alert('删除失败','提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).catch(() =>{})
                })
            }
            else{
                let _rcbItems = this.item
                _rcbItems.forEach((item,index) =>{
                    item.itemIndex = index + 1
                })
                let obj = this.baseData
                obj.sendbackReason = null
                obj.itemCount = _rcbItems.length
                obj.itemMaxIndex = _rcbItems.length
                obj.rtcbItems = _rcbItems
                //new--新建
                if(this.baseData.method === 'new'){
                    addRefund(obj).then(res =>{
                        if(status === 1){
                            obj.id = res.data
                            obj.state = 'CUSTOMERAFFIRM'
                            updateRefund(obj).then(res =>{
                                this.$alert('提交成功','提示',{
                                    type: 'success',
                                    confirmButtonText: '好的'
                                }).then(res =>{
                                    this.returnBack()
                                }).catch(err =>{
                                    this.returnBack()
                                })
                            }).catch(() =>{
                                throw '提交失败'
                            })
                        }
                        else{
                            this.$alert('添加成功','提示',{
                                type: 'success',
                                confirmButtonText: '好的'
                            }).then(res =>{
                                this.returnBack()
                            }).catch(err =>{
                                this.returnBack()
                            })
                        }
                    }).catch(err =>{
                        this.$alert('添加失败','提示',{
                            type: 'warning',
                            confirmButtonText: '好的'
                        }).catch(() =>{})
                    })
                }
                //edit--修改
                else if(this.baseData.method === 'edit'){
                    //status：1--提交，0--保存
                    let tipWord = ''
                    if(status === 1){
                        tipWord = '提交',
                        obj.state = 'CUSTOMERAFFIRM'
                    }
                    else {
                        tipWord = '保存'
                    }
                    updateRefund(obj).then(res =>{
                        this.$alert(`${tipWord}成功`,'提示',{
                            type: 'success',
                            confirmButtonText: '好的'
                        }).then(res =>{
                            this.returnBack()
                        }).catch(err =>{
                            this.returnBack()
                        })
                    }).catch(err =>{
                        this.$alert('删除失败','提示',{
                            type: 'warning',
                            confirmButtonText: '好的'
                        }).catch(() =>{})
                    })
                }
            }
        },
        //用户选择是否用意
        userOperation(flag){
            //1--同意 0--不同意
            let obj = {
                id: this.baseData.id,
                state: (flag)?'APPROVED':'CANCELED'
            }
            updataRefundStatus(obj).then(res =>{
                //成功后，调用查询接口，重新覆盖渲染
                getRefundById({
                    id: this.baseData.id
                }).then(async res =>{
                    this.baseData = res
                    this.baseData.method = 'see'
                    this.releaseBadge('refund')
                    this.init()
                }).catch(err =>{
                    this.$alert('加载失败，返回原先页面','提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).then(() =>{
                        this.returnBack()
                    }).catch(() =>{
                        this.returnBack()
                    })
                })
            }).catch(err =>{
                this.$alert('加载失败，返回原先页面','提示',{
                    type: 'warning',
                    confirmButtonText: '好的'
                }).then(() =>{
                    this.returnBack()
                }).catch(() =>{
                    this.returnBack()
                })
            })
        },
        //执行打印操作
        printRefund(){
            printJS({
                printable: 'printTable', 
                type: 'html', 
                maxWidth: 1300,
                headerStyle: 'margin: -2px;',
                targetStyles: ['*']
            })
        },
        //给小于10的数字加前缀
        addZeroIfNeed(num){
            if(num < 10){
                return '0'+num
            }
            return num
        },
        //通过状态返回中文名称
        getNameByState(state){
            switch(state){
                case 'APPROVED':
                    return '客户同意'
                case 'ONCREATE':
                    return '处理中'
                case 'CANCELED':
                    return '客户不同意'
                case 'CUSTOMERAFFIRM':
                    return '客户确认中'
                default:
                    return ''
            }
        },
        ...mapMutations('navTabs', [
            'addTab'
        ]),
        ...mapMutations('badge',[
            'addBadge',
            'releaseBadge'
        ]),
        ...mapActions('navTabs',[
            'closeTab',
            'closeToTab'
        ]),
    },
    computed:{
        //判断此时确认书可以提交还是删除-->处理中
        judgeOpa:function(){
            return (this.item.length === 0)?'删除':'提交'
        },
        //返回特定格式的时间戳
        toLocaleTime:function(){
            return toLocale(this.baseData.createTs)
        },
        //返回总金额
        totalMoney:function(){
            let total = 0
            this.item.forEach(_item =>{
                total += Number(_item.totalmoney)
            })
            return total
        },
        //返回大写形式的总金额
        totalMoneyUpper:function(){
            return digitUppercase(this.totalMoney)
        }
    },
    created(){
        this.baseData = JSON.parse(sessionStorage.getItem('refund'))
        this.init()
    }
}
</script>

<style>
#detailRefund .el-card{
    color: #000;
}
#refundTable td,#refundTable th{
    border-right: 1px solid #000;
    border-bottom:1px solid #000!important;
}
#refundTable tr>td:last-child, #refundTable tr>th:nth-last-child(2){
    border-right: none;
}
#detailRefund .el-dialog__body{
    padding: 5px 0;
}
</style>

<style scoped>
@page { size: landscape; }
p{ margin: 5px 0; }
.success-icon{color: #279e25; }
.error-icon{ color: crimson; }
.uli{ text-decoration: underline; }
.t-indent{ text-indent: 2.5em; }
.border-t{ border-top: 1px solid #000; }
.border-b{ border-bottom: 1px solid #000; }
.border-r{ border-right: 1px solid #000; }
.p20{ padding: 10px 0; }
.mb10{ margin-bottom: 10px; }
.mr40{ margin-right: 40px; }
.p-click{
    position: relative;
    bottom: 3px;
}
.icon-print{
    position: absolute;
    right: 5px;
    top: 0px;
    font-size: 25px;
    color: gray;
}
.t-dec{
    padding: 5px;
    border-bottom: 1px solid #000;
    line-height: 20px;
}
.t-com{
    width: 50%;
    padding: 20px 0;
    margin: -1px;
}
.t-foot>span{
    display: inline-block;
    padding: 10px 0 10px 30px;
}
#moneyTable{ border-spacing:0!important }
#moneyTable td{
    font-size: 14px;
    padding: 10px;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
}
#moneyTable>tr:nth-child(1)>td:last-child{
    border-right: none;
}

</style>