import React, { Component } from 'react'
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteProductImage} from '../../api/index'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {
  constructor(props){
    super(props)
    let fileList = [];
    const {imgs} = this.props;
    if(imgs && imgs.length>0){
      fileList = imgs.map((img,index)=>({
        uid:-(index+1),
        name:'image-1607597300144.jpg',
        status:'done',
        url:'http://zlx.cool:5000/upload/image-1607597300144.jpg'
      }))
    }
    this.state={
      previewVisible:false,
      previewImage:'',
      fileList
    }
  }
  getImages = ()=>{
    return this.state.fileList.map(file=>file.name)
  }
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList}) => {
    console.log(file,fileList.length,file===fileList[fileList.length-1])
    if(file.status==='done'){
      const result = file.response;//{state:0,data:{name,url}}
      if(result.status===0){
        const {name,url} = result.data;
        file = fileList[fileList.length-1]
        file.name = name;
        file.url = url;
      } 
    }else if(file.status==='removed'){
      let result = await reqDeleteProductImage(file.name);
      if(result.status===0){
      }
    } 
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action= '/manage/img/upload'//上传图片接口地址
          accept='image/*'
          name = 'image'//请求参数名
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

