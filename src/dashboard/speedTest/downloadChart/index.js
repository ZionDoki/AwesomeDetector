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
        height: cardHeight
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
                <MyLine data={downData[0]} style={{ height: cardHeight - 12 }} />
        </Paper>
    );
}

DownloadChart.propTypes = {
    downData: PropTypes.array.isRequired
}