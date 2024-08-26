
const User = require("../model/User");
const Expense = require("../model/Expense");

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserExpenses = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const expenses = await Expense.find({ user: userId });

    if (expenses.length === 0) {
      return res.status(404).json({ msg: "No expenses found for this user" });
    }

    // Trả về danh sách chi tiêu
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Xóa một người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await user.deleteOne({ _id: req.params.id });
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
