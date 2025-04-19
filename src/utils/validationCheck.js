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

const validateEditProfile = (req) => {
  try {
    const isUpdatedAllowed = [
      "firstName",
      "lastName",
      "age",
      "skills",
      "about",
      "profileImage",
    ];

    const isValidEditKeys = Object.keys(req.body).every((field) =>
      isUpdatedAllowed.includes(field)
    );
    return isValidEditKeys;
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  valdiationCheck,
  validateEditProfile,
};
