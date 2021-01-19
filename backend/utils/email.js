const nodemailer = require('nodemailer');



// APP PASS: rjizgrgvxjaibcjv

function sendEmail(email, hashedCode) {

  let testAccount = nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'alexandru.ursu2712@gmail.com',
      pass: 'rjizgrgvxjaibcjv'
    }
  });

  // 'to' and 'text' fields will be completed with required parameters
  var mailOptions = {
    from: 'elinore13@ethereal.email',
    to: email,
    subject: 'Confirm your email address',
//    text: "Please confirm your email address by pressing the following link:",// localhost:3000/hardstuck/users/confirm?id=".concat(hashedCode),
    // html: "<a href=".concat('\""').concat("localhost:3000/hardstuck/users/confirm?id=").concat(hashedCode).concat('\"').concat("/>")
    html: '<p>Click <a href="http://'+process.env.IP+':'+process.env.PORT+'/licenta/users/confirm?id=' + hashedCode + '">here</a> to activate your account.</p>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// function sendResponse(subject, destinationEmail, messageText) {
//   let testAccount = nodemailer.createTestAccount();
//
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//       user: 'alexandru.ursu2712@gmail.com',
//       pass: 'rjizgrgvxjaibcjv'
//     }
//   });
//
//   // 'to' and 'text' fields will be completed with required parameters
//   var mailOptions = {
//     from: 'elinore13@ethereal.email',
//     to: destinationEmail,
//     subject: subject,
//     text: messageText
//   };
//
//   console.log(mailOptions);
//
//
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }

module.exports = {
  sendEmail
  // ,
  // sendResponse
}
