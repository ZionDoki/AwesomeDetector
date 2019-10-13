import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar, makeStyles } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ComputerIcon from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    },
    content: {
      alignItems: 'center',
      display: 'flex'
    },
    title: {
      fontWeight: 550
    },
    avatar: {
      backgroundColor: '#00bcd4',
      height: 56,
      width: 56
    },
    icon: {
      height: 32,
      width: 32
    },
    difference: {
      marginTop: theme.spacing(2),
      display: 'flex',
      alignItems: 'center'
    },
    differenceIcon: {
      color: theme.palette.error.dark
    },
    differenceValue: {
      color: theme.palette.error.dark,
      marginRight: theme.spacing(1)
    }
  }));

  export default function OnlineDevice(props) {
      const classes = useStyles();
      const value = props.value;

      return (
        <Card className={classes.root}>
          <CardContent>
            <Grid container justify="space-between">
              <Grid item>
                <Typography className={classes.title} color="textSecondary" gutterBottom variant="subtitle2">
                  在线设备数量
                </Typography>
                <Typography variant="h5">
                    {value}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar className={classes.avatar}>
                  <ComputerIcon className={classes.icon} />
                </Avatar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
  }