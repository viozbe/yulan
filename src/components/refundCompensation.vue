<template>
    <div>
        <el-card shadow="hover">
            <div slot="header">
                <span class="fstrong f16">退款赔偿</span>
            </div>
            <div>
                <div class="search">
                    <span>建立日期:</span>
                    <el-date-picker value-format="yyyy-MM-dd"
                        style="width: 14%;"
                        v-model="dateFrom"
                        type="date"
                        placeholder="日期区间">
                    </el-date-picker>
                    <span style="width: 15px;">至</span>
                    <el-date-picker value-format="yyyy-MM-dd"
                        style="width: 14%;"
                        v-model="dateTo"
                        type="date"
                        placeholder="日期区间">
                    </el-date-picker>
                    <el-select
                        style="width: 14%;"
                        class="ml5 mr5" 
                        v-model="chooseState" 
                        placeholder="请选择">
                        <el-option
                            v-for="item in (identity==='SALEMAN')?stateOptionSaleman:stateOptionEcweb"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="success" @click.native="clickSearch">查 询</el-button>
                    <el-button type="warning" @click.native="resetSearch">重 置</el-button>
                    <el-button type="primary" @click.native="insertRefund" v-if="identity==='SALEMAN'" class="fr">新 建</el-button>
                </div>
                <div class="search" v-if="identity === 'SALEMAN'">
                    <span>型号：</span>
                    <el-input clearable
                        style="width: 14%;" 
                        v-model="itemNo" 
                        placeholder="产品型号">
                    </el-input>
                    <span>客户名：</span>
                    <el-input clearable 
                        style="width: 14%;"
                        v-model="cname" 
                        placeholder="客户名">
                    </el-input>
                    <span>创建人：</span>
                    <el-input clearable
                        style="width: 14%;"  
                        v-model="erpCreatorname" 
                        placeholder="创建人">
                    </el-input>
                </div>
                <el-table border
                    :row-class-name="tableRowClassName"
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        label="编号"
                        prop="id">
                    </el-table-column>
                    <el-table-column
                        min-width="130"
                        label="创建时间">
                        <template slot-scope="scope">
                            {{toLocale(scope.row.createTs)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="identity === 'SALEMAN'"
                        label="客户名称"
                        prop="cname">
                    </el-table-column>
                    <el-table-column
                        v-if="identity === 'ECWEB'"
                        label="玉兰业务员"
                        prop="erpCreatorname">
                    </el-table-column>
                    <el-table-column
                        label="货品数"
                        prop="itemCount">
                    </el-table-column>
                    <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            {{getNameByState(scope.row.state)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="identity === 'SALEMAN'"
                        label="创建人"
                        prop="erpCreatorname">
                    </el-table-column>
                    <el-table-column
                        min-width="90"
                        label="操作">
                        <template slot-scope="scope">
                            <el-tooltip content="查看" placement="top">
                                <el-button circle style="padding: 7px;"
                                    @click="toDetail(scope.row,'see')"
                                    type="warning" 
                                    icon="el-icon-search">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                v-if="scope.row.state === 'CUSTOMERAFFIRM' && scope.row.erpCreator === cid"
                                content="撤回" 
                                placement="top">
                                <el-button circle style="padding: 7px;"
                                    @click="returnBack(scope.row,'back')"
                                    type="info"
                                    icon="el-icon-back">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                v-if="scope.row.state === 'ONCREATE' && scope.row.erpCreator === cid"
                                content="编辑" 
                                placement="top">
                                <el-button circle style="padding: 7px;"
                                    @click="toDetail(scope.row,'edit')" 
                                    type="primary" 
                                    icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip 
                                v-if="scope.row.state === 'ONCREATE' && scope.row.erpCreator === cid && scope.row.itemCount === 0"
                                content="删除" 
                                placement="top">
                                <el-button circle style="padding: 7px;"
                                    @click="returnBack(scope.row,'delete')" 
                                    type="danger" 
                                    icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="identity === 'SALEMAN'"
                        label="打印标记"
                        prop="printed">
                        <template slot-scope="scope">
                            <el-checkbox 
                                v-if="scope.row.state === 'APPROVED' || scope.row.state === 'CANCELED'"
                                @change="changePrinted(scope.row,scope.$index)"
                                v-model="scope.row.printed">
                                {{(scope.row.printed === false)?'未打印':'已打印'}}
                            </el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="width: 100%;" 
                    class="dib tc"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="allNum">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import '@/assets/css/base.css'
import {
    getSaleManData,
    getProductData,
    addRefund,
    getAllRefund,
    getRefundById,
    deleteRefund,
    updataRefundStatus,
    updateRefund,
    updatePrinted
} from '@/api/refund'
import { mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
    name: 'RefundCompensation',
    data(){
        return{
            cid: Cookies.get('cid'),  //用户ID
            customerType: Cookies.get('customerType'),  //客户类型
            identity: Cookies.get('identity'),          //客户身份
            pageSize: 10,       //每页的条数
            currentPage: 1,     //当前页数
            dateFrom: '',       //时间搜索--起
            dateTo: '',         //时间搜索--止
            //状态搜索
            stateOptionSaleman:[
                { value: null, label: '全部状态'},
                { value: 'ONCREATE', label: '处理中' },
                { value: 'CUSTOMERAFFIRM', label: '客户确认中' },
                { value: 'APPROVED', label: '客户同意' },
                { value: 'CANCELED', label: '客户不同意' }
            ],
            stateOptionEcweb:[
                { value: 'CUSTOMERAFFIRM', label: '客户确认中' },
                { value: 'APPROVED', label: '客户同意' },
                { value: 'CANCELED', label: '客户不同意' }
            ],
            chooseState: null,      //选中的状态
            itemNo: '',             //型号
            cname: '',              //客户名
            erpCreatorname: '',     //创建人名
            tableData: [],          //表格数据
            allNum: 0,              //表格总共有几条数据
        }
    },
    methods:{
        //初始化最新一周时间
        initDate(){
            let to = new Date()
            let from = new Date(to.getTime() - 7*24*60*60*1000)
            this.dateFrom = from.getFullYear()+'-'+this.addZeroIfNeed(from.getMonth()+1)+'-'+this.addZeroIfNeed(from.getDate())
            this.dateTo = to.getFullYear()+'-'+this.addZeroIfNeed(to.getMonth()+1)+'-'+this.addZeroIfNeed(to.getDate())
        },
        //展开搜索
        clickSearch(){
            this.currentPage = 1
            this.searchRefund()
        },
        //初始化角标
        async initBadge(){
            let _refund = await getAllRefund({
                CID: this.cid,
                page: 1,
                number: 1,
                state: 'CUSTOMERAFFIRM'
            })
            this.changeBadge({
                name: 'refund',
                index: _refund.count
            })
        },
        //按条件搜索
        searchRefund(){
            let obj = {
                CID: (this.identity === 'SALEMAN')?'':this.cid,          //客户ID
                page: this.currentPage, //第几页
                number: this.pageSize,  //一页有多少数据
                startDate: this.dateFrom,   //开始日期
                endDate: this.dateTo,       //结束日期
                state: this.chooseState,    //状态
                createName: this.erpCreatorname,    //创建者名称
                cName: this.cname,          //客户名称
                itemNo: this.itemNo         //产品号
            }
            let filter = this.$options.filters['propertyFilter']
            getAllRefund(filter(obj)).then(res =>{
                this.tableData = res.data
                this.tableData.forEach(item =>{
                    item.printed = (item.printed === '0')?true:false
                })
                this.allNum = res.count
            }).catch(err =>{
                this.tableData = []
                this.allNum = 0
            })
        },
        //新建确认书
        insertRefund(){
            this.$prompt('请输入客户编号：','客户信息',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                let obj = {
                    CID: value
                }
                getSaleManData(obj).then(res =>{
                    if(res.code === 1){
                        this.$alert('没有找到该用户','提示',{
                            type: 'warning',
                            confirmButtonText: '好的'
                        }).catch(() =>{
                            return
                        })
                    }
                    else{
                        this.$confirm(`客户编号：${res.customerCode}<br>
                            客户名称：${res.shortName}<br>
                            联系人：${res.customerAgent}<br>
                            联系电话：${res.officeTel}`,'提示',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            dangerouslyUseHTMLString: true  //支持HTML注入
                        }).then(async confirmRes =>{
                            let erp = await getSaleManData({CID: this.cid})
                            let obj = {
                                erpCreator: this.cid,   //创建人id
                                erpCreatorname: erp.shortName,     //创建人名称
                                cid: value,             //客户id
                                cname: res.shortName,   //客户名称
                                state: 'ONCREATE',      //状态同属确认中
                            }
                            this.toDetail(obj,'new')
                        }).catch(err =>{})
                    }
                }).catch(err =>{
                    console.log(err);
                })
            }).catch(() => {})
        },
        //进入确认书页面--修改/查看/新建
        toDetail(data,method){
            let _data = data
            _data.method = method
            sessionStorage.setItem('refund',JSON.stringify(_data))
            this.addTab('detail/detailRefund')
        },
        //撤回/删除确认书
        returnBack(data,method){
            if(data.erpCreator !== this.cid){
                this.$alert('您不是此确认书的创建人，无权利进行此操作','提示',{
                    type: 'warning',
                    confirmButtonText: '好的'
                }).catch(() =>{})
            }
            if(method === 'back'){
                let obj = {
                    id: data.id,
                    state: 'ONCREATE'
                }
                updataRefundStatus(obj).then(res =>{
                    this.$alert('撤回成功','提示',{
                        type: 'success',
                        confirmButtonText: '好的'
                    }).then(() =>{
                        this.searchRefund()
                    }).catch(() =>{})
                }).catch(err =>{
                    this.$alert('撤回失败','提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).catch(() =>{})
                })
            }
            else if(method === 'delete'){
                deleteRefund({
                    id: data.id
                }).then(res =>{
                    this.$alert('删除成功','提示',{
                        type: 'success',
                        confirmButtonText: '好的'
                    }).catch(() =>{})
                }).catch(err =>{
                    this.$alert('删除失败','提示',{
                        type: 'warning',
                        confirmButtonText: '好的'
                    }).catch(() =>{})
                })
            }
        },
        //重置搜索条件
        resetSearch(){
            this.dateFrom = '';
            this.dateTo = '';
            this.itemNo = '';
            this.cname = '';
            this.erpCreatorname = '';
        },
        //切换下一页
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchRefund()
        },
        //修改打印标记
        changePrinted(value,index){
            updatePrinted({
                id: value.id,
                printed: (value.printed)?'0':'1'
            }).catch(() =>{})
        },
        //隔行变色
        tableRowClassName({row, rowIndex}){
            if(rowIndex%2 === 0){
                return 'success-row';
            }
            return '';
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
        //将毫秒数转为标准时间
        toLocale(time){
            let _time = new Date(time)
            let year = _time.getFullYear()
            let month = this.addZeroIfNeed(_time.getMonth()+1)
            let day = this.addZeroIfNeed(_time.getDate())
            let hour = this.addZeroIfNeed(_time.getHours())
            let minute = this.addZeroIfNeed(_time.getMinutes())
            let second = this.addZeroIfNeed(_time.getSeconds())
            let date = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
            return date
        },
        //给时间加前缀'0'
        addZeroIfNeed(num){
            if(num < 10){
                return '0'+num
            }
            return num
        },
        ...mapMutations('navTabs', [
            'addTab'
        ]),
        ...mapMutations('badge',[
            'changeBadge'
        ]),
        ...mapActions('navTabs',[
            'closeTab',
            'closeToTab'
        ]),
    },
    created(){
        //区分客户类型做一些初始化
        if(this.identity === 'SALEMAN'){
            this.chooseState = null
            this.initDate()
        }
        else if(this.identity === 'ECWEB'){
            this.chooseState = 'CUSTOMERAFFIRM'
            this.initBadge()
        }
        this.searchRefund()
    },
    filters:{
        //过滤掉值为空的属性
        propertyFilter(obj){
            let keyArr = Object.keys(obj)
            for(let i = 0; i < keyArr.length; i++){
                if(obj[keyArr[i]] === ''){
                    delete obj[keyArr[i]]
                }
            }
            return obj
        }
    }
}
</script>

<style>
.el-table .success-row {
    background: #f0f9eb;
} 
</style>

<style scoped>
.search{
    font-size: 14px;
}
.search>*{
    margin-bottom: 5px; 
}
.search span{
    display: inline-block;
    width: 60px;
    text-align: left;
    margin: 2px;
}
.ml5{ margin-left: 5px; }
.mr5{ margin-right: 5px; }
.fr{ float: right; }
</style>
