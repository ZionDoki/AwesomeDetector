import React from 'react';
import clsx from 'clsx';
import { Switch, Route } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography,  Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LayersIcon from '@material-ui/icons/Layers';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import SpeedTest from './speedTest';
import AttackTest from './attackTest';
import Manage from './manage';
import reactLogo from './reactlogo.png';
import sideImg from './sideImg.jpg';


const drawerWidth = 240;
const drawerCloseWidth = 60;

const styles = {
    root: {
        display: 'flex',
    },
    appBar: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        boxShadow: 'none',
        backgroundColor: '#fafafa',
    },
    appBarShift: {
        width: `calc(100% - ${drawerCloseWidth}px)`,
    },
    menuButton: {
        marginRight: 10,
    },
    menuButtonClose: {
        display: 'none',
    },
    drawerButton: {
        marginRight: 10
    },
    drawerButtonClose: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        border: 'none',
        backgroundImage: `url(${sideImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    },
    drawerPaperClose: {
        overflow: 'hidden', //避免侧边栏关闭时，下方出现滚动条
        width: drawerCloseWidth,
    },
    transparentBox: {
        backgroundColor: '#000',
        opacity: '.8',
        height: '100%'
    },
    drawerHead: {
        display: 'inline-block',
        height: 63,
        // ...theme.mixins.toolbar, //令侧边栏关闭按钮与导航栏等高
    },
    logo: {
        width: "50px",
        top: "15px",
        position: "absolute",
        marginLeft: 5,
    },
    drawerHeader: {
        marginLeft: '60px', 
        marginTop: '17px',
        color: '#FFF',
    },
    content: {
        height: '100vh',
        flexGrow: 1,
        overflow: 'scroll',
    },
    appBarSpacer: {
        paddingBottom: 60
    },
};

class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            open: true,

        };
    }

    componentDidMount() {
        if(!this.props.user_key) {
            if(localStorage.getItem('local_key') != null)
                this.props.setKey(localStorage.getItem('local_key'));
            else 
                this.props.history.push('/login');
        }
    }

    Logout = () => {
        this.props.signOut();
        this.props.history.push('/login');
    }

    
    render() {
        const {classes} = this.props;
        const { user_key, match, history } = this.props;
        const { open } = this.state;
        const handleDrawerOpen = () => { this.setState({open: true}); };
        const handleDrawerClose = () => { this.setState({open: false}) };
        const handleClick = link_url => history.push(link_url);  
        const title = () => {
            switch(window.location.pathname) {
                case '/dashboard':
                    return '主页总览';
                case '/dashboard/attack':
                    return '洪水攻击测试';
                case '/dashboard/manage':
                    return '用户管理';
            }
        };

        return (
            <div className={classes.root}>
                <CssBaseline />
                 <AppBar 
                     position='absolute'
                     className={ clsx(!open && classes.appBarShift, classes.appBar) }
                     color='inherit'
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
                         <IconButton
                            edge='start'
                            color='inherit'
                            className={ clsx(classes.drawerButton, !open && classes.drawerButtonClose) }
                            onClick={ handleDrawerClose }
                         >
                             <ChevronLeftIcon />
                         </IconButton>
                         <Typography variant='h6' className={classes.title}>
                             {title()}
                         </Typography>
                         <IconButton
                             edge='end'
                             color='inherit'
                             onClick={this.Logout}
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
                  <div className={classes.transparentBox}>
                     <div className={classes.drawerHead}>
                         <img src={reactLogo} alt='logo' className={classes.logo} />
                         <Typography variant='h6' className={classes.drawerHeader} >
                             AwesomeDetector
                         </Typography>
                     </div>
                     <List>
                         <ListItem button component='button' onClick={ () => handleClick(`${match.url}`) }>
                             <ListItemIcon style={{color: '#FFF'}} >
                                 <BarChartIcon />
                             </ListItemIcon>
                             <ListItemText primary='网络测速' style={{color: '#FFF'}} />
                         </ListItem>
                         <ListItem button component='button' onClick={ () => handleClick(`${match.url}/attack`) } >
                             <ListItemIcon style={{color: '#FFF'}}>
                                 <LayersIcon />
                             </ListItemIcon>
                             <ListItemText primary='洪水攻击测试' style={{color: '#FFF'}} />
                         </ListItem>
                         <ListItem button component='button' onClick={ () => handleClick(`${match.url}/manage`) } >
                             <ListItemIcon style={{color: '#FFF'}}>
                                 <PeopleIcon />
                             </ListItemIcon>
                             <ListItemText primary='用户管理' style={{color: '#FFF'}} />
                         </ListItem>
                     </List>
                     {/* <div className={classes.background} style={{backgroundImage: "url(" + sideImg + ")"}} /> */}
                   </div>
                 </Drawer>
                 <main className={classes.content}>
                    <div className={classes.appBarSpacer} /> 
                         <Switch>
                             <Route exact path={`${match.url}`} render={() => <SpeedTest history={history} match={match} user_key={user_key} />} />
                             <Route path={`${match.url}/attack`} render={() => <AttackTest history={history} match={match} user_key={user_key} />} />
                             <Route path={`${match.url}/manage`} render={() => <Manage history={history} match={match} user_key={user_key} />} />
                         </Switch> 
                 </main>
            </div>
         );
    }

}

export default withStyles(styles)(Dashboard);