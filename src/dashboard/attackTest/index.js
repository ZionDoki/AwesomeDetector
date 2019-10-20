import React from 'react';
import { makeStyles, withStyles, Container, Paper, Typography, Divider, Button, Modal, Backdrop, Fade } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, createMuiTheme } from '@material-ui/core';
import { Card, CardHeader, CardContent } from '@material-ui/core';
// import { ThemeProvider } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';
import ComputerIcon from '@material-ui/icons/Computer';

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
        color: theme.palette.common.white,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        // border: '5px solid #fff',
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 10, 2),
    },
}));

// const theme = createMuiTheme({
//     palette: {
//         primary: cyan,
//     },
// });

const ColorButton = withStyles(theme => ({
    root: {
        backgroundColor: cyan[500],
        '&:hover': {
            backgroundColor: cyan[700]
        },
    },
}))(Button);

export default function AttackTest(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [num, setNum] = React.useState(0);
    const traffic = 500;
    const onlineMachineList = [
        {name:'Machine-1', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-2', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-3', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-4', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-5', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-6', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-7', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-8', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-9', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-10', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
        {name:'Machine-11', ip:'ip_address', mac: 'mac_address', os: '操作系统类型' },
    ];
    const handleOpen = (index) => {
       setOpen(true);
       setNum(index);
    };
    const handleClose = () => {setOpen(false)};

   
    return (
        <Container maxWidth='lg' className={classes.container}>
            <Paper style={{height:'85vh'}}>
                <Typography variant='subtitle1' color='primary' className={classes.title}>
                    在线设备洪水攻击测试
                </Typography>
                <Divider />
                <div style={{height:'75vh', overflowY: 'scroll'}}>
                  <List>
                    {onlineMachineList.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <ComputerIcon />
                            </ListItemIcon>
                            <ListItemText primary={item.name} secondary={`IP地址：${item.ip} MAC地址：${item.mac} 操作系统：${item.os}`} />
                            <ListItemSecondaryAction>
                              {/* <ThemeProvider theme={theme}> */}
                                <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handleOpen(index)} >SYN洪水</ColorButton>
                                <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handleOpen(index)} >UDP洪水</ColorButton>
                                <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handleOpen(index)} >HTTP长连接</ColorButton>
                              {/* </ThemeProvider> */}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                  </List>
                </div>
                <Modal
                    aria-labelledby="SYN-modal"
                    aria-describedby="SYN-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 300,
                        style: {
                            // opacity: 0.5,
                        },
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <Card style={{padding:'10px 30px'}}>
                                <CardHeader title='测试结果' />
                                <CardContent>
                                    <h3>当前设备信息</h3>
                                    <p style={{whiteSpace: 'pre'}}>设备名称：{onlineMachineList[num].name}      IP地址：{onlineMachineList[num].ip}</p>
                                    <p style={{whiteSpace: 'pre'}}>MAC地址：{onlineMachineList[num].mac}      操作系统：{onlineMachineList[num].os}</p>
                                    <h3>当前流量</h3>
                                    <p>{traffic}</p>
                                </CardContent>
                            </Card>

                        </div>
                    </Fade>
                </Modal>
            </Paper>
        </Container>
    );
}