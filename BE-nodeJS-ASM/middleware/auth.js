const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra vai trò quản trị viên
module.exports.isAdmin = function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Truy cập bị từ chối' });
  }
  next();
};
