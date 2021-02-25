import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout } from 'antd';
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../../pages/home'
import Category from '../../pages/category'
import Product from '../../pages/product'
import User from '../../pages/user'
import Roles from '../../pages/roles'
import Pie from '../../pages/charts/pie'
import Lineq from '../../pages/charts/line'
import Bar from '../../pages/charts/bar'
import NotFound from '../../pages/not-found'
import {Route,Switch} from 'react-router-dom'
import {DELETEUSER} from '../../redux/actions'
// 后台管理路由组件
const {Footer, Sider, Content } = Layout;
class Admin extends Component {
  render() {
    // 如果用户没有登录，返回登录页面
    if(!this.props.user.data || !this.props.user.data._id) return <Redirect to ='/login'></Redirect>
    return (
         <Layout style = {{minHeight:'100%'}}>
            <Sider><LeftNav user = {this.props.user} deleteUser = {this.props.DELETEUSER}/></Sider>
            <Layout>
              <Header username = {this.props.user.data.username} deleteUser = {this.props.DELETEUSER}>Head</Header>
              <Content style = {{margin:20,backgroundColor: 'white'}}>
                <Switch>
                  <Redirect exact from ='/' to='home' />
                  <Route path='/home' component = {Home}></Route>
                  <Route path='/category' component = {Category}></Route>
                  <Route path='/product' component = {Product}></Route>
                  <Route path='/user' component = {User}></Route>
                  <Route path='/roles' component = {Roles}></Route>
                  <Route path='/charts/bar' component = {Bar}></Route>
                  <Route path='/charts/line' component = {Lineq}></Route>
                  <Route path='/charts/pie' component = {Pie}></Route>
                  <Route component = {NotFound}></Route>
                </Switch>
              </Content>
              <Footer style = {{textAlign:'center',color:'#ccc'}}>Tong l Dan</Footer>
            </Layout>
          </Layout>
    )
  }
}
export default connect (
  state => ({user:state}),
{
  DELETEUSER
}
)(Admin)