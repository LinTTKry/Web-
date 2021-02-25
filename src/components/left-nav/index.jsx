import React, { Component } from 'react'
import './index.less'
import {Link,withRouter} from 'react-router-dom'
import logo from '../../asserts/logo.png'
import { Menu } from 'antd'
import menuList from '../../config'
const { SubMenu } = Menu;
// 非路由组件
class LeftNav extends Component {
  hasAuth =(item)=>{
    const {key,isPublic} = item;
    const {menus} = this.props.user.data.role
    const {username} = this.props.user.data
    if(username==='admin'||isPublic || menus.indexOf(key)!== -1){
      return true
    }
    else if(item.children){
      return !!item.children.find(child=>menus.indexOf(child.key)!== -1)
    }
  }
  getMenuNodes_map = (menuList) => {
     return menuList.map((item)=> {
      if(!item.children){ 
        return (        
          <Menu.Item key={item.key} icon = {item.icon}>
            <Link to ={item.key}>{item.title}</Link>
          </Menu.Item>
      )}
      else {
        // const childrenList = this.getMenuNodes_map(item.children)
        return (
          <SubMenu key= {item.key} title={item.title} icon = {item.icon}>
            {
              this.getMenuNodes_map(item.children)
            }
          </SubMenu>
        )
      }
    })
  }
  getMenuNode_reduce = (menuList)=>{
    const path = this.props.location.pathname
    const user = this.props.user.data
    return menuList.reduce((pre,item)=>{
      console.log('user',item)
      if(this.hasAuth(item)){
        if(!item.children){
          pre.push(
            <Menu.Item key={item.key} icon = {item.icon}>
                <Link to ={{pathname:item.key,state:user}}>{item.title}</Link>
            </Menu.Item>
          )
        }else{
          const cItem = item.children.find(item => path.indexOf(item.key)===0)
          if (cItem) this.openKey = item.key
          pre.push(
            <SubMenu key= {item.key} title={item.title} icon = {item.icon}>
              {
                this.getMenuNode_reduce(item.children)
              }
            </SubMenu>
          )
        }
      }    
      return pre
    },[])
  }
  UNSAFE_componentWillMount(){
    this.menuNodes = this.getMenuNode_reduce(menuList)
  }
  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0)path ='/product'
    const openKey = this.openKey
    return (
      <div className = 'left-nav'>
        <Link to ='/' className = 'left-nav-title'>
          <img src={logo} alt=""/>
          <h1>TongAAAA</h1>
        </Link> 
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys = {[openKey]}
          mode="inline"
          theme="dark"
        >
        {
          this.menuNodes
        }
        </Menu> 
      </div>
    )
  }
}
// 高阶组件
// 包装非路由组件，返回一个新的组件
// 新的组件向非路由组件传递3个属性，history/location/match
export default withRouter(LeftNav)