import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { makeStyles, Paper, Button, Typography, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import Computer from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    button: {
        marginRight: theme.spacing(1),
        color: theme.palette.common.white,
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

export default function ClientList(props) {
    const classes = useStyles();
    const { list, onClickP2P, onClickPing, onClickTestSpeed } = props;
    return (
        <Paper style={{ height: '480px', margin: '10px' }}>
            <Typography variant='subtitle1' className={classes.title} color='primary'>在线设备</Typography>
            <Divider />
            <div style={{ height: '420px', overflowY: 'scroll' }}>
                <List>
                    {list.map((item, index) => (
                        <ListItem key={index} button>
                            <ListItemIcon>
                                <Computer />
                            </ListItemIcon>
                            <ListItemText
                                style={{ whiteSpace: 'pre' }}
                                primary={item.client_id}
                                secondary={`状态:${item.status}   IP地址:${item.ip}   MAC地址:${item.mac}   操作系统:${item.operation_system}`}
                            />
                            <ListItemSecondaryAction>
                                <ColorButton 
                                    size='small' 
                                    variant='contained' 
                                    color='primary' 
                                    className={classes.button} 
                                    onClick={() => onClickP2P(item.client_id, index)} 
                                >
                                    P2P测速
                                </ColorButton>
                                <ColorButton 
                                    size='small' 
                                    variant='contained' 
                                    color='primary' 
                                    className={classes.button} 
                                    onClick={() => onClickPing(item.client_id, item.ip, item.mac)} 
                                >
                                    路由跳数/延迟
                                </ColorButton>
                                <ColorButton
                                    size='small'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    onClick={() => onClickTestSpeed(item.client_id, item.ip, item.mac)} 
                                >
                                    上/下行速度
                                </ColorButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        </Paper>
    );
}
ClientList.propTypes = {
    list: PropTypes.array,
    onClickP2P: PropTypes.func,
    onClickPing: PropTypes.func,
    onClickTestSpeed: PropTypes.func
}