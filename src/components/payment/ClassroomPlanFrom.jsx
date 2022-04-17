import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
// MUI Components
import Button from "@mui/material/Button";
import {
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Backdrop,
  Paper,
  useMediaQuery,
} from "@mui/material";
// stripe
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// Util imports
import CircularProgress from "@mui/material/CircularProgress";
// Custom Components
import ThanksForPurchasingAnimation from "./ThanksForPurchasingAnimation";
//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spline from "@splinetool/react-spline";

//material-icons
import { Redeem, AlternateEmail } from "@mui/icons-material";

import Translations from "../../translations/translations.json";

import { useMutation, gql } from "@apollo/client";

import { useSelector } from "react-redux";

import config from "../../config.json";
import TeacherImg from "../../img/teacher_sub.svg";
import getUser from "../../hooks/getUser";

const UPDATE_USER_SUBSCRIPTION = gql`
  mutation ($id: ID!, $plan: String!, $subscriptionDetails: String!) {
    updateUserSubscription(
      id: $id
      plan: $plan
      subscriptionDetails: $subscriptionDetails
    )
  }
`;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function HomePage(props) {
  const user = getUser();
  const plan = useSelector((state) => state.plan);
  // State
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(false);
  const [spinner, setSpinner] = useState(false);

  var [currentDiscount, setCurrentDiscount] = useState(
    "this field is optional"
  );
  var [discountName, setDiscountName] = useState("None");
  const [discount, setDiscount] = useState(0);

  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(10);

  const [comfirmPurchase, setComfirmPurchase] = useState(false);
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = useState(false);

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [updateUserSubscriptionMutation] = useMutation(
    UPDATE_USER_SUBSCRIPTION
  );

  const stripe = useStripe();
  const elements = useElements();

  const smallScreen = useMediaQuery("(max-width:980px)");

  useEffect(() => {
    setTotal(price - discount);
    console.log(total);
    if (discount >= price) {
      setTotal(0);
    }
    document.getElementById("root").style.padding = "0px";

    return () => {
      setTotal(0);
      document.getElementById("root").style.padding = "10px";
    };
  }, [discount]);

  useEffect(() => {
    if (plan === "Starter") return;
    if (plan === "Classroom") {
      window.location.href = "/plans";
      toast.warn(Translations[userLanguage].alreadyhaveplan);
    }
  }, [plan]);

  const handleUpdateUserSubscription = async (subscriptionDetails) => {
    const subscriptionObj = {
      id: user?.profileObj.googleId,
      plan: "Classroom",
      subscriptionDetails: JSON.stringify(subscriptionDetails),
    };

    updateUserSubscriptionMutation({
      variables: subscriptionObj,
    });
  };

  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    //https://connect-quiz-now.herokuapp.com

    const res = await axios.post(`${config["api-server"]}/pay`, {
      email: email,
    });

    const clientSecret = res.data["client_secret"];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        console.log("Money is in the bank!");
        setSuccess(true);
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const handleSubmitSub = async (event) => {
    if (user == null) {
      toast.error(Translations[userLanguage].alerts.loginbeforebuy);
      setSpinner(false);
      return;
    } else {
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      if (comfirmPurchase == false) return;
      setSpinner(true);

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      });

      if (result.error) {
        toast.error(result.error.message, "Try Again");
        setSpinner(false);
      } else {
        if (activeCoupon === false) {
          const res = await axios.post(`${config["api-server"]}/sub`, {
            payment_method: result.paymentMethod.id,
            email: email,
          });
          // eslint-disable-next-line camelcase
          const { client_secret, status, customer_obj, subscription_obj } =
            res.data;

          if (status !== "succeeded") {
            toast.error(
              `${Translations[userLanguage].alerts.purchasefailed} Status ${status}`
            );
            setSpinner(false);
          } else {
            toast.success(Translations[userLanguage].alerts.wowsoeasy);
            setSuccess(true);
            setSpinner(false);
            handleUpdateUserSubscription(JSON.parse(subscription_obj));
            // No additional information was needed
            // Show a success message to your customer
          }
        }
        if (activeCoupon === true) {
          const res = await axios.post(`${config["api-server"]}/sub-coupon`, {
            payment_method: result.paymentMethod.id,
            email: email,
            coupon: coupon,
          });
          // eslint-disable-next-line camelcase
          const { client_secret, status, customer_obj, subscription_obj } =
            res.data;
          if (status !== "succeeded") {
            toast.error(
              `${Translations[userLanguage].alerts.purchasefailed} Status ${status}`
            );
            setSpinner(false);
          } else {
            toast.success(Translations[userLanguage].alerts.wowsoeasy);
            setSuccess(true);
            setSpinner(false);
            handleUpdateUserSubscription(JSON.parse(subscription_obj));
            // No additional information was needed
            // Show a success message to your customer
          }
        }
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (coupon === "") {
      toast.error(Translations[userLanguage].alerts.entercoupon);
      return;
    } else {
      const res = await axios.post(`${config["api-server"]}/get-coupon`, {
        coupon: coupon,
      });
      console.log(res.data);
      if (res.data === "Invalid Coupon") {
        toast.error(Translations[userLanguage].alerts.entervalidcoupon);
        setActiveCoupon(false);
        setCurrentDiscount((currentDiscount = "this field is optional"));
        setDiscount(0);
        setDiscountName("None");
        return;
      } else {
        console.log(res.data);
        setActiveCoupon(true);
        if (res.data.amount_off != null) {
          setCurrentDiscount((currentDiscount = res.data.amount_off + "$ OFF"));
          setDiscountName(
            (discountName = `${res.data.name} ${currentDiscount}`)
          );
          setDiscount(res.data.amount_off);
        }
        if (res.data.percent_off != null) {
          setCurrentDiscount(
            (currentDiscount = res.data.percent_off + "% OFF")
          );
          setDiscountName(
            (discountName = `${res.data.name} (${currentDiscount})`)
          );
          setDiscount((res.data.percent_off / 100) * 10);
        }
        toast.success(Translations[userLanguage].alerts.couponapplied);
        return;
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleComfirmPurchase = (email) => {
    if (email !== null) {
      setComfirmPurchase(true);
      handleSubmitSub();
    } else {
      setComfirmPurchase(false);
      toast.error(Translations[userLanguage].alerts.purchasefailed);
    }
  };

  const ComfirmPurchase = ({ discount, price, discountName, callback }) => {
    return (
      <div>
        <Paper
          style={{
            padding: "35px",
            border: "2px solid black",
            borderRadius: "0px",
            boxShadow: "10px 10px 0px #262626",
          }}
        >
          <Typography variant="h3">Confirm Purchase</Typography>
          <br></br>
          <Typography variant="h5">Classroom Plan</Typography>
          <br></br>
          <Divider />
          <br></br>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Classroom Plan</Typography>
            <Typography variant="subtitle1">{price}$USD</Typography>
          </div>
          <br></br>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Subtotal</Typography>
            <Typography variant="subtitle1">{price}$USD</Typography>
          </div>
          <br></br>
          <Divider />
          <br></br>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">
              Discount: {discountName}
            </Typography>
            <Typography variant="subtitle1">-{discount}$USD</Typography>
          </div>
          <br></br>
          <Divider />
          <br></br>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="subtitle1">{total}$USD</Typography>
          </div>
          <br></br>
          <Divider />
          <br></br>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Amount Paid</Typography>
            <Typography variant="subtitle1">{total}$USD</Typography>
          </div>
          <br></br>
          <Divider />
          <br></br>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "10px" }}
              onClick={() => {
                callback(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              onClick={() => {
                callback(true);
              }}
            >
              Confirm
            </Button>
          </div>
        </Paper>
      </div>
    );
  };

  return (
    <>
      {success ? (
        <ThanksForPurchasingAnimation />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            id="payment__form__wrapper"
            style={
              smallScreen
                ? {
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                  }
            }
          >
            <div
              style={{
                backgroundColor: "#636CFF",
                flex: "40",
                height: "auto",
                padding: "50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "auto",
              }}
            >
              <div>
                <Typography
                  variant="h5"
                  color="white"
                  style={{ textAlign: "left" }}
                >
                  {Translations[userLanguage].plans.classroom.at} <br></br>{" "}
                  <span style={{ fontSize: "1.8em" }}>
                    {Translations[userLanguage].plans.classroom.price}
                  </span>
                  <br></br>
                  {Translations[userLanguage].plans.classroom.permonth}
                </Typography>
                <br></br>
                <Divider />
                <br></br>
                <img
                  alt="classroom-img"
                  height="350px"
                  width="350px"
                  src={TeacherImg}
                ></img>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "start",
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature1
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature2
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature3
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature4
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature5
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature6
                    }
                  </Typography>
                  <Typography variant="subtitle1" className="features">
                    {"✅ "}
                    {
                      Translations[userLanguage].plans.classroom.features
                        .feature7
                    }
                  </Typography>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                flex: "60",
                height: "auto",
                padding: "50px",
              }}
            >
              <Typography
                variant="h4"
                component="h4"
                style={{ textAlign: "left", fontWeight: "bold" }}
              >
                {Translations[userLanguage].paymentform.title}
                <Typography variant="h4" color="#6c63ff">
                  {Translations[userLanguage].paymentform.plan}
                </Typography>
              </Typography>
              <br></br>
              <Divider />
              <br></br>
              <TextField
                label="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail
                        style={{ color: "c4c4c4", opacity: "90%" }}
                      />
                    </InputAdornment>
                  ),
                }}
                id="outlined-email-input"
                helperText={`Email you'll recive updates and receipts on`}
                margin="normal"
                variant="outlined"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Coupon Code *"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Redeem style={{ color: "c4c4c4", opacity: "90%" }} />
                      </InputAdornment>
                    ),
                  }}
                  id="outlined-coupon-input"
                  helperText={currentDiscount}
                  margin="normal"
                  variant="outlined"
                  size={"small"}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="action"
                  style={{ marginTop: "-12px", marginLeft: "5px" }}
                  onClick={() => handleApplyCoupon()}
                >
                  {Translations[userLanguage].paymentform.button}
                </Button>
              </div>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
              <div style={{ height: "40px" }} />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    handleToggle();
                  }}
                  disabled={spinner}
                >
                  {spinner ? (
                    <CircularProgress
                      style={{
                        marginLeft: "32px",
                        marginRight: "32px",
                        color: "white",
                      }}
                      size={20}
                    />
                  ) : (
                    Translations[userLanguage].paymentform.button2
                  )}
                </Button>
              </div>
              <div>
                <Spline scene="https://draft.spline.design/cVPeOJXBIzTwgsNC/scene.spline" />
              </div>
            </div>
            <Backdrop
              style={{ zIndex: "1000" }}
              open={open}
              onClick={() => {
                handleClose();
              }}
            >
              <ComfirmPurchase
                discount={discount}
                discountName={discountName}
                price={price}
                callback={() => handleComfirmPurchase(email)}
              />
            </Backdrop>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;

//create-customer-portal-session
