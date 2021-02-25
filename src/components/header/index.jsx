import React, { Component } from 'react'
import './index.less'
import {withRouter} from 'react-router-dom'
import {reqWeather} from '../../api/index'
import formateDate from '../../utils/dataUtils'
import logo from '../../asserts/logo.png'
import menuList from '../../config'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button'
const { confirm } = Modal;

class Header extends Component {
  state = {
    currentTime : '',
    weather : '',
  }
  getTime =()=> {
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
      // console.log(currentTime)
    }, 1000);
  }
  getWeather = async ()=>{
    const  {weather} = await reqWeather(110101);
    this.setState({weather})
  }
  getMenuHead = ()=> {
    const {pathname} = this.props.location;  
    let title
    menuList.forEach((item)=> {
      if(item.key === pathname) title = item.title;
      else if(item.children){
        const citem = item.children.find(item=>pathname.indexOf(item.key)===0)
        if(citem) title = citem.title
      }
    })
    return title;
  }
  
  LogOut = () =>{
    confirm({
      title: '是否退出登录?',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        // console.log(this.props)
        this.props.deleteUser()
        this.props.history.replace('/login')
      }
    });
  }
  componentDidMount(){
    this.getTime() 
    this.getWeather() 
  }
  componentWillUnmount (){
    clearInterval(this.timer)
  }
  render() {
    const {currentTime, weather} = this.state;
    const title = this.getMenuHead();
    return (
      <div className = 'header'>
        <div className = 'header-top'>
          <h5>欢迎, {this.props.username}</h5>
          <LinkButton onClick = {this.LogOut}>退出</LinkButton>
        </div>       
        <div className = 'header-bottom'>
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={logo} alt=""/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
