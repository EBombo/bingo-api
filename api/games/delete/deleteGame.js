const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.deleteGame = async (req, res, next) => {
  try {
    logger.log("deleteGame->", req.params, req.query, req.body);

    const { gameId } = req.params;

    await firestore.doc(`games/${gameId}`).update({
      deleted: true,
      updateAt: new Date(),
    });

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

