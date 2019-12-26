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
        top: '26%',
        marginLeft: theme.spacing(-8),
    },
    circularProgress_2: {
        color: cyan[500],
        position: 'absolute',
        zIndex: 2,
        top: '32%',
        marginLeft: theme.spacing(-8),
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
    const { values, pingLoading, routerLoading, clientId } = props;

    return (
        <Paper className={classes.paperHeight}>
            <Typography variant='subtitle1' color='primary' className={classes.title}>
                Ping
            </Typography>
            <div style={{ margin: '12px' }}>
                <Typography variant='subtitle1' align='center' gutterBottom>
                    客户端{clientId}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Items</StyledTableCell>
                            <StyledTableCell align='center' >Values</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map((row, index) => (
                            <TableRow key={row.name}>
                                <StyledTableCell align='center'>{row.name}</StyledTableCell>
                                <StyledTableCell align='right' >{ (row.value && index === 0 ) ? row.value + 'ms' : row.value}</StyledTableCell>
                                <td>{row.name === 'ping' ? ( 
                                        pingLoading && < CircularProgress size={24} className={classes.circularProgress_1} /> 
                                    ) : ( 
                                        routerLoading && < CircularProgress size={24} className={classes.circularProgress_2} /> 
                                    ) }
                                </td>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
}
PingTable.propTypes = {
    values: PropTypes.array,
    pingLoading: PropTypes.bool,
    routerLoading: PropTypes.bool,
}
