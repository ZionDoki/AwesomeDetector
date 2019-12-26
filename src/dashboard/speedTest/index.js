import React, { useReducer } from 'react';
import { Radio, RadioGroup, FormControlLabel, CircularProgress } from '@material-ui/core';
import { withStyles, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { makeStyles, Container, Button, Grid } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

import { GetList, GetClientInfo, GetUploadSpeed, GetDownloadSpeed } from '../../api/speedTest';
import { CreateMission, IsFinished } from '../../api/mission';
import UploadChart from './uploadChart';
import DownloadChart from './downloadChart';
import PingTable from './pingTable';
import ClientList from './clientList';
import ErrorDialog from './errorDialog';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    button: {
        marginRight: theme.spacing(2),
        color: theme.palette.common.white,
    },
    dataDisplay: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        justifyContent: 'center',
    },
    chartProgressUp: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 1,
        top: '35%',
        [theme.breakpoints.up('lg')]: {
            marginLeft: theme.spacing(18),
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: theme.spacing(45),
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(25),
        },
    },
    chartProgressDown: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 1,
        [theme.breakpoints.up('lg')]: {
            top: '35%',
            marginLeft: theme.spacing(18),
        },
        [theme.breakpoints.down('md')]: {
            top: '45%',
            marginLeft: theme.spacing(45),
        },
        [theme.breakpoints.down('sm')]: {
            top: '45%',
            marginLeft: theme.spacing(25),
        },
    },
}));

const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

const loadingReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_UPLOAD':
            return { ...state, uploadChartLoading: true };
        case 'OPEN_DOWNLOAD':
            return { ...state, downloadChartLoading: true };
        case 'OPEN_PING':
            return { ...state, pingTableLoading: true };
        case 'OPEN_ROUTER':
            return { ...state, routerTableLoading: true };
        case 'CLOSE_UPLOAD':
            return { ...state, uploadChartLoading: false };
        case 'CLOSE_DOWNLOAD':
            return { ...state, downloadChartLoading: false };
        case 'CLOSE_PING':
            return { ...state, pingTableLoading: false };
        case 'CLOSE_ROUTER':
            return { ...state, routerTableLoading: false };
    }
}

//4个全局变量用以保存上次的数据
let preUpData = [];
let preDownData = [];
let prePing, preRouter;
let preClientId, preClientIdUp, preClientIdDown;

export default function SpeedTest(props) {
    const classes = useStyles();
    const [onlineMachineList, setOnlineMachineList] = React.useState(Array);
    const [open, setOpen] = React.useState(false);
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [id, setId] = React.useState('');
    const [idTo, setIdTo] = React.useState('');
    const [clientList, setClientList] = React.useState(Array);
    const [upData, setUpData] = React.useState(Array);
    const [downData, setDownData] = React.useState(Array);
    const [values, setValues] = React.useState([
        { name: 'ping', value: '' },
        { name: 'routers', value: '' },
    ]);
    const [chartLoading, dispatch] = useReducer(loadingReducer, {
        uploadChartLoading: false,
        downloadChartLoading: false,
        pingTableLoading: false,
        routerTableLoading: false
    });

    {/* 获取客户端列表 */ }
    React.useEffect(() => {
        var values_temp = [].concat(values);
        values_temp[0].value = prePing;
        values_temp[1].value = preRouter;
        setUpData(preUpData);
        setDownData(preDownData);
        setValues(values_temp);

        GetList().then(res => {
            if (res.body.status) {
                var temp = res.body.data.clients.map((item, index) => {
                    item.p2pUploadLoading = false;
                    item.p2pDownloadLoading = false;
                    item.pingLoading = false;
                    item.routerLoading = false;
                    item.uploadLoading = false;
                    item.downloadLoading = false;
                    return item;
                });
                setOnlineMachineList(temp);
            } else {
                console.log(res.body.status);
                handleOpenErrorDialog('初始化：获取在线客户端列表失败');
            }
        }).catch(err => console.log(err));
    }, []);

    {/* 查询ping任务状态，任务完成时请求延迟的信息 */ }
    const checkPing = (mission_id, client_id, index, mission_type1) => {
        var data1 = { mission_id: mission_id };
        var data2 = { client_id: client_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'testing state of ping mission...')
            if (res.body.status) {
                //任务完成后，终止轮询，并请求数据
                if (res.body.data.isDone) {
                    console.log(client_id, 'ping is done')
                    clearTimeout(document.pingMissionTimeout[client_id][mission_type1]);
                    GetClientInfo(data2).then(res => {
                        console.log(client_id, 'require the data')
                        if (res.body.status) {
                            var list = [].concat(onlineMachineList);
                            var values_temp = [].concat(values);
                            console.log(client_id, mission_type1, res.body.data.client_info[0].value);
                            preClientId = client_id;
                            list[index].pingLoading = false;
                            values_temp[0].value = res.body.data.client_info[0].value;
                            prePing = values_temp[0].value;
                            setValues(values_temp);
                            setOnlineMachineList(list);
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('客户端'+ client_id + '：Ping延迟的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_PING' });
                        clearInterval(document.checkPingTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端'+ client_id + '：无法检测到Ping延迟的测试任务是否完成');
                dispatch({ type: 'CLOSE_PING' });
                clearInterval(document.checkPingTimerInterval[client_id][mission_type1]);
            }
        }).catch(err => console.log(err));
    }

    {/* 查询router任务状态，任务完成时请求路由跳的信息 */ }
    const checkRouter = (mission_id, client_id, index, mission_type2) => {
        var data1 = { mission_id: mission_id };
        var data2 = { client_id: client_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'testing state of router mission...')
            if (res.body.status) {
                //任务完成后，请求数据，终止超时检测，终止轮询
                if (res.body.data.isDone) {
                    console.log(client_id, 'Router mission is done')
                    clearTimeout(document.routerMissionTimeout[client_id][mission_type2]);
                    GetClientInfo(data2).then(res => {
                        console.log(client_id, 'require the data')
                        if (res.body.status) {
                            var list = [].concat(onlineMachineList);
                            var values_temp = [].concat(values);
                            console.log(client_id, mission_type2, res.body.data.client_info[1].value);
                            preClientId = client_id;
                            list[index].routerLoading = false;
                            values_temp[1].value = res.body.data.client_info[1].value;
                            preRouter = values_temp[1].value;
                            setValues(values_temp);
                            setOnlineMachineList(list);
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('客户端'+ client_id + '：路由跳数的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_ROUTER' });
                        clearInterval(document.checkRouterTimerInterval[client_id][mission_type2]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端'+ client_id + '：无法检测到路由跳数的测试任务是否完成');
                dispatch({ type: 'CLOSE_ROUTER' });
                clearInterval(document.checkRouterTimerInterval[client_id][mission_type2]);
            }
        }).catch(err => console.log(err));
    }


    {/* 创建测试Ping延迟和路由跳数的任务 */ }
    const handlePing = (id, ip, mac, index) => {
        var pingData = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: 'PING'
        };
        var routerData = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: 'ROUTER'
        };
        var list = [].concat(onlineMachineList);
        var mission_type1 = 'ping';
        var mission_type2 = 'router';
        list[index].pingLoading = true;
        list[index].routerLoading = true;
        setOnlineMachineList(list);

        //初始化Ping任务的轮询对象
        if(!document.checkPingTimerInterval) {
            document.checkPingTimerInterval = {}
        }
        if(!document.checkPingTimerInterval[id]) {
            document.checkPingTimerInterval[id] = {}
        }
        //初始化Router任务的轮询对象
        if(!document.checkRouterTimerInterval) {
            document.checkRouterTimerInterval = {}
        }
        if(!document.checkRouterTimerInterval[id]) {
            document.checkRouterTimerInterval[id] = {}
        }
        //初始化Ping任务的超时监听对象
        if(!document.pingMissionTimeout){
            document.pingMissionTimeout = {}
        }
        if(!document.pingMissionTimeout[id]){
            document.pingMissionTimeout[id] = {}
        }
        //初始化Router任务的超时监听对象
        if(!document.routerMissionTimeout){
            document.routerMissionTimeout = {}
        }
        if(!document.routerMissionTimeout[id]){
            document.routerMissionTimeout[id] = {}
        }

        //创建ping任务
        CreateMission(pingData).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                // console.log(mission_id);
                dispatch({ type: 'OPEN_PING' });
                //轮询检查任务是否完成
                document.checkPingTimerInterval[id][mission_type1] = setInterval(checkPing, 2000, mission_id, id, index, mission_type1);
                //超时
                document.pingMissionTimeout[id][mission_type1] = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    list[index].pingLoading = false;
                    clearInterval(document.checkPingTimerInterval[id][mission_type1]);
                    handleOpenErrorDialog('客户端'+ id + '：Ping延迟测试超时');
                    dispatch({ type: 'CLOSE_PING' });
                    setOnlineMachineList(list);
                }, 70000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端'+ id + '：Ping延迟的测试任务创建失败！')
            }
        }).catch(err => console.log(err));

        //创建Router任务
        CreateMission(routerData).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_ROUTER' });
                //轮询检查任务是否完成
                document.checkRouterTimerInterval[id][mission_type2] = setInterval(checkRouter, 2000, mission_id, id, index, mission_type2);
                //超时
                document.routerMissionTimeout[id][mission_type2] = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    list[index].routerLoading = false;
                    clearInterval(document.checkRouterTimerInterval[id][mission_type2]);
                    handleOpenErrorDialog('客户端'+ id + '：路由跳数测试超时');
                    dispatch({ type: 'CLOSE_ROUTER' });
                    setOnlineMachineList(list);
                }, 75000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端'+ id + '：路由跳数的测试任务创建失败！')
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测上行速率的任务是否完成，完成后获取上行速率 */ }
    const checkUpload = (mission_id, client_id, index, mission_type1) => {
        const data = { mission_id: mission_id };
        IsFinished(data).then(res => {
            console.log(client_id, mission_type1, 'Testing state...')
            if (res.body.status) {
                //任务完成后，结束轮询，获取近一个月的上行速率
                if (res.body.data.isDone) {
                    console.log(client_id, mission_type1, 'Detection of upload speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    }
                    clearTimeout(document.uploadMissionTimeout[client_id][mission_type1]);
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(client_id, mission_type1, 'Require the data of upload speed.')
                            var temp = [].concat(res.body.data.upload_speed);
                            var list = [].concat(onlineMachineList);
                            preClientIdUp = client_id;
                            //关闭环形进度
                            if (!list[index].p2pUploadLoading) {
                                list[index].uploadLoading = false;
                            } else {
                                list[index].p2pUploadLoading = false;
                            }
                            setOnlineMachineList(list);
                            setUpData(temp);
                            preUpData = temp;
                            dispatch({ type: 'CLOSE_UPLOAD' });
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端'+ client_id + '：测试上行速率的任务已完成，但无法获取上行速率的数据');
                        }
                        clearInterval(document.checkUploadTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端'+ client_id + '：无法检测到上行速率的测试任务是否完成');
                clearInterval(document.checkUploadTimerInterval[client_id][mission_type1]);
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测下行速率的任务是否完成，完成时请求下行速率 */ }
    const checkDownload = (mission_id, client_id, index, mission_type2) => {
        var data1 = { mission_id: mission_id };
        IsFinished(data1).then(res => {
            console.log(client_id, mission_type2, 'Testing state...');
            if (res.body.status) {
                //任务完成后，终止轮询，请求下行速率
                if (res.body.data.isDone) {
                    console.log(client_id, mission_type2, 'Detection of download speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    };
                    var list = [].concat(onlineMachineList);
                    //关闭环形进度
                    if (!list[index].p2pDownloadLoading) {
                        list[index].downloadLoading = false;
                    } else {
                        list[index].p2pDownloadLoading = false;
                    }
                    clearTimeout(document.downloadMissionTimeout[client_id][mission_type2]);
                    GetDownloadSpeed(data2).then(res => {
                        console.log(client_id, mission_type2, 'Require the data of download speed.')
                        if (res.body.status) {
                            var temp = [].concat(res.body.data.download_speed);
                            preClientIdDown = client_id;
                            setDownData(temp);
                            preDownData = temp;
                            setOnlineMachineList(list);
                            dispatch({ type: 'CLOSE_DOWNLOAD' });
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('客户端'+ client_id + '：测试下行速率的任务已完成，但无法获取下行速率的数据');
                        }
                        clearInterval(document.checkDownloadTimerInterval[client_id][mission_type2]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端'+ client_id + '：无法检测到下行速率的测试任务是否完成');
                clearInterval(document.checkDownloadTimerInterval[client_id][mission_type2]);
            }
        }).catch(err => console.log(err));
    }


    {/* 创建测上/下行速率的任务 */ }
    function handleTestSpeed(id, ip, mac, index, target_id) {
        var upload = {};
        var download = {};
        var num = arguments.length; //用于非箭头函数
        var list = [].concat(onlineMachineList);
        var mission_type1;
        var mission_type2;

        if (num === 4) {
            //创建测上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD'
            };
            //创建下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD'
            };
            list[index].uploadLoading = true;
            list[index].downloadLoading = true;
            mission_type1 = 'upload_mission';
            mission_type2 = 'download_mission';
            setOnlineMachineList(list);
        }
        else if (num === 5) {
            //创建测上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD',
                target_client: target_id
            };
            //创建下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD',
                target_client: target_id
            };
            list[index].p2pUploadLoading = true;
            list[index].p2pDownloadLoading = true;
            mission_type1 = 'p2p_upload_mission';
            mission_type2 = 'p2p_download_mission';
            setOnlineMachineList(list);
        }

        //初始化上载速率任务的轮询对象
        if(!document.checkUploadTimerInterval) {
            document.checkUploadTimerInterval = {}
        }
        if(!document.checkUploadTimerInterval[id]) {
            document.checkUploadTimerInterval[id] = {}
        }
        //初始化下载速率任务的轮询对象
        if(!document.checkDownloadTimerInterval) {
            document.checkDownloadTimerInterval = {}
        }
        if(!document.checkDownloadTimerInterval[id]) {
            document.checkDownloadTimerInterval[id] = {}
        }

        //初始化上载速率任务的超时监听对象
        if(!document.uploadMissionTimeout) {
            document.uploadMissionTimeout = {}
        }
        if(!document.uploadMissionTimeout[id]) {
            document.uploadMissionTimeout[id] = {}
        }
        //初始化下载速率任务的超时监听对象
        if(!document.downloadMissionTimeout) {
            document.downloadMissionTimeout = {}
        }
        if(!document.downloadMissionTimeout[id]) {
            document.downloadMissionTimeout[id] = {}
        }

        //创建测上载速率的任务
        CreateMission(upload).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_UPLOAD' });
                //轮询，直到任务完成
                document.checkUploadTimerInterval[id][mission_type1] = setInterval(checkUpload, 2500, mission_id, id, index, mission_type1);
                //超时
                document.uploadMissionTimeout[id][mission_type1] = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: id,
                        start_time: start_time,
                        end_time: end_time
                    };
                    if (num === 4) {
                        list[index].uploadLoading = false; //与P2P不同
                        handleOpenErrorDialog('客户端'+ id + ':上行速率测试超时，将显示历史数据');//与P2P不同
                    } else {
                        list[index].p2pUploadLoading = false;
                        handleOpenErrorDialog('客户端'+ id + '：P2P模式的上行速率测试超时，将显示历史数据');
                    }
                    console.log(id, '超时', num, list[index]);
                    clearInterval(document.checkUploadTimerInterval[id][mission_type1]);
                    dispatch({ type: 'CLOSE_UPLOAD' });
                    setOnlineMachineList(list);
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(id, '超时，请求历史数据')
                            var temp = [].concat(res.body.data.upload_speed);
                            var list = [].concat(onlineMachineList);
                            preClientIdUp = id;
                            setOnlineMachineList(list);
                            setUpData(temp);
                            preUpData = temp;
                            dispatch({ type: 'CLOSE_UPLOAD' });
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端'+ id + '：获取上行速率的历史数据失败');
                        }
                    }).catch(err => console.log(err));
                }, 40000);

            } else {
                console.log(res.body) //输出错误信息
                handleOpenErrorDialog('客户端'+ id + '：上行速率测试任务创建失败');
            }
        }).catch(err => console.log(err))

        //创建测下行速率的任务
        CreateMission(download).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_DOWNLOAD' });
                //轮询，直到任务完成
                document.checkDownloadTimerInterval[id][mission_type2] = setInterval(checkDownload, 2500, mission_id, id, index, mission_type2);
                //超时
                document.downloadMissionTimeout[id][mission_type2] = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: id,
                        start_time: start_time,
                        end_time: end_time
                    };
                    if (num === 4) {
                        //普通模式
                        list[index].downloadLoading = false; //与P2P不同
                        handleOpenErrorDialog('客户端'+ id + '：下行速率测试超时，将显示历史数据'); //与P2P不同
                    } else {
                        //P2P模式
                        list[index].p2pDownloadLoading = false;
                        handleOpenErrorDialog('客户端'+ id + '：P2P模式的下行速率测试超时，将显示历史数据');
                    }
                    clearInterval(document.checkDownloadTimerInterval[id][mission_type2]);
                    dispatch({ type: 'CLOSE_DOWNLOAD' });
                    setOnlineMachineList(list);
                    GetDownloadSpeed(data2).then(res => {
                        console.log(id, '超时，请求历史数据')
                        if (res.body.status) {
                            var temp = [].concat(res.body.data.download_speed);
                            preClientIdDown = id;
                            setDownData(temp);
                            preDownData = temp;
                            setOnlineMachineList(list);
                            dispatch({ type: 'CLOSE_DOWNLOAD' });
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('客户端'+ id + '：获取下行速率的历史数据失败');
                        }
                    }).catch(err => console.log(err));
                }, 50000);
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端'+ id + '：下行速率测试任务创建失败');
            }
        }).catch(err => console.log(err));
    }


    {/* 关闭对话框 */ }
    const handleCloseDialog = () => setOpen(false);

    {/* 选择p2p测速的目标客户端 */ }
    const handleChange = event => {
        setIdTo(event.target.value); //event.target.value是字符串类型,所以之后的idTo都会是string
    }

    {/* 点击'P2P测速'按钮 */ }
    const handleClickP2P = (client_id, index) => {
        var list = [].concat(onlineMachineList); //深拷贝
        delete list[index];
        setClientList(list);
        setId(client_id);
        setOpen(true);
    }

    {/* 点击“确定”按钮，创建P2P网络测速任务 */ }
    const handleP2PTest = () => {
        var ip = '';
        var mac = '';
        var temp_index = -1;
        handleCloseDialog();
        onlineMachineList.some((item, index) => {
            if (item.client_id === id) {
                ip = item.ip;
                mac = item.mac;
                temp_index = index;
                return true;
            }
        });
        //创建测上/下行速率的任务，并获取上/下行速率
        handleTestSpeed(id, ip, mac, temp_index, idTo);
    }


    {/* 关闭错误警告 */ }
    const handleCloseErrorDialog = () => setOpenErrorDialog(false);
    {/* 打开错误警告 */ }
    const handleOpenErrorDialog = msg => {
        setMessage(msg);
        setOpenErrorDialog(true);
    }

    return (
        <Container maxWidth='lg' className={classes.container} >
            <Grid container spacing={2} className={classes.dataDisplay}>
                <Grid item xs={12} lg={4} style={{position:'relative'}}>
                    <UploadChart upData={upData} clientId={preClientIdUp} />
                    {chartLoading.uploadChartLoading && <CircularProgress size={100} className={classes.chartProgressUp} />}
                </Grid>
                <Grid item xs={12} lg={4} style={{position:'relative'}}>
                    <DownloadChart downData={downData} clientId={preClientIdDown} />
                    {chartLoading.downloadChartLoading && <CircularProgress size={100} className={classes.chartProgressDown} />}
                </Grid>
                <Grid item xs={12} lg={3}>
                    <PingTable values={values} pingLoading={chartLoading.pingTableLoading} routerLoading={chartLoading.routerTableLoading} clientId={preClientId} />
                </Grid>
            </Grid>
            <Grid container className={classes.dataDisplay}>
                <Grid item lg={11} xs={12}>
                    <ClientList
                        list={onlineMachineList}
                        onClickP2P={handleClickP2P}
                        onClickPing={handlePing}
                        onClickTestSpeed={handleTestSpeed}
                    />
                </Grid>
            </Grid>
            <ErrorDialog open={openErrorDialog} handleClose={handleCloseErrorDialog} msg={message} />
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth='sm'
                scroll='paper'
            >
                <DialogTitle>客户端{id}可向以下某一客户端发起P2P网络测速：</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        onChange={handleChange}
                        value={idTo}
                        aria-label='p2p-list'
                        name='list'
                    >
                        {clientList.map((item) => (
                            <FormControlLabel
                                control={<Radio />}
                                label={'客户端' + item.client_id}
                                value={item.client_id.toString()} //Radio组件的值须为字符串
                                key={item.ip + item.client_id}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handleP2PTest()}>确认</ColorButton>
                    <ColorButton variant='contained' color='default' className={classes.button} onClick={() => handleCloseDialog()}>取消</ColorButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
