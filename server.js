let express = require("express");
let app = express();
let nodemailer = require("nodemailer");
var cors = require('cors');
const { check, validationResult } = require('express-validator');
let PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.post("/send", check(body("email").isEmail()), cors(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ validEmail: false });
    }
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            pass: process.env.WORD,
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
