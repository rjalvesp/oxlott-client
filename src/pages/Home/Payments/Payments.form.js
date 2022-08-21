import React from "react";
import * as R from "ramda";
import { Text, ReferenceLink } from "components/UI";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import { PaymentsService } from "services/Payments.service";
import { Currency } from "utils/currency";

const referenceValues = [
  {
    field: ["user", "email"],
    url: ["user", "sub"],
    path: "/users",
    label: "User",
  },
];
const stripeValues = [
  {
    field: "amountSubtotal",
    label: "Amount Sub Total",
  },
  {
    field: "amountTotal",
    label: "Total",
  },
  {
    field: "checkoutSession",
    label: "Session",
  },
  {
    field: "paymentIntentId",
    label: "Payment Intent ID",
  },
  {
    field: "paymentId",
    label: "Payment ID",
  },
];

const PaymentsForm = () => {
  const service = PaymentsService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [payment, setPayment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/dashboard/payments");

  React.useEffect(() => {
    setLoading(true);
    if (!id) {
      setTimeout(() => goBack(), 5000);
      return;
    }

    service.getById(id).then(setPayment).catch(goBack);
  }, [id]);

  if (!payment && loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Text variant="h4">{`Payment: ${id}`}</Text>
      </Grid>
      <Grid item xs={12}>
        <Text>Data</Text>
      </Grid>
      {referenceValues.map((reference) => (
        <Grid
          item
          xs={4}
          key={`payment-${payment._id}-reference-values-${reference.field}`}
        >
          <Text>{reference.label}</Text>
          <ReferenceLink
            to={`${reference.path}/${R.pathOr("", reference.url, payment)}`}
          >
            <Text>{R.pathOr("", reference.field, payment)}</Text>
          </ReferenceLink>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Text>Stripe Values</Text>
      </Grid>
      {stripeValues.map((stripe) => (
        <Grid
          item
          xs={4}
          key={`payment-${payment._id}-stripe-values-${stripe.field}`}
        >
          <Text>{stripe.label}</Text>
          <Text>
            {R.is(Number, payment[stripe.field])
              ? Currency((payment[stripe.field] || 0) / 100)
              : payment[stripe.field]}
          </Text>
        </Grid>
      ))}
    </Grid>
  );
};

export default PaymentsForm;
