let express = require("express");
let app = express();
let nodemailer = require("nodemailer");
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/send", (req, res) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.USERNAME,
            pass: process.env.PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: process.env.USERNAME,
        subject: `message from ${req.body.firstname} ${req.body.lastname} from ${req.body.email}`,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        } else {
            return res.redirect("localhost:3000");
        }
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
});
