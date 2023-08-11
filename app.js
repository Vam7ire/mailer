const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 4000;

// Serve the HTML page with the form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// POST endpoint to handle the email sending
app.post('/send-email', async (req, res) => {
  const { recipientEmails, subject, body, userEmail, sendMethod } = req.body;

  if (sendMethod === 'smtp') {
    // SMTP (nodemailer)
    try {
      const transporter = nodemailer.createTransport({
        // SMTP configuration
        // "host": 'mail.smtp2go.com',  // smtp4dev is running locally
        // "port": 2525,           // Default SMTP port
        // "secure": false,
        // "auth": {
    
        //   "user": "Vampir3",
        //   "pass": "x5bRMgNY84hbRHR7"
        // },
        "host": 'smtp.elasticemail.com',  // smtp4dev is running locally
        "port": 2525,           // Default SMTP port
        "secure": false,
        "auth": {
    
          "user": "boymarcus0@gmail.com",
          "pass": "2EB2FEC66A18DE0FDC86233655CC4E6A87FD"
        },
      });

      const mailOptions = {
        from: userEmail,
        to: recipientEmails.split(','),
        subject: subject,
        text: body,
      };

      await transporter.sendMail(mailOptions);
      res.send({ success: true, message: 'Email sent successfully using SMTP.' });
    } catch (error) {
      console.error('Error sending email using SMTP:', error);
      res.status(500).send({ success: false, message: 'Error sending email using SMTP.' });
    }
  } else if (sendMethod === 'api') {
    // API (Elastic Email)
    const elasticEmailApiKey = '0C66B91362C689B0C585E2CEF369762C8D142CB0DBBEA04FC1055F85999747FDF9F7138A543F07CFC4976CA5CB284454'; // Replace with your Elastic Email API key
    try {
      const response = await axios.post('https://api.elasticemail.com/v2/email/send', {
        apikey: elasticEmailApiKey,
        to: recipientEmails,
        subject: subject,
        from: userEmail,
        bodyHtml: body,
      });

      console.log('Email sent using API:', response.data);
      res.send({ success: true, message: 'Email sent successfully using API.' });
    } catch (error) {
      console.error('Error sending email using API:', error.response.data);
      res.status(500).send({ success: false, message: 'Error sending email using API.' });
    }
  } else {
    res.status(400).send({ success: false, message: 'Invalid send method.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






