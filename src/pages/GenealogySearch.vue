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
  const result = await catalog.getCatalogList({
    'gcKey': gcKey.value,
    'genealogyName': genealogyName.value,
    'surname': surname.value,
    'hall': hall.value,
    'publish': publish.value,
    'authors': authors.value,
    'place': place.value,
    'keyWord': keyWord.value,
    'hasImage': hasImage.value,
    'hasIndex': hasIndex.value,
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

defineProps({
  msg: String,
});

const gcKey = ref('');
const genealogyName = ref('');
const surname = ref('');
const hall = ref('');
const publish = ref('');
const authors = ref('');
const place = ref('');
const keyWord = ref('');
const hasImage = ref(2);
const hasIndex = ref(2);
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
    if(t === 'look'){
        router.push('/GenealogyDetail?id='+row._key);
    }
    if(t === 'image'){
      router.push('/ImageView?id='+row._key+'&volume=1&page=1');
    }
    if(t === 'text'){
      router.push('/ImageView?id='+row._key+'&volume=1&page=1&isText=1');
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
  if(this[p] === v){
      this[p] = '';
  }else{
      this[p] = v;
  }
  
  handleSearch();
}

onMounted(() => {
  h.value = window.innerHeight - 60 - 50 - 20 - 164 - 20 - 30;
  surname.value = getQueryVariable('surname') ? decodeURIComponent(getQueryVariable('surname')) : '';
  handleSearch();
});

</script>

<template>
  <section class="genealogy-search-wrap">
    <HeaderModule />
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box marginT20">
          <el-input v-model="gcKey" class="w16p" placeholder="谱ID" clearable />
          <el-input v-model="genealogyName" class="w16p" placeholder="谱名" clearable />
          <el-input v-model="surname" class="w16p" placeholder="姓氏" clearable />
          <el-input v-model="hall" class="w16p" placeholder="堂号" clearable />
          <el-input v-model="publish" class="w16p" placeholder="出版年" clearable />
          <el-input v-model="authors" class="w16p" placeholder="作者" clearable />
        </div>
        <div class="search-box marginT20">
          <el-input v-model="place" class="w16p" placeholder="谱籍地" clearable />
          <el-input v-model="keyWord" class="w16p" placeholder="全文内容检索" clearable />
          <el-radio-group class="w16p" v-model="hasImage">
            <el-radio :label="''">全部影像</el-radio>
            <el-radio :label="1">有影像</el-radio>
            <el-radio :label="2">无影像</el-radio>
          </el-radio-group>
          <el-radio-group class="w16p" v-model="hasIndex">
            <el-radio :label="''">全部索引</el-radio>
            <el-radio :label="1">有索引</el-radio>
            <el-radio :label="2">无索引</el-radio>
          </el-radio-group>
          <div class="w16p"></div>
          <el-button class="w16p" type="primary" @click="handleSearch">检索</el-button>
        </div>
      </section>
      <!-- tab -->
      <section class="tab-section">
        <h3 class="title">找到{{total}}部家谱</h3>
        <ul class="tab-ul">
          <li :class="{active: tab === item.value}" v-for="(item, index) in tabList" :key="index" @click="tab = item.value">{{item.label}}</li>
        </ul>
      </section>
      <!-- data -->
      <section class="data-section">
        <!-- 分面器 -->
        <aside class="aside">
          <div class="scroll-wrap">
              <img class="left" src="../assets/scrollLeft.png" alt="">
              <img class="right" src="../assets/scrollRight.png" alt="">
          </div>
          <div class="statistics">
            <div class="box">
              <h3 class="title">姓氏</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: surname == item.surname}" v-for="(item, index) in listSurname" :key="index" @click="changeSurname(item)">{{item.surname}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">谱籍地</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: place == item.place}" v-for="(item, index) in listPlace" :key="index" @click="changeProperty('place', item.place)">{{item.place}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">堂号</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: hall == item.hall}" v-for="(item, index) in listHall" :key="index" @click="changeProperty('hall', item.hall)">{{item.hall}}({{item.length}})</li>
              </ul>
            </div>
            <div class="box">
              <h3 class="title">作者</h3>
              <ul class="list-wrap style1">
                  <li class="li" :class="{active: authors == item.authors}" v-for="(item, index) in listAuthors" :key="index" @click="changeProperty('authors', item.authors)">{{item.authors}}({{item.length}})</li>
              </ul>
            </div>
          </div>
        </aside>
        <!-- 谱目列表 -->
        <article class="article marginL20">
          <div class="scroll-wrap">
              <img class="left" src="../assets/scrollLeft.png" alt="">
              <img class="right" src="../assets/scrollRight.png" alt="">
          </div>
          <el-table 
            v-if="tab === 0"
            ref="jiapu"
            :data="tableData" 
            border 
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
            <!-- <el-table-column prop="authorJob" label="作者职务" width="120" align="center" />
            <el-table-column prop="firstAncestor" label="一世祖" width="120" align="center" />
            <el-table-column prop="migrationAncestor" label="始迁祖" width="120" align="center" /> -->
            <el-table-column prop="explain" label="说明" width="120" align="center" />
            <el-table-column prop="memo" label="备注" width="120" align="center" />
            <el-table-column label="操作" fixed="right" width="150" align="center">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'look')">查看</el-button>
                <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'image')">影像</el-button>
                <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'text')">全文</el-button>
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
        </article>
      </section>
    </main>
    <footer class="footer">
      <div class="left">
          
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
</template>

<style scoped lang="scss">
.genealogy-search-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f2f2f2 url('../assets/bg.png') 50% 0 no-repeat;
  background-size: 100% 200px;
  color: #333;
  .main{
    margin: 20px 50px auto 50px;
    width: calc(100% - 100px);
    height: calc(100% - 130px);
    .search-wrap{
      padding: 30px;
      background: url('../assets/eave.png') 0 0 repeat-x;
      background-color: #fff;
      .search-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .tab-section{
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .title{
        height: 14px;
        line-height: 14px;
        font-weight: normal;
        border-left: 4px solid #999;
        padding-left: 5px;
        font-size: 14px;
      }
      .tab-ul{
        display: flex;
        align-items: center;
        li{
          margin-left: 20px;
          cursor: pointer;
          &.active{
            color: #358acd;
          }
        }
      }
    }
    .data-section{
      height: calc(100% - 194px);
      display: flex;
      .aside{
        position: relative;
        padding-top: 25px;
        width: 240px;
        background-color: #fff;
      }
      .article{
        position: relative;
        padding-top: 25px;
        width: calc(100% - 260px);
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
    border-left: 4px solid #999;
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
