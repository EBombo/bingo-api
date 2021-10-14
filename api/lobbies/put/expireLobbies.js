const {
  fetchLobbiesNotClosedAndCreatedLastHoursRef,
  updateLobbiesIsClosedField,
} = require("../../../collections/lobbies");
const logger = require("../../../utils/logger");
const { currentDatetimeWithOffsetHours } = require("../../../utils");

const LAST_HOURS_TO_RETRIEVE = 5;

exports.expireLobbies = async (req, res, next) => {
  try {
    logger.log("expireLobbies ->", req.params, req.query, req.body);

    const lastHours = currentDatetimeWithOffsetHours(LAST_HOURS_TO_RETRIEVE);

    const lobbiesRef = await fetchLobbiesNotClosedAndCreatedLastHoursRef(lastHours);

    if (!lobbiesRef?.length) {
      logger.log("lobbiesRef is empty:", lobbiesRef);
      return res.send({ success: false });
    }

    const result = await updateLobbiesIsClosedField(lobbiesRef, { isClosed: true });

    // TODO: Consider remove the logger.
    logger.log("result", result);

    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
