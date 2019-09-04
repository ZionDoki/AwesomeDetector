import React from 'react';
import clsx from 'clsx';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, makeStyles, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LayersIcon from '@material-ui/icons/Layers';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        
    },
    appBarShift: {
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonClose: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
    },
    drawerPaperClose: {
        width: theme.spacing(7),
    },
    drawerCloseButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 8px',
        alignItems: 'center', 
        ...theme.mixins.toolbar,
    }
}));

export default function Dashboard(props){
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => { setOpen(true); };
    const handleDrawerClose = () => { setOpen(false) };
    const { user_key, setKey, signOut } = props;

    return (
       <div>
           <CssBaseline />
            <AppBar 
                position='absolute'
                className={ clsx(!open && classes.appBarShift, classes.appBar) }
            >
                <Toolbar>
                    <IconButton 
                        edge='start' 
                        color='inherit' 
                        onClick={ handleDrawerOpen }
                        className={ clsx(classes.menuButton, open && classes.menuButtonClose) }
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6' className={classes.title}>
                        AwesomeDetector
                    </Typography>
                    <IconButton
                        edge='end'
                        color='inherit'
                        onClick={ signOut }
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant='permanent'
                open={open}
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
            >
                <div className={classes.drawerCloseButton}>
                    <IconButton
                        onClick={ handleDrawerClose }
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button component='a' href='/dashboard'>
                        <ListItemIcon>
                            <BarChartIcon />
                        </ListItemIcon>
                        <ListItemText primary='测速' />
                    </ListItem>
                    <ListItem button component='a' href='/dashboard/attack'>
                        <ListItemIcon>
                            <LayersIcon />
                        </ListItemIcon>
                        <ListItemText primary='洪水攻击测试' />
                    </ListItem>
                    <ListItem button component='a' href='/dashboard/management'>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary='用户管理' />
                    </ListItem>
                </List>
            </Drawer>
       </div>
    );
}