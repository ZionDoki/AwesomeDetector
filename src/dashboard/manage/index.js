import React from 'react';
import { Container, Paper, Typography, TextField, Button, makeStyles, Grid, InputAdornment, IconButton, Divider } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    title: {
        padding: theme.spacing(2),
    },
    form: {
        margin: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(3, 0),
    },
}));

export default function Manage(props) {
    const classes = useStyles();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth='lg' className={classes.container}>
            <Paper>
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <Typography variant='h5' className={classes.title} >
                            创建新用户
                        </Typography>
                        <form className={classes.form}>
                            <TextField 
                                required
                                id='username'
                                label='用户名'
                                name='username'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountCircle />
                                      </InputAdornment>
                                    ),
                                  }}
                            />
                            <TextField 
                                required
                                id='password'
                                label='密码'
                                name='password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                // edge='end'
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                required
                                id='confirmed-password'
                                label='确认密码'
                                name='confirmed-password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'Text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.button}>
                                创建用户
                            </Button>
                        </form>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <Typography variant='h5' className={classes.title} >
                            修改密码
                        </Typography>
                        <form className={classes.form}>
                            <TextField 
                                required
                                id='username'
                                label='用户名'
                                name='username'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountCircle />
                                      </InputAdornment>
                                    ),
                                  }}
                            />
                            <TextField 
                                required
                                id='password'
                                label='当前密码'
                                name='password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                // edge='end'
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                required
                                id='new-password'
                                label='新密码'
                                name='new-password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'Text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                required
                                id='confirmed-password'
                                label='确认密码'
                                name='confirmed-password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'Text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.button}>
                                修改密码
                            </Button>
                        </form>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container>
                    <Grid item lg={6} md={8} xs={12}>
                        <Typography variant='h5' className={classes.title} >
                            删除用户
                        </Typography>
                        <form className={classes.form}>
                            <TextField 
                                required
                                id='username'
                                label='用户名'
                                name='username'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <AccountCircle />
                                      </InputAdornment>
                                    ),
                                  }}
                            />
                            <TextField 
                                required
                                id='password'
                                label='密码'
                                name='password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                // edge='end'
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button type='submit' fullWidth variant='contained' color='secondary' className={classes.button}>
                                删除用户
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}