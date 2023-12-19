<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, imageApi, volumeApi, baseURL } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;
defineProps({
  msg: String,
});

const getImageList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.getImageList({
    'vKey': volumeKey.value,
  });
  loading.close();
  if(result.status == 200){
    imageList.value = result.data;
    total.value = imageList.value.length;
    getImageDetail(imageList.value[page.value - 1]);
  }else{
    createMsg(result.msg);
  }
};

const getImageDetail = async (iKey) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.getImageDetail({
    'iKey': iKey,
  });
  loading.close();
  if(result.status == 200){
    imageDetail.value = baseURL+'/nbyz'+result.data;
  }else{
    createMsg(result.msg);
  }
};

const getVolumeList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await volumeApi.volumeListSingleGC({
    'gcKey': dataKey.value,
  });
  loading.close();
  if(result.status == 200){
    volumeList.value = result.data.map((ele) => {
      ele.label = ele.volumeNumber+'('+ele.internalSerialNumber+')';
      ele.value = ele._key;
      return ele;
    });
  }else{
    createMsg(result.msg);
  }
};

const dataKey = ref('');
const imageList = ref({});
const volumeKey = ref(1);
const page = ref(1);
const total = ref(100);
const imageDetail = ref('');
const isText = ref('');
const volumeList = ref([]);
const handleView = () => {
  router.push('/ImageView?id='+dataKey.value);
}

const menu = ref('1');
const menuList = ref([
  {'label': '目录', 'value': '1'},
  {'label': '序文', 'value': '2'},
  {'label': '世系', 'value': '3'},
]);

const vertical = ref(false);
const keyWord = ref('');
const text = ref('');
const textList = ref([
  {'label': '王子文 卷1 12页', 'value': '1'},
  {'label': '王子文 卷2 10页', 'value': '2'},
  {'label': '王子文 卷3 1页', 'value': '3'},
]);
const textAll = ref('');
const textAllList = ref([
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
  '12月的越南河内，处处绽放中越友谊之花。', 
  '应越共中央总书记阮富仲、越南国家主席武文赏邀请，中共中央总书记、国家主席习近平12月12日至13日对越南进行国事访问。', 
  '访问期间，双方宣布中越两党两国关系新定位，在深化中越全面战略合作伙伴关系基础上，携手构建具有战略意义的中越命运共同体。这是中越关系发展史上一座新的里程碑。',
]);
const handleSearch = () => {

}

watch(page, (nv, ov) => {
    console.log(nv);
    getImageDetail(imageList.value[page.value - 1]);
});

onMounted(() => {
    dataKey.value = getQueryVariable('id');
    volumeKey.value = getQueryVariable('volumeKey');
    page.value = Number(getQueryVariable('page'));
    isText.value = getQueryVariable('isText');
    getVolumeList();
    getImageList();
});

</script>

<template>
  <section class="image-view-wrap">
    <main class="main" :class="{active: isText != 1}">
      <aside class="aside" v-if="isText == 1">
        <p :class="{active: menu === item.value}" v-for="(item, index) in menuList" :key="index" @click="menu = item.value">{{item.label}}</p>
      </aside>
      <div class="large-image" :class="{active: isText != 1}">
        <img class="image" :src="imageDetail" />
      </div>
      <article class="article" v-if="isText == 1">
        <div class="search-box">
          <el-input class="w300" v-model="keyWord" placeholder="全文内容" clearable />
          <el-button type="primary" @click="handleSearch">检索</el-button>
        </div>
        <el-select class="w150 marginT10" v-model="text" placeholder="全文">
          <el-option
            v-for="(item,index) in textList"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="text-wrap style1" :class="{active: vertical}">
          <p :class="{active: textAll === item, vertical: vertical}" v-for="(item, index) in textAllList" :key="index" @click="textAll = item">{{item}}</p>
        </div>
      </article>
    </main>
    <footer class="footer">
      <el-select v-model="volumeKey" placeholder="卷册列表" class="w150">
        <el-option
          v-for="(item,index) in volumeList"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-slider class="marginL20" v-model="page" :min="1" :max="total" show-input />
      <p class="marginL20">/{{total}}</p>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.image-view-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #333;
  color: #fff;
  .main{
    position: relative;
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    &.active{
      justify-content: center;
    }
    .aside{
      width: 200px;
      height: 100%;
      background-color: #666;
      p{
        margin: 10px 0 0 10px;
        cursor: pointer;
        &:hover{
          color: #358acd;
        }
        &.active{
          color: #358acd;
        }
      }
    }
    .large-image{
      width: calc(100% - 600px);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active{
        width: 100%;
      }
      .image{
        height: 100%;
      }
    }
    .article{
      width: 380px;
      height: calc(100% - 20px);
      padding: 10px;
      background-color: #666;
      .text-wrap{
        position: relative;
        height: calc(100% - 74px);
        overflow-y: auto;
        &.active{
          overflow-y: hidden;
          overflow-x: auto;
          display: flex;
        }
        p{
          cursor: pointer;
          margin-top: 10px;
          &:hover{
            color: #358acd;
          }
          &.active{
            color: #358acd;
          }
          &.vertical{
            margin: 10px 10px 0 0;
            display: inline;
            writing-mode: vertical-lr;
            max-height: 100%;
            vertical-align: top;
          }
        }
      }
    }
  }
  .footer{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: #444;
  }
}
</style>
