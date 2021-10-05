const logger = require("../../../utils/logger");
const { snapshotToArray } = require("../../../utils");
const { firestore } = require("../../../config");

exports.getGames = async (req, res, next) => {
  try {
    logger.log("getGames->", req.params);

    const { userId } = req.params;
    const { folderId } = req.query;

    let gamesRef = firestore
      .collection("games")
      .where("usersIds", "array-contains", userId)
      .where("deleted", "==", false);

    if (folderId) gamesRef = gamesRef.where("parentId", "==", folderId);

    const gamesQuery = await gamesRef.get();

    let games = snapshotToArray(gamesQuery);

    games=games.map(game=> ({
      ...game,
      createAt: game.createAt.toDate().toString(),
      updateAt: game.updateAt.toDate().toString()
    }))

    return res.send(games);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
