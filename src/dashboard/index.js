import React from 'react';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({

}));

export default function Dashboard(props){
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => { setOpen(true); };
    const handleDrawerClose = () => { setOpen(false) };

    return (
       <div>
           <CssBaseline />
            <AppBar position='absolute'>
                <Toolbar>
                    <IconButton 
                        edge='start' 
                        color='inherit' 
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6'>
                        AwesomeDetector
                    </Typography>
                </Toolbar>
            </AppBar>
       </div>
    );
}