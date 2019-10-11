import React from 'react';
import { Card, CardContent, makeStyles, Divider, CardHeader } from '@material-ui/core';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const useStyles = makeStyles(theme => ({
    chartContainer: {
        height: 250,
    },
}));

export default function DeviceChart() {
    const classes = useStyles();
    const data = [
        {time: '12:00', num: '19'},
        {time: '12:01', num: '19'},
        {time: '12:02', num: '19'},
        {time: '12:03', num: '20'},
        {time: '12:04', num: '20'},
        {time: '12:05', num: '21'},
    ];

    return (
        <Card>
            <CardHeader 
                title='在线设备数量' 
                titleTypographyProps={{
                    style: {
                        fontSize: 15,
                        fontWeight: 600,
                    },
                }}
            />
            <Divider />
            <CardContent>
              <div className={classes.chartContainer}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <Tooltip />                       
                        <XAxis dataKey='time' label={{value:'时间', position:'bottom', offset:'-7'}} />
                        <YAxis />
                        <Bar name='数量' unit='台' dataKey='num' fill='#8884d8' barSize={15} barGap={10} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
        </Card>
    );
}