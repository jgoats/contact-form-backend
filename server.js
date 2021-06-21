const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.USERNAME,
        pass: process.env.PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});

transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/send", (req, res) => {
    let mailOptions = {
        from: req.body.email,
        to: process.env.USERNAME,
        subject: `message from ${req.body.firstname} ${req.body.lastname} from ${req.body.email}`,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
            res.json({ status: "Email sent" });
        }
    });
});


const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
