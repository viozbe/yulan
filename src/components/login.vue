<template>
    <div class="loginBody">
        <div class="loginMain">
            <!-- 登录框头部--图标 -->
            <div class="mainLogoWrap">
                <img class="mainLogo" width="100%" src="../assets/img/loginLogo.png" alt="">
            </div>
            <div class="mainInfo">
                <h1>玉兰B2B订单管理系统</h1>
                <div class="loginBar"></div>
                <div class="info">
                    <p>账号:</p>
                    <el-input
                        style="width:327px;"
                        placeholder="请输入账号"
                        v-model="cid">
                        <img slot="prefix" src="../assets/img/cid.png" width="22" alt="">
                    </el-input>
                </div>
                <div class="info">
                    <p>密码:</p>
                    <el-input
                        type="password"
                        style="width:327px;"
                        placeholder="请输入密码"
                        v-model="password">
                        <img slot="prefix" src="../assets/img/password.png" width="22" alt="">
                    </el-input>
                </div>
                <div class="submit" @click="loginSubmit">登录</div>
            </div>
        </div>
        <div class="loginTitle">
            <img width="100%" src="../assets/img/loginTitle.png" alt="">
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import{
    userLogin
} from '@/api/user'
import { mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
    name: 'Login',
    data(){
        return{
            cid: '',        //用户账号
            password: '',   //用户密码
        }
    },
    methods:{
        ...mapMutations('navTabs', [
            'emptyTabList'
        ]),
        loginSubmit(){
            if(this.cid === ''){
                this.$alert('请输入用户账号', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return;
            }
            if(this.password === ''){
                this.$alert('请输入密码', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定'
                });
                return;
            }
            let date = new Date();
            //账号首位转大写
            let cidArr = this.cid.split('');
            cidArr[0] = cidArr[0].toUpperCase();
            let cid = cidArr.join('');
            let obj = {
                loginName: cid,
                password: this.password,
                year: date.getFullYear()
            };
            userLogin(obj).then(res =>{
                console.log(res);
                let companyId;
                Cookies.set('cid',cid);
                Cookies.set('userInfo',res.data);
                Cookies.set('isManager',res.data.isManager);
                Cookies.set('realName',res.data.realName);
                companyId = (res.data.companyId === null)?'null':res.data.companyId
                Cookies.set('companyId',companyId)
                Cookies.set('customerMainId',res.data.customerMainId)
                Cookies.set('identity',res.data.type)
                if(res.customerType === ''){
                    if(res.data.type === 'USER'){
                        Cookies.set('customerType','110');
                    }
                }
                else{
                    Cookies.set('customerType',res.customerType);
                }
                this.emptyTabList()
                this.$router.push({
                    path: '/main'
                });
            }).catch(err =>{
                this.$alert(`${err.msg}`, '提示', {
                    type: 'warning',
                    confirmButtonText: '好的'
                });
            })
        }
    },
    created(){
    }
}
</script>
<style scoped>
.loginBody{
    min-width: 1000px;
    min-height: 600px;
    width: 100%;
    height: 100%;
    background: url('../assets/img/loginBg.jpg') no-repeat;
    background-size: cover;
}
.loginTitle{
    width: 16.9%;
    position: fixed;
    bottom: 3.5%;
    right: 2%;
}
.loginMain{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 27em;
    height: 28em;
    background-color: #fff;
    box-shadow: 4px 2px 20px 1px rgba(0,0,0,.25);
    border-radius: 20px;
    font-size: 15px;
}
.mainLogoWrap{
    width: 6.5em;
    position: relative;
    margin: 0 auto;
}
.mainLogo{
    position: relative;
    top: -3.25em;
}
.mainInfo{
    position: relative;
    top: -3em;
}
.mainInfo h1{
    text-align: center;
    font-size: 1.65em;
    color: #333;
    font-weight: 400;
}
.loginBar{
    width: 19em;
    height: 3px;
    border-radius: 50%;
    background-color: #82bc00;
    margin: 20px auto 0;
}
.info{
    margin-top: 1.3em;
    text-align: center;
    font-size: 1em;
}
.info p{
    padding: 0 0 10px 40px;
    text-align: left;
}
.info img{
    margin: 8px 0;
}
.submit{
    user-select: none;
    margin: 3.6rem auto 0;
    width: 327px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
    background-color: #82bc00;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}
</style>


