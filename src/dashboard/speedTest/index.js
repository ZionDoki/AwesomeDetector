import React from 'react';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { withStyles, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { makeStyles, Container, Button, Grid } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

import { GetList, GetClientInfo, GetUploadSpeed, GetDownloadSpeed } from '../../api/speedTest';
import { CreateMission, IsFinished } from '../../api/mission';
import UploadChart from './uploadChart';
import DownloadChart from './downloadChart';
import PingTable from './pingTable';
import ClientList from './clientList';

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
}));

const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

export default function SpeedTest(props) {
    const classes = useStyles();
    const { history } = props;

    const [onlineMachineList, setOnlineMachineList] = React.useState(Array);
    const [open, setOpen] = React.useState(false);
    const [id, setId] = React.useState('');
    const [idTo, setIdTo] = React.useState('');
    const [clientList, setClientList] = React.useState(Array);
    const [upData, setUpData] = React.useState(Array);
    const [downData, setDownData] = React.useState([
        { timestamp: '12:00', value: 500 },
        { timestamp: '12:01', value: 500 },
        { timestamp: '12:02', value: 520 },
        { timestamp: '12:03', value: 420 },
        { timestamp: '12:04', value: 480 },
        { timestamp: '12:05', value: 522 },
    ]);
    const [values, setValues] = React.useState([
        { name: 'ping', value: '__' },
        { name: 'routers', value: '__' },
    ]);



    {/* 获取客户端列表 */ }
    React.useEffect(() => {
        GetList().then(res => {
            if (res.body.status) {
                setOnlineMachineList(res.body.data.clients);
            } else {
                console.log(res.body.status);
                history.push('/login');
            }
        }).catch(err => console.log(err));
    }, []);


    {/* 查询ping任务状态，任务完成时请求路由跳数和延迟的信息 */ }
    const checkPing = (mission_id, client_id) => {
        var data1 = { mission_id: mission_id };
        var data2 = { client_id: client_id };
        IsFinished(data1).then(res => {
            console.log(client_id, 'testing state of mission...')
            if (res.body.status) {
                //任务完成后，终止轮询，并请求数据
                if (res.body.data.isDone) {
                    console.log(client_id, 'ping is done')
                    clearInterval(document.checkPingTimerInterval);
                    GetClientInfo(data2).then(res => {
                        console.log(client_id, 'require the data')
                        if (res.body.status) {
                            setValues(res.body.data.client_info);
                        } else {
                            console.log(res.body);
                        }
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                clearInterval(document.checkPingTimerInterval);
            }
        }).catch(err => console.log(err));
    }


    {/* 请求延迟和路由跳数 */ }
    const handlePing = (id, ip, mac) => {
        var pingData = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: 'PING'
        };
        //创建ping任务
        CreateMission(pingData).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                //轮询检查任务是否完成
                document.checkPingTimerInterval = setInterval(checkPing, 2000, mission_id, id)
            } else {
                console.log(res.body); //返回错误信息
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测上行速率的任务是否完成，完成后获取上行速率 */ }
    const checkUpload = (mission_id, client_id) => {
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
                    clearInterval(document.checkUploadTimerInterval);
                    GetUploadSpeed(data2).then(res => {
                        if (res.body.status) {
                            console.log(client_id, 'Require the data of upload speed.')
                            var temp = res.body.data.upload_speed;
                            //转换时间戳格式
                            temp.map((item, index) => {
                                let dateObj = new Date(item.timestamp);
                                let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                let D = dateObj.getDate() + ' ';
                                let h = dateObj.getHours() + ':';
                                let m = dateObj.getMinutes();
                                let time = M + D + h + m;
                                temp[index].timestamp = time;
                            });
                            setUpData(temp);
                        } else {
                            console.log(res.body) //返回错误信息
                        }
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                clearInterval(document.checkUploadTimerInterval);
            }
        }).catch(err => console.log(err));
    }


    {/* 检查测下行速率的任务是否完成，完成时请求下行速率 */ }
    const checkDownload = (mission_id, client_id) => {
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
                    clearInterval(document.checkDownloadTimerInterval);
                    GetDownloadSpeed(data2).then(res => {
                        console.log(client_id, 'Require the data of upload speed.')
                        if (res.body.status) {
                            var temp = res.body.data.download_speed;
                            temp.map((item, index) => {
                                let dateObj = new Date(item.timestamp);
                                let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
                                let D = dateObj.getDate() + ' ';
                                let h = dateObj.getHours() + ':';
                                let m = dateObj.getMinutes();
                                let time = M + D + h + m;
                                temp[index].timestamp = time;
                            });
                            setDownData(temp);
                        } else {
                            console.log(res.body)
                        }
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body); //返回错误信息
                clearInterval(document.checkDownloadTimerInterval);
            }
        }).catch(err => console.log(err));
    }


    {/* 请求上下行速率 */ }
    function handleTestSpeed(id, ip, mac, target_id) {
        var upload = {};
        var download = {};
        var num = arguments.length; //用于非箭头函数
        if (num === 3) {
            //创建测上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD'
            }
            //创建下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD'
            }
        }
        else if(num === 4) {
            //创建测上行速率所需的参数
            upload = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'UPLOAD',
                target_client: target_id
            }
            //创建下行速率所需的参数
            download = {
                client_id: id,
                ip: ip,
                mac: mac,
                type: 'DOWNLOAD',
                target_client: target_id
            }
        }
        //创建测上载速率的任务
        CreateMission(upload).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                //轮询，直到任务完成
                document.checkUploadTimerInterval = setInterval(checkUpload, 2000, mission_id, id);
            } else {
                console.log(res.body) //输出错误信息
            }
        }).catch(err => console.log(err))
        //创建测下行速率的任务
        CreateMission(download).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                //轮询，直到任务完成
                document.checkDownloadTimerInterval = setInterval(checkDownload, 2000, mission_id, id);
            } else {
                console.log(res.body);
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

    {/* 创建P2P网络测速任务 */ }
    const handleP2PTest = () => {
        var ip = '';
        var mac = '';
        handleCloseDialog();
        onlineMachineList.some( (item) => {
            if(item.client_id === id) {
                ip = item.ip;
                mac = item.mac;
                return true;
            }
        });
        //创建测上下行速率的任务，并获取上下行速率
        handleTestSpeed(id, ip, mac, idTo); 
    }

    return (
        <Container maxWidth='lg' className={classes.container} >
            <Grid container spacing={2} className={classes.dataDisplay}>
                <Grid item xs={12} lg={4}>
                    <UploadChart upData={upData} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <DownloadChart downData={downData} />
                </Grid>
                <Grid item xs={12} lg={3}>
                    <PingTable values={values} />
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
