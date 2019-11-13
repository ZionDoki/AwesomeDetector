import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell, withStyles } from '@material-ui/core';
import { makeStyles, Paper, Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    title: {
        padding: theme.spacing(1),
        fontWeight: 600,
    },
    paperHeight: {
        height: 290,
    },
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
    const { values } = props;
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Paper>
    );
}
PingTable.propTypes = {
    values: PropTypes.array
}
PingTable.defaultProps = {
    values: [
        {name: 'ping', value: '__'},
        {name: 'routers', value: '__'}
    ]
}