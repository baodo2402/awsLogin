const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const nodemailer = require('nodemailer')
const tableName = 'code-requests'
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function sendPasswordEmail(userInfo) {
    const to = userInfo.to;
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    if (!to) {
        return util.buildResponse(401, {
            message: "Email required"
        })
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'thienbao1084@gmail.com',
          pass: 'btne ohhs nsbs qnbh'
        },
      });

      const mailOptions = {
        from: 'thienbao1084@gmail.com',
        to: to,
        subject: 'Reset Code Required',
        text: 'Hi user,\n\nYour email has required a verification code. Please DO NOT share this code with anyone\n\n' + resetCode + '\n\nIf this was not you, please contact our development team by replying to this email or contact your manager \n\nBest regards\nClean & Tidy Dev Team',
      };

      const item = {
        email: to,
        code: resetCode
      }
      try {
        const saveCode = await saveResetCode(item)
        if(!saveCode){
            return util.buildResponse(503, {message: 'Sever error. Please try again later'});
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        // handle to save the code to dynamodb here
        return util.buildResponse(200, {
            message: "Email sent successful"
        })
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', error.message, error.stack);

        return util.buildResponse(500, {
            message: "Internal error: " + error
        })
    }
      
}

async function saveResetCode(item) {
    const params = {
        TableName: tableName,
        Item: item
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving code: ', error)
    });
}

module.exports.sendPasswordEmail = sendPasswordEmail;