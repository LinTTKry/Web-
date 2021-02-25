import React, { Component } from 'react'
import {Form,Input, Select} from 'antd'
const {Item} = Form
const {Option} = Select
export default class AddUserForm extends Component {
  formRef = React.createRef();
  componentDidMount (){
    return this.props.setForm(this.formRef.current)
  }
  render() {
    const {username,email,phone,role_id,password}=this.props.currentUser
    console.log(this.props.currentUser)
    const formLayout =  {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    return (
      <Form {...formLayout} ref = {this.formRef}>
        <Item
          label="用户名"
          name="username"
          initialValue={username}
          >  
          <Input style = {{width:400}}
          placeholder='请输入用户名'></Input>       
        </Item>
        {
          this.props.currentUser._id?null:(
            <Item
              label="密码"
              name="password"
              initialValue={password}
              >  
              <Input style = {{width:400}}
              placeholder='请输入密码'></Input>       
            </Item>
          )
        }        
        <Item
          label="手机号"
          name="phone"
          initialValue={phone}
          >  
          <Input style = {{width:400}}
          placeholder='请输入手机号'></Input>       
        </Item>
        <Item
          label="邮箱"
          name="email"
          initialValue={email}
          >  
          <Input style = {{width:400}}
          placeholder='请输入邮箱'></Input>       
        </Item>
        <Item
          label="角色"
          name="role_id"
          initialValue={this.props.roleNames[role_id]}
          >  
          <Select style = {{width:400}}>
            {
              this.props.roles.map(role=>
                <Option key = {role._id} value = {role._id}>{role.name}</Option>)
            }
          </Select>       
        </Item>
      </Form>
    )
  }
}
