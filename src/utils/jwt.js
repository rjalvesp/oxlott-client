import * as R from "ramda";

export const parseJwt = R.pipe(
  R.split("."),
  R.propOr("", "1"),
  R.replace(/-/g, "+"),
  R.replace(/_/g, "/"),
  atob,
  R.split(""),
  R.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)),
  R.join(""),
  decodeURIComponent,
  JSON.parse
);
