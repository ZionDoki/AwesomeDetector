import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import OnlineDevice from './onlineDevice';
import UserNum from './userNum';
import UploadSpeed from './uploadSpeed';
import DownloadSpeed from './downloadSpeed';
import DeviceChart from './deviceChart';
import DeviceTable from './deviceTable';
import OSChart from './osChart';

import { GetOverviewData } from '../../api/overview';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
    },
}));


export default function Overview(props) {
    const classes = useStyles();
    const { history } = props;
    const [overview, setOverview] = React.useState({
        online_clients: '__',
        users: '__',
        overview_download_speed: '__',
        overview_upload_speed: '__',
    });
    const name = ['online_clients', 'users', 'overview_download_speed', 'overview_upload_speed'];

    {/* 获取总览信息 */}
    React.useEffect(() => {
        GetOverviewData().then(res => {
            if(res.body.status) {
                console.log(res.body);
                let data = res.body.data.overview;
                name.map( (item, index) => setOverview({ ...overview, [item]: data[index].value }) );
            }
            else {
                history.push('/login');
            }
        }).catch( err => console.log(err) );
    });

    {/* 获取操作系统信息 */}

    return (
        <Container maxWidth='lg' className={classes.root}>
            <Grid container spacing={3}>
                <Grid item lg={3} sm={6} xs={12}>
                    <OnlineDevice value={overview.online_clients} />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <UserNum value={overview.users} />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <UploadSpeed value={overview.overview_upload_speed} />
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                    <DownloadSpeed value={overview.overview_download_speed} />
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