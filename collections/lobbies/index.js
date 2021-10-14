const {firestore} = require("../../config");
const {currentDatetimeWithOffsetHours} = require("../../utils");
const chunk = require("lodash/chunk");

const fetchLobbiesNotClosedAndCreatedLastHoursRef = async (hoursFromNow) => {
    const lobbiesQuery = await firestore
        .collection("lobbies")
        .where("isClosed", "==", false)
        .where("createAt", ">=", currentDatetimeWithOffsetHours(hoursFromNow))
        .get();

    return lobbiesQuery.docs.map(doc => doc.ref);
    // CASE 2
    // return snapshotToArray(lobbiesQuery);

    //hacer un map de referencias => ponerlo en utils
};

const BATCH_MAX_LIMIT_TRANSACTION = 500;

const updateLobbiesIsClosedField = async (lobbiesRefs, props) => {

    const lobbiesRefsChunks = chunk(lobbiesRefs, BATCH_MAX_LIMIT_TRANSACTION);

    const promises = lobbiesRefsChunks.map(async lobbyChunk => {

        const batch = firestore.batch();

        lobbyChunk.forEach(lobbyRef => batch.update(lobbyRef, 'isClosed', props));

        await batch.commit()
    });

    await Promise.all(promises)

    /*
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
     */
}

module.exports = {fetchLobbiesNotClosedAndCreatedLastHoursRef, updateLobbiesIsClosedField};