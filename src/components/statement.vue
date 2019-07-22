<template>
    <div>
        <el-card shadow="hover">
            <div slot="header">
                <span class="headSpan">对账单</span>
                <el-button @click="showMoney()" style="float:right;" size="small"  type="warning">查询余额</el-button>
            </div>
            <div>
                <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName"
                style="width: 100%; margin-top:10px">
                  <el-table-column label="广东玉兰集团股份有限公司对账单">
                    <el-table-column
                    prop="dateStart"
                    width="200"
                    label="起始日期">
                    </el-table-column>
                    <el-table-column
                    prop="dateEnd"
                    label="结束日期">
                    </el-table-column>
                    <el-table-column
                    prop="fhjeMonth"
                    label="本期发货总额">
                    </el-table-column>
                    <el-table-column
                    prop="czskMonth"
                    label="本期收款总额">
                    </el-table-column>
                    <el-table-column
                    prop="qcczysk"
                    label="上期应收款">
                    </el-table-column>
                    <el-table-column
                    prop="czysk"
                    label="应收款(合计)">
                    </el-table-column>
                    <el-table-column
                    prop="customerCheckState"
                    label="客户确认状态">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                        <template slot-scope="scope1">
                            <el-button @click="openDia(scope1.row.dateStart,scope1.row.dateEnd,scope1.row)" type="text">明细</el-button>
                        </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
                <div style="margin:0 25%;" class="block">
                    <el-pagination
                        @current-change="outerCurrentChange"
                        :current-page.sync="outerCurrentPage"
                        :page-size="outerlimit" 
                        layout="prev, pager, next, jumper"
                        :total="outercount">
                    </el-pagination>
                </div>
            </div>


            <el-dialog
                    title="对账单明细"
                    :visible.sync="detailVisible"
                    :close-on-click-modal='false'
                    width="60%">
                    <div style="width:90% ;margin:0 auto;">
                        <div style="margin:0 auto; height:50px; width:100%;text-align:center;">
                            <h2>广东玉兰集团股份有限公司对账单</h2>
                        </div>
                        <div style="margin:0 auto; width:100%;">
                            <h4 style="display:inline;">统计日期：{{startDate|cutdate}}~{{endDate|cutdate}}</h4>
                            <el-button v-show="showButton" style="float:right; margin-left:10px;" type="primary" @click="changeStatus(0)">客户确认</el-button>
                            <el-button v-show="showButton" style="float:right;" type="danger" @click="dialogFormVisible = true">客户反馈</el-button>
                        </div>
                        <table border="1" width="100%" cellpadding="10" style="margin:0 auto;">
                            <tr>
                                <th class="grayTD">客户名称</th>
                                <th colspan="2">{{theHead.customerName}}</th>
                                <th class="grayTD">联系人</th>
                                <th colspan="2">{{theHead.customerAgent}}</th>
                            </tr>
                            <tr>
                                <th class="grayTD">电话</th>
                                <th colspan="2">{{theHead.officeTel}}</th>
                                <th class="grayTD">传真</th>
                                <th colspan="2">{{theHead.fax}}</th>
                            </tr>
                            <tr>
                                <td colspan="2" align="center" class="grayTD">版本销售前5名</td>
                                <td colspan="4" align="center">{{theBody.verTop}}</td>
                            </tr>
                            <tr>
                                <td colspan="2" align="center" class="grayTD">本客户版本销售前5名</td>
                                <td colspan="4" align="center">{{theBody.ctmVerTop}}</td>
                            </tr>
                            <tr>
                                <td colspan="1" align="center" class="grayTD">备货单据号</td>
                                <td colspan="5" align="center">{{theBody.ctmBhBill}}</td>
                            </tr>
                            <tr>
                                <td colspan="1"></td>
                                <td align="center" class="grayTD">本期</td>
                                <td align="center" class="grayTD">本年</td>
                                <td></td>
                                <td align="center" class="grayTD">本期</td>
                                <td align="center" class="grayTD">本年</td>
                            </tr>
                            <tr>
                                <td class="grayTD">实际发货总金额</td>
                                <td>{{theBody.fhjeMonth}}</td>
                                <td>{{theBody.consignmentMoney}}</td>
                                <td class="grayTD">实际收款金额</td>
                                <td>{{theBody.czskMonth}}</td>
                                <td>{{theBody.gatherMoneyFax}}</td>
                            </tr>
                            <tr>
                                <td class="grayTD">返利发货总金额</td>
                                <td>{{theBody.moneyFl}}</td>
                                <td>{{theBody.moneyFlTotal}}</td>
                                <td class="grayTD">本期剩余返利</td>
                                <td>{{theBody.moneyFl}}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td class="grayTD">备货总金额</td>
                                <td>{{theBody.moneyBh}}</td>
                                <td>{{theBody.moneyBhTotal}}</td>
                                <td class="grayTD">运费总金额</td>
                                <td>{{theBody.freightMonth}}</td>
                                <td>{{theBody.freight}}</td>
                            </tr>
                            <tr>
                                <td class="grayTD">期初应收款</td>
                                <td colspan="2">{{theBody.qcczysk}}</td>
                                <td class="grayTD">期末应收款</td>
                                <td colspan="2">{{theBody.czysk}}</td>
                            </tr>
                        </table>

                        <el-table
                            :data="tableDetail"
                            :summary-method="getSummaries"
                            show-summary
                            border
                            :row-class-name="tableRowClassName"
                            style="width: 100%; margin:10px auto">
                                <el-table-column
                                width="130"
                                label="日期">
                                    <template slot-scope="scope1">
                                        <span>{{scope1.row.dateOutStock | datatrans}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="单据号" width="130">
                                    <template slot-scope="scope1">
                                        <!-- <span>{{scope1.row.saleNo}}</span> -->
                                        <el-button @click="openTHdia(scope1.row)" type="text">{{scope1.row.saleNo}}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="类别">
                                    <template slot-scope="scope1">
                                        <span>{{scope1.row.billNo}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="money"
                                label="发货总额">
                                </el-table-column>
                                <el-table-column
                                prop="qty"
                                label="发货数量">
                                </el-table-column>
                                <el-table-column
                                prop="freight"
                                label="运费">
                                </el-table-column>
                                <el-table-column
                                prop="gatherMoneyFax"
                                label="收款金额">
                                </el-table-column>
                                <el-table-column
                                label="加收物流费">
                                    <template slot-scope="scope1">
                                        <span>{{scope1.row.transFlag | NYchange}}</span>
                                    </template>
                                </el-table-column>
                        </el-table>
                    </div>
                    
                    <!-- <div style="margin:0 25%;" class="block">
                        <el-pagination
                            @current-change="InnerCurrentChange"
                            :current-page.sync="innerCurrentPage"
                            :page-size="innerlimit" 
                            layout="prev, pager, next, jumper"
                            :total="innercount">
                        </el-pagination>
                    </div> -->
            </el-dialog>

            <el-dialog title="客户反馈" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
                    <el-input type="textarea" maxlength="200" :autosize="{ minRows:4, maxRow:6}" resize="none" v-model="customerCheckComment" placeholder="请输入反馈内容(200字以内)"></el-input>
                    <span style="color:#ccc">{{customerCheckComment.length}}/200</span><br>  
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="changeStatus(1)">确 定</el-button>
                    </div>
            </el-dialog>

            <el-dialog
                :title="THtitle"
                :visible.sync="THdetail"
                :width="THwidth">
            <div style="margin:0 auto;width:20%;" v-show="whatType">
                <span style="font-weight:600">{{THhead}}明细表</span>
            </div>
            <el-table
                v-show="whatType"
                :data="THtabledata"
                border
                :summary-method="getSummaries"
                :row-class-name="tableRowClassName"
                show-summary
                style="width: 100%; margin-top:10px">
                    <el-table-column
                    prop="itemNo"
                    width="160"
                    label="版本型号">
                    </el-table-column>
                    <el-table-column
                    width="150"
                    label="名称">
                        <template slot-scope="scope1">
                            <el-button type="text">{{scope1.row.itemNote}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                    width="150"
                    label="版本名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.itemVersion}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    width="150"
                    label="批号">
                        <template slot-scope="scope">
                            <span>{{scope.row.batchNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="单价">
                        <template slot-scope="scope">
                            <span>{{scope.row.salePrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="物流单价">
                        <template slot-scope="scope">
                            <span>{{scope.row.transPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="数量">
                        <template slot-scope="scope">
                            <span>{{scope.row.qtyDeliver}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="money"
                    label="金额">
                    </el-table-column>
            </el-table>
            <div class="TH" v-show="!whatType">
                <p>日期：{{CZSK.dateOutStock | datatrans}}</p>
                <p>单据号：{{THhead}}</p>
                <p>收款金额：{{CZSK.gatherMoneyFax}}</p>
                <p>备注：{{CZSK.notes}}</p>
            </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
const BACKIT = '客户反馈';
const OKIT = '客户确认'
import { checkBill ,billDetail,userReturn,queryCash,statementDetail} from '@/api/orderList'
import { mapMutations,mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'  
export default {
    data() {
      return {
        CZSK:{},
        THtitle:"对账单明细",
        THwidth:'70%',
        whatType:true,
        //外面的翻页
        outerCurrentPage:1,
        outerlimit:10,
        outercount:100,
        tableData:[],
        theHead:{},
        theBody:{},
        tableDetail:[],
        startDate:'',
        endDate:'',
        detailVisible:false,
        //里面的翻页
        innerCurrentPage:1,
        innerlimit:10,
        innercount:100,
        //用户反馈
        customerCheckState:'',
        customerCheckComment:'',
        showButton:true,
        dialogFormVisible:false,
        CTMmoney:'',
        //提货弹窗
        THdetail:false,
        THhead:'',
        THtabledata:[{
            STATUS_ID:1
        }],
      }
    },
    methods: {
        //打开对账单提货弹窗
        openTHdia(tab){
            console.log(tab);
            if(tab.billNo == 'CZSK'){
                this.whatType = false;
                this.THtitle = '收款备注'
                this.CZSK = tab;
                this.THwidth = '30%'
            }
            else {
                this.whatType = true;
                this.THtitle = '对账单明细'
                this.THwidth = '72%'
            }
            this.THdetail = true ;
            this.THhead = tab.saleNo;
            let url = '/customerBalance/getCustomerBalancePackDetail.do';
            let data = {
                saleNO:this.THhead
            }
            statementDetail(url,data).then(res=>{
                console.log(res);
                console.log(res.packDetailList);
                this.THtabledata = res.packDetailList;
            }) 

        },
        //打开弹窗渲染详情数据
        openDia(startDate,endDate,tab){
            if(tab.customerCheckState!='待确认'){
                this.showButton=false;
            }
            else {
                this.showButton=true;
            }
            this.startDate = startDate + ' 00:00:00';
            this.endDate = endDate + ' 23:59:59';
            console.log(tab);
            console.log(this.startDate,this.endDate);
            this.theBody=tab;
            this.getBillDetail();
            //this.detailVisible= true;
        },
        //翻页获取里面的对账单详情
        InnerCurrentChange(val){
            console.log(`当前页: ${val}`);
            this.innerCurrentPage=val;
            this.tableDetail=[];
            this.getBillDetail();
        },
        //翻页获取外面的对账单
        outerCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.outerCurrentPage=val;
            this.tableData=[];
            this.getBill();
        },
        //改变账单状态
        changeStatus(status){
            let decoration = ''
            let startDate = this.startDate.slice(0,10);
            console.log(startDate);
            if(status==0){
                decoration = '确认通过该对账明细表？';
                this.customerCheckState=OKIT;
            }
            else if(status==1){
                decoration = '确认发表反馈？';
                this.customerCheckState=BACKIT;
            }

            let url = '/customerBalance/customerCheck.do';
            let data ={
                cid:Cookies.get('cid'),
                startDate:startDate,
                customerCheckState:this.customerCheckState,
                customerCheckComment:this.customerCheckComment
            }
            this.$confirm(decoration, '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
                }).then(() => {
                    userReturn(url,data).then(res =>{
                        console.log(res);
                        if(res.msg=='SUCCESS'){
                            this.$alert('操作成功', '提示', {
                            confirmButtonText: '确定',
                            type:'success',
                            });
                            this.getBill();
                            this.detailVisible=false;
                            this.dialogFormVisible=false;
                        }
                        else {
                            this.$alert('操作失败，请稍后重试', '提示', {
                            confirmButtonText: '确定',
                            type:'danger',
                            });
                        }
                    })
                  }).catch(() => { 
                  console.log('还没删');     
            });
        },
        //获取对账单
        getBill(){
            let url = '/customerBalance/getCustomerBalanceInfo.do';
            let data = {
                cid:Cookies.get('cid'),
                limit:10,
                page:this.outerCurrentPage
            }
            checkBill(url,data).then(res=>{
                console.log(res);
                this.tableData=res.customerBalancePeriodList;
                this.theHead=res.customerInfo;
                this.outercount=res.customerBalancePeriodList.length?res.customerBalancePeriodList[0].total:0;
                //customerName customerAgent officeTel  fax
            }) 
        },
        //获取对账详情
        getBillDetail(){
            let url = '/customerBalance/getCustomerBalancePeriodDetailInfo.do';
            let data = {
                cid:Cookies.get('cid'),
                startDate:this.startDate , //开始日期
                endDate:this.endDate, //结束日期
                limit: 999,//10,
                page:1//this.innerCurrentPage
            };
            billDetail(url,data).then(res => {
                console.log(res);
                this.tableDetail=res.customerBalancePeriodDetailList;
                this.innercount = res.customerBalancePeriodDetailList.length?res.customerBalancePeriodDetailList[0].total:0;
                this.detailVisible= true;
            })
        },//计算表格末行
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
            sums[index] = '汇总';
            return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                return prev + curr;
                } else {
                return prev;
                }
            }, 0);
            if(index<10){
                sums[index] = sums[index].toFixed(2);
                sums[index] += ' 元';
            }
            } else {
            sums[index] = '';
            }
            });
            return sums;
        },
        showMoney(){
            if(this.CTMmoney>=0){
                this.$alert(`当前余额为${this.CTMmoney}元`, '余额', {
                confirmButtonText: '确定',
                type:'success',
                }); 
            }
            else {
                this.$alert(`当前欠款${Math.abs(this.CTMmoney)}元,为了不影响发货，请尽快打款，谢谢合作！`, '欠款提醒', {
                confirmButtonText: '确定',
                type:'warning',
                }); 
            }
        },
        //查询余额
        queryMoney(){
            var url = '/order/getResidemoney.do';
            var data = {
            'cid':Cookies.get('companyId'),//后面再改回去
            'companyId':Cookies.get('companyId'),
            }
            queryCash(url,data).then(res => {
                console.log(res);
                this.CTMmoney=res.data;
            })
        },
        //隔行变色
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2==0) {
                return 'success-row';
            }
            return '';
        },
        ...mapMutations('navTabs', [
        'addTab'
        ]),
        ...mapActions('navTabs',[
        'closeTab',
        'closeToTab'
        ]),
    },
    created:function(){
        this.getBill();
        this.queryMoney();
    },
    filters:{
        cutdate(value){
            return value.slice(0,10)
        },
        datatrans(value){  //时间戳转化大法
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? ('0' + MM) : MM;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            let m = date.getMinutes();
            m = m < 10 ? ('0' + m) : m;
            let s = date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return y + '-' + MM + '-' + d + ' ' /* + h + ':' + m + ':' + s; */
        },
        NYchange(value){
            if(value=='Y') return '是';
            if(value=='N') return '否';
            if(value==null) return ''
        }
    }

  }
</script>

<style scoped>
.headSpan{
  font-weight: bold;
  font-size: 18px;
  color: black;
}
.TH{
    font-size: 20px;
    line-height: 30px;
}
.grayTD{
  background:rgb(241, 242, 243);
}
</style>


<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>