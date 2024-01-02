const Order = require('../models/Order');
const nodemailer = require("nodemailer");

const controller = {
    getView: async (req, res) => {
        try {
            res.status(200).contentType('text/html')
                .render("client/expressClientView", {
                    data: req.session.user,
                    layout: "clientLayout",
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
    confirmOrder: async (req, res) => {
        try {
            const order_id = req.params.order_id;
            const currentTime = new Date();
            const timeLimit = new Date(currentTime.getTime() - 48 * 60 * 60 * 1000);

            const updatedOrder = await Order.findByIdAndUpdate(
                {
                    _id: order_id,
                    status: "Unconfimred",
                    orderDate: { $lt: { $dateFromString: { dateString: timeLimit.toISOString() } } }
                },
                { status: "Confirmed" },
                { new: true, upsert: true },
            );
            res.redirect("/order_history");
        } catch (error) {
            console.log(error);
            res.status(500)
                .contentType('text/html')
                .render("500", {
                    layout: false
                });
        }
    },
    confirmReceived: async (req, res) => {
        try {
            const order_id = req.params.order_id;

            const updatedOrder = await Order.findByIdAndUpdate(
                {
                    _id: order_id,
                    status: "Confirmed",
                },
                { status: "Received" },
                { new: true, upsert: true },
            );

            res.redirect("/order_history");
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
                itemWeight,
                senderEmail
            } = req.body;

            if (!req.file && senderEmail.trim() === '' && receiverPhone.trim() === '' && receiverUserName.trim() === '' && senderProvince.trim() === '' && senderAddress.trim() === '' && itemDetails.trim() === '' && cost.trim() === '' && itemCategory.trim() === '' && itemWeight.trim() === '' && receiverAddress.trim() === '' && receiverProvince.trim() === '' && senderPhone.trim() === '' && senderUserName.trim() === '') {
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
                    senderEmail: senderEmail,
                    receiverPhone: receiverPhone,
                    receiverAddress: receiverAddress,
                    receiverProvince: receiverProvince,
                    itemCategory: itemCategory,
                    itemImage: fileName,
                    itemWeight: itemWeight,
                    itemDetails: itemDetails,
                    cost: cost,
                    shipment: null,
                    payment: null,
                    status: "Unconfimred",
                    orderDate: new Date().toLocaleString(),
                })
                const dataOrder = await data.save();

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASS,
                    },
                });


                const info = await transporter.sendMail({
                    from: '"TKT Express" leminhkhoitdtu@gmail.com', // sender address
                    to: `${senderEmail}`, // list of receivers
                    subject: "You have an order", // Subject line
                    text: "Hello", // plain text body
                    html: `<p><b>You have an order: ${dataOrder._id}</b></p>
                            <p><b>Please click to confirm order within 24 hours</b></p>
                            <p><a href="http://localhost:3000/express/confirm/${dataOrder._id}" class="btn btn-outline-primary">Xác nhận</a></p>`,
                });

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


}

module.exports = controller;