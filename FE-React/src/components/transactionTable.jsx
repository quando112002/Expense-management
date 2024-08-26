
import'../css/transactionTable.css'
function TransactionTable() {
  return (
    <div className="transaction-table">
      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Date</th>
            <th>Status</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>REITS</td>
            <td>07 Mar</td>
            <td>Opening Balance</td>
            <td>-</td>
            <td>Groceries</td>
            <td>Balance Adjustment</td>
            <td>$1,000.00</td>
          </tr>
          {/* Thêm các dòng khác nếu cần */}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
