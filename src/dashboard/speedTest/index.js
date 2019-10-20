import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, withStyles, createMuiTheme } from '@material-ui/core';
import { makeStyles, Paper, Container, Button, Typography, Divider, Grid} from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend } from 'recharts';
import Computer from '@material-ui/icons/Computer';

import { GetList, GetClientInfo } from '../../api/speedTest';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
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
    paperHeight: {
        height: 290,
    },
}));

{/* 自定义Table的样式*/}
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#66bb6a',
        color: '#fff',
        fontSize: 18,
    },
    body: {
        fontSize: 16,
    },
}))(TableCell);

// const theme = createMuiTheme({
//     palette: {
//       primary: cyan,
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

export default function SpeedTest(props) {
    const classes = useStyles();
    const { history } = props;
    const [onlineMachineList, setOnlineMachineList] = React.useState(Array);
 
    const data = [
        {time: '12:00', us: 300, ds: 500},
        {time: '12:01', us: 350, ds: 500},
        {time: '12:02', us: 300, ds: 520},
        {time: '12:03', us: 320, ds: 420},
        {time: '12:04', us: 360, ds: 480},
        {time: '12:05', us: 400, ds: 522},
        {time: '12:06', us: 413, ds: 532},
        {time: '12:07', us: 413, ds: 532},
        {time: '12:08', us: 393, ds: 552},
    ];
    const [values, setValues] = React.useState([
        {name: 'ping', value: '__'},
        {name: 'routers', value: '__'},
    ]);

    {/* 获取客户端列表 */}
    React.useEffect(() => {
        GetList().then(res => {
            if(res.body.status) {
                console.log(res.body.data.clients);
                setOnlineMachineList(res.body.data.clients);
            } else {
                console.log(res.body.status);
                history.push('/login');
            }
        }).catch( err => console.log(err) );
    }, []);

    {/* 请求延迟和路由跳数 */}
    const handlePing = id => {
        GetClientInfo(id).then(res => {
            if(res.body.status){
                console.log(res.body.data);
                setValues(res.body.data.client_info);
            } else {
                console.log(res.body.status);
                history.push('/login')
            }
        }).catch( err => console.log(err) );
    }

    {/* 请求上下行速率 */}
    const handleTestSpeed = id => {

    }
    

    return (
        <Container maxWidth='lg' className={classes.container} >
                <Grid container spacing={2} className={classes.dataDisplay}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper className={classes.paperHeight}>
                            {/* <React.Fragment> */}
                                <Typography  color='primary' variant='subtitle1' className={classes.title} >
                                    上/下行速度
                                </Typography> 
                                {/* <Divider /> */}
                                <ResponsiveContainer width='90%' height='83%'>
                                    <LineChart data={data} margin={{top: 10, right: 10, bottom: 5, left: 20}}>
                                        <Line unit='bps' name='上行速率' type='monotone' dataKey='us' stroke='#00bcd4' />
                                        <Line unit='bps' name='下行速率' type='monotone' dataKey='ds' stroke='#8884d8' />
                                        <XAxis dataKey='time'>
                                            <Label value='时间' position='insideBottomRight' offset={-7} />
                                        </XAxis>
                                        <YAxis label={{value: '速率', position: 'insideLeft', offset: -2}} />
                                        <Tooltip />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            {/* </React.Fragment> */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={classes.paperHeight}>
                            <Typography variant='subtitle1' color='primary' className={classes.title}>
                                Ping
                            </Typography> 
                            {/* <Divider /> */}
                            <Paper style={{margin: '12px'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Items</StyledTableCell>
                                            <StyledTableCell align='right' >Values</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {values.map(row => (
                                            <TableRow key={row.name}>
                                                <StyledTableCell>{row.name}</StyledTableCell>
                                                <StyledTableCell align='right' >{row.value}</StyledTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>    
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container className={classes.dataDisplay}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Paper style={{height: '480px', margin: '10px'}}>
                            <Typography variant='subtitle1' className={classes.title} color='primary'>在线设备</Typography>
                            <Divider />
                            <div style={{height: '420px', overflowY: 'scroll'}}>
                                <List>
                                    {onlineMachineList.map((item, index) => (
                                        <ListItem key={index} button>
                                            <ListItemIcon>
                                                <Computer />
                                            </ListItemIcon>
                                            <ListItemText 
                                                style={{whiteSpace: 'pre'}}
                                                primary={item.client_id}
                                                secondary={`状态:${item.status}    IP地址:${item.ip}    MAC地址:${item.mac}    操作系统:${item.operation_system}`} 
                                            />
                                            <ListItemSecondaryAction>
                                                {/* <ThemeProvider theme={theme}> */}
                                                    <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handlePing(item.client_id)} >路由跳数 延迟</ColorButton>
                                                    <ColorButton variant='contained' color='primary' className={classes.button} onClick={() => handleTestSpeed(item.client_id)} >上/下行速度</ColorButton>
                                                {/* </ThemeProvider> */}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))} 
                                </List>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
        </Container>
    );
}
