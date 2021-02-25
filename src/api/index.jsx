// 能根据接口文档定义接口请求
// 包含应用中所有接口请求函数的模块
import ajax from './ajax'
import json from 'jsonp'
import { message } from 'antd'

export const reqLogin = (username, password)=>ajax('/login', {username, password},'POST')

export const reqAddUser = (user) => ajax('/manage/user/add', {user},'POST')

export const reqWeather = (cityCode) =>{
  return new Promise ((resolve,reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&Key=50818ea5327e0327fe99dcff454b1487`;
    // 发送jsonp请求
    json(url,{},(err,data)=>{
      if(!err && data.status === '1'){
          let {reporttime,weather} = data.lives[0];
          // reporttime = reporttime.slice(0,10)
          // console.log(reporttime)
          resolve({reporttime,weather})
      }else{
          message.error('获取信息失败！')
      }
    })
  })
  
}

export const reqCategorys = (parentId)=> ajax('/manage/category/list',{parentId})

export const reqAddCategorys = ({categoryName,parentId})=> ajax( '/manage/category/add',{categoryName,parentId},'POST')

export const reqUpdateCategorys = ({categoryId,categoryName})=> ajax('/manage/category/update',{categoryId,categoryName},'POST')

export const reqProducts = (pageNum,pageSize)=> ajax('/manage/product/list',{pageNum,pageSize})

// 根据类型来选择按名称还是描述搜索
// searchType:productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax('/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName//变量作为属性名应该要加[]
})


export const reqCategory=(categoryId) =>ajax('/manage/category/info',{categoryId})

export const reqUpdateProductStatus=(productId,status) =>ajax('/manage/product/updateStatus',{productId,status},'POST')

export const reqDeleteProductImage=(name) =>ajax('/manage/img/delete',{name},'POST')

export const reqAddOrUpdateProduct=(product) =>ajax('/manage/product/' +(product._id?'update':'add'),{product},'POST')

export const reqRoleList=() =>ajax('/manage/role/list')

export const reqAddRole=(roleName) =>ajax('/manage/role/add',{roleName},'POST')

export const reqUpdateRole=(role) =>ajax('/manage/role/update',role,'POST')

export const reqUserList=() =>ajax('/manage/user/list')

export const reqUserDelete=(userId) =>ajax('/manage/user/delete',{userId},'POST')

export const reqUserAddOrUpdate=(user) =>ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')

