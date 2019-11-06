import React from 'react';
import { makeStyles, Container, Paper, Typography, Divider, Button } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ComputerIcon from '@material-ui/icons/Computer';

import { GetList, CreateMission, IsFinished, GetResult } from '../../api/attackTest';

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
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
    const [id, setId] = React.useState(0);
    const [clientList, setClientList] = React.useState(Array);
    {/* primary表示“安全”，secondary表示“有风险”，default表示“尚未测试” */}
    const [colors, setColors] = React.useState([{
        syn: 'primary',
        udp: 'secondary',
        sha: 'default'
    }]);
    // const [colors, setColors] = React.useState({
    //     syn: 'primary',
    //     udp: 'secondary',
    //     sha: 'default'
    // });


    {/* 获取客户端列表并初始化按钮状态 */}
    React.useEffect(() => {
        GetList().then(res => {
            if(res.body.status) {
                console.log(res.body.data.clients);
                setClientList(res.body.data.clients, () => {
                    var colors_temp = [];
                    console.log(clientList);
                    clientList.map(item => {
                        var obj_temp = {};
                        switch(item.syn) {
                            case 'SAFE':
                                obj_temp.syn('primary');
                                break;
                            case 'DANGER':
                                obj_temp.syn('secondary');
                                break;
                            case 'WAITTING':
                                obj_temp.syn('default');
                                break;
                        };
                        switch(item.udp) {
                            case 'SAFE':
                                obj_temp.udp('primary');
                                break;
                            case 'DANGER':
                                obj_temp.udp('secondary');
                                break;
                            case 'WAITTING':
                                obj_temp.udp('default');
                                break;
                        };
                        switch(item.sha) {
                            case 'SAFE':
                                obj_temp.sha('primary');
                                break;
                            case 'DANGER':
                                obj_temp.sha('secondary');
                                break;
                            case 'WAITTING':
                                obj_temp.sha('default');
                                break;
                        };
                        colors_temp.push(obj_temp);
                    });
                    console.log(colors_temp)
                    // setColors(colors_temp);
                });
            } else {
                props.history.push('/login');
            }
        }).catch(err => console.log(err))
    }, [])


    {/* 查询任务状态，任务完成时请求任务结果 */}
    const checking = (mission_id, index) => {
        var data = {mission_id: mission_id}
        IsFinished(data).then(res => {
            if(res.body.status) {
                if(res.body.data.isDone) {
                    //结束轮询
                    clearInterval(document.checkingTimerInterval);
                    //查询任务结果
                    GetResult(data).then(res => {
                        if(res.body.status) {
                            var type = res.body.data.result.type;
                            var value = res.body.data.result.value;
                            switch(value) {
                                case 'SAFE':
                                    setColors({...colors[index], [type]: 'primary'});
                                    break;
                                case 'DANGER':
                                    setColors({...colors[index], [type]: 'secondary'});
                                    break;
                                case 'WAITTING':
                                    setColors({...colors[index], [type]: 'default'});
                                    break;
                            }
                        } else {
                            props.history.push('/login');
                        }
                    }).catch(err => console.log(err));
                }
            } else {
                props.history.push('/login');
            }
        }).catch(err => console.log(err));
    }

    {/* 创建任务并轮询任务结果 */}
    const handleClick = (id, ip, mac, type, index) => {
        var data = {
            client_id: id,
            ip: ip,
            mac: mac,
            type: type
        };
        var mission_id = -1;
        //创建任务
        CreateMission(data).then(res => {
            if(res.body.status) {
                mission_id = res.body.data.mission_id;
            } else {
                props.history.push('/login');
            }
        }).catch(err => console.log(err));
        //轮询确认是否完成,完成时获取任务结果
        document.checkingTimerInterval = setInterval(checking, 2000, mission_id, index);
    }


   
    return (
        <Container maxWidth='lg' className={classes.container}>
            <Paper style={{height:'85vh'}}>
                <Typography variant='subtitle1' color='primary' className={classes.title}>
                    在线设备洪水攻击测试
                </Typography>
                <Divider />
                <div style={{height:'75vh', overflowY: 'scroll'}}>
                  <List>
                    {clientList.map((item, index) => {
                        console.log(colors)
                        return (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <ComputerIcon />
                            </ListItemIcon>
                            <ListItemText 
                                style={{whiteSpace: 'pre'}}
                                primary={item.client_id}
                                secondary={`状态:${item.status}    IP地址:${item.ip}    MAC地址:${item.mac}    操作系统:${item.operation_system}`} 
                            />
                            <ListItemSecondaryAction>
                              <MuiThemeProvider theme={theme}> 
                                <Button 
                                    variant='contained' 
                                    color={colors[index].syn} 
                                    className={classes.button} 
                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'syn', index)}
                                >
                                    SYN洪水
                                </Button>
                                <Button 
                                    variant='contained' 
                                    color={colors[index].udp} 
                                    className={classes.button} 
                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'udp', index)}
                                >
                                    UDP洪水
                                </Button>
                                <Button 
                                    variant='contained' 
                                    color={colors[index].sha} 
                                    className={classes.button} 
                                    onClick={() => handleClick(item.client_id, item.ip, item.mac, 'sha', index)}
                                >
                                    HTTP长连接
                                </Button>
                              </MuiThemeProvider>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )})}
                  </List>
                </div>
            </Paper>
        </Container>
    );
}