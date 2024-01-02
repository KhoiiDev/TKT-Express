const Employee = require("../models/Employee");
const Order = require("../models/Order");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const controller = {
  getList: async (req, res) => {
    try {
      const orders = await Order.find();

      res.status(200).contentType("text/html").render("admin/orderView", {
        layout: "adminLayout",
        orders: orders,
      });
    } catch (error) {
      console.log(error);
      res.status(500).contentType("text/html").render("500", {
        layout: false,
      });
    }
  },

  //   postCreate: async (req, res) => {
  //     try {
  //       const { nameInput, positionInput, phoneInput, emailInput, workplace } =
  //         req.body;

  //       if (
  //         !req.file &&
  //         workplace.trim() === "" &&
  //         nameInput.trim() === "" &&
  //         positionInput.trim() === "" &&
  //         emailInput.trim() === "" &&
  //         phoneInput.trim() === ""
  //       ) {
  //         res.status(400).send({
  //           errorData: true,
  //           reaction: false,
  //           message: "Error post data",
  //         });
  //         return;
  //       }

  //       const fileName = req.file.filename;

  //       const employee = await Employee.findOne({ name: nameInput });

  //       if (employee) {
  //         res.status(400).send({
  //           exists: true,
  //           reaction: false,
  //           message: "Error database",
  //         });
  //         return;
  //       }
  //       let providerId = await bcrypt.hash(nameInput, 10);

  //       const characters =
  //         "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //       let randomString = "";

  //       for (let i = 0; i < 10; i++) {
  //         const randomIndex = Math.floor(Math.random() * characters.length);
  //         randomString += characters.charAt(randomIndex);
  //       }
  //       const hashedPassword = await bcrypt.hash(randomString, 10);

  //       const account = new User({
  //         username: nameInput,
  //         fullname: nameInput, // Add 'fullname' field
  //         location: "VietNam",
  //         email: emailInput,
  //         profilePhoto: "http://localhost:3000/images/users/default.jpg",
  //         provider: "local",
  //         providerId: providerId,
  //         password: hashedPassword,
  //         role: "Employee",
  //       });

  //       await account.save();

  //       const transporter = nodemailer.createTransport({
  //         host: "smtp.gmail.com",
  //         port: 587,
  //         secure: false,
  //         auth: {
  //           user: process.env.EMAIL_USERNAME,
  //           pass: process.env.EMAIL_PASS,
  //         },
  //       });

  //       const info = await transporter.sendMail({
  //         from: '"TKT Express" leminhkhoitdtu@gmail.com', // sender address
  //         to: `${emailInput}`, // list of receivers
  //         subject: "New Account", // Subject line
  //         text: "Hello", // plain text body
  //         html: `<p><b>Your username is ${emailInput} </b></p>
  //                         <p><b>Your Password is ${randomString} </b></p>`,
  //       });

  //       const employeeData = new Employee({
  //         name: nameInput,
  //         userID: account._id,
  //         position: positionInput,
  //         image: fileName,
  //         phoneNumber: phoneInput,
  //         email: emailInput,
  //         workplace: workplace,
  //       });

  //       await employeeData.save();

  //       res.status(200).send({
  //         reaction: true,
  //         employee: employeeData,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).send({
  //         reaction: false,
  //       });
  //       return;
  //     }
  //   },

  //   postUpdate: async (req, res) => {
  //     try {
  //       let {
  //         nameInput,
  //         positionInput,
  //         phoneInput,
  //         filedName,
  //         id,
  //         emailInput,
  //         workplace,
  //       } = req.body;

  //       if (
  //         nameInput.trim() === "" &&
  //         positionInput.trim() === "" &&
  //         phoneInput.trim() === "" &&
  //         emailInput.trim() === ""
  //       ) {
  //         res.status(400).send({
  //           errorData: true,
  //           reaction: false,
  //           message: "Error post data",
  //         });
  //         return;
  //       }
  //       if (req.file) {
  //         filedName = req.file.filename;
  //       }

  //       const update = {
  //         name: nameInput,
  //         position: positionInput,
  //         image: filedName,
  //         phoneNumber: phoneInput,
  //         email: emailInput,
  //         workplace: workplace,
  //       };
  //       const updatedEmployee = await Employee.findByIdAndUpdate(id, update, {
  //         new: true,
  //         upsert: true,
  //       });

  //       if (!updatedEmployee) {
  //         res.status(400).send({
  //           reaction: false,
  //           message: "Error updating employee",
  //         });
  //         return;
  //       }

  //       res.status(200).send({
  //         reaction: true,
  //         message: "Employee updated successfully",
  //         employee: updatedEmployee,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).send({
  //         reaction: false,
  //         message: "Internal server error",
  //       });
  //       return;
  //     }
  //   },

  //   postDelete: async (req, res) => {
  //     try {
  //       let { id } = req.body;

  //       if (id.trim() === "") {
  //         res.status(400).send({
  //           errorData: true,
  //           reaction: false,
  //           message: "Error post data",
  //         });
  //         return;
  //       }
  //       const deletedEmployee = await Employee.findByIdAndDelete(id);

  //       if (!deletedEmployee) {
  //         res.status(400).send({
  //           reaction: false,
  //           message: "Error deleting employee",
  //         });
  //         return;
  //       }
  //       const deletedUser = await User.findOneAndDelete({
  //         username: deletedEmployee.name,
  //       });

  //       if (!deletedUser) {
  //         res.status(400).send({
  //           reaction: false,
  //           message: "Error deleting employee",
  //         });
  //         return;
  //       }

  //       res.status(200).send({
  //         reaction: true,
  //         message: "Employee deleted successfully",
  //         employee: deletedUser,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).send({
  //         reaction: false,
  //         message: "Internal server error",
  //       });
  //       return;
  //     }
  //   },
};

module.exports = controller;
