import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Header from "./Header";

const Restaurant = (props) => {
  let { id } = useParams();
 
  const [rDetails, setrDetails] = useState({}); 
  const [menuItemList, setMenuItemList] = useState([]);
  const [total, setTotal] = useState(0);

  // user details
  const [name, setName] = useState(props.user ? props.user.name : "");
  const [email, setEmail] = useState(props.user ? props.user.email : "");
  const [mobile, setMobile] = useState("9999999999");
  const [address, setAddress] = useState("Indiranager , Pune");

  let getRestaurantDetails = async () => {
    let url =
      `http://localhost:3001/api/get-restaurant-details-by-restaurant-id/` + id;
    let { data } = await axios.get(url);
    setrDetails(data.restaurant);
  };

  let getMenuItems = async () => {
    let url = `http://localhost:3001/api/get-menu-items-by-restaurant-id/` + id;
    let { data } = await axios.get(url);
    setTotal(0);
    setMenuItemList(data.MenuItemList);
  };

  let addQty = (index) => {
    console.log(index);
    let _menuItemList = [...menuItemList];
    _menuItemList[index].qty += 1;
    let newTotal = _menuItemList[index].price + total;
    setTotal(newTotal);
    setMenuItemList(_menuItemList);
  };

  let removeQty = (index) => {
    console.log(index);
    let _menuItemList = [...menuItemList];
    _menuItemList[index].qty -= 1;
    let newTotal = total - _menuItemList[index].price;
    setTotal(newTotal);
    setMenuItemList(_menuItemList);
  };

  let makePayment = async () => {
    // hit order details api
    let url = "http://localhost:3001/api/gen-order-details";
    let { data } = await axios.post(url, { amount: total });

    if (data.status === false) {
      alert("Unable to create order details");
      return false;
    }
    let { order } = data;
    var options = {
      key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Edureka Zomato Clone",
      description: "Online Food Delivery",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Square_zomato_logo_new.png?20180511061014",
      order_id: order.id, 
      handler: async (response) => {
        let userOrders = menuItemList.filter((menu_item) => {
          return menu_item.qty > 0;
        });
        let sendData = {
          pay_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          orders: userOrders,
          name: name,
          email: email,
          contact: mobile,
          address: address,
          totalAmount: total,
          rest_id: rDetails._id,
          rest_name: rDetails.name,
        };

        let url = "http://localhost:3001/api/verify-payment";
        let { data } = await axios.post(url, sendData);
        if (data.status === true) {
          alert("Payment done successfully");
        } else {
          alert("Payment Fail, try again.");
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: mobile,
      },
    };
    var razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    razorpay.open(); // payment window of Razorpay
  };

  useEffect(() => {
    getRestaurantDetails();
    // on mounting
  }, []);
  return (
    <>
      {/* modal */}
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh " }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              {rDetails.thumb ? (
                <Carousel showThumbs={false} infiniteLoop={true}>
                  {rDetails.thumb.map((value, index) => {
                    return (
                      <div key={index} className="w-100">
                        <img src={"/images/" + value} />
                      </div>
                    );
                  })}
                </Carousel>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* menu item modal */}
      <div
        className="modal fade"
        id="modalMenuItem"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {rDetails.name} Menus
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItemList.map((item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{item.name}</p>
                      <p className="mb-1">Rs. {item.price}</p>
                      <p className="small text-muted">{item.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + item.image} alt="" />

                        {item.qty > 0 ? (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeQty(index)}
                            >
                              -
                            </span>
                            <span>{item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addQty(index)}
                            >
                              +
                            </span>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addQty(index)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}

              {total > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Total {total}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#userForm"
                    data-bs-toggle="modal"
                  >
                    Process
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* user form modal */}
      <div
        className="modal fade"
        id="userForm"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {rDetails.name} User Form
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#modalMenuItem"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={makePayment}>
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row bg-danger justify-content-center">
          <Header user={props.user} />
        </div>
        {/* <!-- section -->  */}
        <div className="row justify-content-center">
          <div className="col-10">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="restaurant-main-image position-relative">
                  <img src={"/images/" + rDetails.image} alt="" className="" />
                  <button
                    className="btn btn-outline-light position-absolute btn-gallery"
                    data-bs-toggle="modal"
                    data-bs-target="#slideShow"
                  >
                    Click To Get Image Gallery
                  </button>
                </div>
              </div>
              <div className="col-12 bColor">
                <h3 className="mt-4 rName">{rDetails.name}</h3>
                <div className="d-flex justify-content-between">
                  <ul className="list-unstyled d-flex gap-3">
                    <li className="rName">Overview</li>
                  
                  </ul>
                  <button
                    className="btn btn-danger align-self-start"
                    data-bs-toggle="modal"
                    href="#modalMenuItem"
                    role="button"
                    onClick={getMenuItems}
                    disabled={props.user ? false : true}
                  >
                    {props.user ? "Menu Items" : "Login For Menu"}
                  </button>
                </div>
                <hr className="mt-0" />

                <div className="over-view">
                  <p className="h5 mb-4 rName fw-bold">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                    {rDetails.cuisine
                      ? rDetails.cuisine
                          .map((value) => {
                            return value.name;
                          })
                          .join(", ")
                      : null}
                  </p>

                  <p className="mb-0 fw-bold">MinCost</p>
                  <p>₹ {rDetails.min_price}</p>
                </div>

                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality}, {rDetails.city}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant;


