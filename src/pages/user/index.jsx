import React, { Component } from 'react'
import {Card,Button,Table,Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqUserList,reqUserDelete,reqUserAddOrUpdate} from '../../api/index'
import AddUserForm from './addUserForm'
import formateDate  from '../../utils/dataUtils'
import {QuestionCircleOutlined} from '@ant-design/icons'
const {confirm} = Modal
export default class User extends Component {
  constructor(){
    super();
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render:(role_id)=>this.roleNames[role_id]
      },
      {
        title: '所属操作',
        render:(user)=>(
          <span style = {{display:'flex'}}>
            <LinkButton 
               onClick = {
                 ()=>this.setState({
                     showIndex:2,
                     currentUser:user
                  })
                }
            >修改</LinkButton>
            <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ];
    this.getUserList();
    this.state = {
      users:[],
      roles:[],
      showIndex:0,
      currentUser:{},
    }
  }
  deleteUser = (user)=>{
    confirm({
      title: `Do you Want to delete user ${user.username}?`,
      icon:<QuestionCircleOutlined />,
      onOk:async ()=>{
        const result = await reqUserDelete(user._id);
        if(result.status===0){
          this.getUserList()
        }
      }
    });
  }
  initRoleNames = (roles)=>{
    const roleNames= roles.reduce((pre,role)=>{
      pre[role._id]=role.name
      return pre
    },{})
    this.roleNames = roleNames
  }
  getUserList = async ()=>{
    const result = await reqUserList();
    if(result.status===0){
      const {users,roles} = result.data;
      this.initRoleNames(roles)
      this.setState({
        users,
        roles})
      console.log('sus')
    }else {
      console.log('err')
    }
  }
  addorUpdateUser = ()=>{
    const {showIndex,currentUser}= this.state
    this.userForm.validateFields().then(async(user)=>{
    if(showIndex===2) user._id = currentUser._id
    console.log(user)
    this.setState({showIndex:0})
    const result = await reqUserAddOrUpdate(user)
    if(result.status===0){
      this.getUserList()
    }else {
      console.log(result)
    }
  })     
  }
  render() {
    const {users,showIndex,currentUser,roles} = this.state;
    const title = (
      <Button type = 'primary' onClick = {()=>this.setState({showIndex:1})}>创建用户</Button>
    )
    const Modaltitle = (
     showIndex===1?"创建用户":"修改用户"
    )
    return (
      <div>
        <Card title={title} bordered>
          <Table dataSource={users} columns={this.columns} bordered
           pagination = {{defaultPageSize: 5, showQuickJumper: true}}
          />
        </Card>
        <Modal
          title={Modaltitle}
          visible={showIndex!==0}
          onOk={this.addorUpdateUser}
          onCancel={()=>{
            this.setState({showIndex:0})
            this.userForm.resetFields();
          }}
          okText="Ok"
          // destroyOnClose
          cancelText="Cancel"
        >
          <AddUserForm currentUser = {showIndex===2?currentUser:{}} roleNames = {this.roleNames} roles={roles}
          setForm = {(form)=>this.userForm =form }></AddUserForm>
        </Modal>
        
      </div>      
    )
  }
}
