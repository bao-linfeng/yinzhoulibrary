<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import {  } from '../util/api';

const router = useRouter();
const global = useGlobalStore();
const {  } = storeToRefs(global);
const { saveProperyValue } = global;

const surname = ref('');

const goRouter = () => {
  router.push('/GenealogySearch?surname='+surname.value);
}
</script>

<template>
  <section class="home-wrap">
    <main class="main">
      <el-input class="w300" v-model="surname" size="large"  placeholder="请输入姓氏" />
      <el-button type="primary" size="large" @click="goRouter">检索</el-button>
    </main>
  </section>
</template>

<style scoped lang="scss">
.home-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../assets/home-bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .main{
    display: flex;
    align-items: center;
  }
}
</style>
