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
    chartProgress: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(18),
    }
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
        GetList().then(res => {
            if (res.body.status) {
                var first_client = res.body.data.clients[0].client_id;
                var temp = res.body.data.clients.map((item, index) => {
                    // item.p2pLoading = false;
                    item.p2pUploadLoading = false;
                    item.p2pDownloadLoading = false;
                    item.pingLoading = false;
                    item.routerLoading = false;
                    item.uploadLoading = false;
                    item.downloadLoading = false;
                    return item;
                });
                setOnlineMachineList(temp);
                var end_time = Date.parse(new Date());
                var start_time = end_time - 7 * 24 * 60 * 60 * 1000;
                var init_data = {
                    client_id: first_client,
                    start_time: start_time,
                    end_time: end_time
                };
                // //请求第一个客户端的上行速率
                // GetUploadSpeed(init_data).then(res => {
                //     if (res.body.status) {
                //         var temp = [].concat(res.body.data.upload_speed);
                //         //转换时间戳格式
                //         temp.map((item, index) => {
                //             let dateObj = new Date(item.timestamp);
                //             let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                //             let D = dateObj.getDate() + ' ';
                //             let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                //             let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                //             let time = M + D + h + m;
                //             temp[index].timestamp = time;
                //         });
                //         setUpData(temp);
                //         console.log(init_data, '初始化上行速率', res.body)
                //     } else {
                //         console.log(res.body);
                //         handleOpenErrorDialog('初始化：请求首个客户端的历史上行速率失败');
                //     }
                // }).catch(err => console.log(err));
                // //请求第一个客户端的下行速率
                // GetDownloadSpeed(init_data).then(res => {
                //     if (res.body.status) {
                //         var temp = [].concat(res.body.data.download_speed);
                //         //转换时间戳格式
                //         temp.map((item, index) => {
                //             let dateObj = new Date(item.timestamp);
                //             let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                //             let D = dateObj.getDate() + ' ';
                //             let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                //             let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                //             let time = M + D + h + m;
                //             temp[index].timestamp = time;
                //         });
                //         setDownData(temp);
                //         console.log(first_client, '初始化下行速率', res.body)
                //     } else {
                //         console.log(res.body);
                //         handleOpenErrorDialog('初始化：请求首个客户端的历史下行速率失败');
                //     }
                // }).catch(err => console.log(err));
            } else {
                console.log(res.body.status);
                // history.push('/login');
                handleOpenErrorDialog('初始化：获取在线客户端列表失败');
            }
        }).catch(err => console.log(err));
    }, []);


    {/* 查询ping任务状态，任务完成时请求延迟的信息 */ }
    const checkPing = (mission_id, client_id, index) => {
        var data1 = { mission_id: mission_id };
        var data2 = { client_id: client_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'testing state of ping mission...')
            if (res.body.status) {
                //任务完成后，终止轮询，并请求数据
                if (res.body.data.isDone) {
                    console.log(client_id, 'ping is done')
                    clearTimeout(document.pingMissionTimeout);
                    GetClientInfo(data2).then(res => {
                        console.log(client_id, 'require the data')
                        if (res.body.status) {
                            var list = [].concat(onlineMachineList);
                            var values_temp = [].concat(values);
                            list[index].pingLoading = false;
                            values_temp[0].value = res.body.data.client_info[0].value;
                            setValues(values_temp);
                            setOnlineMachineList(list);
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('Ping延迟的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_PING' });
                        clearInterval(document.checkPingTimerInterval);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('无法检测到Ping延迟的测试任务是否完成');
                dispatch({ type: 'CLOSE_PING' });
                clearInterval(document.checkPingTimerInterval);
            }
        }).catch(err => console.log(err));
    }
    {/* 查询router任务状态，任务完成时请求路由跳的信息 */ }
    const checkRouter = (mission_id, client_id, index) => {
        var data1 = { mission_id: mission_id };
        var data2 = { client_id: client_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'testing state of router mission...')
            if (res.body.status) {
                //任务完成后，请求数据，终止超时检测，终止轮询
                if (res.body.data.isDone) {
                    console.log(client_id, 'Router mission is done')
                    clearTimeout(document.routerMissionTimeout);
                    GetClientInfo(data2).then(res => {
                        console.log(client_id, 'require the data')
                        if (res.body.status) {
                            var list = [].concat(onlineMachineList);
                            var values_temp = [].concat(values);
                            list[index].pingLoading = false;
                            values_temp[1].value = res.body.data.client_info[1].value;
                            setValues(values_temp);
                            setOnlineMachineList(list);
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('路由跳数的测试任务已完成，但无法获取该数据');
                        }
                        dispatch({ type: 'CLOSE_ROUTER' });
                        clearInterval(document.checkRouterTimerInterval);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('无法检测到路由跳数的测试任务是否完成');
                dispatch({ type: 'CLOSE_ROUTER' });
                clearInterval(document.checkPingTimerInterval);
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
        list[index].pingLoading = true;
        list[index].routerLoading = true;
        setOnlineMachineList(list);

        //创建ping任务
        CreateMission(pingData).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                // console.log(mission_id);
                dispatch({ type: 'OPEN_PING' });
                //轮询检查任务是否完成
                document.checkPingTimerInterval = setInterval(checkPing, 2000, mission_id, id, index);
                //超时
                document.pingMissionTimeout = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    list[index].pingLoading = false;
                    clearInterval(document.checkPingTimerInterval);
                    handleOpenErrorDialog('Ping延迟测试超时');
                    dispatch({ type: 'CLOSE_PING' });
                    setOnlineMachineList(list);
                }, 15000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('Ping延迟的测试任务创建失败！')
            }
        }).catch(err => console.log(err));

        //创建Router任务
        CreateMission(routerData).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                // console.log(mission_id);
                dispatch({ type: 'OPEN_ROUTER' });
                //轮询检查任务是否完成
                document.checkRouterTimerInterval = setInterval(checkRouter, 2000, mission_id, id, index);
                //超时
                document.routerMissionTimeout = setTimeout(() => {
                    var list = [].concat(onlineMachineList);
                    list[index].routerLoading = false;
                    clearInterval(document.checkRouterTimerInterval);
                    handleOpenErrorDialog('路由跳数测试超时');
                    dispatch({ type: 'CLOSE_ROUTER' });
                    setOnlineMachineList(list);
                }, 25000);
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('路由跳数的测试任务创建失败！')
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测上行速率的任务是否完成，完成后获取上行速率 */ }
    const checkUpload = (mission_id, client_id, index) => {
        const data = { mission_id: mission_id };
        IsFinished(data).then(res => {
            console.log(client_id, 'Testing state...')
            if (res.body.status) {
                //任务完成后，结束轮询，获取近一个月的上行速率
                if (res.body.data.isDone) {
                    console.log(client_id, 'Detection of upload speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    }
                    clearTimeout(document.uploadMissionTimeout);
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(client_id, 'Require the data of upload speed.')
                            var temp = [].concat(res.body.data.upload_speed);
                            var list = [].concat(onlineMachineList);
                            //关闭环形进度
                            if (!list[index].p2pUploadLoading) {
                                list[index].uploadLoading = false;
                            } else {
                                list[index].p2pUploadLoading = false;
                            }

                            //转换时间戳格式
                            // temp.map((item, index) => {
                            //     let dateObj = new Date(item.timestamp);
                            //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                            //     let D = dateObj.getDate() + ' ';
                            //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                            //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                            //     let time = M + D + h + m;
                            //     temp[index].timestamp = time;
                            // });
                            setOnlineMachineList(list);
                            console.log(temp);
                            setUpData(temp);
                            dispatch({ type: 'CLOSE_UPLOAD' });
                        } else {
                            console.log(res.body); //返回错误信息
                            handleOpenErrorDialog('测试上行速率的任务已完成，但无法获取上行速率的数据');
                        }
                        clearInterval(document.checkUploadTimerInterval);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('无法检测到上行速率的测试任务是否完成');
                clearInterval(document.checkUploadTimerInterval);
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测下行速率的任务是否完成，完成时请求下行速率 */ }
    const checkDownload = (mission_id, client_id, index) => {
        var data1 = { mission_id: mission_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'Testing state...');
            if (res.body.status) {
                //任务完成后，终止轮询，请求下行速率
                if (res.body.data.isDone) {
                    console.log(client_id, 'Detection of download speed is done.')
                    var end_time = Date.parse(new Date());
                    var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                    var data2 = {
                        client_id: client_id,
                        start_time: start_time,
                        end_time: end_time
                    };
                    var list = [].concat(onlineMachineList);
                    // list[index].downloadLoading = false;
                    //关闭环形进度
                    if (!list[index].p2pDownloadLoading) {
                        list[index].downloadLoading = false;
                    } else {
                        list[index].p2pDownloadLoading = false;
                    }
                    clearTimeout(document.downloadMissionTimeout);
                    GetDownloadSpeed(data2).then(res => {
                        console.log(client_id, 'Require the data of upload speed.')
                        if (res.body.status) {
                            var temp = [].concat(res.body.data.download_speed);
                            console.log(temp);
                            // temp.map((item, index) => {
                            //     let dateObj = new Date(item.timestamp);
                            //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                            //     let D = dateObj.getDate() + ' ';
                            //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                            //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                            //     let time = M + D + h + m;
                            //     temp[index].timestamp = time;
                            // });
                            setDownData(temp);
                            setOnlineMachineList(list);
                            dispatch({ type: 'CLOSE_DOWNLOAD' });
                        } else {
                            console.log(res.body);
                            handleOpenErrorDialog('测试上行速率的任务已完成，但无法获取上行速率的数据');
                        }
                        clearInterval(document.checkDownloadTimerInterval);
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body); //返回错误信息
                handleOpenErrorDialog('无法检测到下行速率的测试任务是否完成');
                clearInterval(document.checkDownloadTimerInterval);
            }
        }).catch(err => console.log(err));
    }


    {/* 创建测上/下行速率的任务 */ }
    function handleTestSpeed(id, ip, mac, index, target_id) {
        var upload = {};
        var download = {};
        var num = arguments.length; //用于非箭头函数
        var list = [].concat(onlineMachineList);

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
            setOnlineMachineList(list);
        }

        //创建测上载速率的任务
        CreateMission(upload).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_UPLOAD' });
                //轮询，直到任务完成
                document.checkUploadTimerInterval = setInterval(checkUpload, 2500, mission_id, id, index);
                //超时
                if (num === 4) {
                    //普通模式
                    document.uploadMissionTimeout = setTimeout(() => {
                        var list = [].concat(onlineMachineList);
                        var end_time = Date.parse(new Date());
                        var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                        var data2 = {
                            client_id: id,
                            start_time: start_time,
                            end_time: end_time
                        };
                        list[index].uploadLoading = false;
                        clearInterval(document.checkUploadTimerInterval);
                        dispatch({ type: 'CLOSE_UPLOAD' });
                        handleOpenErrorDialog('上行速率测试超时');
                        setOnlineMachineList(list);
                        GetUploadSpeed(data2).then(res => {
                            if (res.body.status) {
                                console.log(id, 'Require the data of upload speed.')
                                var temp = [].concat(res.body.data.upload_speed);
                                var list = [].concat(onlineMachineList);
                                //关闭环形进度
                                if (!list[index].p2pUploadLoading) {
                                    list[index].uploadLoading = false;
                                } else {
                                    list[index].p2pUploadLoading = false;
                                }

                                // //转换时间戳格式
                                // temp.map((item, index) => {
                                //     let dateObj = new Date(item.timestamp);
                                //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                //     let D = dateObj.getDate() + ' ';
                                //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                                //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                                //     let time = M + D + h + m;
                                //     temp[index].timestamp = time;
                                // });
                                setOnlineMachineList(list);
                                setUpData(temp);
                                dispatch({ type: 'CLOSE_UPLOAD' });
                            } else {
                                console.log(res.body); //返回错误信息
                                handleOpenErrorDialog('测试上行速率的任务已完成，但无法获取上行速率的数据');
                            }
                            // clearInterval(document.checkUploadTimerInterval);
                        }).catch(err => console.log(err));
                    }, 5000);
                } else {
                    //P2P模式
                    document.uploadMissionTimeout = setTimeout(() => {
                        var list = [].concat(onlineMachineList);
                        var end_time = Date.parse(new Date());
                        var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                        var data2 = {
                            client_id: id,
                            start_time: start_time,
                            end_time: end_time
                        };
                        list[index].p2pUploadLoading = false;
                        clearInterval(document.checkUploadTimerInterval);
                        dispatch({ type: 'CLOSE_UPLOAD' });
                        handleOpenErrorDialog('P2P模式的上行速率测试超时');
                        setOnlineMachineList(list);
                        GetUploadSpeed(data2).then(res => {
                            if (res.body.status) {
                                console.log(id, 'Require the data of upload speed.')
                                var temp = [].concat(res.body.data.upload_speed);
                                var list = [].concat(onlineMachineList);
                                //关闭环形进度
                                if (!list[index].p2pUploadLoading) {
                                    list[index].uploadLoading = false;
                                } else {
                                    list[index].p2pUploadLoading = false;
                                }

                                // //转换时间戳格式
                                // temp.map((item, index) => {
                                //     let dateObj = new Date(item.timestamp);
                                //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                //     let D = dateObj.getDate() + ' ';
                                //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                                //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                                //     let time = M + D + h + m;
                                //     temp[index].timestamp = time;
                                // });
                                setOnlineMachineList(list);
                                setUpData(temp);
                                dispatch({ type: 'CLOSE_UPLOAD' });
                            } else {
                                console.log(res.body); //返回错误信息
                                handleOpenErrorDialog('测试上行速率的任务已完成，但无法获取上行速率的数据');
                            }
                            // clearInterval(document.checkUploadTimerInterval);
                        }).catch(err => console.log(err));
                    }, 5000);
                }

            } else {
                console.log(res.body) //输出错误信息
                handleOpenErrorDialog('上行速率测试任务创建失败');
            }
        }).catch(err => console.log(err))

        //创建测下行速率的任务
        CreateMission(download).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                dispatch({ type: 'OPEN_DOWNLOAD' });
                //轮询，直到任务完成
                document.checkDownloadTimerInterval = setInterval(checkDownload, 2500, mission_id, id, index);
                //超时
                if (num === 4) {
                    //普通模式
                    document.downloadMissionTimeout = setTimeout(() => {
                        var list = [].concat(onlineMachineList);
                        var end_time = Date.parse(new Date());
                        var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                        var data2 = {
                            client_id: id,
                            start_time: start_time,
                            end_time: end_time
                        };
                        list[index].downloadLoading = false;
                        clearInterval(document.checkDownloadTimerInterval);
                        dispatch({ type: 'CLOSE_DOWNLOAD' });
                        handleOpenErrorDialog('下行速率测试超时');
                        setOnlineMachineList(list);
                        GetDownloadSpeed(data2).then(res => {
                            console.log(id, 'Require the data of download speed.')
                            if (res.body.status) {
                                var temp = [].concat(res.body.data.download_speed);
                                // temp.map((item, index) => {
                                //     let dateObj = new Date(item.timestamp);
                                //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                //     let D = dateObj.getDate() + ' ';
                                //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                                //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                                //     let time = M + D + h + m;
                                //     temp[index].timestamp = time;
                                // });
                                setDownData(temp);
                                setOnlineMachineList(list);
                                dispatch({ type: 'CLOSE_DOWNLOAD' });
                            } else {
                                console.log(res.body);
                                handleOpenErrorDialog('测试下行速率的任务已完成，但无法获取下行速率的数据');
                            }
                            // clearInterval(document.checkDownloadTimerInterval);
                        }).catch(err => console.log(err));
                    }, 6000);
                } else {
                    //P2P模式
                    document.downloadMissionTimeout = setTimeout(() => {
                        var list = [].concat(onlineMachineList);
                        var end_time = Date.parse(new Date());
                        var start_time = end_time - 30 * 24 * 60 * 60 * 1000;
                        var data2 = {
                            client_id: id,
                            start_time: start_time,
                            end_time: end_time
                        };
                        list[index].p2pDownloadLoading = false;
                        clearInterval(document.checkDownloadTimerInterval);
                        dispatch({ type: 'CLOSE_DOWNLOAD' });
                        handleOpenErrorDialog('P2P模式的下行速率测试超时');
                        setOnlineMachineList(list);
                        GetDownloadSpeed(data2).then(res => {
                            console.log(id, 'Require the data of upload speed.')
                            if (res.body.status) {
                                var temp = [].concat(res.body.data.download_speed);
                                // temp.map((item, index) => {
                                //     let dateObj = new Date(item.timestamp);
                                //     let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                //     let D = dateObj.getDate() + ' ';
                                //     let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
                                //     let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                                //     let time = M + D + h + m;
                                //     temp[index].timestamp = time;
                                // });
                                setDownData(temp);
                                setOnlineMachineList(list);
                                dispatch({ type: 'CLOSE_DOWNLOAD' });
                            } else {
                                console.log(res.body);
                                handleOpenErrorDialog('测试下行速率的任务已完成，但无法获取下行速率的数据');
                            }
                            // clearInterval(document.checkDownloadTimerInterval);
                        }).catch(err => console.log(err));
                    }, 6000);
                }
            } else {
                console.log(res.body);
                handleOpenErrorDialog('下行速率测试任务创建失败');
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
                // console.log('找到id对应的行：',item.client_id, id, index, temp_index);
                return true;
            }
        });
        console.log('点击确定按钮后：', temp_index);
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
                <Grid item xs={12} lg={4}>
                    <UploadChart upData={upData} />
                    {chartLoading.uploadChartLoading && <CircularProgress size={100} className={classes.chartProgress} />}
                </Grid>
                <Grid item xs={12} lg={4}>
                    <DownloadChart downData={downData} />
                    {chartLoading.downloadChartLoading && <CircularProgress size={100} className={classes.chartProgress} />}
                </Grid>
                <Grid item xs={12} lg={3}>
                    <PingTable values={values} pingLoading={chartLoading.pingTableLoading} routerLoading={chartLoading.routerTableLoading} />
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
