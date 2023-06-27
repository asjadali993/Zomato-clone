import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
const Header = (props) => {
  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    try {
      let data = jwt_decode(token);
      // save in browser
      localStorage.setItem("zc_auth_token", token);
      // reload page
      alert("login successfully");
      window.location.assign("/");
    } catch (error) {
      console.log(error);
      // remove data from local storage
      localStorage.removeItem("zc_auth_token");
    }
  };
  let onError = () => {
    console.log("Login Failed");
  };

  let logout = () => {
    let isLogout = window.confirm("Are you sure logout");
    if (isLogout) {
      localStorage.removeItem("zc_auth_token");
      window.location.reload();
    }
  };
  return (
    <>
      <GoogleOAuthProvider clientId="862455110660-l3s4lg5apkns739gss4elhhmus9l10rp.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="login-sign-up"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Login / SignUp
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onError} />;
              </div>
            </div>
          </div>
        </div>
        <div className="col-10 d-flex justify-content-between py-2">
          {props.logo === false ? <p></p> : <p className="m-0 brand">e!</p>}

          <div>
            {props.user ? (
              <div className="d-lg-flex d-block">
                <div className="d-flex">
              
              <img className="userPicture" src={props.user.picture} alt="user-picture" />
              <p className="me-lg-3 ms-2 fs-4 p-0 m-0 ">
              {props.user.name}
              </p>
              </div>
              <button className="btn btn-secondary d-flex ms-2 " onClick={logout}>
                  Logout
              </button>
          </div>) : (
              <button
                className="btn btn-outline-light"
                data-bs-toggle="modal"
                data-bs-target="#login-sign-up"
              >
                Login
              </button>
            )}

            {/* <button className="btn btn-outline-light">
            <i className="fa fa-search" aria-hidden="true"></i>Create a Account
          </button> */}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Header;
