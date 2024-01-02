const Employee = require("../models/Employee");
const User = require("../models/User");

const controller = {
  getView: async (req, res) => {
    try {
      res.status(200).contentType("text/html").render("client/profileView", {
        user: req.session.user,
        layout: "clientLayout",
      });
    } catch (error) {
      console.log(error);
      res.status(500).contentType("text/html").render("500", {
        layout: false,
      });
    }
  },

  postUpdate: async (req, res) => {
    try {
      let { fullname, gender, phone, location, email } = req.body;

      if (
        email.trim() === "" &&
        fullname.trim() === "" &&
        gender.trim() === "" &&
        phone.trim() === "" &&
        location.trim() === ""
      ) {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }
      let fileName;
      if (req.file) {
        fileName = "http://localhost:3000/images/users/" + req.file.filename;
      } else {
        fileName = req.session.user.profilePhoto;
      }
      if (req.session.user) {
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          {
            fullname: fullname,
            phone: phone,
            gender: gender,
            location: location,
            email: email,
            profilePhoto: fileName,
          },
          { new: true, upsert: true }
        );

        req.session.user = user;
        if (!user) {
          res.status(400).send({
            errorData: true,
            reaction: false,
            message: "Error database",
          });
          return;
        }
        //flash message

        req.toastr.success("Successfully logged in.", "You're in!");
        res.status(200).redirect("/profile");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        reaction: false,
        message: "Internal server error",
      });
      return;
    }
  },
};

module.exports = controller;
