import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import { formatCurrency } from "../../Supports/Convert";

const ExpenseReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const fetchReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports', {
        params: { startDate, endDate },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReport(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err.message);
      setError('Error fetching report. Please try again.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">Generate Expense Report</Typography><br/>
      <form noValidate autoComplete="off">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 16 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 16 }}
        />
        <Button variant="contained" color="primary" onClick={fetchReport} style={{marginTop:"10px"}}>
          Generate Report
        </Button>
      </form>
      {error && (
        <Typography color="error" style={{ marginTop: 16 }}>
          {error}
        </Typography>
      )}
      {report && (
        <div style={{ marginTop: 16 }}>
          <Typography variant="h6">Expense Report</Typography>
          <Typography variant="subtitle1">Total Amount: {formatCurrency(report.totalAmount)}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.categories && Object.keys(report.categories)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell align="right">{formatCurrency(report.categories[category])}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={Object.keys(report.categories).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </Paper>
  );
};

export default ExpenseReport;
