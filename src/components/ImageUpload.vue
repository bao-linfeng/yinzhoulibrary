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

let i = 0, l = 100, files = [];
const handleInputChange = (e) => {
    // console.log(e.target.files);
    files = Array.from(e.target.files);
    l = files.length;
    e.target.value = '';
}

function uploadImage(){
    if(i < i){
        // let fd = new FormData();
        // fd.append('file', files[i]);

        // uploadImageApi(fd);
        // fd = null;
    }else{

    }
}

const uploadImageApi = async (fd) =>{

}

onMounted(() => {
    dataKey.value = props.dataRow._key;
    if(dataKey.value){
        form.value = {
            'volume': props.dataRow.volume || '卷1', 
            'index': props.dataRow.index || '001',
        }
    }
});

</script>

<template>
    <section class="image-upload-section">
        <header class="header">
            <h3 class="title">影像上传</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="60px">
                <el-form-item label="卷名">
                    <el-input class="w200" type="text" v-model="form.volume" :disabled="true" />
                </el-form-item>
                <el-form-item label="卷序号">
                    <el-input class="w200" type="text" v-model="form.index" :disabled="true" />
                </el-form-item>
                <el-form-item label="文件夹">
                    <div class="upload-wrap">
                        <div class="upload-box">
                            <input type="file" id="folderInput" @change="handleInputChange" directory webkitdirectory mozdirectory />
                            <label for="folderInput" class="label">选择文件</label>
                        </div>
                        <p class="btn marginL10" @click="uploadImage">上传</p>
                    </div>
                </el-form-item>
            </el-form>
        </main>
        <div class="process-wrap">
            <div class="process-box">
                <i class="p"></i>
                <i class="d">{{i}}/{{l}}</i>
            </div>
        </div>
        <footer class="footer marginT20">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close">取消</el-button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.image-upload-section{
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
    .main{
        .upload-wrap{
            position: relative;
            display: flex;
            align-items: center;
            .upload-box{
                position: relative;
                width: 120px;
                height: 30px;
                display: flex;
                align-items: center;
                #folderInput{
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                }
                .label{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    background-color: #409eff;
                    color: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
            .btn{
                border: none;
                outline: none;
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 4px;
                background-color: #409eff;
                color: #fff;
                cursor: pointer;
                text-align: center;
            }
        }
    }
    .process-wrap{
        position: relative;
        height: 30px;
        display: flex;
        align-items: center;
        .process-box{
            position: relative;
            width: 100%;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            background-color: #f2f2f2;
            .p{
                position: absolute;
                top: 0;
                left: 0;
                width: 10%;
                height: 100%;
                background-color: #409eff;
            }
            .d{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #f00;
            }
        }
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>