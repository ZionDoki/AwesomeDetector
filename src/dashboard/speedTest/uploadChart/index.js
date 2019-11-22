import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend } from 'recharts';

import MyLine from '../../../component/myline';

const cardHeight = 290;

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: cardHeight,
    },
}));

export default function UploadChart(props) {
    const { upData } = props;
    const classes = useStyles();
    var temp = upData.map((item, index) => {
        return {
            timestamp: item.timestamp,
            value: (item.value/1024/1024).toFixed(3)
        };
    });
    return (
        <Paper className={classes.paperHeight}>
            <Typography color='primary' variant='subtitle1' className={classes.title} >
                上行速度
            </Typography>
            <MyLine data={upData[0]} style={{ height: cardHeight - 12 }} />
            {/* <ResponsiveContainer width='90%' height='83%'>
                <LineChart data={temp} margin={{ top: 10, right: 10, bottom: 5, left: 5 }}>
                    <Line unit='Mbps' name='上行速率' type='monotone' dataKey='value' stroke='#00bcd4' dot={false} />
                    <XAxis dataKey='timestamp'>
                        <Label value='时间' position='insideBottomRight' offset={-7} />
                    </XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer> */}
        </Paper>
    );
}

UploadChart.propTypes = {
    upData: PropTypes.array.isRequired
};