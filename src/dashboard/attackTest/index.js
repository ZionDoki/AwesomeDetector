import React from 'react';
import { makeStyles, Container, Paper, Typography, Divider, Button } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import ComputerIcon from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

export default function AttackTest(props) {
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
    const infoList = [
        'infomation about online device-1',
        'infomation about online device-2',
        'infomation about online device-3',
        'infomation about online device-4',
        'infomation about online device-5',
        'infomation about online device-6',
        'infomation about online device-7',
        'infomation about online device-8',
        'infomation about online device-9',
        'infomation about online device-10',
        'infomation about online device-11',
        'infomation about online device-12',
    ];
    return (
        <Container maxWidth='lg' className={classes.container}>
            <Paper>
                <Typography variant='h5' className={classes.title}>
                    在线设备洪水攻击测试
                </Typography>
                <Divider />
                <List>
                    {onlineMachineList.map((value, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <ComputerIcon />
                            </ListItemIcon>
                            <ListItemText primary={value} secondary={infoList[index]} />
                            <ListItemSecondaryAction>
                                <Button variant='text' color='primary' className={classes.button} >SYN洪水</Button>
                                <Button variant='contained' color='primary' className={classes.button} >UDP洪水</Button>
                                <Button variant='contained' color='primary' >HTTP长连接</Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}