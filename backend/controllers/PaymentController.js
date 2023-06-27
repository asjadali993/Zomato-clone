var crypto = require("crypto");
const Razorpay = require("razorpay");
const OrderModel = require("../models/OrderModel");

const KEY_ID = "rzp_test_RB0WElnRLezVJ5";
const KEY_SECRET = "VLMCIrqKxRMNR9EcRcbL2UG8";

let instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

module.exports.genOrderDetails = (request, response) => {
  let data = request.body; // send this amount from react to express

  var options = {
    amount: data.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (error, order) {
    if (error) {
      let errorObj = { status: false, error };
      response.status(500).send(errorObj);
    } else {
      let sendData = {
        status: true,
        order,
      };
      response.status(200).send(sendData);
    }
  });
};

module.exports.verifyPayment = async (request, response) => {
  let { pay_id, order_id, signature } = request.body;
  let data = request.body;
  let payment_data = order_id + "|" + pay_id;

  var serverSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(payment_data.toString())
    .digest("hex");
  // console.log("sig received ", signature);
  // console.log("sig generated ", serverSignature);
  if (serverSignature === signature) {
    // order details
    await saveOrder(data);
    response.send({
      status: true,
    });
  } else {
    response.send({
      status: false,
    });
  }
};

let saveOrder = async (data) => {
  // save a data in database
  // here data variable is an {} & it's a client data
  // save single data
  let saveData = {
    pay_id: data.pay_id,
    order_id: data.order_id,
    signature: data.signature,
    orders: data.orders,
    name: data.name,
    email: data.email,
    contact: data.contact,
    address: data.address,
    totalAmount: data.totalAmount,
    rest_id: data.rest_id,
    rest_name: data.rest_name,
  };
  // save in data in database
  let newOrder = new OrderModel(saveData);
  let result = await newOrder.save();

  if (result) {
    return true;
  } else {
    return false;
  }
};
