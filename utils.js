const getTimeStamp = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace('T', ' ').replace('Z', '+00');
    return formattedDate;
}

const validateEmailAndPhoneNumber = (email, phoneNumber) => {

    if (email == null && phoneNumber == null) throw new Error("Incorrect format of email \ phone number");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex = /^\d{10}$/;

    const isEmailValid = emailRegex.test(email);
    const isPhoneNumberValid = phoneNumberRegex.test(phoneNumber);

    return { isEmailValid, isPhoneNumberValid };
}

const getUniqueStrings = (arr) => {
    return [...new Set(arr)];
}

let orders = [        {
    "id": 0,
    "phoneNumber": "8879314512",
    "email": "srjchoubey2@gmail.com",
    "linkedId": null,
    "linkedIdPrecedence": "primary",
    "createdAt": "2024-04-01 10:58:28.130+00",
    "updatedAt": "2024-04-01 10:58:28.130+00",
    "deletedAt": null
  },
  {
    "id": 1,
    "phoneNumber": "8879314512",
    "email": "srjchoubey2@yahoo.in",
    "linkedId": 0,
    "linkedIdPrecedence": "secondary",
    "createdAt": "2024-04-01 10:58:28.130+00",
    "updatedAt": "2024-04-01 10:58:28.130+00",
    "deletedAt": null
  },
  {
    "id": 2,
    "phoneNumber": "7506856912",
    "email": "deepa@yahoo.in",
    "linkedId": null,
    "linkedIdPrecedence": "primary",
    "createdAt": "2024-04-01 10:58:28.130+00",
    "updatedAt": "2024-04-01 10:58:28.130+00",
    "deletedAt": null
  },
  {
    "id": 3,
    "phoneNumber": "8879314512",
    "email": "suraj@zettabolt.com",
    "linkedId": 0,
    "linkedIdPrecedence": "secondary",
    "createdAt": "2024-04-01 10:58:28.130+00",
    "updatedAt": "2024-04-01 10:58:28.130+00",
    "deletedAt": null
  }];
  

module.exports = {
    getTimeStamp,
    getUniqueStrings,
    validateEmailAndPhoneNumber,
    orders
}