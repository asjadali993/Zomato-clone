const MealTypeModel = require("../models/MealTypeModel");

module.exports.getMealTypeList = async (request, response) => {
  try {
    let mealTypeList = await MealTypeModel.find();
    let sendData = {
      status: mealTypeList.length === 0 ? false : true,
      mealTypeList,
      count: mealTypeList.length,
    };
    response.status(200).send(sendData);
  } catch (error) {
    let errorObj = { status: false, error };
    response.status(500).send(errorObj);
  }
};
