let express = require("express");
let app = express();
let nodemailer = require("nodemailer");
var cors = require('cors');
let PORT = process.env.PORT || 499;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/send", cors(), (req, res) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            pass: process.env.ENTER,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: `message from ${req.body.firstname} ${req.body.lastname} from ${req.body.email}`,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(error);
        }
        else {
            res.json({
                "emailSent": true,
                "emailValid": true
            })
        }
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
});
