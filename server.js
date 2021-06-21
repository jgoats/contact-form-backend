let express = require("express");
let app = express();
let nodemailer = require("nodemailer");

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let PORT = process.env.PORT || 2999;

app.post("/sent", (req, res) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: process.env.USERNAME,
        subject: `message from ${req.body.email}`,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send("success");
        }
    });
});

app.listen(POST, () => {
    console.log(`running on port ${PORT}`)
});
