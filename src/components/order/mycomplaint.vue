<template>
<el-card class="center_login">
  <div slot="header">
    <span>投诉</span>
  </div>
  <div> 
    <!-- :model="ruleForm" -->
    <el-form  status-icon :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">

    <el-form-item label="提货单号：" prop="goodsNumber">
    <el-input v-model="ruleForm.goodsNumber"  placeholder="请输入提货单号"></el-input>
    </el-form-item>

    <el-form-item label="投诉问题：" prop="question">
    <el-select v-model="ruleForm.question" clearable placeholder="请选择问题类型">
    <el-option
      v-for="item in options"
      :key="item.question"
      :label="item.label"
      :value="item.question">
    </el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="运输工单：" prop="workSheet">
    <el-input v-model="ruleForm.workSheet"  placeholder="请输入运输工作单"></el-input>
    </el-form-item>

    <el-form-item label="投诉内容：" prop="content">
    <el-input style="width:400px;" type="textarea" maxlength="200" :autosize="{ minRows:8, maxRow:10}" resize="none" v-model="ruleForm.content" placeholder="(200字以内)"></el-input>
    <br>
    <span class="spareNum">{{ruleForm.content.length}}/200</span>
    </el-form-item>

    
    <el-form-item>
        <router-link to="/order/complaintResult">
        <el-button @click="sumbitComplaint('ruleForm')" :disabled="ruleForm.content==''?true:false" icon="el-icon-check" type="primary">提交投诉</el-button>
        </router-link>
        <router-link to="/order/myOrder">
        <el-button @click="addTab('order/myOrder')" type="success">返回</el-button>
        </router-link>
        <el-button @click="submitForm('ruleForm')" type="success">Test</el-button>
    </el-form-item>

    </el-form>
  </div>
</el-card>
</template>

<script>
import Axios from 'axios'
import { mapMutations,mapActions } from 'vuex'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
        ruleForm: {
          goodsNumber: '',
          workSheet: '',
          content:'',
          question:'',
        },
        rules: {
           goodsNumber: [
            { required: true, message: '请完善信息', trigger: 'blur' }
           ],
           workSheet: [
            { required: true, message: '请完善信息', trigger: 'blur' }
           ],
           content: [
            { required: true, message: '请完善信息', trigger: 'blur' }
           ],
        },
        options: [{
          question: '选项1',
          label: '问题1'
        }, {
          question: '选项2',
          label: '问题2'
        }, {
          question: '选项3',
          label: '问题3'
        }, {
          question: '选项4',
          label: '问题4'
        }, {
          question: '选项5',
          label: '问题5'
        }],
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$confirm('确定提交投诉？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'info'
                }).then(() => {
                  /* 预留 */ 
/*                 Axios.post('/',{
                  goodsNumber:this.goodsNumber,
                  question:this.question,
                  workSheet:this.workSheet,
                  content:this.content
                  }).then(res => {
                    console.log(res);
                  }).catch(err => {
                    console.log(err);
                  }); */
                  //跳转
                  this.addTab('order/complaintResult');
                  }).catch(() => {
                  this.$message({
                      type: 'success',
                      message: '取消操作成功'
                  });          
            });
          } 
        });
      },
        ...mapMutations('navTabs', [
        'addTab'
        ]),
        ...mapActions('navTabs',[
          'closeTab',
          'closeToTab'
        ]),
        sumbitComplaint(){
          this.$confirm('确定提交投诉？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'info'
                }).then(() => {
                  /* 预留 */ 
/*                 Axios.post('/',{
                  goodsNumber:this.goodsNumber,
                  question:this.question,
                  workSheet:this.workSheet,
                  content:this.content
                  }).then(res => {
                    console.log(res);
                  }).catch(err => {
                    console.log(err);
                  }); */
                  //跳转
                  this.addTab('order/complaintResult');
                  }).catch(() => {
                  this.$message({
                      type: 'success',
                      message: '取消操作成功'
                  });          
            });
        },
    },

  }
</script>

<style scoped>
.center_login{
  margin: 0 auto;
  position: relative;
}
span{
    font-weight: bold;
    font-size: 20px;
}
.el-input,.el-select {
  width: 230px;
}
.spareNum{
  color: gray;
  font-size: 16px;
  font-weight: 400;
}
</style>