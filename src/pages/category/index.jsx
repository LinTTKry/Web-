import React, { Component } from 'react'
import './index.less'
import {Card,Button, Table, message,Modal} from 'antd';
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddCategorys, reqUpdateCategorys} from '../../api/index'
import AddForm from './addForm'
import UpdateForm from './UpdateForm'
import {
  PlusOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
    subCategorys: [],
    loading: false,
    parentId:'0',
    parentName:'',
    showStatus: 0,//0都不显示，1:显示添加，2：显示更新
  }
  initColumns = ()=> {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (categorys) => (
          <span className = 'category-action'>
            <LinkButton onClick = {()=>this.showUpdate(categorys)}>修改分类</LinkButton>
            {
              categorys.parentId === '0' ? <LinkButton onClick = {()=>this.showSubCategory(categorys)}>查看子分类</LinkButton>:null
            }
          </span>        
        ),
      }
    ];
  }
  getCategorys = async (parentId)=>{
    this.setState({loading:true})
    parentId = parentId || this.state.parentId;
    const result = await reqCategorys(parentId);
    this.setState({loading:false})
    if(result.status === 0){
      const categorys = result.data;
      if(parentId === '0'){       
        this.setState({categorys})
      }else {
        this.setState({subCategorys:categorys})
      }
      
    }else{
      message.error('获取列表分类失败')
    }
  }
  showSubCategory = async (categorys)=> {
    this.setState({
      parentId: categorys._id,
      parentName: categorys.name
    },()=>{
      // 回调函数在状态更新完之后完成
      this.getCategorys()
    })
    // 更新状态是异步的
    // 也就是说parentId还是0
    
  }
  showCategorys = ()=> {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  handleCancel =()=>{
    this.setState({showStatus:0})   
  }
  showAdd = ()=>{
    this.setState({
      showStatus:1
    })
  }
  showUpdate = (categorys)=>{
    this.category = categorys
    this.setState({
      showStatus:2
    })
  }
  addCategorys = ()=>{
    this.addform.validateFields().then(async(value)=>{
      this.setState({
        showStatus:0
      })
      const {categoryName,parentId} = value
      const result = await reqAddCategorys({categoryName,parentId})
      if(result.status === 0){
        if(parentId === this.state.parentId){
          this.getCategorys()
        }else if(parentId==='0'){
          this.getCategorys('0')
        }
      }
    })
  }
  updateCategorys = ()=>{
    this.updateform.validateFields().then(async(value)=>{
      this.setState({
        showStatus:0
      })
      const categoryId = this.category._id;
      const {categoryName} = value;
      const result = await reqUpdateCategorys({categoryId,categoryName})
      if(result.status === 0){
        this.getCategorys()
        console.log('update succes')
      } else{
        console.log('update fail')
      }
    })
  }

  UNSAFE_componentWillMount(){
    this.initColumns();
  }
  componentDidMount(){
    // 获取一级
    this.getCategorys();
  }
  render() {
    const {categorys,parentId, parentName, subCategorys,loading,showStatus} = this.state;
    const category = this.category || {}
    const title = parentId === '0'?'一级分类列表':(
      <span className = 'categories-two'>
        <LinkButton onClick = {this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined style = {{margin: '0 10px'}}/>
        <span>{parentName}</span>
      </span>
    );
    const extra = (
      <Button type='primary' onClick = {this.showAdd}>
       <PlusOutlined />
        添加
      </Button>
    )
    return (
      <>
        <Card  title={title} extra={extra}>
          <Table 
          dataSource={parentId === '0' ? categorys:subCategorys} 
          columns={this.columns} 
          loading = {loading}
          bordered  
          rowkey ='_id' 
          pagination = {{defaultPageSize: 5, showQuickJumper: true}}/>
        </Card>
        <Modal 
          title="添加分类" 
          visible={showStatus===1}
          onOk={this.addCategorys} 
          onCancel={this.handleCancel}
          key = 'Add'
          destroyOnClose
          >
          <AddForm categorys = {categorys} parentId = {parentId} setForm = {(form)=>this.addform = form}></AddForm>
        </Modal>
        <Modal 
          title="更新分类" 
          visible={showStatus===2} 
          onOk={this.updateCategorys} 
          onCancel={this.handleCancel}
          key = 'Update'
          destroyOnClose
          >
          <UpdateForm categoryName = {category.name}  setForm = {(form)=>this.updateform = form}></UpdateForm>
        </Modal>
     </> 
    )
  }
}
