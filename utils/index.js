const { get } = require("lodash");
const moment = require("moment");

exports.querySnapshotToArray = (snapshot) => {
  const returnArray = [];
  snapshot.docs.forEach((childSnapshot) => {
    const item = childSnapshot.data();
    item.id = childSnapshot.id;
    returnArray.push(item);
  });
  return returnArray;
};

exports.querySnapshotToRefs = (snapshot) => snapshot.docs.map(doc => doc.ref);

exports.snapshotToArray = (snapshot) => {
  const returnArray = [];
  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.data();
    item.id = childSnapshot.id;
    returnArray.push(item);
  });
  return returnArray;
};

exports.searchName = (user) => {
  const email = get(user, "email") ? get(user, "email") : "";

  return [
    ...get(user, "name", "").toUpperCase().split(" "),
    ...get(user, "lastName", "").toUpperCase().split(" "),
    email.toUpperCase(),
  ];
};

exports.currentDatetimeWithOffsetHours = (offsetHours) => moment().subtract(offsetHours, "hours").toDate();