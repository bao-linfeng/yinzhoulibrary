import axios from 'axios';
let baseURL = 'https://nbyzdata.qingtime.cn';

axios.interceptors.response.use(
  (response) => {
    switch (response.data.statusCode || response.data.status) {
      case '701':
        localStorage.clear();
        // createMsg('登录失效');
        break;
      case '201':
        // createMsg(response.data.msg)
        break;
      default:
    }

    return response;
  },
  (err) => {
    console.log(err);
  }
);

const request = {
  get: (url, params, base = '') => {
    return new Promise((resolve, reject) => {
      axios
        .get((base ? base : baseURL) + url, { params })
        .then((response) => {
          resolve(response.data);
          if (response.data.status == 301) {
            // 验证码失效 => 跳转 验证码校验UI 2022.07.02 -> baolf
            // createMsg(response.data.msg);
            // router.push('/authentication');
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  post: (url, params, base) => {
    return new Promise((resolve, reject) => {
      axios
        .post((base ? base : baseURL) + url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  patch: (url, params) => {
    return new Promise(function (resolve, reject) {
      axios
        .patch(baseURL + url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  delete: (url, params) => {
    return new Promise(function (resolve, reject) {
      axios
        .delete(baseURL + url, {
          data: params,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
};

const catalog = {
  searchGCFrontEnd(param) {// 谱检索（前台无token）
    return request.get('/catalog/searchGCFrontEnd', param);
  },
  GCResolverFrontEnd(param) {// 谱检索分辨器（前台无token）
    return request.get('/catalog/GCResolverFrontEnd', param);
  },
  GCDetailFrontEnd(param) {// 谱目详情（前台无token）
    return request.get('/catalog/GCDetailFrontEnd', param);
  },
  getImageList(param) {
    return request.get('/catalog/imageList', param);
  },
  getImageDetail(param) {
    return request.get('/catalog/image/detail', param);
  },
  createSingleGC(param) {// 单谱创建
    return request.post('/catalog/createSingleGC', param);
  },
  editSingleGC(param) {// 单谱创建
    return request.patch('/catalog/editSingleGC', param);
  },
  deleteSingleGC(param) {// 单谱删除
    return request.delete('/catalog/deleteSingleGC', param);
  },
  searchGC(param) {// 谱检索
    return request.get('/catalog/searchGC', param);
  },
};

const login = {
  loginByPassword(param) {// 登录
    return request.get('/loginByPassword', param);
  },
  setPassword(param) {// 设置新密码
    return request.patch('/setPassword', param);
  },
};

export { 
  catalog,
  login,
  baseURL, 
};
