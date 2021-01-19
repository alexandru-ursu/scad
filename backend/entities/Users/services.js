"use strict";

const {
  Users
} = require('../../data/connection.js');

const {
    generateToken
} = require('../../security/Jwt/index.js');

const {
    ServerError
} = require('../../utils/error.js');

const {
    hash,
    compare
} = require('../../security/Password/index.js');

const {
  sendEmail
} = require('../../utils/email.js')

const add = async (name, email, role, password) => {
    const hashedPassword = await hash(password);
    const hashKey = await hash(email.concat(password));
    const user = new Users({
        name,
        email,
        role,
        password: hashedPassword,
        active: false,
        hashkey: hashKey
    });
    console.log("new user to register:",user);
    await user.save();
    sendEmail(email, hashKey);
    console.log("user registred, awaiting email verification");
};

const login = async (email, password) => {
    const user = await Users.findOne({ email });
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }
    if (user.active === false) {
        throw new ServerError(`Email address was not verified, please check both inbox and spam folders.`, 404);
    }
    if (await compare(password, user.password)) {
        const token = await generateToken({
            userId: user._id,
            userRole: user.role
        });
        const response = {id:user._id, name:user.name, role:user.role, token};
        return response;
    }
    throw new ServerError("Combinatia de username si parola nu este buna!", 404);
};


const activate = async (confirmationLink) => {
  const user = await Users.findOne({hashkey:confirmationLink});
  if (user === null) {
      throw new ServerError(`Token invalid sau expirat.`, 404);
  }
  await Users.updateOne({_id: user._id},{$set:{active:true}},{ upsert: true });
  console.log("User " + user.name + " confirmed his email");
}

const getUser = async (userId) => {
  const user = await Users.findOne({_id:userId});
  if (user === null) {
      throw new ServerError(`User not found in database`, 404);
  }
  return user;
}

module.exports = {
    add,
    activate,
    login,
    getUser
}
