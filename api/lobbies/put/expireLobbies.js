const {
  fetchLobbiesNotClosedAndCreatedLastHoursRef,
  // updateLobbiesIsClosedField,
} = require("../../../collections/lobbies");
const logger = require("../../../utils/logger");
const moment = require("moment")

//const LAST_HOURS_TO_RETRIEVE = -5;
const LAST_HOURS_TO_RETRIEVE = 5;

exports.expireLobbies = async (req, res, next) => {
  try {
    logger.log("expireLobbies ->", req.params, req.query, req.body);

    //const lastHour=moment().subtract(LAST_HOURS_TO_RETRIEVE,"hours").toDate()

    const lobbiesRef = await fetchLobbiesNotClosedAndCreatedLastHoursRef(LAST_HOURS_TO_RETRIEVE);

    if (!lobbiesRef?.length) {
      logger.log("lobbiesRef is empty:", lobbiesRef);
      return res.send({ success: false });
    }

    logger.log("number of lobbies retrieved", lobbiesRef.docs.length);
    logger.log("all lobbies's timestamp:", lobbies.docs.map(d => d.data().createAt.toString()).join(', '));

    // const result = await updateLobbiesIsClosedField(lobbiesRef, {isClosed:true}})
    // logger.log("result", result);
    return res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}