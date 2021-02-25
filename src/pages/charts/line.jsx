import React, { Component } from 'react'
import { Chart, Line, Point, Tooltip, Axis } from "bizcharts";

export default class Lineq extends Component {
  render() {
    const data = [
      {
        year: "1991",
        value: 3,
      },
      {
        year: "1992",
        value: 4,
      },
      {
        year: "1993",
        value: 3.5,
      },
      {
        year: "1994",
        value: 5,
      },
      {
        year: "1995",
        value: 4.9,
      },
      {
        year: "1996",
        value: 6,
      },
      {
        year: "1997",
        value: 7,
      },
      {
        year: "1998",
        value: 9,
      },
      {
        year: "1999",
        value: 11,
      },
    ];
    return (
      <div>
          <Chart
            padding={[10, 20, 50, 50]}
            autoFit
            height={500}
            data={data}
            scale={{ value: { min: 0,max:11 } }}
            // onLineMouseleave={console.log}
            // onPointClick={console.warn}
            onAxisLabelClick={(e => {
              const { axis } = e.gEvent.delegateObject;
              debugger
              alert(`you clicked axis: ${axis.get('field')}`)
            })}
          >
            <Line position="year*value" />
            <Point position="year*value" />
            <Tooltip showCrosshairs lock triggerOn='click' />
            <Axis name='value' title={{
              position: 'center'
            }} />
      </Chart>
      </div>
    )
  }
}
