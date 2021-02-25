import axios from 'axios'
import {message} from 'antd'
// 函数的返回值是promise对象
// 默认是get请求并且不发送数据
export default function ajax (url,data = {},type = 'GET'){
    return new Promise ((resolve,reject)=> {
      let promise
      if(type === 'GET'){
        promise =  axios.get(url,
          {params: data})
      }
      else{
        promise = axios.post(url,data)
      }
      promise.then(response => {
        resolve(response.data)
      }).catch(error => {
        message.error('error: '+ error.message)
      })
    })
      
}