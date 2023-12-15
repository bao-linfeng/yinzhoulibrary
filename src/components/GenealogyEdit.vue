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
    'genealogyName': '', 
    'surname': '',
    'hall': '',
    'publish': '',
    'place': '',
    'authors': '',
    'volume': '',
    'memo': '',
    'explain': '',
    'isCreateVolume': ''
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
            'genealogyName': props.dataRow.genealogyName || '', 
            'surname': props.dataRow.surname || '',
            'hall': props.dataRow.hall || '',
            'publish': props.dataRow.publish || '',
            'place': props.dataRow.place || '',
            'authors': props.dataRow.authors || '',
            'volume': props.dataRow.volume || '',
            'memo': props.dataRow.memo || '',
            'explain': props.dataRow.explain || '',
        }
    }
});

</script>

<template>
    <section class="genealogy-edit-section">
        <header class="header">
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="60px">
                <el-form-item label="谱名">
                    <el-input class="w200" type="text" v-model="form.genealogyName" placeholder="请输入谱名" />
                </el-form-item>
                <el-form-item label="姓氏">
                    <el-input class="w200" type="text" v-model="form.surname" placeholder="请输入姓氏" />
                </el-form-item>
                <el-form-item label="堂号">
                    <el-input class="w200" type="text" v-model="form.hall" placeholder="请输入堂号" />
                </el-form-item>
                <el-form-item label="出版年">
                    <el-input class="w200" type="text" v-model="form.publish" placeholder="请输入出版年" />
                </el-form-item>
                <el-form-item label="谱籍地">
                    <el-input class="w200" type="text" v-model="form.place" placeholder="请输入谱籍地" />
                </el-form-item>
                <el-form-item label="作者">
                    <el-input class="w200" type="text" v-model="form.authors" placeholder="请输入作者" />
                </el-form-item>
                <el-form-item label="总卷数">
                    <el-input class="w200" type="text" v-model="form.volume" placeholder="请输入总卷数" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input class="w200" type="text" v-model="form.memo" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="说明">
                    <el-input class="w200" type="text" v-model="form.explain" placeholder="请输入说明" />
                </el-form-item>
                <el-form-item v-if="!dataKey">
                    <el-checkbox v-model="form.isCreateVolume" label="按总卷册数自动生成卷册列表" />
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
.genealogy-edit-section{
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