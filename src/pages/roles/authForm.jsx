import React, { Component } from 'react'
import {Input,Tree,Form} from 'antd'
import menuList from '../../config/index' 
import PropTypes from 'prop-types'
const Item = Form.Item
export default class AuthForm extends Component {
  static propTypes = {
    role : PropTypes.object
  }
  constructor(props){
    super(props)
    this.treeData = [
      {
        title:"平台权限",
        key:'all',
        children:menuList
      }
    ]
    const {menus} = this.props.role
    this.state = {
      checkedKeys:menus
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys:menus
    })
  }
  getMenus = ()=>this.state.checkedKeys;
  onCheck = (checkedKeys)=>{
    this.setState({
      checkedKeys
    })
  }
  render() {
    const {role} = this.props
    const {checkedKeys} = this.state
    const formLayout =  {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    return (
      <div>
        <Form  {...formLayout}>
          <Item label="角色名称"> 
          <Input value = {role.name} disabled></Input>
          </Item>
        </Form>   
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          // onSelect={this.onCheck}
          onCheck={this.onCheck}
          treeData={this.treeData}
        />  
      </div>
    )
  }
}
