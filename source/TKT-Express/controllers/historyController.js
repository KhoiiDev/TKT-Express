const Order = require("../models/Order");
const Employee = require("../models/Employee");

const controller = {
  getView: async (req, res) => {
    try {
      let data = await Order.find({ userID: req.session.user._id })
        .populate('shipments');

      for (let i = 0; i < data.length; i++) {
        if (data[i].shipments && data[i].shipments.employee) {
          let e = await Employee.findOne(data[i].shipments.employee);
          data[i].employeeInfo = e; // Tạo thuộc tính mới để lưu trữ thông tin nhân viên
        }
      }
      res
        .status(200)
        .contentType("text/html")
        .render("client/historyOrderView", {
          data: data,
          layout: "clientLayout",
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
      const { nameInput, positionInput, phoneInput } = req.body;

      if (
        !req.file &&
        nameInput.trim() === "" &&
        positionInput.trim() === "" &&
        phoneInput.trim() === ""
      ) {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }

      const fileName = req.file.filename;

      const employee = await Employee.findOne({ name: nameInput });

      if (employee) {
        res.status(400).send({
          exists: true,
          reaction: false,
          message: "Error database",
        });
        return;
      }

      const employeeData = new Employee({
        name: nameInput,
        position: positionInput,
        image: fileName,
        phoneNumber: phoneInput,
      });

      await employeeData.save();

      res.status(200).send({
        reaction: true,
        employee: employeeData,
      });
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
      let { nameInput, positionInput, phoneInput, filedName, id } = req.body;

      if (
        nameInput.trim() === "" &&
        positionInput.trim() === "" &&
        phoneInput.trim() === ""
      ) {
        res.status(400).send({
          errorData: true,
          reaction: false,
          message: "Error post data",
        });
        return;
      }
      if (req.file) {
        filedName = req.file.filename;
      }

      const employee = await Employee.findOne({ name: nameInput });

      if (employee) {
        res.status(400).send({
          exists: true,
          reaction: false,
          message: "Error database",
        });
        return;
      }

      const update = {
        name: nameInput,
        position: positionInput,
        image: filedName,
        phoneNumber: phoneInput,
      };
      const updatedEmployee = await Employee.findByIdAndUpdate(id, update, {
        new: true,
        upsert: true,
      });

      if (!updatedEmployee) {
        res.status(400).send({
          reaction: false,
          message: "Error updating employee",
        });
        return;
      }

      res.status(200).send({
        reaction: true,
        message: "Employee updated successfully",
        employee: updatedEmployee,
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
      let { id } = req.params;

      const deletedOrder = await Order.findByIdAndDelete({ _id: id });

      if (!deletedOrder) {
        res.status(400).send({
          reaction: false,
          message: "Error deleting Order",
        });
        return;
      }

      res.status(200).redirect("/order_history");
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
