<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg } from '../util/ADS';
import HeaderModule from '../components/HeaderModule.vue';

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
  const result = await catalog.searchGCFrontEnd({
    'gcKey': SearchParameters.value.gcKey,
    'genealogyName': SearchParameters.value.genealogyName,
    'surname': SearchParameters.value.surname,
    'hall': SearchParameters.value.hall,
    'publish': SearchParameters.value.publish,
    'authors': SearchParameters.value.authors,
    'place': SearchParameters.value.place,
    'keyWord': SearchParameters.value.keyWord,
    'hasImage': SearchParameters.value.hasImage,
    'hasIndex': SearchParameters.value.hasIndex,
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

const GCResolverFrontEnd = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.GCResolverFrontEnd({
    'gcKey': SearchParameters.value.gcKey,
    'genealogyName': SearchParameters.value.genealogyName,
    'surname': SearchParameters.value.surname,
    'hall': SearchParameters.value.hall,
    'publish': SearchParameters.value.publish,
    'authors': SearchParameters.value.authors,
    'place': SearchParameters.value.place,
    'keyWord': SearchParameters.value.keyWord,
    'hasImage': SearchParameters.value.hasImage,
    'hasIndex': SearchParameters.value.hasIndex,
  });
  loading.close();
  if(result.status == 200){
    listAuthors.value = result.data.listAuthors;
    listHall.value = result.data.listHall;
    listPlace.value = result.data.listPlace;
    listSurname.value = result.data.listSurname;
  }else{
    createMsg(result.msg);
  }
};

const SearchParameters = ref({
  'gcKey': '',
  'genealogyName': '',
  'surname': '',
  'hall': '',
  'publish': '',
  'authors': '',
  'place': '',
  'keyWord': '',
  'hasImage': '',
  'hasIndex': '',
});
const page = ref(1);
const limit = ref(30);
const total = ref(0);
const tableData = ref([]);
const h = ref(200);
const handleSearch = () => {
    page.value = 1;
    getDataList();
    GCResolverFrontEnd();
}

const handleClickAction = (row, t) => {
    if(t === 'look'){
        router.push('/GenealogyDetail?id='+row._key);
    }
    if(t === 'image'){
      router.push('/ImageView?id='+row._key+'&volumeKey='+row.firstVolumeKey+'&page=1');
    }
    if(t === 'text'){
      router.push('/ImageView?id='+row._key+'&volumeKey='+row.firstVolumeKey+'&page=1&isText=1');
    }
}

const handleCurrentChange = (data) => {
    page.value = data;
    getDataList();
}

const tab = ref(0);
const tabList = ref([
  {'label': '列表', 'value': 0},
  {'label': '图库', 'value': 1},
]);


const listSurname = ref([]);
const listPlace = ref([]);
const listHall = ref([]);
const listAuthors = ref([]);
const changeProperty = (p, v) =>{
  console.log(p, v);
  if(SearchParameters.value[p] === v){
    SearchParameters.value[p] = '';
  }else{
    SearchParameters.value[p] = v;
  }
  
  handleSearch();
}

onMounted(() => {
  h.value = 900;
  SearchParameters.value.surname = getQueryVariable('surname') ? decodeURIComponent(getQueryVariable('surname')) : '';
  handleSearch();
});

</script>

<template>
  <section class="genealogy-search-wrap">
    <HeaderModule />
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <!-- <el-input v-model="SearchParameters.gcKey" class="w16p" placeholder="谱ID" clearable /> -->
          <el-input v-model="SearchParameters.surname" class="w20p" placeholder="请输入姓氏" clearable />
          <el-input v-model="SearchParameters.genealogyName" class="w20p" placeholder="请输入谱名" clearable />
          <el-input v-model="SearchParameters.place" class="w20p" placeholder="请输入谱籍地" clearable />
          <el-input v-model="SearchParameters.hall" class="w20p" placeholder="请输入堂号" clearable />
          <el-input v-model="SearchParameters.authors" class="w20p" placeholder="请输入作者" clearable />
        </div>
        <div class="search-box marginT30">
          <el-input v-model="SearchParameters.publish" class="w20p" placeholder="请输入出版年" clearable />
          <el-input v-model="SearchParameters.keyWord" class="w20p" placeholder="请输入全文关键字" clearable />
          <el-radio-group class="w20p" v-model="SearchParameters.hasImage">
            <el-radio :label="''">全部影像</el-radio>
            <el-radio :label="'1'">有影像</el-radio>
            <el-radio :label="'2'">无影像</el-radio>
          </el-radio-group>
          <el-radio-group class="w20p" v-model="SearchParameters.hasIndex">
            <el-radio :label="''">全部索引</el-radio>
            <el-radio :label="'1'">有索引</el-radio>
            <el-radio :label="'2'">无索引</el-radio>
          </el-radio-group>
          <el-button class="w20p" type="primary" @click="handleSearch">检索</el-button>
        </div>
      </section>
      <!-- tab -->
      <section class="tab-section">
        <h3 class="title">发现 {{total}} 部家谱</h3>
        <ul class="tab-ul">
          <li :class="{active: tab === item.value}" v-for="(item, index) in tabList" :key="index" @click="tab = item.value">{{item.label}}</li>
        </ul>
      </section>
      <!-- data -->
      <section class="data-section">
        <!-- 谱目列表 -->
        <article class="article">
          <div class="scroll-wrap">
              <img class="left" src="../assets/scrollLeft.png" alt="">
              <img class="right" src="../assets/scrollRight.png" alt="">
          </div>
          <el-table 
            v-if="tab === 0"
            ref="jiapu"
            :data="tableData"  
            :height="h"
            style="width: 100%">
            <el-table-column prop="_key" label="谱ID" width="120" align="center" />
            <el-table-column prop="genealogyName" label="谱名" min-width="120" align="center" />
            <el-table-column prop="surname" label="姓氏" width="120" align="center" />
            <el-table-column prop="volume" label="总卷数" width="120" align="center" />
            <el-table-column prop="volumeNumber" label="实拍卷数" width="120" align="center" />
            <el-table-column prop="hall" label="堂号" width="120" align="center" />
            <el-table-column prop="publish" label="出版年" width="120" align="center" />
            <el-table-column prop="place" label="谱籍地" min-width="120" align="center" />
            <el-table-column prop="authors" label="作者" width="120" align="center" />
            <el-table-column prop="explain" label="说明" width="120" align="center" />
            <el-table-column prop="memo" label="备注" width="120" align="center" />
            <el-table-column label="操作" fixed="right" width="180" align="center">
              <template #default="scope">
                <button class="btn" @click="handleClickAction(scope.row, 'look')">查看</button>
                <button class="btn" v-if="scope.row.hasImage == 1" @click="handleClickAction(scope.row, 'image')">影像</button>
                <button class="btn" v-if="scope.row.hasIndex == 1" @click="handleClickAction(scope.row, 'text')">全文</button>
              </template>
            </el-table-column>
          </el-table>
          <!-- box -->
          <section v-else class="catalog-wrap style1">
            <div class="catalog-box" @click="handleClickAction(item, 'look')" v-for="(item, index) in tableData" :key="index">
              <div class="cover">
                <img src="../assets/cover.png" alt="封面" />
                <i>{{item.genealogyName}}</i>
              </div>
              <div class="detail">
                <h3 class="overflow" :title="item.genealogyName">{{item.genealogyName}}</h3>
                <p>姓氏: {{item.surname}}</p>
                <p>堂号: {{item.hall}}</p>
                <p>出版年: {{item.publish}}</p>
                <p :title="item.place">谱籍地: {{item.place}}</p>
                <p class="overflow" :title="item.author">撰修者: {{item.author}}</p>
              </div>
            </div>
          </section>
          <!-- 分页器 -->
          <div class="pagination-wrap">
            <el-pagination
              background
              layout="prev, pager, next, jumper, total"
              :current-page="page"
              :page-size="limit"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </div>
        </article>
        <!-- 分面器 -->
        <aside class="aside marginL20">
          <div class="scroll-wrap">
              <img class="left" src="../assets/scrollLeft.png" alt="">
              <img class="right" src="../assets/scrollRight.png" alt="">
          </div>
          <div class="statistics">
            <div class="box">
              <h3 class="title">姓氏</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: SearchParameters.surname == item.surname}" v-for="(item, index) in listSurname" :key="index" @click="changeProperty('surname', item.surname)">{{item.surname}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">谱籍地</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: SearchParameters.place == item.place}" v-for="(item, index) in listPlace" :key="index" @click="changeProperty('place', item.place)">{{item.place}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">堂号</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: SearchParameters.hall == item.hall}" v-for="(item, index) in listHall" :key="index" @click="changeProperty('hall', item.hall)">{{item.hall}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">作者</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: SearchParameters.authors == item.authors}" v-for="(item, index) in listAuthors" :key="index" @click="changeProperty('authors', item.authors)">{{item.authors}}({{item.length}})</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </main>
    <!-- <footer class="footer">
      <div class="left">
          
      </div>
      <div class="right">
        
      </div>
    </footer> -->
  </section>
</template>

<style scoped lang="scss">
.genealogy-search-wrap {
  position: relative;
  width: 100%;
  min-height: 100%;
  background: #fffcf9;
  // url('../assets/bg.png') 50% 0 no-repeat
  background-size: 100% 200px;
  color: #333;
  .main{
    width: 100%;
    padding-bottom: 30px;
    // height: calc(100% - 130px);
    .search-wrap{
      width: 1400px;
      margin: 0 auto;
      padding: 30px;
      background: #f8f8f8 url('../assets/Rectangle.png') 50% 50% no-repeat;
      background-size: cover;
      .search-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .tab-section{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 85px 130px 50px 130px;
      color: #7C4F11;
      .title{
        font-size: 40px;
        font-weight: normal;
        font-family: 'kaiti';
      }
      .tab-ul{
        position: absolute;
        top: 102px;
        left: 0;
        font-size: 26px;
        li{
          cursor: pointer;
          width: 26px;
          margin-bottom: 30px;
          padding-left: 7px;
          &.active{
            font-weight: bold;
            border-left: 4px solid #7C4F11;
          }
        }
      }
    }
    .data-section{
      width: 1460px;
      margin: 0 auto;
      // height: calc(100% - 341px);
      display: flex;
      .aside{
        position: relative;
        padding-top: 25px;
        width: 240px;
        background-color: #fff;
      }
      .article{
        position: relative;
        padding: 30px 20px 20px 20px;
        width: calc(100% - 300px);
        background-color: #fff;
        .btn{
          border: none;
          outline: none;
          color: #C9A470;
          background-color: transparent;
          margin: 0 10px;
          cursor: pointer;
        }
        .pagination-wrap{
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
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
// 卷轴
.scroll-wrap{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25px;
  background: url('../assets/scroll.png') 0 0 repeat-x;
  &.active{
    left: 11px;
    width: calc(100% - 22px);
  }
  .left{
    position: absolute;
    left: -11px;
    top: 0;
  }
  .right{
    position: absolute;
    right: -11px;
    top: 0;
  }
}
// 分面器
.statistics{
  height: calc(100% - 45px);
  padding: 20px;
  font-size: 16px;
  .box{
    height: calc(25% - 20px);
    margin-top: 20px;
  }
  .title{
    border-left: 3px solid #333;
    padding-left: 10px;
    margin-bottom: 20px;
    height: 14px;
    line-height: 14px;
    font-size: 16px;
    font-weight: normal;
  }
  .list-wrap{
    height: calc(100% - 34px);
    overflow-y: auto;
    .li{
      text-indent: 14px;
      margin-bottom: 5px;
      cursor: pointer;
      &.active{
        color: #358acd;
      }
    }
  }
}
// box
.catalog-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 20px;
  overflow-y: auto;
  .catalog-box{
    position: relative;
    height: 240px;
    width: 430px;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 3px;
    display: inline-flex;
    margin: 20px 10px 0 10px;
    padding: 10px;
    .cover{
      position: relative;
      width: 190px;
      height: 240px;
      img{
          display: block;
      }
      i{
        position: absolute;
        top: 60px;
        right: 60px;
        max-height: 140px;
        font-style: normal;
        writing-mode: tb-rl;
        line-height: 14px;
        font-size: 12px;
        color: #fff;
      }
    }
    .detail{
      color: #333;
      margin-left: 20px;
      width: 200px;
      font-size: 16px;
      p{
        font-size: 16px;
        margin: 10px 0 5px 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

</style>
