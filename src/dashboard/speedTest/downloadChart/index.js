import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend } from 'recharts';

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: 290,
    },
}));

export default function DownloadChart(props) {
    const { downData } = props;
    const classes = useStyles();
    return (
        <Paper className={classes.paperHeight}>
            <Typography color='primary' variant='subtitle1' className={classes.title} >
                下行速度
            </Typography>
            <ResponsiveContainer width='90%' height='83%'>
                <LineChart data={downData} margin={{ top: 10, right: 10, bottom: 5, left: 12 }}>
                    <Line unit='bps' name='下行速率' type='monotone' dataKey='value' stroke='#8884d8' dot={false} />
                    <XAxis dataKey='timestamp'>
                        <Label value='时间' position='insideBottomRight' offset={-7} />
                    </XAxis>
                    <YAxis label={{ value: '速率', position: 'insideLeft', offset: -2 }} />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
}

DownloadChart.propTypes = {
    downData: PropTypes.array.isRequired
}