import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend } from 'recharts';

import MyLine from '../../../component/myline';

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: 290,
    },
}));

const modify = (data) => {
    data.some((item, index) => {
        data[index].value = item.value / 1024 /1024;
    });
}

export default function DownloadChart(props) {
    const { downData } = props;
    const classes = useStyles();
    var temp = downData.map((item, index) => {
        return {
            timestamp: item.timestamp,
            value: (item.value/1024/1024).toFixed(4)
        };
    });
    return (
        <Paper className={classes.paperHeight}>
            <Typography color='primary' variant='subtitle1' className={classes.title} >
                下行速度
            </Typography>
            <ResponsiveContainer width='90%' height='83%'>
                <MyLine data={temp} />
                {/* <LineChart data={temp} margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
                    <Line unit='Mbps' name='下行速率' type='monotone' dataKey='value' stroke='#8884d8' dot={false} />
                    <XAxis dataKey='timestamp'>
                        <Label value='时间' position='insideBottomRight' offset={-7} />
                    </XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart> */}
            </ResponsiveContainer>
        </Paper>
    );
}

DownloadChart.propTypes = {
    downData: PropTypes.array.isRequired
}