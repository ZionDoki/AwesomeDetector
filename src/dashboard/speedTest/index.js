import React from 'react';
import { makeStyles, Paper, Container, Button, Typography, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import Computer from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(2),
        // marginLeft: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

export default function SpeedTest(props) {
    const classes = useStyles();
    const { user_key } = props;
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

    return (
        <Container maxWidth='lg' className={classes.container} >
            <Paper>
                <Typography variant='h5' className={classes.title} >
                    在线设备网络测速
                </Typography>
                <Divider />
                <List>
                    {onlineMachineList.map((value, index) => (
                        <ListItem key={index}>
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
