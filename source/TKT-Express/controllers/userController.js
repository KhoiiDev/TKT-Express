const User = require("../models/User");
const bcrypt = require("bcrypt");

const controller = {
  getList: async (req, res) => {
    try {
      const user = await User.find({});

      res.status(200).contentType("text/html").render("admin/userView", {
        layout: "adminLayout",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).contentType("text/html").render("500", {
        layout: false,
      });
    }
  },

  postCreate: async (req, res) => {
    try {
      const { username, password, CfPassword, role } = req.body;

      if (
        !req.file &&
        username.trim() === "" &&
        password.trim() === "" &&
        role.trim() === ""
      ) {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }
      const fileName = req.file.filename;

      const truck = await User.findOne({ username: username });

      if (truck) {
        res.status(400).send({
          exists: true,
          reaction: false,
          message: "Error database",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let providerId = await bcrypt.hash(username, 10);

      const Data = new User({
        username: username,
        fullname: username, // Add 'fullname' field
        location: "VietNam",
        email: username,
        profilePhoto: "http://localhost:3000/images/users/" + fileName,
        provider: "local",
        providerId: providerId,
        password: hashedPassword,
        role: role,
      });

      await Data.save();

      res.status(200).send({
        reaction: true,
        data: Data,
      });
      console.log("hello world");
    } catch (error) {
      console.log(error);
      res.status(500).send({
        reaction: false,
      });
      return;
    }
  },

  postUpdate: async (req, res) => {
    try {
      let { role, filedName, id } = req.body;

      if (role.trim() === "" && id.trim() === "") {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }
      if (req.file) {
        filedName = "http://localhost:3000/images/users/" + req.file.filename;
      }

      const update = {
        role: role,
        profilePhoto: filedName,
      };
      const updatedData = await User.findByIdAndUpdate(id, update, {
        new: true,
        upsert: true,
      });

      if (!updatedData) {
        res.status(400).send({
          reaction: false,
          message: "Error updating employee",
        });
        return;
      }

      res.status(200).send({
        reaction: true,
        message: "Employee updated successfully",
        data: updatedData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        reaction: false,
        message: "Internal server error",
      });
      return;
    }
  },

  postDelete: async (req, res) => {
    try {
      let { id } = req.body;

      if (id.trim() === "") {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }

      const deletedData = await User.findByIdAndDelete(id);

      if (!deletedData) {
        res.status(400).send({
          reaction: false,
          message: "Error deleting",
        });
        return;
      }

      res.status(200).send({
        reaction: true,
        message: "Deleted successfully",
        data: deletedData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        reaction: false,
        message: "Internal server error",
      });
      return;
    }
  },
  logout: async (req, res) => {
    try {
      req.session.user = null;
      res.status(200).redirect("/auth/login");
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
