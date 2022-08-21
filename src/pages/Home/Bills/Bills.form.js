import React from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { IconTextButton, ReferenceLink, Text } from "components/UI";
import { BillsService } from "services/Bills.service";
import { Currency } from "utils/currency";

const referenceValues = [
  {
    field: ["user", "email"],
    url: ["user", "_id"],
    path: "/users",
    label: "User",
  },
  {
    field: ["event", "eventType", "name"],
    url: ["event", "_id"],
    path: "/events",
    label: "Event",
  },
];
const values = [
  {
    field: "data",
    label: "Playing numbers",
  },
];
const eventValues = [
  {
    field: "cost",
    label: "Cost",
  },
  {
    field: "prize",
    label: "Prize",
  },
];
const eventDateValues = [
  {
    field: "date",
    label: "Bought Date",
  },
  {
    field: "from",
    label: "From",
  },
  {
    field: "to",
    label: "To",
  },
];
const BillsForm = () => {
  const service = BillsService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [bill, setBill] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [blockButton, setBlockButton] = React.useState(false);

  const goBack = () => navigate("/dashboard/bills");

  React.useEffect(() => {
    setLoading(true);
    if (!id) {
      setTimeout(() => goBack(), 5000);
      return;
    }

    service.getById(id).then(setBill).catch(goBack);
  }, [id]);

  const markAsClaimed = () => {
    setBlockButton(true);
    service.createAt(`${id}/claim`, {}).then(() => {
      setBill({ ...bill, claimed: true });
      setBlockButton(false);
    });
  };

  const markAsPaid = () => {
    setBlockButton(true);
    service.createAt(`${id}/pay`, {}).then(() => {
      setBill({ ...bill, paid: true });
      setBlockButton(false);
    });
  };

  if (!bill && loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Text variant="h4">{`Bill: ${id}`}</Text>
      </Grid>
      <Grid item xs={12}>
        <Text>Data</Text>
      </Grid>
      {referenceValues.map((reference) => (
        <Grid
          item
          xs={12}
          key={`bill-${bill._id}-reference-values-${reference.field}`}
        >
          <Text>{reference.label}</Text>
          <ReferenceLink
            to={`${reference.path}/${R.pipe(
              R.pathOr("", reference.url),
              R.split(":"),
              R.last
            )(bill)}`}
          >
            <Text>{R.pathOr("", reference.field, bill)}</Text>
          </ReferenceLink>
        </Grid>
      ))}

      <Grid item xs={4}>
        <Text>Is Claimed</Text>
        <Text>
          {!bill.claimed ? (
            <IconTextButton
              onClick={() => markAsClaimed()}
              type="button"
              variant="contained"
              color="primary"
              disabled={blockButton}
            >
              No, Mark as claimed
            </IconTextButton>
          ) : (
            <CheckIcon />
          )}
        </Text>
      </Grid>
      <Grid item xs={8}>
        <Text>Is Paid</Text>
        <Text>
          {!bill.paid ? (
            <IconTextButton
              onClick={() => markAsPaid()}
              type="button"
              variant="contained"
              color="primary"
              disabled={blockButton}
            >
              No, Mark as paid
            </IconTextButton>
          ) : (
            <CheckIcon />
          )}
        </Text>
      </Grid>
      {values.map((value) => (
        <Grid item xs={4} key={`bill-${bill._id}-event-values-${value.field}`}>
          <Text>{value.label}</Text>
          <Text>{bill[value.field].join(", ")}</Text>
        </Grid>
      ))}
      {eventValues.map((value) => (
        <Grid item xs={4} key={`bill-${bill._id}-event-values-${value.field}`}>
          <Text>{value.label}</Text>
          <Text>{Currency(bill.event[value.field] || 0)}</Text>
        </Grid>
      ))}
      {eventDateValues.map((value) => (
        <Grid item xs={4} key={`bill-${bill._id}-event-values-${value.field}`}>
          <Text>{value.label}</Text>
          <Text>{dayjs(bill.event[value.field]).format("LLL")}</Text>
        </Grid>
      ))}
    </Grid>
  );
};

export default BillsForm;
