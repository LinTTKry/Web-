import React, { Component } from 'react'
import { Editor } from "react-draft-wysiwyg";
import {EditorState,convertToRaw,ContentState} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    const html = this.props.detail;
    if(html){
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    }else {
      this.state = {
        editorState:EditorState.createEmpty(),
      };
    }
    
  }
  onEditorStateChange = (editorState)=>{
    this.setState({
      editorState,
    })
  }
  uploadCallback = (file)=>{
    return new Promise(
      (resolve,reject)=>{
        const xhr = new  XMLHttpRequest();
        xhr.open('POST','/manage/img/upload');
        const data = new FormData();
        data.append('image',file)
        xhr.send(data);
        xhr.addEventListener('load',()=>{
          const response = JSON.parse(xhr.responseText);
          resolve({
            data:{link:response.data.url}
          })
        })
        xhr.addEventListener('error',()=>{
          const error = JSON.parse(xhr.responseText);
          reject(error)
        })
      }
    )
  }
  getDetail = ()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  render() {
    const {editorState} = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle = {{minHeight:200, border:'1px solid #000', paddingLeft:'10px'}}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {uploadCallback: this.uploadCallback, alt :{present:true,manndatory:true}}
        }}
      />
    )
  }
}
