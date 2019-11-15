import React from 'react';
import { makeStyles, Container, Paper, Typography, Divider, Button, Popover, CircularProgress, LinearProgress } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import ComputerIcon from '@material-ui/icons/Computer';

import { GetList } from '../../api/speedTest';
import { CreateMission, IsFinished, GetResult } from '../../api/mission';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    button: {
        marginRight: theme.spacing(2),
    },
    popover: {
        pointerEvents: 'none',
    },
    popoverPaper: {
        padding: theme.spacing(1),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '23%',
        marginLeft: theme.spacing(-10),
      },
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#4caf50',
            contrastText: '#fff',
        },
    },
});

export default function AttackTest(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = Boolean(anchorEl);
    const [popoverStr, setPopoverStr] = React.useState('');
    const [clientList, setClientList] = React.useState(Array);
    {/* primary表示“安全”，secondary表示“有风险”，default表示“尚未测试” */ }
    const [states, setStates] = React.useState(Array);
    // const [loading, setLoading] = React.useState(false);

    {/* 关闭Popover */}
    const handleClosePopover = () => setAnchorEl(null);

    {/* 打开Popover，并显示不同颜色按钮的含义 */}
    const handleOpenPopover = (event, type) => {
        switch(type) {
            case 'primary':
                setPopoverStr('安全');
                break;
            case 'secondary':
                setPopoverStr('有风险');
                break;
            case 'default':
                setPopoverStr('尚未检测');
                break;
        }
        setAnchorEl(event.currentTarget);
    }

    {/* 获取客户端列表并初始化按钮状态 */ }
    React.useEffect(() => {
        GetList().then(res => {
            if (res.body.status) {
                var states_temp = [];
                states_temp = res.body.data.clients.map(item => {
                    var obj_temp = {};
                    switch (item.syn) {
                        case 'SAFE':
                            obj_temp.syn = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.syn = 'secondary';
                            break;
                        case 'WAITTING':
                            obj_temp.syn = 'default';
                            break;
                    };
                    switch (item.udp) {
                        case 'SAFE':
                            obj_temp.udp = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.udp = 'secondary';
                            break;
                        case 'WAITTING':
                            obj_temp.udp = 'default';
                            break;
                    };
                    switch (item.sha) {
                        case 'SAFE':
                            obj_temp.sha = 'primary';
                            break;
                        case 'DANGER':
                            obj_temp.sha = 'secondary';
                            break;
                        case 'WAITTING':
                            obj_temp.sha = 'default';
                            break;
                    };
                    obj_temp.synLoading = false;
                    obj_temp.udpLoading = false;
                    obj_temp.shaLoading = false;
                    return obj_temp;
                });
                setStates(states_temp);
                setClientList(res.body.data.clients);
            } else {
                console.log(res.body);
            }
        }).catch(err => console.log(err))        
    }, [])


    {/* 查询任务状态，任务完成时请求任务结果 */ }
    const checking = (mission_id, index) => {
        var data = { mission_id: mission_id }
        //检查任务是否完成
        IsFinished(data).then(res => {
            if(res.body.status) {
                //任务完成时，终止轮询，请求数据
                if (res.body.data.isDone) {
                    clearInterval(document.checkingTimerInterval);
                    GetResult(data).then(res => {
                        if (res.body.status) {
                            var type = res.body.data.result.type;
                            var value = res.body.data.result.value;
                            var loadingStr;
                            switch(type) {
                                case 'SYN':
                                    loadingStr = 'synLoading';
                                    break;
                                case 'UDP':
                                    loadingStr = 'udpLoading';
                                    break;
                                case 'SHA':
                                    loadingStr = 'shaLoading';
                                    break;
                            }
                            switch (value) {
                                case 'SAFE':
                                    setStates({ ...states[index], [type]: 'primary', [loadingStr]: false });
                                    break;
                                case 'DANGER':
                                    setStates({ ...states[index], [type]: 'secondary', [loadingStr]: false });
                                    break;
                                case 'WAITTING':
                                    setStates({ ...states[index], [type]: 'default', [loadingStr]: false });
                                    break;
                            }
                        } else {
                            console.log(res.body);
                        }
                    }).catch(err => console.log(err));
                }
            } else {
                console.log(res.body);
                clearInterval(document.checkingTimerInterval);
            }
        }).catch(err => console.log(err));
    }

    {/* 创建任务并轮询任务结果 */ }
    const handleClick = (id, ip, mac, type, index) => {
        var data = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: type
        };
        var states_temp = [].concat(states);
        switch(type) {
            case 'SYN':
                states_temp[index].synLoading = true;
                break;
            case 'UDP':
                states_temp[index].udpLoading = true;
                break;
            case 'SHA':
                states_temp[index].shaLoading = true;
                break;
        }
        setStates(states_temp);
        //创建任务
        CreateMission(data).then(res => {
            if (res.body.status) {
                var mission_id = res.body.data.mission_id;
                //轮询，直到任务完成
                document.checkingTimerInterval = setInterval(checking, 2000, mission_id, index);
            } else {
                console.log(res.body);
            }
        }).catch(err => console.log(err));        
    }



    return (
        <Container maxWidth='lg' className={classes.container}>
            {/* {console.log(states,clientList)} */}
            <Paper style={{ height: '85vh' }}>
                <Typography variant='subtitle1' color='primary' className={classes.title}>
                    在线设备洪水攻击测试
                </Typography>
                <Divider />
                <div style={{ height: '75vh', overflowY: 'scroll' }}>
                    {/* {loading && <LinearProgress color='secondary' variant='query' />} */}
                    <List>
                        {clientList.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <ComputerIcon />
                                </ListItemIcon>
                                <ListItemText
                                    style={{ whiteSpace: 'pre' }}
                                    primary={item.client_id}
                                    secondary={`状态:${item.status}    IP地址:${item.ip}    MAC地址:${item.mac}    操作系统:${item.operation_system}`}
                                />
                                <ListItemSecondaryAction>
                                    <MuiThemeProvider theme={theme}>
                                        <Button
                                            variant='contained'
                                            color={states[index].syn}
                                            className={classes.button}
                                            onClick={() => handleClick(item.client_id, item.ip, item.mac, 'SYN', index)}
                                            onMouseEnter={(event) => handleOpenPopover(event,states[index].syn)}
                                            onMouseLeave={handleClosePopover}
                                            disabled={states[index].synLoading}
                                        >
                                            SYN洪水
                                        </Button>
                                        { states[index].synLoading && <CircularProgress size={24} className={classes.buttonProgress} /> }
                                        <Button
                                            variant='contained'
                                            color={states[index].udp}
                                            className={classes.button}
                                            onClick={() => handleClick(item.client_id, item.ip, item.mac, 'UDP', index)}
                                            onMouseEnter={(event) => {handleOpenPopover(event, states[index].udp)}}
                                            onMouseLeave={handleClosePopover}
                                            disabled={states[index].udpLoading}
                                        >
                                            UDP洪水
                                        </Button>
                                        { states[index].udpLoading && <CircularProgress size={24} className={classes.buttonProgress} /> }
                                        <Button
                                            variant='contained'
                                            color={states[index].sha}
                                            className={classes.button}
                                            onClick={() => handleClick(item.client_id, item.ip, item.mac, 'SHA', index)}
                                            onMouseEnter={(event) => {handleOpenPopover(event, states[index].sha)}}
                                            onMouseLeave={handleClosePopover}
                                            disabled={states[index].shaLoading}
                                        >
                                            HTTP长连接
                                        </Button>
                                        { states[index].shaLoading && <CircularProgress size={24} className={classes.buttonProgress} /> }
                                    </MuiThemeProvider>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Paper>
            <Popover
                classes={{ paper: classes.popoverPaper }}
                className={classes.popover}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={handleClosePopover}
            >
                <Typography variant='body2'>
                    {popoverStr}
                </Typography>
            </Popover>
        </Container>
    );
}