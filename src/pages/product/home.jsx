import React, { Component } from 'react'
import {Card, Select,Input,Button,Table} from 'antd'
import {
  PlusOutlined
} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {withRouter } from 'react-router';
import {reqProducts,reqSearchProducts,reqUpdateProductStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'
const Option = Select.Option;
class ProductHome extends Component {
  state = {
    products:[],
    loading: false,
    total:0,
    searchName:'',//搜索关键字;
    searchType:'productName',//根据哪个字段搜索
  }
  initColumns=()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc'        
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price)=>'￥'+price
      },
      {
        title: '状态',
        width:100,
        render: (product) => {
          const {status,_id} = product;
          const newState = status===1?2:1;
          return (
          <span>
            <Button 
            type='primary' 
            onClick = {()=>this.updateStatus(_id,newState)}
            >
              {status === 1?'下架':'上架'}
            </Button>
            <span>{status === 1?'在售':'已下架'}</span>
          </span>
        )},
      },
      {
        title: '操作',
        width:100,
        render: (product) => (
          <span>
            <LinkButton onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
            <LinkButton onClick={()=>this.props.history.push('product/addupdate',product)}>修改</LinkButton>
          </span>
        ),
      },
    ];
  }
  updateStatus=async(_id,status)=>{
    // console.log(status)
    const result = await reqUpdateProductStatus(_id,status);
    if(result.status===0){
      console.log('sus')
      this.getProducts(this.pageNum);
    }
  }
  getProducts=async(pageNum)=>{
    this.pageNum=pageNum;//让此页操作可见
    this.setState({loading:true});
    const {searchName,searchType} = this.state
    let result;
    if(searchName){
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    }else{
      result = await reqProducts(pageNum,PAGE_SIZE);
    }
    this.setState({loading:false});
    if (result.status===0) {
        const {total,list} = result.data;
        this.setState({total,
          products:list})
    }
    
  }
  componentWillMount(){
    this.initColumns();
  }
  componentDidMount(){
    this.getProducts(1);
  }
  render() {
    const {products,total,loading,searchType}= this.state
    const title = (
      <span>
        <Select 
        defaultValue={searchType} 
        style={{width:150}} 
        onChange = {(value)=>this.setState({searchType:value})
        }>
            <Option value = 'productName'>按名称搜索</Option>
            <Option value = 'productDesc'>按描述搜索</Option>
        </Select>
        <Input 
        style={{width:150, margin:'0 15px'}} 
        placeholder='关键字'
        onChange={(event)=>this.setState({searchName:event.target.value})}></Input>    
        <Button type='primary'onClick = {()=>this.getProducts(1)}>搜索</Button>
      </span>          
    )
    const extra = (
      <Button type = 'primary' onClick={()=>this.props.history.push('/product/addupdate')}>
        <PlusOutlined/>
        添加商品
      </Button>
    )
    return (
      <Card size="small" title={title} extra={extra}>
      <Table 
      columns={this.columns} 
      loading = {loading}
      dataSource={products} 
      bordered 
      // pagination给总数及pageSize可以自动分页，并且在选择页面时onChange可以绑定函数
      pagination = {{
        current:this.pageNum,
        total,
        defaultPageSize: PAGE_SIZE, 
        showQuickJumper: true,
        onChange: this.getProducts//(pageNum)=>{this.pageProducts(pageNum)}
        }}/>
    </Card>
    )
  }
}
export default withRouter(ProductHome)
