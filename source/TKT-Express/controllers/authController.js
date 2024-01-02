const User = require("../models/User");
const bcrypt = require("bcrypt");
const session = require('express-session');
const passport = require('passport');

const controller = {
  getLogin: async (req, res) => {
    try {
      res.status(200).contentType('text/html')
        .render("auth/loginView", {
          layout: "main",
        });
    } catch (error) {
      console.log(error);
      res.status(404);
    }
  },
  postLoginAccount: async (req, res, next) => {
    try {
      const { name, pass } = req.body;

      // Check if name and pass values exist
      if (!name || !pass) {
        return res.status(400).json({
          reaction: false,
          message: "Missing name or pass data",
        });
      }

      // Find the user with the provided username
      const user = await User.findOne({ username: name });

      if (!user) {
        return res.status(401).json({
          exists: true,
          reaction: false,
        });
      }

      // Compare the provided password with the hashed password
      const isPasswordMatch = await bcrypt.compare(pass, user.password);

      if (isPasswordMatch) {
        // Lưu thông tin đăng nhập vào session
        req.session.user = user;

        if (user.role == 'Admin') {
          res.json({ redirectUrl: "/admin/user" });

        }
        if (user.role == 'User') {
          res.json({ redirectUrl: "/home" });

        }
        if (user.role == 'Employee') {
          req.session.user = user
          res.json({ redirectUrl: "/employee" });
        }

      } else {
        res.status(401).json({
          exists: true,
          reaction: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false,
      });
      return;
    }
  },

  getRegister: async (req, res) => {
    try {
      res.status(200).contentType('text/html')
        .render("auth/registerView", {
          layout: "main",
        });
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false
      });
      return;
    }
  },
  postRegister: async (req, res) => {
    try {
      const { name, pass } = req.body;

      // Check if name and pass values exist
      if (!name || !pass) {
        return res.status(400).send({
          reaction: false,
          message: "Missing name or pass data",
        });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(pass, 10);

      // Find the user with the provided username
      const user = await User.findOne({ username: name });

      if (user) {
        return res.status(401).send({
          exists: true,
          reaction: false,
        });
      }
      let providerId = await bcrypt.hash(hashedPassword, 10)
      const userRegister = new User({
        username: name,
        fullname: name,
        location: "locationInput",
        email: '',
        profilePhoto: "http://localhost:3000/images/users/default.jpg",
        provider: "local",
        password: hashedPassword,
        providerId: providerId,
        role: "User",
        phone: "",
      });
      
      const data = await userRegister.save();
      req.session.user = data;
      res.json({ redirectUrl: "/home" });
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false
      });
      return;
    }
  },
  getForgotPassword: async (req, res) => {
    try {
      res.status(200).contentType('text/html')
        .render("auth/registerView", {
          layout: "main",
        });
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false
      });
      return;
    }
  },
  postForgotPassword: async (req, res) => {
    try {
      const { name, pass } = req.body;

      // Check if name and pass values exist
      if (!name || !pass) {
        return res.status(400).send({
          reaction: false,
          message: "Missing name or pass data",
        });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(pass, 10);

      // Find the user with the provided username
      const user = await User.findOne({ username: name });

      if (user) {
        return res.status(401).send({
          exists: true,
          reaction: false,
        });
      }
      let providerId = await bcrypt.hash(hashedPassword, 10)
      const userRegister = new User({
        username: name,
        fullname: name,
        location: "locationInput",
        email: '',
        profilePhoto: "http://localhost:3000/images/users/default.jpg",
        provider: "local",
        password: hashedPassword,
        providerId: providerId,
        role: "User",
        phone: "",
      });
      
      const data = await userRegister.save();
      req.session.user = data;
      res.json({ redirectUrl: "/home" });
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false
      });
      return;
    }
  },
  getLogout: async (req, res) => {
    try {
      req.session.user = null;
      res.status(200).redirect("/auth/login");
    } catch (error) {
      console.log(error);
      res.status(500).render("500", {
        layout: false
      });
      return;
    }
  },
}

module.exports = controller;
