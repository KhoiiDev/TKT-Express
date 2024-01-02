const CheckUser = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (req.session.user) {
    if (req.session.user.role === 'User') {
      next();
    }
    else {
      res.redirect("/auth/login");
    }
  }
  else {
    res.redirect("/auth/login");
  }
};

module.exports = CheckUser;