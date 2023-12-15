<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, baseURL } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg, initDownloadExcel } from '../util/ADS';
import VolumeEdit from '../components/VolumeEdit.vue';
import ImageUpload from '../components/ImageUpload.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const getDataList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  tableData.value = [];
  const result = await catalog.getCatalogList({
    'gcKey': gcKey.value,
    'volumeKey': volumeKey.value,
    'siteKey': '1379194999',
    'userRole': '3',
    'page': page.value,
    'limit': limit.value,
  });
  loading.close();
  if(result.status == 200){
    tableData.value = result.result.list;
    total.value = result.result.total;
  }else{
    createMsg(result.msg);
  }
};

const props = defineProps({
  msg: String,
});

const gcKey = ref('');
const volumeKey = ref('');
const page = ref(1);
const limit = ref(30);
const total = ref(0);
const tableData = ref([]);
const h = ref(200);
const handleSearch = () => {
    page.value = 1;
    getDataList();
}

const handleClickAction = (row, t) => {
  console.log(row, t);
  if(t === 'linkImages'){
    
  }
  if(t === 'edit'){
    
  }
  if(t === 'delete'){
    
  }
  if(t === 'add'){
    
  }
  dataRow.value = row;
  isShow.value = t;
}

const handleCurrentChange = (data) => {
    page.value = data;
    getDataList();
}

const dataRow = ref('');
const isShow = ref('');
const handleClose = (data) => {
  isShow.value = '';
}

const handleBatchUpdate = () => {

}

onMounted(() => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20;
  gcKey.value = getQueryVariable('id');
  handleSearch();
});

</script>

<template>
  <section class="manage-volume-wrap">
    <header class="header">
      <h3 class="title">卷册列表</h3>
      <div class="right">
        <el-button type="primary" @click="handleClickAction({}, 'add')">新建卷册</el-button>
      </div>
    </header>
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <el-input v-model="gcKey" class="w150" placeholder="谱ID" clearable />
          <el-input v-model="volumeKey" class="w150" placeholder="卷ID" clearable />
          <el-button type="primary" @click="handleSearch">检索</el-button>
        </div>
      </section>
      <!-- table -->
      <el-table 
        ref="jiapu"
        :data="tableData" 
        border 
        :height="h"
        style="width: 100%">
        <el-table-column prop="_key" label="谱ID" width="120" align="center" />
        <el-table-column prop="genealogyName" label="谱名" min-width="120" align="center" />
        <el-table-column prop="surname" label="姓氏" width="120" align="center" />

        <el-table-column prop="volume" label="卷名" width="120" align="center" />
        <el-table-column prop="volumeKey" label="卷ID" width="120" align="center" />
        <el-table-column prop="pages" label="页码" width="120" align="center" />
        <el-table-column prop="path" label="卷册路径" min-width="120" align="center" />
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'linkImages')">关联影像</el-button>
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'edit')">编辑</el-button>
            <el-popconfirm
              width="220"
              :confirm-button-text="'确定'"
              :cancel-button-text="'取消'"
              :title="'您确认要删除该卷册吗?'"
              @confirm="handleClickAction(scope.row, 'delete')"
            >
              <template #reference>
                  <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer class="footer">
      <div class="left">
        <p>合计: 1,000册, 100,000页</p>
      </div>
      <div class="right">
        <!-- 分页器 -->
        <el-pagination
          small
          background
          layout="prev, pager, next, jumper, total"
          :current-page="page"
          :page-size="limit"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </footer>
  </section>
  <VolumeEdit v-if="isShow === 'add' || isShow === 'edit'" :dataRow="dataRow" v-on:close="handleClose" />
  <ImageUpload v-if="isShow === 'linkImages'" :dataRow="dataRow" v-on:close="handleClose" />
</template>

<style scoped lang="scss">
.manage-volume-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  color: #333;
  background-color: #f2f2f2;
  .header{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  .main{
    margin: 20px 20px 0 20px;
    width: calc(100% - 80px);
    height: calc(100% - 120px);
    padding: 0 20px;
    background-color: #fff;
    .search-wrap{
      padding: 20px 0;
      .search-box{
        display: flex;
        align-items: center;
      }
    }
  }
  .footer{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
        
    }
    .right{
      display: flex;
      align-items: center;
    }
  }
}
</style>
