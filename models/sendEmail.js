const NewsAPI = require("newsapi");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const EMAIL_UNAME = "psnotification2@gmail.com";
const EMAIL_PW = "Felizes2";
const EMAIL_UNAME_TO = "andrei.cabrera@gmail.com";

const mail = nodemailer.createTransport({
  service: "gmail", // Based on an origin Gmail account
  auth: {
    user: EMAIL_UNAME, // Origin email address
    pass: EMAIL_PW, // Origin email pw
  },
});

const mailOptions = {
  from: EMAIL_UNAME, // Origin email address
  to: EMAIL_UNAME_TO, // Receiving email address
  subject: "Daily news",
  text: "test",
};

let currentEmailCounter = 0;
let saved;
// Request product status from Best Buy
const checkNews = async () => {
  try {
    const data = await fetch(
      `http://newsapi.org/v2/top-headlines?country=us&apiKey=e10a421e09ea42868b6009ee2f1da44f`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //format
        mailOptions.text = data;
        sendMail();
      });
  } catch (error) {
    console.log(error);
  }
};

// Send mail with given options
const sendMail = () => {
  // If it's time to send out mail
  if (checkMailLimit()) {
    mail.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

// Checks if mail should be sent
const checkMailLimit = () => {
  if (currentEmailCounter === 1) {
    currentEmailCounter--;
    return true;
  }

  currentEmailCounter++;
  return false;
};

module.exports = { checkNews };
// setInterval((email) => checkNews(email), (60 / requestPerDay) * 60000);
