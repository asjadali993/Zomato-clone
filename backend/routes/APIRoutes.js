const express = require("express");
const APIRoutes = express.Router();

const location = require("../controllers/LocationController");
const restaurant = require("../controllers/RestaurantController");
const mealType = require("../controllers/MealTypeController");
const {
  genOrderDetails,
  verifyPayment,
} = require("../controllers/PaymentController");

APIRoutes.get("/api", location.home);
APIRoutes.get("/api/get-location-list", location.getLocationList);

APIRoutes.get(
  "/api/get-restaurant-list-by-location-id/:loc_id",
  restaurant.getRestaurantListByLocationId
);

APIRoutes.get(
  "/api/get-restaurant-details-by-restaurant-id/:id",
  restaurant.getRestaurantDetailsByRestaurantId
);

APIRoutes.get(
  "/api/get-menu-items-by-restaurant-id/:r_id",
  restaurant.getMenuItemsByRestaurantId
);

APIRoutes.get("/api/get-meal-type-list", mealType.getMealTypeList);

APIRoutes.post("/api/filter", restaurant.filter);

// payment
APIRoutes.post("/api/gen-order-details", genOrderDetails);
APIRoutes.post("/api/verify-payment", verifyPayment);
module.exports = APIRoutes;
