import React, {Component} from 'react'
import {Button, Card} from 'antd'
import { Chart, Interval } from 'bizcharts';
/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {

  render() {
    const data = [
      { year: '1951 年', sales: 38 },
      { year: '1952 年', sales: 52 },
      { year: '1956 年', sales: 61 },
      { year: '1957 年', sales: 45 },
      { year: '1958 年', sales: 48 },
      { year: '1959 年', sales: 38 },
      { year: '1960 年', sales: 38 },
      { year: '1962 年', sales: 38 },
    ];
    return (
      <div>
        <Card >
          <Button type='primary'>更新</Button>
        </Card>
        <Card title='柱状图'>
          <Chart height={300} autoFit data={data} >
            <Interval position="year*sales"  />
          </Chart>
        </Card>
      </div>
    )
  }
}
