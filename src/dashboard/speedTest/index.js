import React, { useReducer } from 'react';
import { Radio, RadioGroup, FormControlLabel, CircularProgress, TextField, InputAdornment } from '@material-ui/core';
import { withStyles, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { makeStyles, Container, Button, Grid } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

import { GetList, GetClientInfo, GetUploadSpeed, GetDownloadSpeed } from '../../api/speedTest';
import { CreateMission, IsFinished, CreateUdpMission } from '../../api/mission';
import UploadChart from './uploadChart';
import DownloadChart from './downloadChart';
import PingTable from './pingTable';
import ClientList from './clientList';
import ErrorDialog from './errorDialog';
import UdpDialog from './udpDialog';
import P2PDialog from './p2pDialog';

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

{/* 自定义按钮 */ }
const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

{/* 控制图表的环形进度条 */ }
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

    const [openP2PUpload, setOpenP2PUpload] = React.useState(false);//p2p上行测速对话框
    const [openP2PDownload, setOpenP2PDownload] = React.useState(false);//p2p下行测速对话框
    const handleCloseP2PDialog = () => {
        if (openP2PUpload) setOpenP2PUpload(false);
        if (openP2PDownload) setOpenP2PDownload(false);
    }

    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);//报错弹窗
    const [message, setMessage] = React.useState('');//报错信息
    {/* 关闭错误警告 */ }
    const handleCloseErrorDialog = () => setOpenErrorDialog(false);
    {/* 打开错误警告 */ }
    const handleOpenErrorDialog = msg => {
        setMessage(msg);
        setOpenErrorDialog(true);
    }

    const [openUdpUpload, setOpenUdpUpload] = React.useState(false); //UDP上行测速任务对话框
    const [openUdpDownload, setOpenUdpDownload] = React.useState(false); //UDP下行测速任务对话框
    const handleCloseUdpDialog = () => {
        if (openUdpUpload) {
            setOpenUdpUpload(false);
        } else {
            setOpenUdpDownload(false);
        }
    }

    //UDP输入框参数
    const [udpProps, setUdpProps] = React.useState({
        duration: -1,
        speed: -1,
    });
    const handleChangeUdp = name => event => {
        console.log(udpProps);
        setUdpProps({ ...udpProps, [name]: event.target.value });
    }

    const [id, setId] = React.useState(-1);
    const [idTo, setIdTo] = React.useState(-1);
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
                    //给每个客户端增加“loading”状态
                    item.p2pUploadLoading = false;
                    item.p2pDownloadLoading = false;
                    item.udpUploadLoading = false;
                    item.udpDownloadLoading = false;
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
                            handleOpenErrorDialog('客户端' + client_id + '：Ping延迟的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_PING' });
                        clearInterval(document.checkPingTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到Ping延迟的测试任务是否完成');
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
                            handleOpenErrorDialog('客户端' + client_id + '：路由跳数的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_ROUTER' });
                        clearInterval(document.checkRouterTimerInterval[client_id][mission_type2]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到路由跳数的测试任务是否完成');
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
        if (!document.checkPingTimerInterval) {
            document.checkPingTimerInterval = {}
        }
        if (!document.checkPingTimerInterval[id]) {
            document.checkPingTimerInterval[id] = {}
        }
        //初始化Router任务的轮询对象
        if (!document.checkRouterTimerInterval) {
            document.checkRouterTimerInterval = {}
        }
        if (!document.checkRouterTimerInterval[id]) {
            document.checkRouterTimerInterval[id] = {}
        }
        //初始化Ping任务的超时监听对象
        if (!document.pingMissionTimeout) {
            document.pingMissionTimeout = {}
        }
        if (!document.pingMissionTimeout[id]) {
            document.pingMissionTimeout[id] = {}
        }
        //初始化Router任务的超时监听对象
        if (!document.routerMissionTimeout) {
            document.routerMissionTimeout = {}
        }
        if (!document.routerMissionTimeout[id]) {
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
                    handleOpenErrorDialog('客户端' + id + '：Ping延迟测试超时');
                    dispatch({ type: 'CLOSE_PING' });
                    setOnlineMachineList(list);
                }, 70000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端' + id + '：Ping延迟的测试任务创建失败！')
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
                    handleOpenErrorDialog('客户端' + id + '：路由跳数测试超时');
                    dispatch({ type: 'CLOSE_ROUTER' });
                    setOnlineMachineList(list);
                }, 75000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端' + id + '：路由跳数的测试任务创建失败！')
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
                            // if (!list[index].p2pUploadLoading) {
                            //     list[index].uploadLoading = false;
                            // } else {
                            //     list[index].p2pUploadLoading = false;
                            // }
                            if (mission_type1 == 'upload_mission') {
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
                            handleOpenErrorDialog('客户端' + client_id + '：测试上行速率的任务已完成，但无法获取上行速率的数据');
                        }
                        clearInterval(document.checkUploadTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到上行速率的测试任务是否完成');
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
                    // if (!list[index].p2pDownloadLoading) {
                    //     list[index].downloadLoading = false;
                    // } else {
                    //     list[index].p2pDownloadLoading = false;
                    // }
                    if (mission_type2 == 'download_mission') {
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
                            handleOpenErrorDialog('客户端' + client_id + '：测试下行速率的任务已完成，但无法获取下行速率的数据');
                        }
                        clearInterval(document.checkDownloadTimerInterval[client_id][mission_type2]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到下行速率的测试任务是否完成');
                clearInterval(document.checkDownloadTimerInterval[client_id][mission_type2]);
            }
        }).catch(err => console.log(err));
    }


    {/* 创建测上行速率的任务 */ }
    function handleTestUploadSpeed(id, ip, mac, index, target_id) {
        var upload = {};
        var num = arguments.length; //用于非箭头函数
        var list = [].concat(onlineMachineList);
        var mission_type1;

        if (num === 4) {
            //创建测上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD'
            };
            list[index].uploadLoading = true;
            mission_type1 = 'upload_mission';
            setOnlineMachineList(list);
        }
        else if (num === 5) {
            //创建测P2P上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD',
                target_client: target_id
            };
            list[index].p2pUploadLoading = true;
            mission_type1 = 'p2p_upload_mission';
            setOnlineMachineList(list);
        }

        //初始化上载速率任务的轮询对象
        if (!document.checkUploadTimerInterval) {
            document.checkUploadTimerInterval = {}
        }
        if (!document.checkUploadTimerInterval[id]) {
            document.checkUploadTimerInterval[id] = {}
        }

        //初始化上载速率任务的超时监听对象
        if (!document.uploadMissionTimeout) {
            document.uploadMissionTimeout = {}
        }
        if (!document.uploadMissionTimeout[id]) {
            document.uploadMissionTimeout[id] = {}
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
                        handleOpenErrorDialog('客户端' + id + ':上行速率测试超时，将显示历史数据');//与P2P不同
                    } else {
                        list[index].p2pUploadLoading = false;
                        handleOpenErrorDialog('客户端' + id + '：P2P模式的上行速率测试超时，将显示历史数据');
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
                            handleOpenErrorDialog('客户端' + id + '：获取上行速率的历史数据失败');
                        }
                    }).catch(err => console.log(err));
                }, 40000);

            } else {
                console.log(res.body) //输出错误信息
                handleOpenErrorDialog('客户端' + id + '：上行速率测试任务创建失败');
            }
        }).catch(err => console.log(err))

    }


    {/* 创建测下行速率的任务 */ }
    function handleTestDownloadSpeed(id, ip, mac, index, target_id) {
        var download = {};
        var num = arguments.length; //用于非箭头函数
        var list = [].concat(onlineMachineList);
        var mission_type2;

        if (num === 4) {
            //创建下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD'
            };
            list[index].downloadLoading = true;
            mission_type2 = 'download_mission';
            setOnlineMachineList(list);
        }
        else if (num === 5) {
            //创建P2P下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD',
                target_client: target_id
            };
            list[index].p2pDownloadLoading = true;
            mission_type2 = 'p2p_download_mission';
            setOnlineMachineList(list);
        }

        //初始化下载速率任务的轮询对象
        if (!document.checkDownloadTimerInterval) {
            document.checkDownloadTimerInterval = {}
        }
        if (!document.checkDownloadTimerInterval[id]) {
            document.checkDownloadTimerInterval[id] = {}
        }

        //初始化下载速率任务的超时监听对象
        if (!document.downloadMissionTimeout) {
            document.downloadMissionTimeout = {}
        }
        if (!document.downloadMissionTimeout[id]) {
            document.downloadMissionTimeout[id] = {}
        }

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
                        handleOpenErrorDialog('客户端' + id + '：下行速率测试超时，将显示历史数据'); //与P2P不同
                    } else {
                        //P2P模式
                        list[index].p2pDownloadLoading = false;
                        handleOpenErrorDialog('客户端' + id + '：P2P模式的下行速率测试超时，将显示历史数据');
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
                            handleOpenErrorDialog('客户端' + id + '：获取下行速率的历史数据失败');
                        }
                    }).catch(err => console.log(err));
                }, 50000);
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + id + '：下行速率测试任务创建失败');
            }
        }).catch(err => console.log(err));
    }

    {/* 选择p2p测速的目标客户端 */ }
    const handleChange = event => {
        setIdTo(event.target.value); //event.target.value是字符串类型,所以之后的idTo都会是string
    }

    {/* 点击'P2P上行测速'按钮 */ }
    const handleClickP2PUpload = (client_id, index) => {
        var list = [].concat(onlineMachineList); //深拷贝
        delete list[index];
        setClientList(list);
        setId(client_id);
        setOpenP2PUpload(true);
    }
    {/* 点击'P2P下行测速'按钮 */ }
    const handleClickP2PDownload = (client_id, index) => {
        var list = [].concat(onlineMachineList); //深拷贝
        delete list[index];
        setClientList(list);
        setId(client_id);
        setOpenP2PDownload(true);
    }

    {/* 点击“确定”按钮，创建P2P网络上行测速任务 */ }
    const handleP2PUploadTest = () => {
        var ip = '';
        var mac = '';
        var temp_index = -1;
        handleCloseP2PDialog();
        onlineMachineList.some((item, index) => {
            if (item.client_id === id) {
                ip = item.ip;
                mac = item.mac;
                temp_index = index;
                return true;
            }
        });
        //创建测上行速率的任务，并获取上行速率
        handleTestUploadSpeed(id, ip, mac, temp_index, idTo);
    }
    {/* 点击“确定”按钮，创建P2P网络下行测速任务 */ }
    const handleP2PDownloadTest = () => {
        var ip = '';
        var mac = '';
        var temp_index = -1;
        handleCloseP2PDialog();
        onlineMachineList.some((item, index) => {
            if (item.client_id === id) {
                ip = item.ip;
                mac = item.mac;
                temp_index = index;
                return true;
            }
        });
        //创建测下行速率的任务，并获取下行速率
        handleTestDownloadSpeed(id, ip, mac, temp_index, idTo);
    }


    {/* 点击按钮，打开UDP上行测速对话框 */ }
    const handleClickUdpUpload = (client_id) => {
        setId(client_id);
        setOpenUdpUpload(true);
    }
    {/* 点击按钮，打开UDP行下测速对话框 */ }
    const handleClickUdpDownload = (client_id) => {
        setId(client_id);
        setOpenUdpDownload(true);
    }

    {/* 轮询UDP上行测速任务是否完成 */ }
    const checkUdpUpload = (mission_id, client_id, index, mission_type1) => {
        const data = { mission_id: mission_id };
        IsFinished(data).then(res => {
            console.log(client_id, mission_type1, 'Testing state...')
            if (res.body.status) {
                //任务完成后，结束轮询，获取近一个月的上行速率
                if (res.body.data.isDone) {
                    console.log(client_id, mission_type1, 'Detection of UDP upload speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    }
                    clearTimeout(document.udpUploadMissionTimeout[client_id][mission_type1]);
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(client_id, mission_type1, 'Require the data of UDP upload speed.', res.body.data)
                            var temp = [].concat(res.body.data.upload_speed);
                            var list = [].concat(onlineMachineList);
                            preClientIdUp = client_id;
                            list[index].udpUploadLoading = false;
                            setOnlineMachineList(list);
                            setUpData(temp);
                            preUpData = temp;
                            dispatch({ type: 'CLOSE_UPLOAD' });
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端' + client_id + '：测试UDP上行速率的任务已完成，但无法获取上行速率的数据');
                        }
                        list[index].udpUploadLoading = false;
                        setOnlineMachineList(list);
                        clearInterval(document.checkUdpUploadTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到UDP上行速率的测试任务是否完成');
                clearInterval(document.checkUdpUploadTimerInterval[client_id][mission_type1]);
            }
        }).catch(err => console.log(err));
    }

    {/* 发起Udp上行测速 */ }
    const handleTestUdpUploadSpeed = id => {
        var upload = {};
        var index;
        var list = [].concat(onlineMachineList);
        var mission_type1;
        var expireTime = ( udpProps.duration + 10 ) * 1000;
        //关闭对话框
        handleCloseUdpDialog();
        //创建测上行速率所需的参数
        list.some((item, ix) => {
            if (item.client_id === id) {
                index = ix;
                upload.client_id = id;
                upload.ip = item.ip;
                upload.mac = item.mac;
                upload.type = "UDP_UPLOAD";
                return true;
            }
        });
        upload.duration = udpProps.duration;
        upload.speed = udpProps.speed;
        list[index].udpUploadLoading = true;
        mission_type1 = 'udp_upload_mission';
        setOnlineMachineList(list);

        //初始化UDP上载速率任务的轮询对象
        if (!document.checkUdpUploadTimerInterval) {
            document.checkUdpUploadTimerInterval = {}
        }
        if (!document.checkUdpUploadTimerInterval[id]) {
            document.checkUdpUploadTimerInterval[id] = {}
        }

        //初始化UDP上载速率任务的超时监听对象
        if (!document.udpUploadMissionTimeout) {
            document.udpUploadMissionTimeout = {}
        }
        if (!document.udpUploadMissionTimeout[id]) {
            document.udpUploadMissionTimeout[id] = {}
        }

        //创建测上载速率的任务
        CreateUdpMission(upload).then(res => {
            var list = [].concat(onlineMachineList);
            // list[index].udpUploadLoading = false; //关闭列表中的环形进度条
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_UPLOAD' });
                //轮询，直到任务完成
                document.checkUdpUploadTimerInterval[id][mission_type1] = setInterval(checkUdpUpload, 2500, mission_id, id, index, mission_type1);
                //超时
                document.udpUploadMissionTimeout[id][mission_type1] = setTimeout(() => {
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: id,
                        start_time: start_time,
                        end_time: end_time
                    };

                    handleOpenErrorDialog('客户端' + id + ':UDP上行速率测试超时，将显示历史数据');
                    // console.log(id, '超时', list[index]);
                    clearInterval(document.checkUdpUploadTimerInterval[id][mission_type1]);
                    //请求历史数据
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(id, '超时，请求历史数据, 数据是：', res.body.data)
                            var temp = [].concat(res.body.data.upload_speed);
                            preClientIdUp = id;
                            setUpData(temp);
                            preUpData = temp;
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端' + id + '：获取UDP上行速率的历史数据失败');
                        }
                        list[index].udpUploadLoading = false
                        setOnlineMachineList(list); //超时后，请求历史数据成功/失败后，关闭列表中的环形进度条
                        dispatch({ type: 'CLOSE_UPLOAD' }); //超时后，请求历史数据成功/失败后，关闭上行速率图标的环形进度条
                    }).catch(err => console.log(err));
                }, expireTime);

            } else {
                console.log(res.body) //输出错误信息
                list[index].udpUploadLoading = false
                setOnlineMachineList(list); //关闭列表中的环形进度条
                handleOpenErrorDialog('客户端' + id + '：UDP上行速率测试任务创建失败');
            }
        }).catch(err => console.log(err))

    }

    {/* 轮询UDP下行测速任务是否完成 */ }
    const checkUdpDownload = (mission_id, client_id, index, mission_type1) => {
        const data = { mission_id: mission_id };
        IsFinished(data).then(res => {
            console.log(client_id, mission_type1, 'Testing state...')
            if (res.body.status) {
                //任务完成后，结束轮询，获取近一个月的下行速率
                if (res.body.data.isDone) {
                    console.log(client_id, mission_type1, 'Detection of UDP download speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    }
                    clearTimeout(document.udpDownloadMissionTimeout[client_id][mission_type1]);
                    GetDownloadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(client_id, mission_type1, 'Require the data of UDP download speed.')
                            var temp = [].concat(res.body.data.download_speed);
                            var list = [].concat(onlineMachineList);
                            preClientIdDown = client_id;
                            list[index].udpDownloadLoading = false;
                            setOnlineMachineList(list);
                            setDownData(temp);
                            preDownData = temp;
                            dispatch({ type: 'CLOSE_DOWNLOAD' });
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端' + client_id + '：测试UDP下行速率的任务已完成，但无法获取下行速率的数据');
                        }
                        clearInterval(document.checkUdpDownloadTimerInterval[client_id][mission_type1]);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('客户端' + client_id + '：无法检测到UDP下行速率的测试任务是否完成');
                clearInterval(document.checkUdpDownloadTimerInterval[client_id][mission_type1]);
            }
        }).catch(err => console.log(err));
    }

    {/* 发起Udp下行测速 */ }
    const handleTestUdpDownloadSpeed = id => {
        var download = {};
        var index;
        var list = [].concat(onlineMachineList);
        var mission_type1;
        var expireTime = ( udpProps.duration + 10 ) * 1000;
        //关闭对话框
        handleCloseUdpDialog();
        //创建测下行速率所需的参数
        list.some((item, ix) => {
            if (item.client_id === id) {
                index = ix;
                download.client_id = id;
                download.ip = item.ip;
                download.mac = item.mac;
                download.type = "UDP_DOWNLOAD";
                return true;
            }
        });
        download.duration = udpProps.duration;
        download.speed = udpProps.speed;
        list[index].udpDownloadLoading = true;
        mission_type1 = 'udp_download_mission';
        setOnlineMachineList(list);

        //初始化UDP下载速率任务的轮询对象
        if (!document.checkUdpDownloadTimerInterval) {
            document.checkUdpDownloadTimerInterval = {}
        }
        if (!document.checkUdpDownloadTimerInterval[id]) {
            document.checkUdpDownloadTimerInterval[id] = {}
        }

        //初始化UDP下载速率任务的超时监听对象
        if (!document.udpDownloadMissionTimeout) {
            document.udpDownloadMissionTimeout = {}
        }
        if (!document.udpDownloadMissionTimeout[id]) {
            document.udpDownloadMissionTimeout[id] = {}
        }

        //创建测下载速率的任务
        CreateUdpMission(download).then(res => {
            var list = [].concat(onlineMachineList);

            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_DOWNLOAD' });
                //轮询，直到任务完成
                document.checkUdpDownloadTimerInterval[id][mission_type1] = setInterval(checkUdpDownload, 2500, mission_id, id, index, mission_type1);
                //超时
                document.udpDownloadMissionTimeout[id][mission_type1] = setTimeout(() => {
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: id,
                        start_time: start_time,
                        end_time: end_time
                    };

                    handleOpenErrorDialog('客户端' + id + ':UDP下行速率测试超时，将显示历史数据');
                    clearInterval(document.checkUdpDownloadTimerInterval[id][mission_type1]);
                    //请求历史数据
                    GetDownloadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(id, '超时，请求历史数据，数据是：', res.body.data)
                            var temp = [].concat(res.body.data.upload_speed);
                            preClientIdDown = id;
                            setDownData(temp);
                            preDownData = temp;
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('客户端' + id + '：获取UDP下行速率的历史数据失败');
                        }
                        dispatch({ type: 'CLOSE_DOWNLOAD' }); //关闭下行速率图标的环形进度条
                        list[index].udpDownloadLoading = false;
                        setOnlineMachineList(list);//超时关闭列表环形进度条
                    }).catch(err => console.log(err));
                }, expireTime);

            } else {
                console.log(res.body) //输出错误信息
                handleOpenErrorDialog('客户端' + id + '：UDP下行速率测试任务创建失败');
                list[index].udpDownloadLoading = false;
                setOnlineMachineList(list);//关闭列表环形进度条
            }
        }).catch(err => console.log(err))

    }



    return (
        <Container maxWidth='lg' className={classes.container} >
            <Grid container spacing={2} className={classes.dataDisplay}>
                <Grid item xs={12} lg={4} style={{ position: 'relative' }}>
                    <UploadChart upData={upData} clientId={preClientIdUp} />
                    {chartLoading.uploadChartLoading && <CircularProgress size={100} className={classes.chartProgressUp} />}
                </Grid>
                <Grid item xs={12} lg={4} style={{ position: 'relative' }}>
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
                        onClickP2PUpload={handleClickP2PUpload}
                        onClickP2PDownload={handleClickP2PDownload}
                        onClickPing={handlePing}
                        onClickTestUploadSpeed={handleTestUploadSpeed}
                        onClickTestDownloadSpeed={handleTestDownloadSpeed}
                        onClickUdpUpload={handleClickUdpUpload}
                        onClickUdpDownload={handleClickUdpDownload}
                    />
                </Grid>
            </Grid>
            <ErrorDialog open={openErrorDialog} handleClose={handleCloseErrorDialog} msg={message} />
            {/* P2P上行测速对话框 */}
            <P2PDialog
                open={openP2PUpload}
                id={id}
                idTo={idTo}
                clientList={clientList}
                type="上行"
                onClose={handleCloseP2PDialog}
                onChange={handleChange}
                onClick={handleP2PUploadTest}
            />
            {/* P2P下行测速对话框 */}
            <P2PDialog
                open={openP2PDownload}
                id={id}
                idTo={idTo}
                clientList={clientList}
                type="下行"
                onClose={handleCloseP2PDialog}
                onChange={handleChange}
                onClick={handleP2PDownloadTest}
            />
            {/* UDP上行测速对话框 */}
            <UdpDialog open={openUdpUpload} id={id} type="上行" onClose={handleCloseUdpDialog} onChange={handleChangeUdp} onClick={() => handleTestUdpUploadSpeed(id)} />
            {/* UDP下行测速对话框 */}
            <UdpDialog open={openUdpDownload} id={id} type="下行" onClose={handleCloseUdpDialog} onChange={handleChangeUdp} onClick={() => handleTestUdpDownloadSpeed(id)} />
        </Container>
    );
}
