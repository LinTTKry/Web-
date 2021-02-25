import React, { Component } from 'react'
import{Route,Switch,Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './addupdate'
export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path ='/product' component={ProductHome}></Route>
          <Route path ='/product/detail' component={ProductDetail}></Route>
          <Route path ='/product/addupdate' component={ProductAddUpdate}></Route>
          <Redirect to = '/product' />
        </Switch>
      </div>
    )
  }
}
