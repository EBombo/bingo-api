const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.putGame = async (req, res, next) => {
  try {
    logger.log("putGame->", req.params, req.query, req.body);

    const { userId, gameId } = req.params;
    const game = req.body;

    await firestore.doc(`games/${gameId}`).update({
      ...game,
      usersIds: [userId],
      updateAt: new Date(),
    });

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
