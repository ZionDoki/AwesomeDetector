import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, CircularProgress } from '@material-ui/core';
import { makeStyles, Paper, Button, Typography, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { cyan, green } from '@material-ui/core/colors';
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
    buttonProgress_1: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-10),
      },
    buttonProgress_2: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-9),
      },
    buttonProgress_3: {
        color: green[500],
        position: 'absolute',
        zIndex: 1,
        top: '18%',
        marginLeft: theme.spacing(-8),
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
                                    disabled={ item.p2pDownloadLoading || item.p2pUploadLoading }
                                    className={classes.button} 
                                    onClick={() => onClickP2P(item.client_id, index)} 
                                >
                                    P2P上/下行测速
                                </ColorButton>
                                { item.p2pUploadLoading && <CircularProgress size={22} className={classes.buttonProgress_1} /> }
                                { item.p2pDownloadLoading && <CircularProgress size={22} className={classes.buttonProgress_1} /> }
                                <ColorButton 
                                    size='small' 
                                    variant='contained' 
                                    color='primary' 
                                    disabled={item.pingLoading || item.routerLoading}
                                    className={classes.button} 
                                    onClick={() => onClickPing(item.client_id, item.ip, item.mac, index)} 
                                >
                                    路由跳数/延迟
                                </ColorButton>
                                { item.pingLoading && <CircularProgress size={22} className={classes.buttonProgress_2} /> }
                                { item.routerLoading && <CircularProgress size={22} className={classes.buttonProgress_2} /> }
                                <ColorButton
                                    size='small'
                                    variant='contained'
                                    color='primary'
                                    disabled={item.uploadLoading || item.downloadLoading}
                                    className={classes.button}
                                    onClick={() => onClickTestSpeed(item.client_id, item.ip, item.mac, index)} 
                                >
                                    上/下行测速
                                </ColorButton>
                                { item.uploadLoading && <CircularProgress size={22} className={classes.buttonProgress_3} /> }
                                { item.downloadLoading && <CircularProgress size={22} className={classes.buttonProgress_3} /> }
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