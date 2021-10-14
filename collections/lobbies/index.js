const { firestore } = require("../../config");
const chunk = require("lodash/chunk");
const { querySnapshotToRefs } = require("../../utils");

const fetchLobbiesNotClosedAndCreatedLastHoursRef = async (lastHours) => {
  const lobbiesQuery = await firestore
    .collection("lobbies")
    .where("isClosed", "==", false)
    .where("createAt", "<=", lastHours)
    .get();

  return querySnapshotToRefs(lobbiesQuery);
};

const BATCH_MAX_LIMIT_TRANSACTION = 500;

const updateLobbiesIsClosedField = async (lobbiesRefs, props) => {
  const lobbiesRefsChunks = chunk(lobbiesRefs, BATCH_MAX_LIMIT_TRANSACTION);

  const promises = lobbiesRefsChunks.map(async (lobbyRefsChunk) => {
    const batch = firestore.batch();

    lobbyRefsChunk.forEach((lobbyRef) => batch.update(lobbyRef, props));

    await batch.commit();
  });

  await Promise.all(promises);
};

module.exports = {
  fetchLobbiesNotClosedAndCreatedLastHoursRef,
  updateLobbiesIsClosedField,
};
