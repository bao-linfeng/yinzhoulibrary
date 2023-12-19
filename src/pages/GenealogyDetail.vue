<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
import HeaderModule from '../components/HeaderModule.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;
defineProps({
  msg: String,
});

const getDataDetail = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.GCDetailFrontEnd({
    'gcKey': dataKey.value,
  });
  loading.close();
  if(result.status == 200){
    detail.value = result.data;
  }else{
    createMsg(result.msg);
  }
};

const dataKey = ref('');
const detail = ref({});
const field_main = ref([
  {'fieldMeans': '谱ID', 'fieldName': '_key'},
  // {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
  {'fieldMeans': '姓氏', 'fieldName': 'surname'},
  {'fieldMeans': '出版年', 'fieldName': 'publish'},
  {'fieldMeans': '堂号', 'fieldName': 'hall'},
  {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
  {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
  {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
  // {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern'},
  {'fieldMeans': '总卷数', 'fieldName': 'volume'},
  {'fieldMeans': '页数', 'fieldName': 'page'},
  {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
  // {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume'},
  {'fieldMeans': '作者', 'fieldName': 'authors'},
  {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
  {'fieldMeans': '版本类型', 'fieldName': 'version'},
]);

const handleView = () => {
  router.push('/ImageView?id='+dataKey.value+'&volumeKey='+detail.value.firstVolumeKey+'&page=1');
}

onMounted(() => {
    dataKey.value = getQueryVariable('id');
    getDataDetail();
});

</script>

<template>
  <section class="genealogy-detail-wrap">
    <HeaderModule />
    <main class="main">
        <h3 class="title">家谱简介</h3>
        <section class="main-section marginT20">
            <aside class="aside">
              <img class="cover" src="../assets/cover.png" />
              <p class="name">{{detail.genealogyName}}</p>
              <el-button v-if="detail.hasImage == 1" class="marginT20" type="primary" @click="handleView">查看影像</el-button>
              <el-button v-if="detail.hasIndex == 1" class="marginT20" type="primary" @click="handleView">查看全文</el-button>
            </aside>
            <article class="article marginL20">
              <h3 class="title">{{detail.genealogyName}}</h3>
              <ul class="detail-ul">
                <li class="li marginT10" v-for="(item, index) in field_main" :key="index">
                  <p>{{item.fieldMeans}}</p>
                  <span>{{detail[item.fieldName]}}</span>
                </li>
              </ul>
            </article>
        </section>
    </main>
    <footer class="footer">
        <div class="left">
            
        </div>
        <div class="right">
            
        </div>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.genealogy-detail-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f2f2f2 url('../assets/bg.png') 50% 0 no-repeat;
  background-size: 100% 200px;
  .main{
    margin: 50px auto auto auto;
    padding: 30px;
    width: 914px;
    height: 470px;
    background: url('../assets/eave.png') 0 0 repeat-x, url('../assets/long.png') 0 0 no-repeat;
    background-color: #fff;
    >.title{
      width: 200px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      background: url('../assets/tleft.svg') 0 50% no-repeat, url('../assets/tright.svg') 100% 50% no-repeat; 
    }
    .main-section{
      display: flex;
      .aside{
        position: relative;
        width: 190px;
        .name{
          position: absolute;
          top: 60px;
          right: 65px;
          bottom: 95px;
          text-align: center;
          color: #fff;
          width: 12px;
          font-size: 10px;
          font-style: normal;
          overflow: hidden;
        }
      }
      .article{
        width: calc(100% - 210px);
        .title{
          font-size: 24px;
        }
        .detail-ul{
          .li{
            width: 50%;
            display: inline-flex;
            align-items: center;
            p{
              font-weight: bold;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .footer{
    width: calc(100% - 100px);
    padding: 0 50px;
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
