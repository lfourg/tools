import axios from 'axios'

// axios 配置
axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
let baseURL = '/api'
let instance = axios.create({

});

let api = {
  post: function (url, params) {
    return new Promise((resolve, reject) => {
      instance.post(baseURL + url, params).then(response => {
        resolve(response.data);
      }).catch((error) => {
        reject(error)
      })
    });
  },
  get: function (url, params) {
    return new Promise((resolve, reject) => {
      instance.get(baseURL + url, {params: params}).then(response => {
        resolve(response.data);
      }).catch((error) => {
        reject(error);
      })
    });
  }
}

export default api;
