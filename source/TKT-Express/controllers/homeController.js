const controller = {
  getHome: async (req, res) => {
    try {
      // if (req.isAuthenticated()) {
        // User is authenticated, render dashboard with user information
        res.status(200).contentType("text/html").render("client/home", {
          user: req.user,
          layout: "clientLayout",
        });
      // } else {
      //   // User is not authenticated, redirect to login page
      //   res.redirect("/login");
      // }
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false,
      });
      return;
    }
  },
  getNotifications: async (req, res) => {
    try {
      res.status(200).contentType("text/html").render("client/home", {
        layout: "clientLayout",
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false,
      });
      return;
    }
  },
};

module.exports = controller;
