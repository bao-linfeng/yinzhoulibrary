<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
  dataRow: Object,
});

const goRouter = (data) => {
    router.push(data);
}

const dataKey = ref('');
const form = ref({
    'volume': '', 
    'index': '',
});

const handleSave = () => {
    if(dataKey.value){

    }else{
        
    }
    close();
}

const emit = defineEmits(['close', 'save']);
const close = () => {
    emit('close');
}

onMounted(() => {
    dataKey.value = props.dataRow._key;
    if(dataKey.value){
        form.value = {
            'volume': props.dataRow.volume || '', 
            'index': props.dataRow.index || '',
        }
    }
});

</script>

<template>
    <section class="volume-edit-section">
        <header class="header">
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="60px">
                <el-form-item label="卷名">
                    <el-input class="w200" type="text" v-model="form.volume" placeholder="请输入卷名，如 卷1" />
                </el-form-item>
                <el-form-item label="卷序号">
                    <el-input class="w200" type="text" v-model="form.index" placeholder="请输入卷序号，如 001" />
                </el-form-item>
            </el-form>
        </main>
        <footer class="footer">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close">取消</el-button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.volume-edit-section{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    box-shadow: 0 0 1px 2px #ddd;
    border-radius: 10px;
    z-index: 10000;
    background-color: #fff;
    .header{
        text-align: center;
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>