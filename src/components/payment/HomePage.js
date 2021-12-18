import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
// MUI Components
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Backdrop,
  Paper,
} from "@material-ui/core";
// stripe
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// Util imports
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
// Custom Components
import CardInput from "./CardInput";
import ThanksForPurchasingAnimation from "./ThanksForPurchasingAnimation";
//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//material-icons
import { Redeem, AlternateEmail } from "@material-ui/icons";

import Translations from "../../translations/translations.json";

import { useMutation, gql } from "@apollo/client";

import { useSelector } from "react-redux";

const UPDATE_USER_SUBSCRIPTION = gql`
  mutation ($id: ID!, $plan: String!, $subscriptionDetails: String!) {
    updateUserSubscription(
      id: $id
      plan: $plan
      subscriptionDetails: $subscriptionDetails
    )
  }
`;

toast.configure();

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: "35vh auto",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  div: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  button: {
    margin: "2em auto 1em",
  },
});

function HomePage(props) {
  const classes = useStyles();
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

  const [open, setOpen] = useState(false);

  const [userLanguage] = useState(
    localStorage.getItem("connectLanguage") || "english"
  );

  const [updateUserSubscriptionMutation] = useMutation(
    UPDATE_USER_SUBSCRIPTION
  );

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setTotal(price - discount);
    console.log(total);
    if (discount >= price) {
      setTotal(0);
    }
    return () => {
      setTotal(0);
    };
  }, [discount]);

  useEffect(() => {
    if (plan === "Starter") return;
    if (plan !== "Starter") {
      window.location.href = "/plans";
      toast.warn(Translations[userLanguage].alreadyhaveplan);
    }
  }, [plan]);

  const handleUpdateUserSubscription = async (subscriptionDetails) => {
    const subscriptionObj = {
      id: JSON.parse(localStorage.getItem("user")).profileObj.googleId,
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

    const res = await axios.post(
      "https://connect-backend-2.herokuapp.com/pay",
      { email: email }
    );

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
        renderAnimation();
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const handleSubmitSub = async (event) => {
    if (JSON.parse(localStorage.getItem("user")) == null) {
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
        console.log(result.error.message);
        toast.error(result.error.message, "Try Again");
        setSpinner(false);
      } else {
        if (activeCoupon === false) {
          const res = await axios.post(
            "https://connect-backend-2.herokuapp.com/sub",
            { payment_method: result.paymentMethod.id, email: email }
          );
          // eslint-disable-next-line camelcase
          const { client_secret, status, customer_obj, subscription_obj } =
            res.data;
          console.log(JSON.parse(customer_obj).id);
          console.log(JSON.parse(subscription_obj));

          if (status === "requires_action") {
            stripe.confirmCardPayment(client_secret).then(function (result) {
              if (result.error) {
                console.log("There was an issue!");
                console.log(result.error);
                toast.error(result.error);
                setSpinner(false);
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc)
              } else {
                console.log(Translations[userLanguage].alerts.wowsoeasy);
                console.log(res.data);
                toast.success(Translations[userLanguage].alerts.wowsoeasy);
                renderAnimation();
                setSpinner(false);
                console.log(result);
                handleUpdateUserSubscription(JSON.parse(subscription_obj));
                // Show a success message to your customer
              }
            });
          } else {
            console.log(Translations[userLanguage].alerts.wowsoeasy);
            console.log(res.data);
            toast.success(Translations[userLanguage].alerts.wowsoeasy);
            renderAnimation();
            setSpinner(false);
            console.log(result);
            handleUpdateUserSubscription(JSON.parse(subscription_obj));
            // No additional information was needed
            // Show a success message to your customer
          }
        }
        if (activeCoupon === true) {
          const res = await axios.post(
            "https://connect-backend-2.herokuapp.com/sub-coupon",
            {
              payment_method: result.paymentMethod.id,
              email: email,
              coupon: coupon,
            }
          );
          // eslint-disable-next-line camelcase
          const { client_secret, status, customer_obj, subscription_obj } =
            res.data;
          console.log(JSON.parse(customer_obj).id);
          console.log(JSON.parse(subscription_obj));

          if (status === "requires_action") {
            stripe.confirmCardPayment(client_secret).then(function (result) {
              if (result.error) {
                console.log("There was an issue!");
                console.log(result.error);
                toast.error(result.error);
                setSpinner(false);
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc)
              } else {
                console.log(Translations[userLanguage].alerts.wowsoeasy);
                console.log(res.data);
                toast.success(Translations[userLanguage].alerts.wowsoeasy);
                renderAnimation();
                setSpinner(false);
                console.log(result);
                handleUpdateUserSubscription(JSON.parse(subscription_obj));
                // Show a success message to your customer
              }
            });
          } else {
            console.log(Translations[userLanguage].alerts.wowsoeasy);
            console.log(res.data);
            toast.success(Translations[userLanguage].alerts.wowsoeasy);
            renderAnimation();
            setSpinner(false);
            console.log(result);
            handleUpdateUserSubscription(JSON.parse(subscription_obj));
            // No additional information was needed
            // Show a success message to your customer
          }
        }
      }
    }
  };

  const renderAnimation = () => {
    ReactDOM.render(
      <ThanksForPurchasingAnimation />,
      document.getElementById("paymentFormCard")
    );
    setSpinner(false);
  };

  const handleApplyCoupon = async () => {
    if (coupon === "") {
      toast.error(Translations[userLanguage].alerts.entercoupon);
      return;
    } else {
      const res = await axios.post(
        `https://connect-backend-2.herokuapp.com/get-coupon`,
        { coupon: coupon }
      );
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

  const handleComfirmPurchase = (childData) => {
    if (childData === true) {
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
    <Card
      id="paymentFormCard"
      className={classes.root}
      style={{
        padding: "10px",
        border: "2px solid black",
        boxShadow: "10px 10px 0px #262626",
        borderRadius: "0px",
      }}
    >
      <CardContent className={classes.content}>
        <Typography variant="h4" component="h4">
          {Translations[userLanguage].paymentform.title}
        </Typography>
        <br></br>
        <Typography variant="h5">
          {props.match.params.plan === "classroom"
            ? Translations[userLanguage].paymentform.plan
            : "Premium Plan"}
        </Typography>
        <br></br>
        <Divider />
        <br></br>
        <TextField
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmail style={{ color: "c4c4c4", opacity: "90%" }} />
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
            color="primary"
            style={{ marginTop: "-12px", marginLeft: "5px" }}
            onClick={() => handleApplyCoupon()}
          >
            {Translations[userLanguage].paymentform.button}
          </Button>
        </div>
        <CardInput />
        <div className={classes.div}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              handleToggle();
            }}
          >
            {spinner ? (
              <CircularProgress
                style={{ marginLeft: "32px", marginRight: "32px" }}
                size={20}
              />
            ) : (
              Translations[userLanguage].paymentform.button2
            )}
          </Button>
        </div>
      </CardContent>
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
          callback={handleComfirmPurchase}
        />
      </Backdrop>
    </Card>
  );
}

export default HomePage;

//create-customer-portal-session
