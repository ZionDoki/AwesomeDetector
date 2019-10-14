import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import green from '@material-ui/core/colors/green';
import BackupIcon from '@material-ui/icons/Backup';

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
      backgroundColor: green[400],
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

  export default function UploadSpeed(props) {
      const classes = useStyles();
      const value = props.value;

      return (
        <Card className={classes.root}>
          <CardContent>
            <Grid container justify="space-between">
              <Grid item>
                <Typography className={classes.title} color="textSecondary" gutterBottom variant="subtitle2">
                  当前全网平均上载速率
                </Typography>
                <Typography variant="h5">
                    {`${value}bps`}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar className={classes.avatar}>
                  <BackupIcon className={classes.icon} />
                </Avatar>
              </Grid>
            </Grid>
            {/* <div className={classes.difference}>
              <ArrowDownwardIcon className={classes.differenceIcon} />
              <Typography
                className={classes.differenceValue}
                variant="body2"
              >
                12%
              </Typography>
              <Typography
                color='textSecondary'
                variant="caption"
              >
                Since last month
              </Typography>
            </div> */}
          </CardContent>
        </Card>
      );
  }

  UploadSpeed.propTypes = {
    value: PropTypes.number
  }