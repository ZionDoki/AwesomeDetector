import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell, withStyles, CircularProgress } from '@material-ui/core';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: 290,
    },
    circularProgress_1: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 2,
        top: '22%',
        marginLeft: theme.spacing(-6),
    },
    circularProgress_2: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 2,
        top: '28%',
        marginLeft: theme.spacing(-6),
    }
}));

{/* 自定义Table的样式*/ }
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#66bb6a',
        color: '#fff',
        fontSize: 18,
    },
    body: {
        fontSize: 16,
    },
}))(TableCell);

export default function PingTable(props) {
    const classes = useStyles();
    const { values, pingLoading, routerLoading } = props;
    return (
        <Paper className={classes.paperHeight}>
            <Typography variant='subtitle1' color='primary' className={classes.title}>
                Ping
            </Typography>
            <Paper style={{ margin: '12px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Items</StyledTableCell>
                            <StyledTableCell align='right' >Values</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(row => (
                            <TableRow key={row.name}>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell align='right' >{row.value}</StyledTableCell>
                                { row.name === 'ping' ? ( pingLoading && < CircularProgress size={24} className={classes.circularProgress_1} /> ) : ( routerLoading && < CircularProgress size={24} className={classes.circularProgress_2} /> ) }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Paper>
    );
}
PingTable.propTypes = {
    values: PropTypes.array,
    pingLoading: PropTypes.bool,
    routerLoading: PropTypes.bool,
}
