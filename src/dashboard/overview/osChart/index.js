import React from 'react';
import { makeStyles, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const useStyles = makeStyles(theme => ({
    chartContainer: {
        height: 250
    },
}));

export default function OSChart() {
    const classes = useStyles();
    const colors = ['#00bcd4', '#81c784', '#ffa726'];
    const RADIAN = Math.PI / 180; 
    const data = [
        {name:'Windows', value:13},
        {name:'Linux', value:5},
        {name:'Mac', value:2},
    ];
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);
        
        return (
         <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
           {`${(percent * 100).toFixed(0)}%`}
         </text>
        );
   };

    return (
        <Card>
            <CardHeader
                title='在线设备的操作系统比例' 
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
                        <PieChart>
                            <Pie data={data} outerRadius={85} fill="#82ca9d" label={renderCustomizedLabel} labelLine={false}>
                                {data.map((item, index) => (
                                    <Cell fill={colors[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconType='star' />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}