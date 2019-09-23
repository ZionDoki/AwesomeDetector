import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, withStyles } from '@material-ui/core';
import { makeStyles, Paper, Container, Button, Typography, Divider, Grid} from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label, Tooltip, Legend } from 'recharts';
import Computer from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(1),
        // marginLeft: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(2),
    },
    dataDisplay: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        justifyContent: 'center',
    },
    paperHeight: {
        height: 290,
    },
    table: {

    },
}));

{/* 自定义TableHead的样式*/}
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#2196f3',
        color: '#fff',
        fontSize: 15,
    },
    body: {
        backgroundColor: '#42a5f5',
        color: '#fff',
    },
}))(TableCell);

export default function SpeedTest(props) {
    const classes = useStyles();
    const onlineMachineList = [
        'Machine-1',
        'Machine-2',
        'Machine-3',
        'Machine-4',
        'Machine-5',
        'Machine-6',
        'Machine-7',
        'Machine-8',
        'Machine-9',
        'Machine-10',
        'Machine-11',
        'Machine-12',
    ];
    const data = [
        {time: '12:00', us: 300, ds: 500},
        {time: '12:01', us: 350, ds: 500},
        {time: '12:02', us: 400, ds: 520},
        {time: '12:03', us: 320, ds: 420},
        {time: '12:04', us: 360, ds: 480},
        {time: '12:05', us: 400, ds: 522},
        {time: '12:06', us: 413, ds: 532},
        {time: '12:07', us: 413, ds: 532},
        {time: '12:08', us: 393, ds: 552},
    ];
    const values = [
        {name: 'Ping', value: 'value1'},
        {name: '路由跳数', value: 'value2'},
        {name: '延迟', value: 'value3'},
    ];


    return (
        <Container maxWidth='lg' className={classes.container} >
            <Paper>
                <Typography component='h4' variant='h6' className={classes.title} >
                    在线设备网络测速
                </Typography>
                <Divider />
                <Grid container spacing={3} className={classes.dataDisplay}>
                    <Grid item xs={12} md={8} lg={8}>
                        <Paper className={classes.paperHeight}>
                            {/* <React.Fragment> */}
                                <Typography  color='primary' component='h4' variant='h6' className={classes.title} >
                                    上/下行速度
                                </Typography> 
                                <ResponsiveContainer width='90%' height='83%'>
                                    <LineChart data={data} margin={{top: 10, right: 10, bottom: 5, left: 20}}>
                                        <Line unit='bps' name='上行速率' type='monotone' dataKey='us' stroke='#556cd6' />
                                        <Line unit='bps' name='下行速率' type='monotone' dataKey='ds' stroke='#ff5722' />
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
                    <Grid item xs={12} md={3} lg={3}>
                        <Paper className={classes.paperHeight}>
                            <Typography component='h4' variant='h6' color='primary' className={classes.title}>
                                Ping
                            </Typography> 
                            <Paper style={{margin: '12px'}}>
                                <Table className={classes.table}>
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
                <List>
                    {onlineMachineList.map((value, index) => (
                       <ListItem key={index} button>
                            <ListItemIcon>
                                <Computer />
                            </ListItemIcon>
                            <ListItemText primary={value} secondary='Information about online devices' />
                            <ListItemSecondaryAction>
                                <Button variant='outlined' color='primary' className={classes.button} >Ping 路由跳数 延迟</Button>
                                <Button variant='outlined' color='primary' >上/下行速度</Button>
                            </ListItemSecondaryAction>
                       </ListItem>
                    ))} 
                </List>
            </Paper>
        </Container>
    );
}
