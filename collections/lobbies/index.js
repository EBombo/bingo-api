const { firestore } = require("../../config");
const { currentDatetimeWithOffsetHours, snapshotToArray } = require("../../utils");
const chunk = require("lodash/chunk");

lobbiesRef = firestore.collection(`lobbies`)

const fetchLobbiesNotClosedAndCreatedLastHoursRef = async (hoursFromNow) => {
  const lobbiesQuery = await firestore
    .collection("lobbies")
    .where("isClosed", "==", false)
    .where("createAt", ">=", currentDatetimeWithOffsetHours(hoursFromNow))
    .get();

  return lobbiesQuery.docs.map(doc => doc.ref);
      // CASE 2
  // return snapshotToArray(lobbiesQuery);
};

const BATCH_MAX_LIMIT_TRANSACTION = 500;
const updateLobbiesIsClosedField = async (lobbiesRefs, newIsClosedValue = true) => {
  const batch = firestore.batch();
  const lobbiesRefsChunks = chunk(lobbiesRefs, size=BATCH_MAX_LIMIT_TRANSACTION);

  let writeResults = [];

  for (let i = 0; i < lobbiesRefsChunks.length; i++) {
    const lobbiesRefsChunk = lobbiesRefsChunks[i];
    lobbiesRefsChunk.forEach((lobbyRef) => {
      // CASE 2
      // const lobbyRef = firestore.doc(`lobbies/${lobby.id}`);
      batch.update(lobbyRef, 'isClosed', newIsClosedValue);
    });

    writeResults.push(await batch.commit()); 
  }

  return writeResults;
}

module.exports = { fetchLobbiesNotClosedAndCreatedLastHoursRef, updateLobbiesIsClosedField };