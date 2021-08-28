let express = require("express");
let app = express();
let nodemailer = require("nodemailer");
var cors = require('cors');
let PORT = process.env.PORT || 498;
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const myOAuth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);
myOAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
});
const myAccessToken = myOAuth2Client.getAccessToken();

app.post("/send", cors(), (req, res) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken: myAccessToken,
            expires: 121212121321231
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
