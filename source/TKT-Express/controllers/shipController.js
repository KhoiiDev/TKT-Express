const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Shipment = require('../models/Shipment');
const Employee = require('../models/Employee');
const nodemailer = require("nodemailer");

const controller = {
    getView: async (req, res) => {
        try {
            const data = await Employee.findOne({ userID: req.session.user._id });

            res.status(200).contentType('text/html')
                .render("employee/profileEmployee", {
                    data: data,
                    layout: "employeeLayout",
                });
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    showOrder: async (req, res) => {
        try {
            const employee = await Employee.findOne({ userID: req.session.user._id })
                .exec();

            const ships = await Shipment.find({ employee: employee._id })
                .exec();

            const shipIds = ships.map(ship => ship._id);

            const orders = await Order.find({ shipments: { $in: shipIds } })
                .populate('shipments')
                .populate('payments')
                .exec();

            res.status(200).contentType('text/html')
                .render("employee/shipView", {
                    orderData: orders,
                    layout: "employeeLayout",
                });

        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    getOrder: async (req, res) => {
        try {
            // xác định nhân viên.
            const employee = await Employee.findOne({ userID: req.session.user._id });

            const workplace = employee.workplace;

            // tìm tất cả order có địa chỉ ở nơi nhân viên đang công tác.
            const orders = await Order.find({
                $or: [
                    { receiverProvince: workplace },
                    { senderProvince: workplace }
                ],
                status: "Confirmed"
            }).limit(50);
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let randomString = '';
            // thêm shipment và payment vào order.
            for (o in orders) {
                // Tạo Shipment
                let ship = new Shipment({
                    shipAddress: orders[o].receiverAddress,
                    shipmentTime: new Date().toLocaleString(),
                    status: "Pending",
                    employee: employee
                });
                for (let i = 0; i < 10; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    randomString += characters.charAt(randomIndex);
                }
                let pay = new Payment({
                    codePay: randomString,
                    status: 'Unpaid'
                });
                await pay.save();
                await ship.save();
                await Order.findByIdAndUpdate(
                    orders[o]._id,
                    {
                        shipments: ship,
                        payments: pay
                    },
                    { new: true, upsert: true },
                );
            }

            res.redirect("/employee/myOrder");
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    postCreate: async (req, res) => {
        try {
            const {
                senderAddress,
                senderUserName,
                senderPhone,
                receiverAddress,
                receiverUserName,
                receiverPhone,
                itemCategory,
                cost,
                senderProvince,
                receiverProvince,
                itemDetails,
                itemWeight
            } = req.body;

            if (!req.file || receiverPhone.trim() === '' && receiverUserName.trim() === '' && senderProvince.trim() === '' && senderAddress.trim() === '' && itemDetails.trim() === '' && cost.trim() === '' && itemCategory.trim() === '' && itemWeight.trim() === '' && receiverAddress.trim() === '' && receiverProvince.trim() === '' && senderPhone.trim() === '' && senderUserName.trim() === '') {
                res.status(400).send({
                    errorData: true,
                    reaction: false,
                    message: "Error post data"
                });
                return;
            } else {
                const fileName = 'http://localhost:3000/images/express/' + req.file.filename;

                const data = new Order({
                    userID: req.session.user._id,
                    senderUserName: senderUserName,
                    senderPhone: senderPhone,
                    senderAddress: senderAddress,
                    senderProvince: senderProvince,
                    receiverUserName: receiverUserName,
                    receiverPhone: receiverPhone,
                    receiverAddress: receiverAddress,
                    receiverProvince: receiverProvince,
                    itemCategory: itemCategory,
                    itemImage: fileName,
                    itemWeight: itemWeight,
                    itemDetails: itemDetails,
                    cost: cost,
                    status: "Pending",
                    orderDate: new Date().toLocaleString(),
                })
                await data.save();
                res.json({ redirectUrl: "/order_history" });
            }

        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    postUpdateShip: async (req, res) => {
        try {
            const { shipStatus, order_id } = req.body;
            const order = await Order.findOne({
                _id: order_id
            }).populate('shipments').populate('payments');

            const shipUpdate = await Shipment.findByIdAndUpdate(
                order.shipments._id,
                { status: shipStatus },
                { new: true, upsert: true },
            );

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASS,
                },
            });

            if (shipUpdate.shipStatus === 'Delivered') {
                const info = await transporter.sendMail({
                    from: '"TKT Express" leminhkhoitdtu@gmail.com', // sender address
                    to: `${order.senderEmail}`, // list of receivers
                    subject: "Info your order", // Subject line
                    text: "Hello", // plain text body
                    html: `<p>Your order <b>${order._id}</b> is: <b>${shipUpdate.shipStatus}</b> and <b>${order.payments.status}</b></p>
                            <p><b>Please click to confirm receipt of order.</b></p>
                            <p><a href="http://localhost:3000/express/confirmReceived/${order._id}" class="btn btn-outline-primary">Xác nhận</a></p>`,
                });
            }
            else {
                const info = await transporter.sendMail({
                    from: '"TKT Express" leminhkhoitdtu@gmail.com', // sender address
                    to: `${order.senderEmail}`, // list of receivers
                    subject: "Info your order", // Subject line
                    text: "Hello", // plain text body
                    html: `<p>Your order <b>${order._id}</b> is: <b>${shipUpdate.shipStatus}</b> and <b>${order.payments.status}</b></p>`,
                });
            }


            res.status(200).send({
                reaction: true,
            });
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    postUpdatePayment: async (req, res) => {
        try {
            const {
                payID,
            } = req.body;
            if (payID.trim() !== '') {
                const payUpdate = await Payment.findByIdAndUpdate(
                    payID,
                    { status: 'Paid' },
                    { new: true, upsert: true },
                );

                res.status(200).send({
                    reaction: true,
                });
            } else {
                res.status(400).send({
                    errorData: true,
                    reaction: false,
                    message: 'Error post data',
                });
            }

        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
}

module.exports = controller;