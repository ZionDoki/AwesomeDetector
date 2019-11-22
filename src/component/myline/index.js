/*!
 *  MyLine Componets
 *  @Params
 *    - data <Required> <Array-type>
 *    - orderLineColor <Optional> <Array-type>
 *    - customName <Optional> <Function>
 */

import React, { Component } from 'react'
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

const preLineColor = [
  'rgb(81, 171, 255)',  // blue
  'rgb(235, 32, 72)',   // red
  'rgb(112, 243, 151)', // green
  'rgb(255, 118, 87)',  // orange
  'rgb(250, 0, 98)',  // yellow
];

export default class MyLine extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timestamp: [],
      dataLegend: [],
      dataList: []
    }
  }

  componentWillReceiveProps(pre) {
    if(pre.data) {
      if(!this.props.compare) {
        let dataLegend = Object.keys(pre.data).map((key) => {
          if( key !== 'timestamp')
            return this.props.varToReadable ? this.props.varToReadable(key) : this.varToReadable(key)
          return null
        });

        dataLegend.indexOf(null);
        dataLegend.splice(dataLegend.indexOf(null), 1)

        this.setState({dataLegend: dataLegend});
      } else {
        let dataLegend = [];
        let result = [];
        console.log(pre.data)
        Object.keys(pre.data).map((item) => {
          Object.keys(pre.data[item]).map(key => {
            if( key !== 'timestamp') {
              let temp = item + this.varToReadable(key);
              console.log(temp)
              dataLegend.push(temp);
              console.log(dataLegend)
            }
          })
          return null
        });

        if(pre.data) {
          Object.keys(pre.data).map((item1, index1) => {
          Object.keys(pre.data[item1]).map((item, index) => {
            if(item !== 'timestamp') {
              result.push({
                name: this.props.varToReadable ? (item1 + this.props.varToReadable(item)) : (item1 + this.varToReadable(item)),   // [*] add translate function
                type:'line', 
                smooth: true,
                xAxisIndex: index1,
                sampling: 'average',
                // itemStyle: {
                //     color: this.props.color ? this.props.color : preLineColor[index-1]    // [*] add select color funciton
                // },
                center: ['150%', '100%'],
                areaStyle: {color: 'rgba(0,0,0,0)'} ,
                emphasis: {
                  itemStyle: {
                    shadowColor: 'rgba(52, 90, 90, 0.95)',
                    shadowBlur: 10,
                  }
                },
                data: pre.data[item1][item]
              });
            }
              return ;
            })
            return null;
          })
        }

        // dataLegend.indexOf(null);
        // dataLegend.splice(dataLegend.indexOf(null), 1)

        console.log(dataLegend)

        this.setState({
          dataLegend: dataLegend,
          finalData: result
        });
      }
    }
  }

  varToReadable = (name) => {
    switch(name) {
      case `timestamp`: return '时间戳'
      case `station_name`: return '1米空气温度'
      case `air_temperature_1`: return '1米空气温度'
      case `air_temperature_2`: return '2米空气温度'
      case `air_temperature_4`: return '4米空气温度'
      case `air_temperature_8`: return '8米空气温度'
      case `air_temperature_10`: return '10米空气温度'
      case `air_temperature_12`: return '12米空气温度'
      case `air_temperature_16`: return '16米空气温度'
      case `air_temperature_32`: return '32米空气温度'
      case `air_temperature_48`: return '48米空气温度'
      case `air_humidity_1`: return '1米空气湿度'
      case `air_humidity_2`: return '2米空气湿度'
      case `air_humidity_4`: return '4米空气湿度'
      case `air_humidity_8`: return '8米空气湿度'
      case `air_humidity_10`: return '10米空气湿度'
      case `air_humidity_12`: return '12米空气湿度'
      case `air_humidity_16`: return '16米空气湿度'
      case `air_humidity_32`: return '32米空气湿度'
      case `air_humidity_48`: return '48米空气湿度'
      case `air_wind_speed_1`: return '1米风速'
      case `air_wind_speed_2`: return '2米风速'
      case `air_wind_speed_4`: return '4米风速'
      case `air_wind_speed_8`: return '8米风速'
      case `air_wind_speed_10`: return '10米风速'
      case `air_wind_speed_12`: return '12米风速'
      case `air_wind_speed_16`: return '16米风速'
      case `air_wind_speed_32`: return '32米风速'
      case `air_wind_speed_48`: return '48米风速'
      case `air_wind_direction_1`: return '1米风向'
      case `air_wind_direction_2`: return '2米风向'
      case `air_wind_direction_4`: return '4米风向'
      case `air_wind_direction_8`: return '8米风向'
      case `air_wind_direction_10`: return '10米风向'
      case `air_wind_direction_12`: return '12米风向'
      case `air_wind_direction_16`: return '16米风向'
      case `air_wind_direction_32`: return '32米风向'
      case `air_wind_direction_48`: return '48米风向'
      case `air_rainfall`: return '降雨量'
      case `air_pressure`: return '大气压'
      case `soil_water_potential_5`: return '5米土壤水势'
      case `soil_water_potential_10`: return '10米土壤水势'
      case `soil_water_potential_20`: return '20米土壤水势'
      case `soil_water_potential_40`: return '40米土壤水势'
      case `soil_water_potential_60`: return '60米土壤水势'
      case `soil_water_potential_80`: return '80米土壤水势'
      case `soil_water_potential_160`: return '160米土壤水势'
      case `soil_water_content_5`: return '5米土壤含水量'
      case `soil_water_content_10`: return '10米土壤含水量'
      case `soil_water_content_20`: return '20米土壤含水量'
      case `soil_water_content_40`: return '40米土壤含水量'
      case `soil_water_content_60`: return '60米土壤含水量'
      case `soil_water_content_80`: return '80米土壤含水量'
      case `soil_water_content_160`: return '160米土壤含水量'
      case `soil_temperature_5`: return '5米土壤温度'
      case `soil_temperature_10`: return '10米土壤温度'
      case `soil_temperature_20`: return '20米土壤温度'
      case `soil_temperature_40`: return '40米土壤温度'
      case `soil_temperature_60`: return '60米土壤温度'
      case `soil_temperature_80`: return '80米土壤温度'
      case `soil_temperature_160`: return '160米土壤温度'
      case `soil_elec_rate_5`: return '5米土壤电导率'
      case `soil_elec_rate_10`: return '10米土壤电导率'
      case `soil_elec_rate_20`: return '20米土壤电导率'
      case `soil_elec_rate_40`: return '40米土壤电导率'
      case `soil_elec_rate_60`: return '60米土壤电导率'
      case `soil_elec_rate_80`: return '80米土壤电导率'
      case `soil_elec_rate_160`: return '160米土壤电导率'
      case `soil_heat_flux_5`: return '5cm土壤热通量'
      case `soil_heat_flux_10`: return '10cm土壤热通量'
      case `photo_active_radiation`: return '光合有效辐射'
      case `photo_downward_short_radiation`: return '向下短波辐射'
      case `photo_upward_short_radiation`: return '向上短波辐射'
      case `photo_downward_long_radiation`: return '向下长波辐射'
      case `photo_upward_long_radiation`: return '向上长波辐射'
      case `photo_infrared_temperature`: return '红外地表温度'
      case `photo_sunshine_hours`: return '日照时数'
      case `NDVI`: return 'NDVI植被指数'
      default: return name
    }
  }

  getOptions = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        textStyle: {
          color: '#000',
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
      },
      grid: {
        right: '48px',
        left: '48px',
        top: '24px',
      },
      legend: {
        type: 'scroll',
        data: this.state.dataLegend,
        // selected: this.props.data.selected
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            // color:'rgba(0, 0, 0, 0.45)'
          }
        },
        boundaryGap: false,
        data: this.props.data ? (this.props.data.timestamp ? this.props.data.timestamp.map((item) => {
          return new Date(item).toLocaleString()
        }) : []) : []
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
          // color:'rgba(0, 0, 0, 0.45)'
        }},
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 50
      }, {
        start: 0,
        end: 50,
        bottom: 0,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '90%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: this.props.data ? Object.keys(this.props.data).map((item, index) => {
        if(item !== 'timestamp') {
          return {
            name: this.props.varToReadable ? this.props.varToReadable(item) : this.varToReadable(item),    // [*] add translate function
            type:'line', 
            smooth: true,
            sampling: 'average',
            itemStyle: {
                color: this.props.color ? this.props.color : preLineColor[index-1]    // [*] add select color funciton
            },
            center: ['150%', '100%'],
            areaStyle: Object.keys(this.props.data).length <= 2 ? {} :{color: 'rgba(0,0,0,0)'} ,
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(52, 90, 90, 0.95)',
                shadowBlur: 10,
              }
            },
            data: this.props.data[item]
          };
        }
        return null;
      }) : []
    };
    return option;
  }

 

  render() {

    return (
      <div>
        <ReactEcharts
          notMerge={true}
          style={this.props.style ? this.props.style : {}}
          lazyUpdate={true}
          option={this.props.compare ? (this.props.data ? this.getCompareOptions() : {}) : (this.props.data ? this.getOptions() : {})}
          // onEvents={ this.props.onEvents ? this.props.onEvents : {} }
        />
      </div>
    )
  }
}
