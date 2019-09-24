import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import OnlineDevice from './onlineDevice';
import UserNum from './userNum';
import UploadSpeed from './uploadSpeed';
import DownloadSpeed from './downloadSpeed';
import DeviceChart from './deviceChart';
import DeviceTable from './deviceTable';
import OSChart from './osChart';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
    },
}));

export default function Overview(props) {
    const classes = useStyles();
    
    return (
        <Container maxWidth='lg' className={classes.root}>
            <Grid container spacing={3}>
                <Grid item lg={3} sm={6} xs={12}>
                    <OnlineDevice />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <UserNum />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <UploadSpeed />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <DownloadSpeed />
                </Grid>
                <Grid item lg={8} md={12} sm={12}>
                    <DeviceChart />
                  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <OSChart />                 
                </Grid>
                <Grid item lg={12} md={12} sm={12}>
                    <DeviceTable />
                </Grid>
            </Grid>
        </Container>
    );
}