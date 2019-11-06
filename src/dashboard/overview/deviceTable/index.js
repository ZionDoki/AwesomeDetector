import React from 'react';
import { makeStyles, Card, CardHeader, CardContent, Table, TableHead, TableBody, TableRow, TableCell, Divider, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    card: {
        marginTop: theme.spacing(4),
    },
    tableContainer: {
        height: 280,
    },
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#00bcd4',
        color: theme.palette.common.white,
    },
}))(TableCell);

export default function DeviceTable(props) {
    const classes = useStyles();
    const data = props.value;

    return (
        <Card>
            <CardHeader
                title='平均上/下载速率最高的设备'
                titleTypographyProps={{
                    style: {
                        fontSize: 15,
                        fontWeight: 600,
                    },
                }}
            />
            <Divider />
            <CardContent>
                <div className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>设备名称</StyledTableCell>
                                <StyledTableCell>平均上载速率</StyledTableCell>
                                <StyledTableCell>平均下载速率</StyledTableCell>
                                <StyledTableCell>IP地址</StyledTableCell>
                                <StyledTableCell>MAC地址</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index + '-' + row.ip}>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.us}</TableCell>
                                    <TableCell>{row.ds}</TableCell>
                                    <TableCell>{row.ip}</TableCell>
                                    <TableCell>{row.mac}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

DeviceTable.propTypes = {
    value: PropTypes.array
}

DeviceTable.defaultProps = {
    value: [
             {username: 'Machine1', us: '500bps', ds: '480bps', ip: 'IP_Address', mac: 'MAC_Address'},
         ]
}