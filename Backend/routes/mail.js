import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
const router = express.Router();

const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.API_KEY_MAIL
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });


router.get("/" , async (req , res) => {
  try {
    const data = await mg.messages.create("sandboxa0db361081674f8f85e3cdd8e65907b4.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxa0db361081674f8f85e3cdd8e65907b4.mailgun.org>",
      to: ["TradeWise <sakethlearning@gmail.com>"],
      subject: "Hello TradeWise",
      text: "Congratulations TradeWise, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
});

export default router;