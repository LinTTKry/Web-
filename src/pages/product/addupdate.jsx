import React from 'react'
import {Card,Input,Form,Cascader,Button} from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import {reqCategorys} from '../../api/index'
import {withRouter} from 'react-router-dom'
import PicturesWall from './pictures-wall'
import RichTextEditor from './richTextEditor'
import {reqAddOrUpdateProduct} from '../../api/index'
const {Item} = Form;
const {TextArea} = Input;
function ProductAddUpdate(props) {
    const isupdate = !!props.location.state;
    const product = props.location.state || {};
    const {detail} = product
    console.log(detail) 
    if(isupdate) product.imgs=['image-1610690052949.JPG']
    const categoryIds = [];
    if(isupdate){
      if(product.pCategoryId==='0'){
        categoryIds.push(product.categoryId)
      }else{
        categoryIds.push(product.pCategoryId)
        categoryIds.push(product.categoryId)
      }
    }
    const optionLists = []; 
    const [options, setOptions] = React.useState(optionLists); 
    const pw = React.useRef();
    const editor = React.useRef();
    const [form] = Form.useForm();
    const title = (
      <span>
        <ArrowLeftOutlined style = {{marginRight:'15px',color:'#1DA57A'}} onClick = {()=>props.history.goBack()}/>
        {!isupdate?'添加商品':'修改商品'}
      </span>    
    )
    const formLayout =  {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }
    const submit=()=> {
      form.validateFields().then(async (value)=>{
        const {name,price,desc,categoryIds} = value;
        let pCategoryId, categoryId;
        if(categoryIds.length===1){
          pCategoryId = '0'
          categoryId = categoryIds[0]
        }else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = pw.current.getImages()
        const detail = editor.current.getDetail()
        const producted = {name,price,desc,imgs,detail,pCategoryId,categoryId}
        // 如果是更新需要加上id
        if(isupdate){
          producted._id = product._id;
        }
        console.log(producted)
        const result = await reqAddOrUpdateProduct(producted);
        console.log(result)
      }).catch(err=>{
        console.log('err')
      })
    }
    const initOptions= async (categorys)=>{
      const options = categorys.map((item)=>({
        value:item._id,
        label:item.name,
        isLeaf:false
      }))
      // 如果是一个二级分类的更新
      if(isupdate && product.pCategoryId !=='0'){
        const subcategorys = await getCategorys(product.pCategoryId);
          const suboptions = subcategorys.map((item)=>(
          {
            value:item._id,
            label:item.name,
            isLeaf:true
          })) 
        const targetOption = options.find(item=>item.value===product.pCategoryId)
        targetOption.children = suboptions
      }
      setOptions([...options])
    }
    const getCategorys = async (parentId)=>{
      const result = await reqCategorys(parentId);
      if(result.status === 0){
        const categorys = result.data;
        if(parentId==='0'){
          initOptions(categorys)      
        }else{
          return categorys;
        }
      }
    }
    const loadData = async(selectedOptions)=>{
      const targetOption = selectedOptions[0];
      targetOption.loading = true;
      const subcategorys = await getCategorys(targetOption.value);
      targetOption.loading= false;
      if(subcategorys && subcategorys.length>0){
        const suboptions = subcategorys.map((item)=>(
          {
            value:item._id,
            label:item.name,
            isLeaf:true
          }))
        targetOption.children=suboptions;
      }else{
        targetOption.isLeaf=true
      }    
      setOptions([...options])
    }
    React.useEffect(()=>{
      getCategorys('0');
    },[props])
    return (
      <Card title={title} bordered={true} >
        <Form 
          form = {form}
          {...formLayout}>
          <Item
            label="商品名称"
            name="name"
            initialValue={product.name}
            rules={[{ required: true, message: 'Please enter name!' }]
            }>  
            <Input style = {{width:400}}
            placeholder='请输入商品名称'></Input>       
          </Item>
          <Item
            label="商品描述"
            name="desc"
            initialValue={product.desc}
            rules={[{ required: true, message: 'Please enter description!' }]
            }>  
            <TextArea 
            style = {{width:400}} 
            placeholder='请输入商品描述'
            autoSize={{minRows:2,maxRows:6}}
            ></TextArea>       
          </Item>
          <Item
            label="商品价格"
            name="price"
            initialValue={product.price}
            rules={[
              { required: true, message: 'Please enter price!' },
              () => ({
                validator(_, value) {
                  if (value*1>0) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Price must large than 0!');
                },
              }),
            ]}>  
            <Input 
            type ='number'
            placeholder='请输入商品价格'
            style = {{width:400}} 
            addonAfter="元"></Input>
          </Item>
          <Item
            label="商品分类"
            name="categoryIds"
            rules={[{ required: true, message: 'Please choose category!' }]}
            initialValue={categoryIds}
            >  
            <Cascader 
            options={options} 
            style = {{width:400}}
            loadData={loadData} 
            />           
          </Item>
          <Item
            label="商品图片"
            name="imgs"
            initialValue={product.imgs}
            >  
            <PicturesWall ref = {pw} imgs= {product.imgs}/>
          </Item>
          <Item
            label="商品详情"
            name="detail"
            >  
            <RichTextEditor
            ref = {editor}
            labelCol= {{ span: 2 }}
            wrapperCol= {{ span: 16 }}
            detail = {detail}
            ></RichTextEditor>
          </Item>
          <Button type='primary' onClick={submit}>提交</Button>
        </Form>
      </Card>
    )
  }
export default withRouter(ProductAddUpdate)