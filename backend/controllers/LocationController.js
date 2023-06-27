const LocationModel = require("../models/LocationModel");

module.exports.home = (request, response) => {
  response.send("API Call");
};

module.exports.getLocationList = async (request, response) => {
  try {
    let locationList = await LocationModel.find();
    let sendData = {
      status: locationList.length === 0 ? false : true,
      locationList,
      count: locationList.length,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};
