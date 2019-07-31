<template>
    <div id="wallPaperCon">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span class="fstrong f16">墙纸</span>
            </div>
            <div id="shopsCon">
                <div id="searchBoxW" class="tl">
                    <el-input clearable
                        v-model.trim="searchKey" 
                        @clear="tableData = []"
                        @keyup.enter.native="_getShopsWallPaperMsg"
                        placeholder="输入商品型号查找商品"
                        style="width:25%; min-width:280px;">
                        <div id="searchBtn" slot="append" @click="_getShopsWallPaperMsg">搜索</div>
                    </el-input>
                    <div id="searchHistory" style="margin: 5px 0 0">
                        <ul class="ovh l" style="font-size: 12px;">
                            <li>历史搜索：</li>
                            <li v-if="history.length === 0">暂无搜索记录</li>
                            <li v-for="item in history" :key="item">
                                <a @click="searchByHistory(item)">{{item}}</a>
                            </li>
                            <li v-if="history.length !== 0"><a @click="removeHistory">删除历史记录</a></li>
                        </ul>
                    </div>
                </div>
                <el-table class="loading-area"
                    :data="tableData"
                    :row-key="getRowKeys"
                    :expand-row-keys="expands"
                    @expand-change="expandChange"
                    style="min-width: 750px; margin: 0px auto 20px auto;">
                    <el-table-column
                        label="型号"
                        prop="type">
                    </el-table-column>
                    <el-table-column
                        label="样本型号"
                        prop="sample">
                    </el-table-column>
                    <el-table-column
                        label="版本"
                        prop="versionNumber">
                    </el-table-column>
                    <el-table-column
                        label="名称"
                        prop="version">
                    </el-table-column>
                    <el-table-column
                        label="品牌"
                        prop="brand">
                    </el-table-column>
                    <el-table-column
                        min-width="150"
                        label="数量">
                        <template slot-scope="scope">
                            <div v-if="scope.row.unit === '平方米'">
                                <span class="num-font">宽</span>
                                <currency-input
                                    :customStyle="'width: 75px;'"
                                    v-model="scope.row.number">
                                </currency-input>
                                    ×
                                <span class="num-font">高</span>
                                <currency-input
                                    :customStyle="'width: 75px;'"
                                    v-model="scope.row.anotherNumber">
                                </currency-input>
                            </div>
                            <div v-else>
                                <currency-input
                                    v-model="scope.row.number">
                                </currency-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="单位"
                        prop="unit">
                    </el-table-column>
                    <el-table-column
                        width="100px"
                        label="操作">
                        <template slot-scope="scope">
                            <a class="mr10" @click="seeStore(scope)">查看库存</a>
                            <el-dialog title="库存查询" :visible.sync="dialogTableVisible" width="520px">
                                <el-table border :data="produceStore" style="width:500px;" :row-style="rowClass">
                                    <el-table-column property="stockNo" label="库房"></el-table-column>
                                    <el-table-column property="batchNo" label="批号" width="200" show-overflow-tooltip></el-table-column>
                                    <el-table-column property="qty" label="库存" width="70"></el-table-column>
                                </el-table>
                                <div slot="footer">
                                    <p class="f14 tc border-b mb10"><b>以上数值仅供参考，以实际订单处理为准</b></p>
                                    <el-button type="success" plain @click="dialogTableVisible = false">关 闭</el-button>
                                </div>
                            </el-dialog>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        width="20px;"
                        type="expand">
                        <template slot-scope="scope">
                            <el-form label-position="left" class="loading-area">
                                <el-form-item label="活动：">
                                    <el-select :disabled="disableFlag" v-model="seletedActivity" 
                                        :placeholder="(disableFlag === false)?'请选择一个活动':'此产品不参与活动'">
                                        <!-- <el-option-group
                                            v-for="group in activity"
                                            :key="group.label"
                                            :label="group.label">
                                            <el-option
                                                v-for="item in group.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-option-group> -->
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
                                    <el-button style="width: 130px;" type="danger" @click="saveToShoppingCar(scope.row)">加入购物车</el-button>
                                    <el-button style="width: 130px;" type="info" @click="closeExpand">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { 
    getShopsWallPaperMsg ,
} from '@/api/shopSearch'
import {
    getWallPaperStore,
    checkStore
} from '@/api/searchStore'
import{
    findItemActivity
} from '@/api/findActivity'
import{
    addShoppingCar
} from '@/api/shop'
import Vue from 'vue'
import Cookies from 'js-cookie'

export default {
    name: 'WallPaper',
    data(){
        return{
            cid: Cookies.get('cid'),  //假定给的用户id
            customerType: Cookies.get('customerType'), //客户类型
            searchKey : '', //搜索的关键词
            activity: [],   //活动
            seletedActivity: '',    //选择的活动
            remark: '', //备注
            tableData: [
                {
                    type: 'DT35010', //型号
                    sample: '111',   //样本型号
                    versionNumber: '新墙标(大)',    //版本
                    version: '窄幅墙纸',      //名称
                    brand: '玉兰',   //品牌
                    number: '',     //计量
                    anotherNumber: '',  //辅助计量、
                    unit: '',       //单位
                    activity: [
                        { value: '活动一' },
                        { value: '活动二' },
                        { value: '活动三' },
                        { value: '活动四' }
                    ],              //活动
                    seletedActivity: '',      //选择的活动
                    remark: '',     //备注
                    itemFlag: '0',    //状态
                },],
            expands: [],    //展开行type的数组
            produceStore: [{
                    stockNo: '1',         //库房
                    batchNo: '131',       //批号
                    qty: '361',           //库存
                    itemNo: '',           //产品型号
                },{
                    stockNo: '2',
                    batchNo: '132',
                    qty: '100',
                    itemNo: '',
                },{
                    stockNo: '3',
                    batchNo: '133',
                    qty: '100',
                    itemNo: ''
            }],
            dialogTableVisible: false,  //控制展开的是哪些行
            disableFlag: false,         //判断是否禁用选择框
            history: [],                //本地存储
        }
    },
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
            return row.type;
        },
        //收起展开行-获取商品的活动
        expandChange(row){
            console.log(row);
            /*
            console.log(row);
            this.clearMsg();
            findItemActivity({
                CID: this.cid,
                customerType: this.customerType,
                itemNo: row.type,
                itemVersion: row.versionNumber
            }).then(res =>{
                console.log(res);
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
                                // value: res[i].second[j].orderType,
                                value: res[i].second[j].pId
                        }
                        this.activity.push(obj);
                    }
                }
                this.activity.push({
                    label: '不参与活动',
                    value: null
                });
                console.log(res);
                console.log(this.activity);              
            }).catch(err =>{
                console.log(err);                
            })
            let temp = this.expands;
            this.expands = [];
            this.expands.push(row.type);
            if(temp.length === 1 && temp[0] === row.type){     // 收起展开行
                this.expands = [];
            }
            */
        },
        //通过历史记录查询产品
        searchByHistory(name){
            this.tableData = [];
            this.expands = [];
            this.clearMsg();
            this.searchKey = name;
            this._getShopsWallPaperMsg();
        },
        //查询搜索墙纸
        _getShopsWallPaperMsg(){
            var data = {
                paperType: this.searchKey.toUpperCase(),
                cid: this.cid
            };
            this.expands = [];
            getShopsWallPaperMsg(data).then(res => {
                console.log(res);
                this.tableData = [];
                this.tableData.push({
                    type: res.data.itemNo,  //型号
                    sample: res.data.oldItemNo, //样本型号
                    versionNumber: res.data.itemVersion,    //版本
                    version: res.data.itemType.note,    //名称
                    brand: res.data.productBrand,   //品牌
                    productType: res.data.productType,  //类型
                    unit: (res.data.unit === '°ü')?'包':res.data.unit,    //单位
                    itemFlag: res.data.itemFlag,//不知是啥
                    number: '', //数量
                    anotherNumber: '',   //辅助数量
                });
                return this.tableData[0];
            }).then(data => {
                let storage = window.localStorage;
                let arr = [];
                if(storage.history !== undefined && storage.history !== null){
                    arr = storage.history.toLocaleString().split(',');
                }
                // storage.history = ['NPP155407','NPP123456'];
                // console.log(storage.history.toLocaleString().split(',')[0]);
                // console.log(storage.history.toLocaleString().split(','));
                //记录去重
                arr.push(this.searchKey.toUpperCase());
                arr = [...new Set(arr)];
                //arr = ['NPP155407','NPP1551407','1NPP155407','NPP1525407','NPP15544507','NP4P155407','N4PP1554407','4NPP155407','NP1P155407']
                //只保留最新的8条记录
                if(arr.length > 8){
                    arr = arr.splice(arr.length-8);
                }
                storage.history = arr;
                this.history = arr.reverse();
                console.log(storage.history.toLocaleString());
                this.clearMsg();
                findItemActivity({
                    CID: this.cid,
                    customerType: this.customerType,
                    itemNo: data.type,
                    itemVersion: data.versionNumber,
                    productType	: data.productType,
                    productBrand: data.brand
                }).then(res =>{
                    console.log(res);
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
                    console.log(this.activity);
                }).catch(err =>{
                    console.log(err);                
                })
                this.expands = [];
                this.expands.push(data.type);
            }).catch(err =>{
                this.tableData = [];
                this.expands = [];
                this.clearMsg();
            })
        },
        //获取库存信息
        getStore(row,res){
            let storeMessage;
            switch(res.msg){
                case 'SUCCESS':
                    storeMessage = null;
                    break;
                case 'waitForProduction':
                    this.$confirm('当前库存不足，请等待生产', '提示', {
                        confirmButtonText: '等生产',
                        cancelButtonText: '返回',
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    }).then(() => {
                        storeMessage = '0';
                        console.log(storeMessage);
                        this.addToCar(row,storeMessage);
                        return;
                    }).catch(() => {
                        this.searchKey = '';
                        this.tableData = [];
                        this.expands = [];
                        this.clearMsg();
                        return;
                    });
                    break;
                case 'splitShipment':
                    this.$confirm('此型号单个批次库存不满足需求量', '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '分批出货',
                        cancelButtonText: '等生产',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                    }).then(() => {
                        storeMessage = '1';
                        console.log(storeMessage);
                        this.addToCar(row,storeMessage);
                        return;
                    }).catch(action  => {
                        if(action === 'cancel'){
                            storeMessage = '0';   
                            console.log(storeMessage);
                            this.addToCar(row,storeMessage);
                        }
                        return;
                    });
                    break;
                case 'null':
                    this.$confirm('当前库存不足，请等待生产', '提示', {
                        confirmButtonText: '等生产',
                        cancelButtonText: '返回',
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    }).then(() => {
                        storeMessage = '0';
                        console.log(storeMessage);
                        this.addToCar(row,storeMessage);
                        return;
                    }).catch(() => {
                        this.searchKey = '';
                        this.tableData = [];
                        this.expands = [];
                        this.clearMsg();
                        return;
                    });
                    break;
                default:
                    storeMessage = '0';
                    break;
            }
            this.addToCar(row,storeMessage);
            return;
        },
        //库存无问题，添加入购物车
        addToCar(row,storeMessage){
            if(storeMessage === undefined)  return;
            if(this.seletedActivity  === null || this.seletedActivity  === undefined)
                this.seletedActivity = '';
            if(row.unit !== '平方米'){
                var data ={
                    customer_type: this.customerType,
                    CID: this.cid,
                    itemNO: row.type,
                    commodityType: 'wallpaper',
                    activityID: this.seletedActivity,
                    quantity: row.number,
                    height: '',
                    width: '',
                    note: this.remark,
                    splitShipment: storeMessage
                };
            }
            else{
                var data ={
                    customer_type: this.customerType,
                    CID: this.cid,
                    itemNO: row.type,
                    commodityType: 'wallpaper',
                    activityID: this.seletedActivity,
                    quantity: '',
                    height: row.anotherNumber,
                    width: row.number,
                    note: this.remark,
                    splitShipment: storeMessage
                };
            }
            console.log(data);
            addShoppingCar(data).then(res =>{
                console.log(res.data);
                if(res.data.code === 0){
                    this.$alert('此型号已添加成功，请前往购物车查看', '添加成功', {
                        confirmButtonText: '确定',
                        type: 'success'
                    });
                    this.searchKey = '';
                    this.tableData = [];
                    this.expands = [];
                    this.clearMsg();
                }
                else{
                    this.$alert(res.data.msg, '添加失败', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                    this.searchKey = '';
                    this.tableData = [];
                    this.expands = [];
                    this.clearMsg();
                }
            }).catch(err =>{
                this.$alert('请查看信息填写是否正确或者检查网络是否通畅', '添加失败', {
                        confirmButtonText: '确定',
                        type: 'warning'
                });
                this.searchKey = '';
                this.tableData = [];
                this.expands = [];
                this.clearMsg();
                console.log(err);
            })
        },
        //保存到购物车
        saveToShoppingCar(row){
            //库存判断,判断成功才可以添加
            let val;
            if(row.unit === '平方米'){
                val = row.number * row.anotherNumber;
            }
            else{
                val = row.number;
            }
            val = Number(val).toFixed(2);
            if(val === '0.00' || val === 0.00){
                this.$alert('数量不能为空','提示',{
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return ;
            }
            //判断数字合理性
            var re = /((^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$))/;
            if(re.test(val) === false){
                this.$alert('请填写正确的数字', '提示', {
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
            checkStore({
                itemNo: row.type,
                stockShowNum: val
            }).then(res =>{
                this.getStore(row,res);
                return;
            }).catch(err =>{
                console.log(err);
            })
        },
        //修改该商品的计量
        numberChange(value, index){
            //value :String
            console.log(value,index);
        },
        //查看该商品的库存
        seeStore(scope){
            this.dialogTableVisible = true;
            this.produceStore = [];
            getWallPaperStore({
                itemNo: scope.row.type
            }).then( res =>{
                console.log(res);
                this.produceStore = res.data;
            }).catch( err =>{
                console.log(err.data);
            })
            // console.log(scope.row.type);
            // console.log(scope);
        },
        //选择该商品加入购物车
        chooseItem(value){
            console.log(value);   
        },
        //点击取消收起
        closeExpand(){
            this.searchKey = '';
            this.tableData = [];
            this.clearMsg();
        },
        //获取历史记录
        localHistory(){
            let storage=window.localStorage;
            let arr = [];
            if(storage.history !== undefined && storage.history !== null){
                arr = storage.history.toLocaleString().split(',');
            }
            return arr.reverse();
        },
        //删除历史记录
        removeHistory(){
            this.$confirm('是否清空历史搜索纪录，清空后不可恢复', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let storage=window.localStorage;
                storage.removeItem('history');
                this.history = this.localHistory();
            }).catch(() => {        
            });
        }
    },
    created(){
        this.tableData = [];
        this.history = this.localHistory();
    },
    computed:{
        getNum(index){
            if(typeof(data) !== 'number')   return '';
            return data.toFixed(2);
        },
    },
}
</script>

<style scoped>
.border-b{
    border-bottom: 1px solid black;
}
a:hover{ cursor: pointer; }
#wallPaperCon .clearfix:before, 
#wallPaperCon .clearfix:after {
    display: table;
    content: "";
}
#wallPaperCon .clearfix:after {
    clear: both
}
#shopSearchBox div:hover{
    cursor: pointer;
}
#searchBtn{
    color: #101010;
    cursor: pointer;
}
#searchHistory ul{
    display: inline-block;
}
#searchHistory ul li{
    min-width: 50px;
    height: 20px;
    line-height: 20px;
    float: left;
    padding: 5px 0px;
    margin-right: 5px;
    text-align: center;
}
#searchHistory ul li a{
    margin-right: 5px;
    text-decoration: none;
    color: #303133;
}
#searchHistory ul li a:hover{
    color: orangered;
    font-weight: bold;
}
.num-font{
    margin: 0 2px;
}
</style>


<style>
#wallPaperCon .el-dialog__body{
    padding: 10px;
}
#shopsCon .el-table__expand-icon::after{
    display: none;
    position: relative;
    bottom: 1px;
    font-size: 14px;
    content: "选择此款";
    color: red;
    cursor: pointer;
    -webkit-transition: background-color .25s ease;
    transition: background-color .25s ease;
}
#wallPaperCon .el-table__expand-icon >i{
    display: none !important;
}
#searchBoxW .el-form-item{
    display: block;
}
</style>