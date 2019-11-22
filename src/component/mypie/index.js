/*
  
*/
import React, { Component } from 'react'
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class MyPie extends Component {

 getOptions = () => {
  const option = {
    // title:{
    //   text: (!this.props.type) ? '' : ((this.props.type === 'windArea') ? '区域风电分布图': '区域光伏分布图'),
    //   textStyle: {
    //     color: 'rgba(245, 245, 245, 0.85)'
    //   }
    // },  
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      backgroundColor: 'rgba(255, 255, 255, 0.86)',
      textStyle: {
        color: '#000',
      },
      extraCssText: 'box-shadow: 0 0 3px rgba(245, 245, 245, 0.85);'
    },
    legend:this.props.type ? {
      orient: 'vertical',
      // x: 'right',
      type: 'scroll',
      textStyle:{color:'rgba(245, 245, 245, 0.45)'},
      right: '16%',
      top: '22%',
      itemGap: 16,
      // formatter: (name) => {
      //   return name + ': ' + this.props.data.filter((item)=> {
      //     if(item.name === name) {
      //       return item.value;
      //     }
      //     return null;
      //   })[0].value + ' 瓦';
      // },
      data: this.props.data
    } : {
      orient: 'vertical',
      textStyle:{color:'black'},
      x: 'left',
      data: this.props.data
    },
    series: [
      {
        name: this.props.type ? '片区输电' : '操作系统类型',
        type:'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        center: this.props.type ? ['30%', '50%'] : ['50%', '50%'],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: this.props.data
        // 设计传入数据的接口 this.props.data
      }
    ]
  };

  return option;
 }

 render() {
  return (
   <div>
     <ReactEcharts
      lazyUpdate={true}
      option={this.getOptions()}
     />
   </div>
  );
 }
}