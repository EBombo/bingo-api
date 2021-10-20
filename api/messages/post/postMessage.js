const logger = require("../../../utils/logger");
const { firestore, adminFirestore } = require("../../../config");

exports.postMessage = async (req, res, next) => {
  try {
    logger.log("postMessage->", req.params, req.query, req.body);

    const { user, message, lobbyId } = req.body;
    const messagesRef = firestore.collection("messages");
    const messageId = messagesRef.doc().id;

    const promiseMessage = messagesRef.doc(messageId).set({
      id: messageId,
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
      message,
      user,
      lobbyId,
    });

    const promiseLobby = firestore
      .doc(`lobbies/${lobbyId}`)
      .update({ totalMessages: adminFirestore.FieldValue.increment(1) });

    await Promise.all([promiseMessage, promiseLobby]);

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
