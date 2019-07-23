<template>
    <div id="shopTabCon">
        <el-table
            id="shopTabTable"
            class="loading-area"
            :data="tableData"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            style="min-width: 750px; margin: 5px auto;">
            <el-table-column
                label="型号"
                prop="itemNo">
            </el-table-column>
            <el-table-column
                label="名称"
                prop="note">
                <template slot-scope="scope">
                    <span v-if="scope.row.note !== null">{{scope.row.note}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column
                label="规格尺寸">
                <template slot-scope="scope">
                    <span v-if="scope.row.fixType === '01'">
                        <span v-if="scope.row.rzGrade">
                            定宽{{scope.row.rzGrade}}
                            <!-- {{scope.row.fixGrade/1000 + (scope.row.unit?scope.row.unit:'米')}} -->
                        </span>
                        <span v-else>
                            定宽
                        </span>
                    </span>
                    <span v-else-if="scope.row.fixType === '02'">
                        <span v-if="scope.row.rzGrade">
                            定高{{scope.row.rzGrade}}
                            <!-- {{scope.row.fixGrade/1000 + (scope.row.unit?scope.row.unit:'米')}} -->
                        </span>
                        <span v-else>
                            定高
                        </span>
                    </span>
                    <span v-else-if="scope.row.rzGrade">
                        {{scope.row.rzGrade}}
                        <!-- {{scope.row.fixGrade/1000 + (scope.row.unit?scope.row.unit:'米')}} -->
                    </span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="尺寸"
                prop="fixGrade">
                <template slot-scope="scope">
                    <span v-if="scope.row.fixGrade !== null">
                        {{scope.row.fixGrade/1000}}
                    </span>
                    <span v-else>--</span>
                </template>
            </el-table-column> -->
            <el-table-column
                min-width="140"
                label="数量">
                <template slot-scope="scope">
                    <div v-if="scope.row.unit === '平方米'">
                        <span class="num-font">宽</span>
                        <currency-input
                            :customStyle="'width: 75px;'"
                            v-model.number="numberList[scope.$index].value">
                        </currency-input>
                            ×
                        <span class="num-font">高</span>
                        <currency-input
                            :customStyle="'width: 75px;'"
                            v-model="numberList[scope.$index].value1">
                        </currency-input>
                    </div>
                    <div v-else>
                        <currency-input
                            v-model.number="numberList[scope.$index].value">
                        </currency-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="单位">
                <template slot-scope="scope">
                    <span>{{scope.row.unit?scope.row.unit:'米'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="100px"
                label="操作">
                <template slot-scope="scope">
                    <a class="mr10" @click="seeStore(scope)">
                        查看库存
                        <iframe :src="storeUrl(scope.row.itemNo)" style="display:none;" frameborder="0"></iframe>
                    </a>
                </template>
            </el-table-column>
            <el-table-column 
                width="100px;"
                type="expand">
                <template slot-scope="scope">
                    <el-form label-position="left" class="loading-area">
                        <el-form-item label="活动：">
                            <el-select :disabled="disableFlag" v-model="seletedActivity" 
                                :placeholder="(disableFlag === false)?'请选择一个活动':'此产品不参与活动'">
                                <el-option
                                    v-for="item in activity"
                                    :label="item.label"
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <div class="dib rel" style="width: 55%;">
                                <el-input
                                    resize="none"
                                    type="textarea"
                                    placeholder="请输入您的备注信息"
                                    maxlength="200"
                                    :autosize="{ minRows: 3, maxRows: 6}"
                                    v-model="remark">
                                </el-input>
                                <i class="el-icon-edit" 
                                    style="position:absolute;
                                        right:10px;bottom:5px;">
                                </i>
                            </div>
                            <span style="margin-left:10px;">{{remark?remark.length:0}}/200</span>
                        </el-form-item>
                        <el-form-item class="tc">
                            <el-button style="width: 130px;" type="danger" @click="saveToShoppingCar(scope.row,scope.$index)">加入购物车</el-button>
                            <el-button style="width: 130px;" type="info" @click="expandChange(scope)">取消</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="商品库存" :visible.sync="dialogTableVisible" width="550px">
            <el-table id="storeTable" :data="produceStore" :row-style="rowClass">
                <el-table-column property="header" min-width="30%"></el-table-column>
                <el-table-column property="body" style="width: 70%;"></el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="success" plain @click="dialogTableVisible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import{
    findItemActivity
} from '@/api/findActivity'
import{
    checkStore
} from '@/api/searchStore'
import{
    addShoppingCar
} from '@/api/shop'
import Axios from 'axios'
import Cookies from 'js-cookie'

export default {
    name: 'shopTab',
    data() {
        return {
            cid: Cookies.get('cid'),      //客户ID
            customerType: Cookies.get('customerType'), //客户类型
            activity: [],       //活动
            seletedActivity: '',//选择的活动
            remark: '',         //备注
            expands: [],    //展开行type的数组
            produceStore: [
                {
                    header: '类别',
                    body: '面料'
                },
                {
                    header: '编号',
                    body: 'MLGB'
                },
                {
                    header: '尺寸',
                    body: '1.4'
                },
                {
                    header: '库存信息',
                    body: '库存120.2米，卷1=95.9米，卷2=24.3米'
                },
            ],
            storeMsg: [],       //储存当前页面的库存信息
            dialogTableVisible: false,
            disableFlag: false,         //判断是否禁用选择框
        }
    },
    props:[ 'tableData', 'numberList' ],
    // tableData:{
    //     handler:(val,oldval) => {  
    //         console.log(val,oldval);
    //         this.storeMsg = [];
    //         // this.footShow = val;
    //     },  
    //     immediate:true,//关键
    // },
    methods:{
        //给库存表格切换不同的颜色
        rowClass(row, index){
            if(row.rowIndex%2 === 0){
                return ;
            }
            else{
                return { "background": "rgba(225, 255, 229, 1)" }
            }
        },
        //清空值
        clearMsg(){
            this.activity = [];
            this.seletedActivity = '';
            this.remark = '';
        },
        //获取row的key值
        getRowKeys(row) {
            return row.itemNo;
        },
        storeUrl(IID){
            return `http://www.luxlano.com/ddkc/ecqueryItemStock.asp?IID=${IID}`;
        },
        //收起展开行
        expandChange(row){
            console.log(row);
            this.clearMsg();
            if(row.itemNo === undefined){
                this.expands = [];
                return ;
            }    
            var itemVersion = row.itemVersion?row.itemVersion:'';
            var productType = row.productType?row.productType:'';
            var productBrand = row.productBrand?row.productBrand:'';
            findItemActivity({
                CID: this.cid,
                customerType: this.customerType,
                itemNo: row.itemNo,
                itemVersion: itemVersion,
                productType: productType,
                productBrand: productBrand
            }).then(res =>{
                if(res.length === 0){
                    this.disableFlag = true; 
                }
                else{
                    this.disableFlag = false;
                }
                for(var i=0; i<res.length; i++){
                    for(var j=0; j<res[i].second.length; j++){
                        var obj = {
                                label: res[i].second[j].orderType+' '+res[i].second[j].orderName,
                                value: res[i].second[j].pId,
                        }
                        this.activity.push(obj);
                    }
                }     
                this.activity.push({
                    label: '不参与活动',
                    value: null
                });
            }).catch(err =>{console.log(row.itemNo);
                console.log(err);                
            })
            let temp = this.expands;
            this.expands = [];
            this.expands.push(row.itemNo);
            if(temp.length === 1 && temp[0] === row.itemNo){     // 收起展开行
                this.expands = [];
            }
        },
        //保存到购物车
        saveToShoppingCar(row,index){
            //库存判断,判断成功才可以添加
            let val;
            if(row.unit === '平方米'){
                val = this.numberList[index].value * this.numberList[index].value1;
            }
            else{
                val = this.numberList[index].value;
            }
            if(val === '0' || val === 0){
                this.$alert('数量不能为空','提示',{
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return ;
            }
            //判断数字合理性
            //面料、花边保留一位小数
            //其余都是整数
            let _type = Cookies.get('activeNameSoftSuit');
            let re = /^[1-9]\d*$/;
            if(_type === 'ML' || _type === 'XHB'){
                re = /^[0-9]+(.[0-9]{1})?$/;
            }
            if(re.test(val) === false){
                this.$alert('数量栏请填写正确的数字', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return ;
            }
            if(this.seletedActivity === '' && this.disableFlag === false){
                this.$alert('请选择一个活动','提示',{
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return;
            }
            console.log(row);
            let storeMessage;
            if(this.seletedActivity  === null || this.seletedActivity  === undefined)     
                this.seletedActivity = '';
            this.numberList[index].value = this.numberList[index].value.toString();
            this.numberList[index].value1 = this.numberList[index].value1.toString();
            if(row.unit !== '平方米'){
                addShoppingCar({
                    customer_type: this.customerType,
                    CID: this.cid,
                    itemNO: row.itemNo,
                    commodityType: 'soft',
                    activityID: this.seletedActivity,
                    quantity: this.numberList[index].value,
                    height: '',
                    width: '',
                    note: this.remark,
                    splitShipment: storeMessage,
                    softType: _type
                }).then(res =>{
                    console.log(res);
                    this.numberList[index].value = '';
                    this.expands = [];
                    this.clearMsg();
                    if(res.data.code === 0){
                        this.$alert('此型号已添加成功，请前往购物车查看', '添加成功', {
                            confirmButtonText: '确定',
                            type: 'success'
                        });
                    }
                    else{
                        this.$alert(res.data.msg, '添加失败', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    }
                }).catch(err =>{
                    this.numberList[index].value = '';
                    this.expands = [];
                    this.clearMsg();
                    this.$alert('添加失败，请查看信息填写是否正确或者检查网络是否通畅', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                    });
                    console.log(err);
                })
            }
            else{
                addShoppingCar({
                    customer_type: this.customerType,
                    CID: this.cid,
                    itemNO: row.itemNo,
                    commodityType: 'soft',
                    activityID: this.seletedActivity,
                    quantity: '',
                    height: this.numberList[index].value1,
                    width: this.numberList[index].value,
                    note: this.remark,
                    splitShipment: storeMessage,
                    softType: _type
                }).then(res =>{
                    console.log(res);
                    this.numberList[index].value = '';
                    this.numberList[index].value1 = '';
                    this.expands = [];
                    this.clearMsg();
                    if(res.data.code === 0){
                        this.$alert('此型号已添加成功，请前往购物车查看', '添加成功', {
                            confirmButtonText: '确定',
                            type: 'success'
                        });
                    }
                    else{
                        this.$alert(res.data.msg, '添加失败', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    }
                }).catch(err =>{
                    this.numberList[index].value = '';
                    this.numberList[index].value1 = '';
                    this.expands = [];
                    this.clearMsg();
                    this.$alert('添加失败，请查看信息填写是否正确或者检查网络是否通畅', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                    });
                    console.log(err);
                })
            }
        },
        //修改该商品的计量
        numberChange(value){
            //value :String
            console.log(value);
        },
        //查看该商品的库存
        seeStore(scope){
            this.dialogTableVisible = true;
            //生成库存表格，依次是类别、编号、尺寸、库存信息
            this.produceStore[0].body = scope.row.note?scope.row.note:'暂无数据';
            this.produceStore[1].body = scope.row.itemNo?scope.row.itemNo:'暂无数据';
            this.produceStore[2].body = scope.row.fixGrade/1000;
            this.produceStore[3].body = this.storeMsg[scope.$index]?this.storeMsg[scope.$index]:'暂无数据'; 
        },
        //选择该商品加入购物车
        chooseItem(){
        }
    },
    created(){
        
    },
    computed:{
        // length(){
        //     this.numberList = [];
        //     for(var i=0; i<this.tableData.length; i++){
        //         this.numberList.push({
        //             value: '',  //主计量
        //             value1: ''  //辅助计量
        //         });
        //     }
        //     return this.tableData.length;
        // }
        msg(){
            return this.tableData;
        }
    },
    mounted(){
        const self = this;
        window.addEventListener('message', function(e){
            if(typeof(e.data) === 'string')
                self.storeMsg.push(e.data);
            //console.log(self.storeMsg);
        }, false);  
    },
    watch:{
        msg(newV,oldV) {
            // do something
            this.storeMsg = [];
        } 
    }
}
</script>
<style>
#storeTable .el-table__footer-wrapper, 
#storeTable .el-table__header-wrapper{ display: none }
#storeTable .el-dialog__body{
    padding: 20px;
}
#shopTabCon .el-tabs__header{ margin: 0; }
#shopTabCon .el-dialog__body{
    padding: 0 20px;
}
#shopTabTable .el-table__expand-icon::after{
    display: block!important;
    position: relative;
    bottom: 1px;
    font-size: 14px;
    content: "选择此款";
    color: red;
    cursor: pointer;
    -webkit-transition: background-color .25s ease;
    transition: background-color .25s ease;
}
#shopTabCon .el-table__expand-icon >i{
    display: none !important;
}
</style>

<style scoped>
#storeTable{ border: 1px solid gray; }
#storeTable tr>:nth-child(1){ border-bottom: 1px solid gray; }
#storeTable tr>:nth-child(2){ 
    border-left: 1px solid gray;
    border-bottom: 1px solid gray;
}
a:hover{ cursor: pointer; }
.num-font{
    margin: 0 2px;
}
</style>
