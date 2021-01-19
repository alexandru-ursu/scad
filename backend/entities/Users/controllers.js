const express = require('express');

const UsersService = require('./services.js');
const {
  validateFields
} = require('../../utils/verify.js');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const {
    name,
    role,
    email,
    password
  } = req.body;

  // validare de campuri
  try {
    const fieldsToBeValidated = {
      name: {
        value: name,
        type: 'ascii'
      },
      email: {
        value: email,
        type: 'email'
      },
      role: {
        value: role,
        type: 'alpha'
      },
      password: {
        value: password,
        type: 'ascii'
      }
    };
    console.log(fieldsToBeValidated);
    validateFields(fieldsToBeValidated);

    await UsersService.add(name, email, role, password);

    res.send('User added');
    res.status(201).end();
  } catch (err) {
    // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
    next(err);
  }
});


router.post('/login', async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  try {
    const fieldsToBeValidated = {
      email: {
        value: email,
        type: 'email'
      },
      password: {
        value: password,
        type: 'ascii'
      }
    };

    validateFields(fieldsToBeValidated);

    const token = await UsersService.login(email, password);

    res.status(200).json(token);
    res.status(200).end();
  } catch (err) {
    // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
    next(err);
  }
})

router.get('/confirm', async (req, res, next) => {
  var hashkey = req.query.id;
  try {
    const fieldsToBeValidated = {
      hashkey: {
        value: hashkey,
        type: 'ascii'
      }
    };

    validateFields(fieldsToBeValidated);

    await UsersService.activate(hashkey);

    res.send("Email confirmed, your account was activated.");
    res.status(200).end();
  } catch (err) {
    // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
    next(err);
  }
})



module.exports = router;
