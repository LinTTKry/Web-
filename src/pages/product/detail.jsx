import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Card,List} from 'antd'
import './product.less'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import {reqCategory} from '../../api/index'
const {Item} = List;
class ProductDetail extends Component {
  state={
    cname1:'',
    cname2:''
  }
  getCategory=async(categoryId)=>{
    const result = await reqCategory(categoryId);
    const {name} = result.data;
    if(result.status===0){
      this.setState({cname1:name})
      console.log('sus',name)
    }
  }
  async componentDidMount(){
    const {pcategoryId,categoryId} = this.props.location.state;
    console.log(pcategoryId,categoryId)
    if(pcategoryId===undefined){
      const result = await reqCategory(categoryId);
      console.log(result)
      const cname1 = result.data.name;
      this.setState({
        cname1
      })
    }else {
      // 串联形式
      // const result1 = await reqCategory(pcategoryId);
      // const result2 = await reqCategory(categoryId);
      // const cname1 = result1.data.name;
      // const cname2 = result2.data.name;
      // 并行形式
      let results = await Promise.all([reqCategory(pcategoryId),reqCategory(categoryId)])
      const cname1 = results[0].data.name;
      const cname2 = results[1].data.name;
      this.setState({
        cname1,
        cname2
      })
    }
  }
  render() {
    const title = (
      <span>
        <ArrowLeftOutlined style = {{marginRight:'15px',color:'#1DA57A'}} onClick = {()=>this.props.history.goBack()}/>
        商品详情
      </span>    
    )
    const imgs = [
      'http://zlx.cool:5000/upload/image-1607597300144.jpg',
      'http://zlx.cool:5000/upload/image-1607597300144.jpg',
      'http://zlx.cool:5000/upload/image-1607597300144.jpg',
    ]
    const detail = `<p>1111</p>`
    const {name,desc,price,} = this.props.location.state;
    const {cname1,cname2} = this.state
    return (
        <Card title={title} bordered={true} >
          <List className = "product-detail">
            <Item style={{justifyContent:'start'}}>
              <span className='left'>商品名称:</span>
              <span>{name}</span>
            </Item>
            <Item  style={{justifyContent:'start'}}>
              <span className='left'>商品描述:</span>
              <span>{desc}</span>
            </Item>
            <Item  style={{justifyContent:'start'}}>
              <span className='left'>商品价格:</span>
              <span>{price}</span>
            </Item>
            <Item  style={{justifyContent:'start'}}>
              <span className='left'>所属分类:</span>
              <span>{cname1} {cname2?'-->'+cname2:''}</span>
            </Item>
            <Item  style={{justifyContent:'start'}}>
              <span className='left'>商品图片:</span>
              {
                 imgs.map((item,index)=>{
                    return (
                    <img key = {index} src = {item} alt ='' className = 'product-img'/>)
                 })
              }
            </Item>
            <Item  style={{justifyContent:'start'}}>
              <span className='left'>商品详情:</span>
              <span dangerouslySetInnerHTML={{__html:detail}}></span>
            </Item>
          </List>
        </Card>
    )
  }
}
export default withRouter(ProductDetail)