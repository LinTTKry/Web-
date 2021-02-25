import React from 'react'
import logo from '../../asserts/logo.png'
import './index.less'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import {reqLogin} from '../../api/index'
import {SAVEUSER} from '../../redux/actions'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
// 登录的路由组件
const {Item} = Form//不能写在import之前
function Login (props){
    const [form] = Form.useForm();
    // 提交发送ajax请求
    const onFinish = async values => {
        const result = await reqLogin(values.username,values.password)
        if(result.status === 0){
          message.success('成功了')
          props.SAVEUSER(result)
          props.history.replace('/admin')     
        } 
        else message.error(result.msg)      
    }
    // 如果已经登录过了就直接跳转到主页面
    if (props.user.data && props.user.data._id){
      return <Redirect to = '/'/>
    }
    return (
      <div className = 'login'>
        <header className = 'login-header'>
            <img src={logo} alt=""/>
            <h1>React项目：后台管理项目</h1>
        </header>
        <section className = 'login-content'>
          <h2>用户登录</h2>
          <Form
            form = {form}
            name="normal_login"
            className="login-form"
            onFinish = {onFinish}
          >
            <Item
              name="username"
              // 声明式验证，使用他人的验证
              rules={[
                { required: true, whitespace:true, message: 'Please input your Username!'},
                { min: 4, message: 'At least 4 characters!'},
                { max: 12, message: 'At most 12 characters!'},
                {pattern: /^[a-zA-Z0-9]+$/,message: 'Username should be composed of alphet, number and _'}
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" style = {{color: 'rgba(0,0,0,.25)'}} />} placeholder="Username" />
            </Item>
            <Item
              name="password"
              rules={[
                { required: true, whitespace:true, message: 'Please input your Username!'},
                { min: 4, message: 'At least 4 characters!'},
                { max: 12, message: 'At most 12 characters!'},
                {pattern: /^[a-zA-Z0-9]+$/,message: 'Username should be composed of alphet, number and _'}
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style = {{color: 'rgba(0,0,0,.25)'}}/>}
                type="password"
                placeholder="Password"
              />
            </Item>

            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form>
        </section>
      </div>
    )
  }

export default connect (
  state => ({user:state}),
{
  SAVEUSER
}
)(Login)
// 1. 前台表单验证
// 2. 数据收集