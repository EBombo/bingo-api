const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.postGame = async (req, res, next) => {
  try {
    logger.log("postGame->", req.params, req.query, req.body);

    const { userId } = req.params;
    const game = req.body;
    const gamesRef = firestore.collection("games");
    const gameId = game.id;

    await gamesRef.doc(gameId).set({
      ...game,
      id: gameId,
      usersIds: [userId],
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
    });

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
