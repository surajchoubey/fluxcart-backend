const { getTimeStamp, validateEmailAndPhoneNumber, getUniqueStrings, orders } = require("./utils.js");

// Controller function to fetch messages
function identify(req, res) {
  try {
    const { email, phoneNumber } = req.body;

    validateEmailAndPhoneNumber(email, phoneNumber);

    let idsToCheck = [];
    let linkedIds = [];

    let primaryFound = false;
    let emails = [];
    let phoneNumbers = [];
    let primaryIndex =  null;

    for (let i = 0; i < orders.length;) {

      const order = orders[i];

      if ((email && order.email && order.email == email)
      || (phoneNumber && order.phoneNumber && order.phoneNumber == phoneNumber)) {

        while (orders[i].linkedId != null) {
          i = orders[i].linkedId;
        }

        primaryFound = true;
        primaryIndex = i;
        idsToCheck.push(i);

        if (order.email) emails.push(orders[primaryIndex].email);
        if (order.phoneNumber) phoneNumbers.push(orders[primaryIndex].phoneNumber);

        break;

      }
      
      i++;
    }

    if (primaryFound) {
      for (let i = primaryIndex; i < orders.length; i++) {

        const order = orders[i];

        if (idsToCheck.some( id => id == order.linkedId)) {

          idsToCheck.push(order.id);
          linkedIds.push(order.id);
  
          if (order.email) emails.push(order.email);
          if (order.phoneNumber) phoneNumbers.push(order.phoneNumber);
        }
      }
    }

    res.status(200).json({
      contact: {
        primaryContactId: primaryIndex,
        emails: getUniqueStrings(emails),
        phoneNumbers: getUniqueStrings(phoneNumbers),
        secondaryContactIds: linkedIds
      }
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

// Controller function to add a new message
function createOrder(req, res) {
  try {
    const { phoneNumber, email } = req.body;

    validateEmailAndPhoneNumber(email, phoneNumber);

    let linkedId = null;
    let linkedIdPrecedence = "primary";

    for (let i = 0; i < orders.length; i++) {
      if ((orders[i].email && email && orders[i].email == email)
      || (orders[i].phoneNumber && phoneNumber && orders[i].phoneNumber == phoneNumber)) {
          linkedId = orders[i].id;
          linkedIdPrecedence = "secondary";
          console.log(linkedId);
          break;
        }
    }

    const timestamp = getTimeStamp()

    const order = {
      id: orders.length,
      phoneNumber,
      email,
      linkedId,
      linkedIdPrecedence,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null
    }

    orders.push(order);

    res.status(201).json({ 
      message: 'Order created successfully',
      itemAdded: order
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
}

function getOrders(req, res) {
  res.status(200).json(orders);
}

module.exports = { identify, createOrder, getOrders };
