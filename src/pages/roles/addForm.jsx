import React, { Component } from 'react'
import {Form,Input} from 'antd'
export default class AddForm extends Component {
  formRef = React.createRef();
  componentDidMount(){
    this.props.setForm(this.formRef.current)
  }
  render() {
    const Item = Form.Item
    const formLayout =  {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    return (
      <Form ref ={this.formRef} {...formLayout}>
        <Item
        label="角色名称"
        name="roleName"
        rules={[{ required: true, message: 'Please input name!' }]}
        > 
          <Input placeholder='请输入角色名称'
          ></Input>
        </Item>
      </Form>
    )
  }
}
