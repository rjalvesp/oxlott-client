import * as R from "ramda";
import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
dayjs.extend(dayjsUtc);

export const limit = 10;

export const getSorting = (sorting) => {
  let sort = [{ createdAt: "desc" }];
  if (sorting) {
    sort = [{ [sorting.field]: sorting.sort.toLowerCase() }];
  }
  return { sort };
};

export const getValue = ({ op, value }) => {
  if (!value) {
    return {};
  }
  switch (op) {
    case "!=": {
      return { $not: value };
    }
    case ">": {
      return { $gt: value };
    }
    case ">=": {
      return { $gte: value };
    }
    case "<": {
      return { $lt: value };
    }
    case "<=": {
      return { $lte: value };
    }
    case "startsWith": {
      return { $regex: `(?i)^${value}` };
    }
    case "endsWith": {
      return { $regex: `(?i)${value}$` };
    }
    case "contains": {
      return { $regex: `(?i)${value}` };
    }
    case "not": {
      const date = dayjs(value);
      if (!date.isValid()) {
        return {};
      }
      return { $ne: date.utc().format() };
    }
    case "after": {
      const date = dayjs(value);
      if (!date.isValid()) {
        return {};
      }
      return { $gt: date.utc().format() };
    }
    case "before": {
      const date = dayjs(value);
      if (!date.isValid()) {
        return {};
      }
      return { $lt: date.utc().format() };
    }
    case "onOrAfter": {
      const date = dayjs(value);
      if (!date.isValid()) {
        return {};
      }
      return { $gte: date.utc().format() };
    }
    case "onOrBefore": {
      const date = dayjs(value);
      if (!date.isValid()) {
        return {};
      }
      return { $lte: date.utc().format() };
    }
    case "isEmpty": {
      return {
        $in: ["", 0],
      };
    }
    case "isNotEmpty": {
      return {
        $not: { $in: ["", 0] },
      };
    }
    case "isAnyOf": {
      return { $in: value };
    }
    case "=":
    case "is":
    case "equals":
    default:
      return value;
  }
};

export const getFiltering = (filters) => {
  if (!filters || R.isEmpty(filters)) {
    return [];
  }
  return R.pipe(
    R.unless(R.is(Array), (filterValue) => [filterValue]),
    R.map(({ columnField: field, operatorValue: op, value }) =>
      R.unless(R.isEmpty, R.objOf(field), getValue({ op, value }))
    ),
    R.mergeAll,
    R.objOf("selector")
  )(filters);
};

export const transformInvertedBoolean = (field) =>
  R.pipe(
    R.unless(R.is(Array), (value) => [value]),
    R.map(
      R.when(
        R.propEq("columnField", field),
        R.over(
          R.lensProp("value"),
          R.pipe((value) => value === "false")
        )
      )
    )
  );

export const transformBoolean = (field) =>
  R.map(
    R.when(
      R.propEq("columnField", field),
      R.over(R.lensProp("value"), (value) => value === "true")
    )
  );
