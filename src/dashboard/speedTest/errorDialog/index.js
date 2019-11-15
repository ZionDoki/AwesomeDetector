import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Dialog, DialogContent, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    warning: {
        marginBottom: theme.spacing(2),
        color: red[500],
    },
}));

export default function ErrorDialog(props) {
    const classes = useStyles();
    const { open, handleClose, msg } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                <Typography className={classes.warning}>{msg}</Typography>
            </DialogContent>
        </Dialog>
    );
}

ErrorDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    msg: PropTypes.string
};