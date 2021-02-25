import React, { Component } from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item;
export default class UpdateForm extends Component{     
      static propTypes = {
        category: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
      }
      
      formRef = React.createRef();
      componentDidMount(){
        this.props.setForm(this.formRef.current)
      }
      render(){
        const {categoryName} =this.props
        return (
          <Form name = 'form' ref={this.formRef} preserve={false} onFinish = {this.onFinish}>
            <Item name = "categoryName" initialValue = {categoryName}
            rules={[
              { required: true, whitespace:true, message: '分类名称输入'}
            ]}>
              <Input placeholder = {'请输入分类名称'} ></Input>
            </Item>      
          </Form>
        )
      }
}