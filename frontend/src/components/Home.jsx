import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Home = (props) => {
  let navigate = useNavigate();
  let { locationList } = props;

  let { restaurantList } = props;
  let [mealTypeList, setMealTypeList] = useState([]); // state hook

  let getMealType = async () => {
    let url = "http://localhost:3001/api/get-meal-type-list";
    let { data } = await axios.get(url);
    setMealTypeList(data.mealTypeList); // updating state mealType
  };


  useEffect(() => {
    getMealType();
  }, []);
  return (
    <>
      <main className="container-fluid">
        <section className="row main-section align-content-start justify-content-center">
          <Header logo={false} user={props.user} />
          <section className="col-12 d-flex flex-column align-items-center justify-content-center">
            <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
            <p className="h1 text-white my-3 text-center">
              Find the best restaurants, cafés, and bars
            </p>
            <div className="search w-50 d-flex mt-3">
              <select
                type="text"
                className="form-control mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
                placeholder="Please type a location"
              >
                <option hidden value="">Select Location</option>
                {locationList.map((location, index) => {
                  return (
                    <option key={index} value={location.location_id}>
                      {location.name} , {location.city}
                    </option>
                  );
                })}
              </select>
              <div className=" input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-search "></i>
                </span>
                <select type="text" className="form-control py-2 px-3" placeholder="Search for restaurants">
                  <option hidden value="">Select Restaurant</option>

                  {
                    restaurantList.map((restaurant, index) => {
                      return (
                        <option key={index} value={restaurant.location_id}>
                          {restaurant.name} , {restaurant.city}
                        </option>
                      );
                    })}

                </select>
              </div>
            </div>
          </section>
        </section>
        <section className="row justify-content-center">
          <section className="col-10 mt-3 pt-4 ">
            <h3 className="fw-bold  ">
              <Link className=" fw-bold text-decoration-none text-navy" to="/search">Quick Searches</Link>
            </h3>
            <p className="text-secondary">Discover restaurants by Searches</p>
          </section>
          <section className="col-10 ">
            <section className="row py-2 ">
              <section className="col-12 px-0 pb-5 d-flex  justify-content-between flex-wrap">
                {mealTypeList.map((meal, index) => {
                  return (
                    <section 
                      onClick={() =>
                        navigate(`/search/${meal.meal_type}/${meal.name}`)
                      }
                      key={index}
                      className="py-1 homeCard  d-flex border border-1 shadow quick-search-item"
                    >
                      <img src={"/images/" + meal.image} alt="" className="image-item" />
                      <div className="pt-2 px-2">
                        <h6 className=" fw-bold text-navy">{meal.name}</h6>
                        <p className="small text-muted"> {meal.content}</p>
                      </div>
                    </section>
                  );
                })}
              </section>
            </section>
          </section>
        </section>
      </main>
    </>
  );
};

export default Home;
