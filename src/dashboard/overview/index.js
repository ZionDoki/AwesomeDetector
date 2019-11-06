import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import OnlineDevice from './onlineDevice';
import UserNum from './userNum';
import UploadSpeed from './uploadSpeed';
import DownloadSpeed from './downloadSpeed';
import DeviceChart from './deviceChart';
import DeviceTable from './deviceTable';
import OSChart from './osChart';

import { GetOverviewData, GetOSNum, GetFiveClients, GetDeviceNum } from '../../api/overview';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
    },
}));


export default function Overview(props) {
    const classes = useStyles();
    const { history } = props;
    const [overview, setOverview] = React.useState({Object});
    const [osInfo, setOsInfo] = React.useState(Array); 
    const [fasterClients, setFasterClients] = React.useState(Array);
    const [deviceNum, setDeviceNum] = React.useState(Array);

    {/* 获取总览信息 */}
    React.useEffect(() => {
        GetOverviewData().then(res => {
            if(res.body.status) {
                console.log(res.body.data.overview);
                let data = res.body.data.overview;
                setOverview(data);
            }
            else {
                history.push('/login');
            }
        }).catch( err => console.log(err) );
    }, []);  //第二个参数设为空，防止Hook在组件更新后也被调用


    {/* 获取操作系统信息 */}
    React.useEffect(() => {
        GetOSNum().then(res => {
            if(res.body.status) {
                console.log(res.body.data)
                setOsInfo(res.body.data.operation_system);
            }
            else {
                history.push('/login');
            }
        }).catch( err => console.log(err) );
    }, []);


    {/* 获取平均上下载速率最快的前五个设备信息 */}
    React.useEffect(() => {
        GetFiveClients().then(res => {
            if(res.body.status) {
                console.log(res.body.data.faster_clients);
                setFasterClients(res.body.data.faster_clients);
            }
            else {
                history.push('/login')
            }
        }).catch( err => console.log(err) );
    }, []);

    {/* 获取若干时间点的在线设备数量 */}
    React.useEffect(() => {
        let endTime = Date.parse(new Date());
        let startTime = endTime-180000*7;
        let data = { start_time: startTime, end_time: endTime };
        GetDeviceNum(data).then(res => {
            if(res.body.status) {
                setDeviceNum(res.body.data.online_clients);
            } else {
                history.push('/login')
            }
        }).catch(err => console.log(err));
    }, []);

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
                    <DeviceChart value={deviceNum} />  
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <OSChart value={osInfo} />                 
                </Grid>
                <Grid item lg={12} md={12} sm={12}>
                    <DeviceTable value={fasterClients} />
                </Grid>
            </Grid>
        </Container>
    );
}