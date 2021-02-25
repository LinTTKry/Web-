import React, { Component } from 'react'
import {Card,Button, Table,Modal} from 'antd';
import {reqRoleList,reqAddRole,reqUpdateRole} from '../../api/index'
import AddForm from './addForm'
import AuthForm from './authForm'
import formateDate from '../../utils/dataUtils'
import {connect} from 'react-redux'
import {DELETEUSER} from '../../redux/actions'
class Roles extends Component {
  constructor(){
    super()
    this.columns=[
      {
        title:'角色名称',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time)=>formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
      }
    ]
    this.state = {
      roles:[],
      role:{},//选中的role
      loading:false,
      showCreate:false,
      showPower:false
    }
    this.authRef = React.createRef();
  }
  componentDidMount (){
    this.getRoleList();
  }
  getRoleList= async()=>{
    this.setState({loading:true})
    const result = await reqRoleList();
    this.setState({loading:false})
    if(result.status ===0){
      const roles = result.data;
      this.setState({roles})
    }
  }
  onRow = (role)=>{
    return {
      onClick: event=>{
        this.setState({role})
      }
    }
  }
  createRole = ()=>{
    this.form.validateFields().then(async(value)=>{
      this.setState({showCreate:false})
      this.form.resetFields()
      const {roleName} = value
      const result = await reqAddRole(roleName)
      if(result.status===0){
        const role = result.data;
        console.log(role)
        this.setState(state=>({
          roles:[...state.roles,role]
        }))
      }
    }).catch(err=>{
      console.log('err')
    })
  }
  updateRole = async()=>{
    this.setState({showPower:false})
    const role = this.state.role;
    const roleId = this.props.location.state.role_id
    const menus = this.authRef.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now()
    const result = await reqUpdateRole(role)
    if(result.status===0){
      if(roleId===role._id){
        this.props.DELETEUSER();
        this.props.history.replace('/admin')
      }else{
        this.setState({
          roles:[...this.state.roles]
        })
      }  
    }
  }
  render() {
    const {roles,role,loading,showCreate,showPower} = this.state
    const title = (
      <span>
        <Button type = 'primary' style = {{marginRight:10}} onClick={()=>this.setState({showCreate:true})}>创建用户</Button>
        <Button type = 'primary' disabled={!role._id} onClick = {()=>this.setState({showPower:true})}>设置角色权限</Button>
      </span>
    )
    return (
      <div>
        <Card title={title} bordered>
          <Table 
            dataSource={roles} 
            columns={this.columns} 
            bordered
            rowKey='_id'
            loading = {loading}
            pagination = {{defaultPageSize: 5}}
            rowSelection={{ type: 'radio' ,
            selectedRowKeys:[role._id],
            onSelect: (role)=>{
              this.setState({role})
            }
          }}
            onRow = {this.onRow}
          />
        </Card>
        <Modal
          title="创建角色"
          visible={showCreate}
          onOk={this.createRole}
          onCancel={()=>{
            this.setState({showCreate:false})
            this.form.resetFields()
          }}
          okText="Ok"
          // destroyOnClose
          cancelText="Cancel"
        >
          <AddForm setForm = {(form)=>this.form=form}></AddForm>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showPower}
          onOk={this.updateRole}
          onCancel={()=>{
            this.setState({showPower:false})
          }}
          okText="Ok"
          cancelText="Cancel"
        >
          <AuthForm ref = {this.authRef} role = {role}></AuthForm>
        </Modal>
      </div>
    )
  }
}
export default connect (
  state => ({user:state}),
{
  DELETEUSER
}
)(Roles)
