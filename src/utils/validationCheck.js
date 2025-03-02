const validator = require("validator");

const valdiationCheck = (data) => {
  const { firstName, lastName, email, password } = data;

  if (!firstName || !lastName) {
    throw new Error(
      "name is missing please check if you add firstName and lastName"
    );
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Passoword should be strong");
  }
};

module.exports = {
  valdiationCheck,
};
