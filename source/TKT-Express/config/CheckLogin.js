const CheckLogin = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (req.session.user) {
      next();
    }
    else {
      res.redirect("/auth/login");
    }
  };
  
  module.exports = CheckLogin;