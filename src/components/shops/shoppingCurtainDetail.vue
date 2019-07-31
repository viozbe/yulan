<template>
    <div>
        <el-card shadow="hover">
            <!-- <div slot="header">
                <span class="fstrong f16">修改商品信息：</span>
            </div> -->
            <div class="mb10">
                <p class="fstrong f16">商品信息：</p>
            </div>
            <!-- <span style="color: red;" class="f12 mt5">(带单选框表示可要可不要)</span> -->
            <el-table style="width:100%;" border
                :data="curtainData"
                :span-method="cellMerge">
                <el-table-column
                    width="170"
                    label="商品信息">
                    <template>
                        <div class="messageBox">
                        <div>
                            <label>款号:</label>
                            <div class="messageInput">{{message.itemNo}}</div>
                        </div>
                        <div>
                            <label>成品宽:</label>
                            <div class="messageInput">{{message.width}}</div>m
                        </div>
                        <div>
                            <label>成品高:</label>
                            <div class="messageInput">{{message.height}}</div>m
                        </div>
                        <div>
                            <label>假帘高:</label>
                            <div class="messageInput">{{message.highJia}}</div>m
                        </div>
                        <div>
                            <label>褶皱倍数:</label>
                            <div class="messageInput">{{message.multiple}}</div>
                        </div>
                        <div>
                            <label>帘头外包盒单边宽度:</label>
                            <div class="messageInput">{{(message.WBH === '')?'无':message.WBH}}</div>m
                        </div>
                        <div>
                            <label>位置:</label>
                            <div class="messageInput" style="width: 100px;">{{(message.location === '')?'无':message.location}}</div>
                        </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="名称"
                    width="60">
                    <template slot-scope="scope">
                        {{getTypeName(scope.row.itemType)}}
                        <br>
                        <el-checkbox @change="changeLink('lt',0)" v-if="scope.row.itemType === 'lt'" v-model="chooseBig[0]">
                            <span v-if="chooseBig[0] == false" style="color: red;">×</span>
                        </el-checkbox>
                        <el-checkbox @change="changeLink('ls',1)" v-if="scope.row.itemType === 'ls'" v-model="chooseBig[1]">
                            <span v-if="chooseBig[1] == false" style="color: red;">×</span>
                        </el-checkbox>
                        <el-checkbox @change="changeLink('lspb',2)" v-if="scope.row.itemType === 'lspb'" v-model="chooseBig[2]">
                            <span v-if="chooseBig[2] == false" style="color: red;">×</span>
                        </el-checkbox>
                        <el-checkbox @change="changeLink('sha',3)" v-if="scope.row.itemType === 'sha'" v-model="chooseBig[3]">
                            <span v-if="chooseBig[3] == false" style="color: red;">×</span>
                        </el-checkbox>
                        <!-- <el-checkbox v-if="scope.row.itemType === 'pjb'" v-model="chooseBig[3]"></el-checkbox> -->
                    </template>
                </el-table-column>
                <el-table-column label="编码"
                    width="140">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="(scope.row.itemType === 'pjb' && scope.row.changeFlag === 'Y')">
                                <el-select size="mini" v-model="scope.row.itemNo" placeholder="请选择">
                                    <el-option
                                        v-for="item in part2"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </span>
                            <span v-else-if="scope.row.changeFlag === 'Y' ">
                                <a class="uline" @click="getNewItemNo(scope.row,scope.$index)">
                                    {{scope.row.itemNo}}
                                </a>
                                <el-checkbox class="ml5"
                                    v-if="scope.row.deleteFlag === 'Y'"
                                    v-model="scope.row.choose"
                                    @change="changeLinkReverse(scope.row)">
                                </el-checkbox>
                            </span>
                            <!-- <div v-else-if="scope.row.changeFlag === 'Y' && scope.row.itemType !== 'lt' && scope.row.productType !== 'SSDX'">
                                <a class="uline" @click="getNewItemNo(scope.row,scope.$index)">
                                    {{scope.row.itemNo}}
                                </a>
                                <el-checkbox class="ml5"
                                    v-if="scope.row.deleteFlag === 'Y'"
                                    v-model="scope.row.choose">
                                </el-checkbox>
                            </div>
                            <div v-else-if="scope.row.itemType === 'lt' && scope.row.productType !== 'KS'">
                                <a class="uline" @click="getNewItemNo(scope.row,scope.$index)">
                                    {{scope.row.itemNo}}
                                </a>
                                <el-checkbox class="ml5"
                                    v-if="scope.row.deleteFlag === 'Y'"
                                    v-model="scope.row.choose">
                                </el-checkbox>
                            </div> -->
                            <span v-else>
                                {{scope.row.itemNo}}
                                <el-checkbox class="ml5"
                                    v-if="scope.row.deleteFlag === 'Y'"
                                    v-model="scope.row.choose"
                                    @change="changeLinkReverse(scope.row)">
                                </el-checkbox>
                            </span>
                            <span v-if="bigToSmall(scope.row) == true" 
                                style="color: red;">
                                ×
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.note !== null">{{scope.row.note}}</div>
                        <div v-else>{{getTypeName(scope.row.itemType)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="规格:米/对"
                    width="60"
                    align="center">
                    <template slot-scope="scope">
                        {{(scope.row.fixGrade===0 || scope.row.fixGrade === null)?'--':scope.row.fixGrade/1000}}
                    </template>
                </el-table-column>
                <el-table-column label="面料属性"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.fixType !== '' && scope.row.fixType !== null && scope.row.productType === 'ML'">
                            <el-select
                                size="mini" 
                                v-model="scope.row.fixType" 
                                placeholder="请选择"
                                @change="changeDosageByFixtype(scope.$index)">
                                <el-option
                                    v-for="item in fixType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- {{(scope.row.fixType === '01')?'定宽':'定高'}} -->
                        </div>
                        <div v-else></div>
                    </template>
                </el-table-column>
                <el-table-column label="用量"
                    width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.itemType === 'lspb'"></span>
                        <span v-else-if="scope.row.modifyFlag === 'Y'">
                            <el-input
                                style="width: 75%;"
                                size="mini"
                                v-model="scope.row.dosage">
                            </el-input>
                            {{(scope.row.dosage === '')?'':scope.row.unit}}
                        </span>
                        <span v-else>
                            {{scope.row.dosage|dosageFilter}}
                            {{(scope.row.dosage === '')?'':scope.row.unit}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="制造说明"
                    width="130">
                    <template slot-scope="scope">
                        <div v-if="scope.row.itemType === 'lt'">
                            <el-select size="mini" v-model="scope.row.creator" placeholder="--未选--">
                                <el-option
                                    v-for="item in part0"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else-if="scope.row.productType === 'ML'">
                            <el-select size="mini" v-model="scope.row.creator" placeholder="--未选--">
                                <el-option
                                    v-for="item in part1"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <!-- <div v-if="part[scope.$index].length !== 0">
                            <el-select size="mini" v-model="scope.row.creator" placeholder="--未选--">
                                <el-option
                                    v-for="item in part[scope.$index]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div> -->
                    </template>
                </el-table-column>
                <el-table-column label="说明" width="80">
                    <template slot-scope="scope">
                        <span style="color:red;">
                            {{scope.row.tip}}
                            <!-- {{judgeTip(scope.row,scope.$index)}} -->
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input
                            type="textarea"
                            :autosize="{ maxRows: 6 }"
                            v-model="scope.row.remark"
                            clearable>
                        </el-input>
                        {{getRemark(scope.row)}}
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog width="65%"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false">
                <div slot="title"><b>{{dialogTitle}}</b></div>
                <div v-if="items.length !== 0">
                    <el-input clearable size="small" class="ml10 mb10"
                        v-if="curtainData[chooseIndex].productType !== 'GY'"
                        placeholder="输入商品型号查找"
                        style="width:25%; min-width:220px;"
                        v-model.trim="searchKey"
                        @clear="getAllItemNoData(1)"
                        @keyup.enter.native="getSingleItemNoData(1)">
                        <div id="searchBtn" slot="append" @click="getSingleItemNoData(1)">搜索</div>
                    </el-input>
                    <br>
                    <el-radio border size="small"
                        class="mt10 ml10"
                        v-for="item in items"
                        :value="item.itemNo"
                        :key="item.itemNo"
                        v-model="itemNo" :label="item.itemNo">
                        <span v-if="chooseType === 'LCB' || chooseType === 'GY'">
                            {{item.itemNo+' '+item.note}}
                        </span>
                        <span v-else>{{item.itemNo}}</span>
                    </el-radio>
                    <el-pagination
                        v-if="curtainData[chooseIndex].productType !== 'GY'"
                        class="tc mt10"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="totalNumber">
                    </el-pagination>
                </div>
                <div v-else style="height: 200px;">
                    暂无数据
                </div>
                <footer class="mt20" style="text-align: center;">
                    <el-button class="mr10" type="success" 
                        @click="chooseItemNo" plain>确定</el-button>
                    <el-button class="ml10" type="danger"
                        @click="dialogTableVisible = false" plain>取消</el-button>
                </footer>
            </el-dialog>
            <div style="text-align: center;" class="mt20">
                <!-- <router-link to="/shoppingCar/shopping?curtain">
                    <el-button type="danger" class="mr20" width="130px"
                        @click.native="addTab('shoppingCar/shopping?curtain')">
                        保存至购物车
                    </el-button>
                </router-link> -->
                <el-button type="danger" class="mr20" width="130px"
                    @click="addCurtainToShoppingCar">
                    保存至购物车
                </el-button>
                <router-link to="/shops/curtain">
                    <el-button type="info" class="ml20" width="130px"
                        @click.native="closeToTab({oldUrl: 'shops/shoppingCurtainDetail',newUrl: 'shops/curtain'})">
                        返回
                    </el-button>
                </router-link>
            </div>
        </el-card>
    </div>
</template>

<script>
import {
    getCurtainDetailMsg,
    getGY,
    changeDosageByNo,
    addCurtainToCar,
    changeItem,
    changeItemBlur,
} from '@/api/curtain'
import Cookies from 'js-cookie'
import { mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
    name: 'shoppingCurtainDetail',
    data(){
        return{
            cid: Cookies.get('cid'),  //假定给的用户id
            customerType: Cookies.get('customerType'), //客户类型
            getParams: Cookies.get('curtainMsg'),  //获取传入的参数
            //获取真实数据
            message:{
                itemNo: 'T330029',
                width : parseFloat(10.001),      //成品宽度
                height: parseFloat(5.001),       //成品高度
                WBH: parseFloat(1.001),          //帘头外包盒宽度
                multiple: parseFloat(2.2),      //褶皱倍数
                location: '123',
                groupType: '',                  //活动组
            },
            chooseBig: [true,true,true,true,true], //是否选择了大类
            spanArr0: [],                   //商品信息跨行的数据
            spanArr1: [],                   //名称跨行的数据
            spanArr2: [],                   //编码名称跨列，配件包专有
            pos: 0,                         //和spanArr对应的下标
            chooseIndex: -1,                //默认选中的数据下标
            dialogTableVisible: false,      //是否出现弹出层
            dialogTitle: '',                //弹出层标题
            searchKey: '',                  //搜索的关键词
            items: [],                      //可供选择的全部编码
            currentPage: 1,                 //当前的页数
            pageSize: 30,                   //每页的个数
            totalNumber: 0,                 //全部编码的数量
            chooseType: '',                 //选中的产品类型
            itemNo: '',                     //选中的编码
            //接口获取到的全部数据
            allData: {},
            //窗帘数据
            curtainData: [],
            //窗帘大类状态
            curtainType: [],
            //风格切换：01--定宽，02--定高
            fixType: [
                {
                    value: '01',
                    label: '定宽'
                },
                {
                    value: '02',
                    label: '定高'
                }
            ],
            //根据编号查询制造说明
            part: [],
            //帘头制造说明
            part0: [
                { value: '幺术贴正车' },
                { value: '幺术贴反车' },
                { value: '穿/挂杆款' },
                { value: '特殊见备注' }
            ],
            //帘身、纱制造说明
            part1: [
                { value: '对开' },
                { value: '单开' },
                { value: '特殊开备注' },
            ],
            //配件编码
            part2: [
                { label: 'GD920011:挂带', value: 'GD920011' },
                { label: 'GD920012:挂带', value: 'GD920012' },
                { label: 'GD920013:挂带', value: 'GD920013' },
                { label: 'GD920041:挂带', value: 'GD920041' },
                { label: 'GD920042:挂带', value: 'GD920042' },
                { label: 'GD920061:挂带', value: 'GD920061' },
                { label: 'GD920062:挂带', value: 'GD920062' },
                { label: 'GD920063:挂带', value: 'GD920063' },
                { label: 'GD920071:挂带', value: 'GD920071' },
                { label: 'GD920072:挂带', value: 'GD920072' },
                { label: 'GD920073:挂带', value: 'GD920073' },
                { label: 'GD920101:挂带', value: 'GD920101' },
                { label: 'GD920102:挂带', value: 'GD920102' },
                { label: 'GD920103:挂带', value: 'GD920103' },
                { label: 'GD920111:挂带', value: 'GD920111' },
                { label: 'GD920112:挂带', value: 'GD920112' },
                { label: 'GD920113:挂带', value: 'GD920113' },
                { label: 'GD920121:挂带', value: 'GD920121' },
                { label: 'GD920131:挂带', value: 'GD920131' },
                { label: 'GD920141:挂带', value: 'GD920141' },
                { label: 'PJB-006:绑带(赠送)', value: 'PJB-006' },
                { label: 'PJB-001:挂带+侧钩(赠送)', value: 'PJB-001' },
                { label: 'PJB-009-KAFEI:吊球+挂钩', value: 'PJB-009-KAFEI' },
                { label: 'PJB-009-KAQI:吊球+挂钩', value: 'PJB-009-KAQI' },
                { label: 'PJB-009-MIHUANG:吊球+挂钩', value: 'PJB-009-MIHUANG' },
                { label: 'PJB-009-QIANHUI:吊球+挂钩', value: 'PJB-009-QIANHUI' },
                { label: '-未选择配件包-', value: null },
            ],
        }
    },
    created(){
        // if(this.getParams.curtainMessage != undefined)
        //     Cookies.set('curtainMessage',this.getParams.curtainMessage);
        // this.message = JSON.parse(Cookies.get('curtainMessage'));
        // this.curtainData.type = this.message.type;
        // this.curtainData.width = this.message.width;
        // this.curtainData.height = this.message.height;
        // this.curtainData.wrinkle = this.message.foldMultiple;
        // console.log(this.message);
        if(Cookies.get('curtainMsg') !== undefined && Cookies.get('curtainMsg') !== null){
            this.message = JSON.parse(Cookies.get('curtainMsg'));
            console.log(this.message);
            this.getPJB();
            this.getDetail();
        }
    },
    methods:{
        //大类和二类的联动
        changeLink(type,index){
            for(let i = 0; i < this.curtainData.length; i++){
                if(this.curtainData[i].itemType === type){
                    this.curtainData[i].choose = this.chooseBig[index];
                }
            }
        },
        //大类和二类的反向联动
        changeLinkReverse(data){
            let _index;
            let _arr = this.getBigType(data.itemType);
            let flag = true;
            switch(data.itemType){
                case 'lt':
                    _index = 0;
                    break;
                case 'ls':
                    _index = 1;
                    break;
                case 'lspb':
                    _index = 2;
                    break;
                case 'sha':
                    _index = 3;
                    break;
                case 'pjb':
                    _index = 4;
                    break;
                default:
                    _index = -1;
            }
            if(_index >= 0 && _index <= 4){
                _arr.forEach(item => {
                    if(item.deleteFlag !== 'Y' || item.choose === true){
                        flag = false;
                    }
                })
                if(data.choose || flag){
                    this.chooseBig[_index] = data.choose;
                }
            }
        },
        //获取某个大类的全部数据
        getBigType(type){
            let arr = [];
            this.curtainData.forEach(item => {
                if(item.itemType === type){
                    arr.push(item);
                }
            });
            return arr;
        },
        //获取窗帘配件包数据
        getPJB(){
            this.part2 = []
            let obj = {
                limit: 999,
                page: 1,
                itemNO: 'PJB'
            }
            changeItem(obj).then(res =>{
                let _arr = []
                res.data.forEach(item =>{
                    _arr.push({
                        label: `${item.itemNo}:${item.note}`,
                        value: item.itemNo
                    })
                })
                _arr.sort(function(a , b){
                    return (a.value>b.value)?1:-1   //升序
                })
                _arr.push({ label: '-未选择配件包-', value: null })
                this.part2 = _arr
            }).catch(err =>{
                this.part2 = []
            })
        },
        //通过窗帘头信息获取接口信息
        getDetail(){
            let data = {
                itemNO: this.message.itemNo,
                width : this.message.width,      //成品宽度
                height: this.message.height,       //成品高度
                WBH: (this.message.isWBH === false || this.message.WBH === '')?'0':this.message.WBH,          //帘头外包盒宽度
                multiple: this.message.multiple,      //褶皱倍数
                location: this.message.location
            };
            getCurtainDetailMsg(data).then(res =>{
                this.allData = res;
                this.getCurtainMsg(res);
                this.getSpanArr(res);
                console.log(res);
            }).catch(err =>{
                console.log(err);
            })
        },
        //通过接口数据生成窗帘表格信息
        getCurtainMsg(data){
            this.curtainData = [];
            this.message.highJia = this.allData.itemList[0].highJia;
            for(let i = 0; i < data.itemList.length; i++){
                //获取编号对应的制造说明
                // await this.getTheGY(data.itemList[i].itemNo).then(res =>{
                //     let gy = [];
                //     for(let j = 0; j < res.length; j++){
                //         gy.push({
                //             value: res[j],
                //             label: res[j]
                //         });
                //     }
                //     this.part.push(gy);
                // });
                //乱码解决
                if(data.itemList[i].unit === '°ü')  data.itemList[i].unit = '包';
                if(data.itemList[i].itemMLGY.itemType === 'lspb'){
                    data.itemList[i].fixType = '';
                }   
                let obj = {
                    itemNo: data.itemList[i].itemNo,                    //编号
                    itemType: data.itemList[i].itemMLGY.itemType,       //型号
                    productType: data.itemList[i].itemMLGY.productType, //产品号
                    note: data.itemList[i].note,                        //名称
                    fixGrade: data.itemList[i].fixGrade,                //规格
                    fixType: data.itemList[i].fixType,                  //风格
                    dosage: '',                                         //用量
                    creator: '',                                        //制造说明
                    tip: '',                                            //说明
                    remark: '',                                         //备注
                    unit: data.itemList[i].unit,                        //单位
                    modifyFlag: data.itemList[i].itemMLGY.modifyFlag,   //用量是否可以修改，Y可修改，N不可修改
                    deleteFlag: data.itemList[i].itemMLGY.deleteFlag,   //物料是否可删除，Y可删除，N不可删除
                    changeFlag: data.itemList[i].itemMLGY.changeFlag,   //物料是可以替换，Y可替换，N不可替换
                    choose: true,                                       //是否选中，默认选中了
                    inlineNo: data.itemList[i].itemMLGY.no                //编号
                };
                this.curtainData.push(obj);
                this.getDosage(obj,i);
            }
            console.log(this.curtainData);
        },
        //点击更换编码名称
        getNewItemNo(data,index){
            // let _itemType = data.itemType;
            // let _productType = data.productType;
            // let status = (_productType === 'ML')?true:false;
            // let status1 = (_productType === 'GY')?true:false;
            // if(_itemType !== 'ls' && _itemType !== 'sha'){
            //     this.$alert('该产品无法修改', '提示', {
            //         confirmButtonText: '确定',
            //         type: 'warning'
            //     });
            //     return;
            // }
            // if(status === false && status1 === false){
            //     this.$alert('该产品无法修改', '提示', {
            //         confirmButtonText: '确定',
            //         type: 'warning'
            //     });
            //     return;
            // }
            this.itemNo = '';
            this.searchKey = '';
            this.items = [];
            this.dialogTableVisible = true;
            this.dialogTitle = `【${this.getProductName(data.productType)}】类产品列表`;
            this.chooseIndex = index;
            this.chooseType = data.productType;
            console.log(this.chooseType)
            if(data.productType !== 'GY'){
                this.getAllItemNoData(1);
            }
            else{
                this.getTheGY(this.message.itemNo);
            }
        },
        //获取每页的条数
        handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
        },
        //当前页改变时的操作
        handleCurrentChange(val){
            if(this.searchKey === ''){
                this.getAllItemNoData(0);
            }
            else{
                this.getSingleItemNoData(0);
            }
        },
        //获取可修改的全部编码
        getAllItemNoData(status){
            if(this.searchKey !== '')   return;
            //0为默认搜索，1为搜索时首页
            if(status === 1)    this.currentPage = 1;
            let obj = {
                itemNO: this.chooseType,
                limit: this.pageSize,
                page: this.currentPage,
            }
            changeItem(obj).then(res =>{
                this.items = res.data;
                this.totalNumber = res.data[0].total;
            }).catch(err =>{
                this.items = [];
                this.currentPage = 1;
                this.totalNumber = 0;
            })
        },
        //获取模糊搜索的编码
        getSingleItemNoData(status){
            //0为默认模糊搜索，1为模糊搜索时首页
            if(this.searchKey === '')   return;
            if(status === 1)    this.currentPage = 1;
            let obj = {
                itemType: this.chooseType,
                itemNO: this.searchKey.toUpperCase(),
                limit: this.pageSize,
                page: this.currentPage,
            };
            changeItemBlur(obj).then(res =>{
                this.items = res.data;
                this.totalNumber = res.data[0].total;
            }).catch(err =>{
                this.items = [];
                this.currentPage = 1;
                this.totalNumber = 0;
            })
        },
        //修改编码--影响用量
        chooseItemNo(){
            if(this.itemNo === ''){
                this.$alert('请选择一个产品', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
                return;
            }
            if(this.chooseIndex < 0){
                this.dialogTableVisible = false;
                return;
            }
            let _productType = this.curtainData[this.chooseIndex].productType;
            let status = (_productType === 'ML')?true:false;
            let status1 = (_productType === 'GY')?true:false;
            this.dialogTableVisible = false;
            //修改对应的名称规格
            let data = this.items.find(v =>{
                if(v.itemNo === this.itemNo)
                    return v;
            });
            this.curtainData[this.chooseIndex].note = data.note;
            this.curtainData[this.chooseIndex].fixGrade = data.fixGrade;
            this.curtainData[this.chooseIndex].fixType = (data.fixType === null)?'':data.fixType;
            this.allData.itemList[this.chooseIndex].fixType = (data.fixType === null)?'':data.fixType;
            //非工艺修改用量
            if(!status1){
                //修改用量
                let obj = {
                    width: this.message.width,
                    height: this.message.height,
                    WBH: (this.message.WBH!=='')?this.message.WBH:'0',
                    multiple: this.message.multiple,
                    parentItemNo: this.message.itemNo,
                    itemNO: this.itemNo,    
                    itemType: this.curtainData[this.chooseIndex].itemType,
                    fixType: this.curtainData[this.chooseIndex].fixType
                };
                changeDosageByNo(obj).then(res =>{
                    let _data = this.curtainData[this.chooseIndex];
                    //绣花边只需要修改自身，无需修改面料
                    if(_data.productType === 'XHB'){
                        let keys = Object.values(res)[0];
                        if(isNaN(Number(keys))){
                            this.$alert('用量获取失败', '提示', {
                                confirmButtonText: '好的',
                                type: 'warning'
                            });
                            return;
                        }
                        this.curtainData[this.chooseIndex].dosage = keys;
                    }
                    //面料除了修改自身，还需修改所有其他的，除了LCB、XHB之外的所有，工艺继续做进一步判断
                    else if(_data.productType === 'ML'){
                        let keys = Object.values(res)[2];
                        if(isNaN(Number(keys))){
                            this.$alert('用量获取失败', '提示', {
                                confirmButtonText: '好的',
                                type: 'warning'
                            });
                            return;
                        }
                        this.updateDosage(_data.itemType,keys);
                    }
                    this.curtainData[this.chooseIndex].itemNo = this.itemNo;
                    this.judgeTip(_data,this.chooseIndex);
                }).catch(err =>{
                    console.log(err);
                })
            }
            //工艺用量修改
            else if(status1){
                this.curtainData[this.chooseIndex].itemNo = this.itemNo;
                this.judgeTip(this.curtainData[this.chooseIndex],this.chooseIndex);
                if(this.curtainData[this.chooseIndex].itemNo === 'GY-003'){
                    this.curtainData[this.chooseIndex].dosage = this.allData.GY;
                }
                else{
                    for(let i = 0 ; i < this.curtainData.length; i++){
                        if(this.curtainData[i].itemType === this.curtainData[this.chooseIndex].itemType && i !== this.chooseIndex){
                            if(this.curtainData[i].productType === 'ML'){
                                this.curtainData[this.chooseIndex].dosage = this.curtainData[i].dosage;
                                break;
                            }
                        }
                    }
                }
            }
        },
        //修改风格
        changeDosageByFixtype(index){
            let obj = {
                width: this.message.width,
                height: this.message.height,
                WBH: (this.message.WBH!=='')?this.message.WBH:'0',
                multiple: this.message.multiple,
                parentItemNo: this.message.itemNo,
                itemNO: this.curtainData[index].itemNo,    
                itemType: this.curtainData[index].itemType,
                fixType: this.curtainData[index].fixType
            };
            changeDosageByNo(obj).then(res =>{
                let _data = this.curtainData[index];
                //绣花边只需要修改自身，无需修改面料
                if(_data.productType === 'XHB'){
                    let keys = Object.values(res)[0];
                    if(isNaN(Number(keys))){
                        this.$alert('用量获取失败', '提示', {
                            confirmButtonText: '好的',
                            type: 'warning'
                        });
                        return;
                    }
                    this.curtainData[index].dosage = keys;
                }
                //面料除了修改自身，还需修改所有其他的，除了LCB、XHB之外的所有，工艺继续做进一步判断
                else if(_data.productType === 'ML'){
                    let keys = Object.values(res)[2];
                    if(isNaN(Number(keys))){
                        this.$alert('用量获取失败', '提示', {
                            confirmButtonText: '好的',
                            type: 'warning'
                        });
                        return;
                    }
                    this.updateDosage(_data.itemType,keys);
                }
                this.judgeTip(this.curtainData[index],index);
            }).catch(err =>{
                console.log(err);
            })
        },
        //获取产品类别名称
        getProductName(val){
            switch(val){
                case 'PJB':
                    return '配件包/挂袋';
                case 'XHB':
                    return '绣花边';
                case 'ZX':
                    return '增项服务';
                case 'MLP':
                    return '面料(配布)';
                case 'CPL':
                    return '成品帘';
                case 'SSDX':
                    return '缩水定型';
                case 'LCB':
                    return '里衬布';
                case 'KS':
                    return '帘头';
                case 'ML':
                    return '面料(主布)';
                case 'GY':
                    return '工艺';
                case 'WBH':
                    return '外包盒';
                default:
                    return '其它';
            }
        },
        //获取窗帘大类名称
        getTypeName(val){
            switch(val){
                case 'lt':
                    return '帘头';
                case 'ls':
                    return '帘身';
                case 'lspb':
                    return '帘身配布';
                case 'sha':
                    return '纱';
                case 'pjb':
                    return '配件';
                default:
                    return '暂无名称';
            }
        },
        //获取窗帘大类用量
        getDosage(data,index){
            let val = data.itemType;
            let pval = data.productType;
            let _val;
            if(pval === 'GY' && data.itemNo === 'GY-003'){
                _val = this.allData.GY;
            }
            else{
                switch(val){
                    case 'lt':
                        if(pval === 'XHB')  _val = this.allData.XHBlt;
                        else    _val = this.allData.lt;
                        break;
                    case 'ls':
                        if(pval === 'LCB')  _val = this.allData.LCB;
                        else if(pval === 'XHB') _val = this.allData.XHBls;
                        else    _val = this.allData.ls;
                        break;
                    case 'sha':
                        _val = this.allData.sha;
                        break;
                    case 'pjb':
                        _val = this.allData.pjb;
                        break;
                    case 'LCB':
                        _val = this.allData.LCB;
                        break;
                    default:
                        _val = '';
                }
            }
            _val = Number(_val);
            if(isNaN(_val))    _val = '';
            this.curtainData[index].dosage = Math.round(_val * 100) / 100; 
        },
        //动态修改大类的全部用量
        updateDosage(itemType,dosage){
            for(let i = 0; i < this.curtainData.length; i++){
                let pType = this.curtainData[i].productType
                if(this.curtainData[i].itemType === itemType && pType !== 'LCB' && pType !== 'XHB'){
                    if(this.curtainData[i].itemNo !== 'GY-003'){
                        this.curtainData[i].dosage = dosage;
                    }
                    else{
                        this.curtainData[i].dosage = this.allData.GY;
                    }
                }
            }
        },
        //获取备注文字
        getRemark(data){
            if(data.fixType === '02'){
                let _fixType = data.fixGrade/1000;
                if(_fixType < this.message.height){
                    return '超高帘，用量待审核!!'
                }
            }
            return '';
        },
        //通过编号获取工艺
        getTheGY(itemNo){
            let data = {
                itemNO: itemNo
            };
            this.currentPage = 1;
            getGY(data).then(res =>{
                // let _items = [];
                // for(let i = 0; i < res.itemList.length; i++){
                //     _items.push({
                //         itemNo: res.itemList[i]
                //     });
                // }
                this.items = res.itemList;
                this.totalNumber = res.itemList.length;
            }).catch(err =>{
                this.items = [];
                this.totalNumber = 0;
            })
        },
        //动态判断制造说明
        judgeTip(data,index){
            let status = -1;
            if(data.fixType === '02' && this.allData.itemList[index].fixType === '01'){
                status = 1;
            }
            if(data.fixType === '01' && this.allData.itemList[index].fixType === '02'){
                status = 2;
            }
            if(data.itemNo !== this.allData.itemList[index].itemNo){
                if(status === 1)  status = 4;
                else if(status === 2)   status = 5;
                else    status = 3;
            }
            switch(status){
                case 1:
                    this.curtainData[index].tip = '修改为定高';
                    break;
                case 2:
                    this.curtainData[index].tip = '修改为定宽';
                    break;
                case 3:
                    this.curtainData[index].tip = '非标配';
                    break;
                case 4:
                    this.curtainData[index].tip = '修改为定高，非标配';
                    break;
                case 5:
                    this.curtainData[index].tip = '修改为定宽，非标配';
                    break;
                default:
                    this.curtainData[index].tip = '';
            }
            //return this.curtainData[index].tip;
        },
        //通过数据动态获取行数数据
        getSpanArr(msg){
            let data = msg.itemList;
            for(let i = 0; i < data.length; i++){
                if (i === 0){
                    this.spanArr0.push(data.length);
                    this.spanArr1.push(1);
                    this.pos = 0;
                    this.curtainType.push({
                        name: data[i].itemMLGY.itemType,
                        value: true
                    });
                }
                else{
                    this.spanArr0.push(0);
                    // 判断当前元素与上一个元素是否相同
                    if(data[i].itemMLGY.itemType === data[i - 1].itemMLGY.itemType){
                        this.spanArr1[this.pos] += 1;
                        this.spanArr1.push(0);
                    }
                    else{
                        this.spanArr1.push(1);
                        this.pos = i;
                        this.curtainType.push({
                            name: data[i].itemMLGY.itemType,
                            value: true
                        });
                    }
                }
            }
        },
        //通过数组合并行
        cellMerge({ row, column, rowIndex, columnIndex }){
            if(columnIndex === 0){
                let _row = this.spanArr0[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return{
                    rowspan: _row,
                    colspan: _col
                }
            }
            if(columnIndex === 1){
                let _row = this.spanArr1[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            if(columnIndex === 2){
                if(row.itemType === 'pjb' && row.changeFlag === 'Y'){
                    return {
                        rowspan: 1,
                        colspan: 2
                    }
                }
            }
            if(columnIndex === 3){
                if(row.itemType === 'pjb' && row.changeFlag === 'Y'){
                    return {
                        rowspan: 1,
                        colspan: 0
                    }
                }
            }
        },
        //添加窗帘入购物车
        addCurtainToShoppingCar(){
            //有制造说明的不能为空
            let _curtainData = JSON.parse(JSON.stringify(this.curtainData))
            for(let i = 0; i < _curtainData.length; i++){
                switch(_curtainData[i].itemType){
                    case 'lt':
                        if(this.chooseBig[0] === false){
                            _curtainData.splice(i--,1)
                        }
                        break
                    case 'ls':
                        if(this.chooseBig[1] === false){
                            _curtainData.splice(i--,1)
                        }
                        break
                    case 'lspb':
                        if(this.chooseBig[2] === false){
                            _curtainData.splice(i--,1)
                        }
                        break
                    case 'sha':
                        if(this.chooseBig[3] === false){
                            _curtainData.splice(i--,1)
                        }
                        break
                }
            }
            for(let i = 0; i < _curtainData.length; i++){
                let _itemType =_curtainData[i].itemType;
                if(_itemType === 'ls' || _itemType === 'sha' || _itemType === 'lspb'){
                    if(_curtainData[i].productType === 'ML'){
                        if(_curtainData[i].creator === ''){
                            this.$alert('制造说明不能为空', '提示', {
                                confirmButtonText: '好的',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                }
                if(_itemType === 'lt' && _curtainData[i].creator === ''){
                    this.$alert('制造说明不能为空', '提示', {
                        confirmButtonText: '好的',
                        type: 'warning'
                    });
                    return;
                }
                if(_curtainData[i].creator === '特殊见备注' || _curtainData[i].creator === '特殊开备注'){
                    if(this.isNull(_curtainData[i].remark)){
                        this.$alert(`${_curtainData[i].creator}不能为空`, '提示', {
                            confirmButtonText: '好的',
                            type: 'warning'
                        });
                        return;
                    }
                }
            }
            let _isWBH;
            let _WBH;
            let _curtainLists =[];
            let _data = [
                { name: 'lt', number: 0 },
                { name: 'ls', number: 0 },
                { name: 'lspb', number: 0 },
                { name: 'sha', number: 0 },
                { name: 'pjb', number: 0 }
            ];
            if(this.message.isWBH === false){
                _isWBH = 0;
                _WBH = null;
            }
            else{
                _isWBH = 1;
                _WBH = this.message.WBH;
            }
            //判断个数
            for(let i = 0; i < _curtainData.length; i++){
                switch(_curtainData[i].itemType){
                    case 'lt':
                        _data[0].number++;
                        break;
                    case 'ls':
                        _data[1].number++;
                        break;
                    case 'lspb':
                        _data[2].number++;
                        break;
                    case 'sha':
                        _data[3].number++;
                        break;
                    case 'pjb':
                        _data[4].number++;
                    default:
                        break;
                }
            }
            let _index = [0,0,0,0,0];
            for(let i = 0; i < _data.length; i++){
                for(let k = i; k >= 0; k--){
                    _index[i] += _data[k].number;
                }
            }
            for(let i = 0; i < _data.length; i++){
                if(_data[i].number === 0)   continue;
                let _obj = {
                    partName: this.getTypeName(_data[i].name),
                    curtainCommodities: []
                };
                let j = 0;
                for(let k = i; k > 0; k--){
                    j += _data[k-1].number;
                }
                for(; j < _index[i]; j++){
                    if(_curtainData[j].choose === false || _curtainData[j].itemNo === null)    continue;
                    let _certainHeightWidth = _curtainData[j].fixType;
                    if(_certainHeightWidth === '01')    _certainHeightWidth = 1;
                    if(_certainHeightWidth === '02')    _certainHeightWidth = 0;
                    let _obj1 = {
                        activityId: this.message.activity,
                        item:{
                            itemNo: _curtainData[j].itemNo,
                        },
                        note: _curtainData[j].remark,
                        unit: _curtainData[j].unit,
                        curtainPartName: this.getTypeName(_data[i].name),
                        curtainItemName: (_curtainData[j].note === null)?this.getTypeName(_data[i].name):_curtainData[j].note,
                        dosage: _curtainData[j].dosage,
                        manufacturingInstructions: _curtainData[j].creator,
                        certainHeightWidth: _certainHeightWidth,
                        specification: (_curtainData[j].fixGrade===null)?null:(_curtainData[j].fixGrade/1000).toFixed(2),
                        illustrate: _curtainData[j].tip,
                        deleteFlag: _curtainData[j].deleteFlag,
                        modifyFlag: _curtainData[j].modifyFlag,
                        changeFlag: _curtainData[j].changeFlag,
                        inlineNo: _curtainData[j].inlineNo
                    };
                    _obj.curtainCommodities.push(_obj1);
                }
                if(_obj.curtainCommodities.length !== 0) _curtainLists.push(_obj);
            }
            if(_curtainLists.length === 0 || (_curtainLists.length === 1 && _curtainLists[0].partName === '配件'
                && _curtainLists[0].curtainCommodities.length === 0)){
                this.$alert('请至少选择一款配件!','提示',{
                    confirmButtonText: '好的',
                    type: 'warning'
                });
                return ;
            }
            let obj = {
                modelNumber: this.message.itemNo,
                CID: this.cid,
                customerType: this.customerType,
                price: '',
                activityGroupType: this.message.groupType,
                width: this.message.width,
                height: this.message.height,
                drape: this.message.multiple,
                outsourcingBoxWidth: _isWBH,
                outsourcingBoxWidth: _WBH,
                curtainLists: _curtainLists,
                location: this.message.location,
                falseShadeHigh: this.message.highJia
            };
            addCurtainToCar(obj).then(res =>{
                this.closeToTab({
                    oldUrl: 'shops/shoppingCurtainDetail',
                    newUrl: 'shoppingCar/shopping?curtain'
                })
                //this.addTab('shoppingCar/shopping?curtain');
                this.$router.push({
                    path: '/shoppingCar/shopping?curtain'
                })
            }).catch(err =>{
                console.log(err);
                if(err.code === 2){
                    this.$alert('该产品信息正在完善，请等待!','提示',{
                        confirmButtonText: '好的',
                        type: 'warning'
                    });
                }
            })
        },
        ...mapMutations('navTabs', [
            'addTab'
        ]),
        ...mapActions('navTabs',[
            'closeTab','closeToTab'
        ]), 
        //判空
        isNull(str){
            if (str === '' || str === undefined || str === null ) return true;
            var regu = '^[ ]+$';
            var re = new RegExp(regu);
            return re.test(str);
        },
        //大类二类的勾选联动，是否出现×号
        bigToSmall:function(data){
            let index = -1;
            switch(data.itemType){
                case 'lt':
                    index = 0;
                    break;
                case 'ls':
                    index = 1;
                    break;
                case 'lspb':
                    index = 2;
                    break;
                case 'sha':
                    index = 3;
                    break;
                case 'pjb':
                    index = 4;
                default:
                    index = -1;
            }
            if(index >= 0 && index <= 4){
                if(this.chooseBig[index] === false || !data.choose){
                    return true
                }
            } 
            return false          
        }   
    },
    computed:{
        
    }
}
</script>

<style scoped>
/* .el-table__body tr:hover>td{background-color: initial!important;}
.el-table__body tr .current-row>td{background-color: initial!important;} */
#messageRight{
    margin: 20px 40px;
    display: inline-block;
    vertical-align: middle;
}
#messageRight tr td:nth-child(1){
    text-align: right;
}
#messageRight tr td:nth-child(2){
    padding-left: 20px;
}
#messageRight td{
    padding: 5px;
    font-size: 14px;
}
#curtainTable tr td{ padding: 6px 3px; }
#shoppingMsg>p{ margin: 20px auto; }
.messageBox>div{
    padding: 15px 0;
}
.messageInput{
    border: 1px solid #c3c3c3;
    margin-right: 3px;
    padding: 3px 6px 3px 6px;
    min-width: 65px;
    border-radius: 4px;
    color: gray;
    display: inline-block;
}
</style>