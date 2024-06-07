const { 
  getTimeStamp,
  validateEmailAndPhoneNumber,
  getUniqueStrings,
  PRIMARY,
  SECONDARY
} = require("./utils.js");
const { orders } = require("./ordersdb.js");

// Controller function to fetch messages
function identify(req, res) {
  try {
    const { email, phoneNumber } = req.body;

    validateEmailAndPhoneNumber(email, phoneNumber);

    let secondaryCount = 0;
    let primaryCount = 0;
    let primaryIndex =  null;
    let secondaryIndex = null;
    let findings = [];
    let primaryIndices = [];
    let linkedIds = [];

    for (let i = 0; i < orders.length; i++) {

      const order = orders[i];

      if ((email && order.email && order.email == email)
      || (phoneNumber && order.phoneNumber && order.phoneNumber == phoneNumber)) {

        findings.push({
          index: i,
          linkedId: order.linkedId,
          linkPrecedence: order.linkPrecedence
        });

        secondaryCount += (order.linkedId != null);
        primaryCount += (order.linkedId == null);
        primaryIndices.push(i);

        if (secondaryCount == 1) secondaryIndex = i;
      }
    }

    if (secondaryCount == 0 && primaryCount > 0) {
      primaryIndices.push(findings[0].index);
      for (let i = 1; i < findings.length; i++) {
        orders[findings[i].index].linkedId = findings[0].index;
        orders[findings[i].index].linkPrecedence = SECONDARY;
      }
    } else {
      for (let i = 0; i < findings.length; i++) {
        if (findings[i].linkPrecedence == PRIMARY && 
          findings[i].index != orders[secondaryIndex].linkedId) {
          orders[findings[i].index].linkedId = secondaryIndex;
          orders[findings[i].index].linkPrecedence = SECONDARY;
          primaryIndices.push(secondaryIndex);
        } else if (findings[i].linkPrecedence == SECONDARY) {
          let temp_i = findings[i].index;
          while (orders[temp_i].linkedId != null) {
            temp_i = orders[temp_i].linkedId;
          }
          primaryIndices.push(temp_i);
        }
      }
    }

    primaryIndices.sort();
    let idsToCheck = [...new Set(primaryIndices)];

    for (let i = 0; i < idsToCheck.length; i++) {
      if (i == 0) primaryIndex = idsToCheck[i];
      else linkedIds.push(idsToCheck[i]);
    }

    let emails = [];
    let phoneNumbers = [];

    if (primaryIndex != null) {
      let primaryOrder = orders[primaryIndex];
      if (primaryOrder.email) emails.push(primaryOrder.email);
      if (primaryOrder.phoneNumber) phoneNumbers.push(primaryOrder.phoneNumber);
    }

    for (let i = 0; i < orders.length && idsToCheck.length > 0; i++) {
      const order = orders[i];
      if (idsToCheck.some(id => id == order.linkedId)) {

        idsToCheck.push(order.id);
        linkedIds.push(order.id);

        if (order.email) emails.push(order.email);
        if (order.phoneNumber) phoneNumbers.push(order.phoneNumber);
      }
    }

    const secondaryContactIds = [...new Set(linkedIds)].sort()

    res.status(200).json({
      contact: {
        primaryContactId: primaryIndex,
        emails: getUniqueStrings(emails),
        phoneNumbers: getUniqueStrings(phoneNumbers),
        secondaryContactIds
      }
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

// Controller function to add a new order
function createOrder(req, res) {
  try {
    const { phoneNumber, email } = req.body;

    validateEmailAndPhoneNumber(email, phoneNumber);

    let linkedId = null;
    let linkPrecedence = PRIMARY;

    for (let i = 0; i < orders.length; i++) {
      if ((orders[i].email && email && orders[i].email == email)
      || (orders[i].phoneNumber && phoneNumber && orders[i].phoneNumber == phoneNumber)) {
          linkedId = orders[i].id;
          linkPrecedence = SECONDARY;
          break;
        }
    }

    const timestamp = getTimeStamp();

    const order = {
      id: orders.length,
      phoneNumber,
      email,
      linkedId,
      linkPrecedence,
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
