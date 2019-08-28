<template>
    <div id="curtain">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span class="fstrong f16">窗帘</span>
            </div>
            <div id="shopsCon">
                <p class="f12 tl" style="color: red;">（带*号表示可选择帘头外包盒）</p>
                <div id="shopSearchBox" class="mt10">
                    <el-input clearable
                        v-model.trim="searchKey" 
                        @clear="getData(1)"
                        @keyup.enter.native="getDataBlur(1)"
                        placeholder="输入商品型号查找商品"
                        style="width:25%; min-width:250px;">
                        <div id="searchBtn" slot="append" style="cursor:pointer;" @click="getDataBlur(1)">搜索</div>
                    </el-input>
                </div>
                <el-table class="loading-area"
                    :data="curtainMsg"
                    style="min-width: 750px; margin: 5px auto;">
                    <el-table-column
                        label="型号">
                        <template slot-scope="scope">
                            <div v-if="scope.row.wbhFlag === '1'">
                                {{scope.row.itemNo}}
                                <span style="color: red;">*</span>
                            </div>
                            <div v-else>
                                {{scope.row.itemNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="宽度(m)">
                        <template slot-scope="scope">
                            <currency-input
                                placeholder="0.00"
                                v-model="scope.row.width">
                            </currency-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="高度(m)">
                        <template slot-scope="scope">
                            <currency-input
                                placeholder="0.00"
                                v-model="scope.row.height">
                            </currency-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="帘外包宽度(m)"
                        prop="fixGrade">
                        <template slot-scope="scope">
                            <div v-if="scope.row.wbhFlag === '1'">
                                <el-checkbox v-model="scope.row.isWBH">
                                    <currency-input
                                        placeholder="0.00"
                                        v-model="scope.row.WBH">
                                    </currency-input>
                                </el-checkbox>
                            </div>
                            <div v-else>
                                <el-checkbox v-model="scope.row.isWBH" disabled>
                                    <el-input
                                        style="width:85px;"
                                        size="mini"
                                        placeholder="无"
                                        v-model="scope.row.WBH"
                                        disabled>
                                    </el-input>
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="褶皱倍数">
                        <template slot-scope="scope">
                            <el-select size="mini" v-model="scope.row.multiple" style="width:85px;">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="位置">
                        <template slot-scope="scope">
                            <el-input
                                style="width:85px;"
                                size="mini"
                                placeholder="选填"
                                v-model="scope.row.location">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="活动">
                        <template slot-scope="scope">
                            <el-select size="mini" 
                                :disabled="isActivity[scope.$index]"
                                v-model="scope.row.activity" 
                                :placeholder="(isActivity[scope.$index] === true)?'无可选活动':'请选择活动'">
                                <el-option
                                    v-for="item in activityOptions[scope.$index]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <a @click="chooseItem(scope.row,scope.$index)" style="color:red;">选择此款</a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="tc"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="totalNumber">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import { 
    getCurtainMsg,
    getShopSingleCurtain
} from '@/api/shopSearch'
import {
    findItemActivity
} from '@/api/findActivity'

export default {
    name: 'Curtain',
    data(){
        return{
            cid: Cookies.get('cid'),  //假定的用户ID
            customerType: Cookies.get('customerType'), //客户类型
            searchKey : '', //搜索的关键词
            //窗帘数据
            curtainData: [],
            //产品对应的数据：宽、高、假帘高、褶皱倍数、位置、活动
            curtainMsg: [],
            //褶皱倍数选项
            options:[
                { value: '2.0'},
                { value: '2.1' },
                { value: '2.2' },
                { value: '2.3' },
                { value: '2.4' },
                { value: '2.5' },
                { value: '2.6' },
                { value: '2.7' },
                { value: '2.8' },
                { value: '2.9' },
                { value: '3.0' }
            ],
            activityOptions: [],//活动的数组
            isActivity: [false,false,false,false,false,false,false,false,false,false],     //是否有活动
            activityGroup: [],  //活动ID对应的groupType
            currentPage: 1,     //当前的页数
            pageSize: 10,       //每页的个数
            totalNumber: 0,   //总条数
        }
    },
    methods:{
        //进入窗帘详情
        chooseItem(data,index){
            let arr = []
            let str = ''
            if(data.width === ''){ arr.push('宽度') }
            if(data.height === ''){ arr.push('高度') }
            if(data.multiple === ''){ arr.push('褶皱倍数') }
            if(arr.length !== 0){
                str = arr.join('、')
                this.$alert(`请确保产品${data.itemNo}的${str}已经输入!!`,'提示',{
                    confirmButtonText: '好的',
                })
                return ;
            }
            if(data.activity === ''){
                if((this.isActivity[index] === false)){
                    this.$alert('请选择活动!!','提示',{
                        confirmButtonText: '好的',
                    })
                    return ;
                }
                else    data.activity = null;
            }
            if(data.wbhFlag === '1' && data.isWBH === false && data.WBH !== ''){
                this.$alert('在填写了帘外包宽度的情况下，请勾选前面的按钮!!','提示',{
                    confirmButtonText: '好的',
                })
                return ;
            }
            if(data.wbhFlag === '1' && data.isWBH === true && data.WBH === ''){
                this.$alert('在勾选了帘外包的情况下，帘外包宽度不能为空!!','提示',{
                    confirmButtonText: '好的',
                })
                return ;
            }
            let _groupType;
            this.activityGroup.forEach(item => {
                if(item.pId === data.activity){
                    _groupType = item.groupType;
                }
            });
            this.curtainMsg[index].groupType = _groupType;
            Cookies.set('curtainMsg',data);
            console.log(data);
            this.addTab('shops/shoppingCurtainDetail');
            this.$router.push({
                name: `shoppingCurtainDetail`
            });
        },
        ...mapMutations('navTabs', [
            'addTab'
        ]),
        ...mapActions('navTabs',[
            'closeTab'
        ]),
        //清空信息
        clearMsg(){
            this.curtainData = [];
            this.curtainMsg = [];
            this.currentPage = 1;
            this.totalNumber = 0;
        },
        //获取每页的条数
        handleSizeChange(val){
            console.log(`每页${val}条`);
        },
        //当前页改变时的操作
        handleCurrentChange(val){
            if(this.searchKey === ''){
                this.getData(0);
            }
            else{
                this.getDataBlur(0);
            }
        },
        //获取窗帘数据--默认搜索
        getData(status){
            if(this.searchKey !== '')   return;
            //0为默认搜索，1为搜索时首页
            if(status === 1)    this.currentPage = 1;
            let data = {
                limit: this.pageSize,
                page: this.currentPage,
            };
            getCurtainMsg(data).then(res =>{
                //赋值给表格
                this.curtainData = res.data;
                this.createCurtainMsg(this.curtainData);
                //获取总条数
                if(this.totalNumber !== this.curtainData[0].total){
                    this.totalNumber = this.curtainData[0].total;
                }
                console.log(this.curtainData);
            }).catch(err =>{
                //获取失败，清空数据
                this.clearMsg();
                this.searchKey = '';
            });
        },
        //获取窗帘数据--模糊搜索
        getDataBlur(status){
            //0为默认模糊搜索，1为模糊搜索时首页
            if(this.searchKey === '')   return;
            if(status === 1)    this.currentPage = 1;
            let data = {
                itemNo: this.searchKey.toUpperCase(),
                limit: this.pageSize,
                page: this.currentPage
            };
            getShopSingleCurtain(data).then(res =>{
                //赋值给表格
                this.curtainData = res.data;
                this.createCurtainMsg(this.curtainData);
                if(this.totalNumber !== this.curtainData[0].total){
                    this.totalNumber = this.curtainData[0].total;
                }
                console.log(this.curtainData);
            }).catch(err =>{
                //获取失败，清空数据
                this.clearMsg();
            })
        },
        //渲染到表格的数
        async createCurtainMsg(data){
            this.curtainMsg = [];
            this.activityOptions = [];
            this.isActivity = [];
            for(let i = 0; i < data.length; i++){
                this.curtainMsg.push({
                    itemNo: data[i].itemNo, //型号
                    width: '',              //宽
                    height: '',             //高
                    WBH: '',                //假帘高
                    isWBH: false,           //false:不选假帘高，true：选择假帘高
                    wbhFlag: data[i].wbhFlag, //1：需要假帘高，0：不需要假帘高
                    multiple: '2.2',          //褶皱倍数
                    location: '',           //位置
                    activity: '',           //活动
                    groupType: '',          //groupType
                });
                await this.getProductActivity(data[i]).then(res =>{
                    console.log(res);
                    if(res.length === 0)    this.isActivity.push(true);
                    else    this.isActivity.push(false);
                    let _obj = [];
                    for(var i=0; i<res.length; i++){
                        for(var j=0; j<res[i].second.length; j++){
                            var obj = {
                                label: res[i].second[j].orderType+' '+res[i].second[j].orderName,
                                value: res[i].second[j].pId,
                            }
                            var obj1 = {
                                pId: res[i].second[j].pId,
                                groupType: res[i].second[j].groupType
                            }
                            let re = this.activityGroup.some(i => i.pId === obj1.pId);
                            if(re === false)    this.activityGroup.push(obj1);
                            _obj.push(obj);
                        }
                    };
                    console.log(this.activityGroup);
                    _obj.push({
                        label: '不参与活动',
                        value: null
                    });
                    this.activityOptions.push(_obj);
                }).catch(err =>{
                    this.isActivity.push(true);
                    this.activityOptions.push([]);
                    console.log(err);
                });
            }
        },
        //获取产品活动
        getProductActivity(data){
            let obj = {
                CID: this.cid,
                customerType: this.customerType,
                itemNo: data.itemNo,
                itemVersion: data.itemVersion,
                productType: data.productType,
                productBrand: data.productBrand
            };
            return new Promise((resolve,reject) => {
                findItemActivity(obj).then(res =>{
                    return resolve(res);
                }).catch(err =>{
                    return reject(err);
                })
            })
        },
        //初始化
        init(){
            this.getData(1);
        }
    },
    created(){
        this.init();
    }
}
</script>

<style>

#searchBox .el-input__inner{
    height:34px;
    border-radius:0px;
    outline:none; 
}
#searchBox .el-form-item{
    display: block;
}
</style>

<style scoped>
a:hover{ cursor: pointer; }
.clearfix:before, .clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
#searchBox{
    width: 47%;
    display: inline-block;
}
#searchBtn{
    color: #101010;
    cursor: pointer;
}
</style>

