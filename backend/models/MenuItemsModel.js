// schema
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const MenuItemsSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  ingridients: { type: Array },
  restaurantId: { type: ObjectId },
  image: { type: String },
  qty: { type: Number },
  price: { type: Number },
});
// model

const MenuItemsModel = mongoose.model("menuitem", MenuItemsSchema, "menuitems");

// export
module.exports = MenuItemsModel;
