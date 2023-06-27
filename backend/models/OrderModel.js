// schema
const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  pay_id: { type: String },
  order_id: { type: String },
  signature: { type: String },
  orders: { type: Array },
  name: { type: String },
  email: { type: String },
  contact: { type: String },
  address: { type: String },
  totalAmount: { type: Number },
  rest_id: { type: mongoose.Schema.Types.ObjectId },
  rest_name: { type: String },
});
// model
const OrderModel = mongoose.model("order", OrderSchema, "userorders");

// export
module.exports = OrderModel;
