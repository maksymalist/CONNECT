//@ts-nocheck
import React from "react";
import "../../style/style.css";
import ClassroomPlanForm from "./ClassroomPlanFrom";
// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_live_51JMw6pBqTzgw1Au7Y06gQdURUJrgclwkr0hpdfIvGoKd9sLugfqbnBe6lC5d6bF6fdnlbxgutmmH0933EqR3cii000BXjkHPZD"
);
export default function StripeSubscriptions({ match }) {
  return (
    <div id="paymentIntent" className="center-div">
      <div>
        <Elements stripe={stripePromise}>
          <ClassroomPlanForm match={match} />
        </Elements>
      </div>
    </div>
  );
}
