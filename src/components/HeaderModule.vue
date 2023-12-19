<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import LoginModule from './LoginModule.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const logout = () => {
    saveProperyValue({'label': 'token', 'value': ''});
    saveProperyValue({'label': 'userInfo', 'value': ''});
    localStorage.clear();
    router.push('/');
}

const goRouter = (data) => {
    router.push(data);
}

const isLogin = ref(false);
const handleLogin = () => {
    if(!token.value){
        isLogin.value = true;
    }
}

onMounted(() => {

});

</script>

<template>
    <header class="header">
      <h3 class="title" @click="goRouter('/')">鄞州图书馆</h3>
      <nav class="nav">
        <router-link to="/GenealogySearch">检索中心</router-link>
        <router-link v-if="token" class="marginL20" to="/GenealogyManage">管理中心</router-link>
        <a class="btn marginL20" @click="handleLogin">{{token ? userInfo.account : '登录'}}</a>
      </nav>
    </header>
    <LoginModule v-if="isLogin" v-on:close="isLogin = false" />
</template>

<style scoped lang="scss">
.header{
    height: 160px;
    padding: 0 250px;
    width: calc(100% - 500px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(21,65,128,.6);
    color: #fff;
    .title{
        cursor: pointer;
    }
    .nav{
        a{
            color: #fff;
        }
    }
}
</style>