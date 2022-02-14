import * as R from "ramda";

export const validateEmail = (value) => {
  if (!value) {
    return { code: "required", text: "Email is required" };
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return { code: "invalid", text: "Email is invalid" };
  }
  if (value.length < 4) {
    return { code: "minlength", text: "Email is too short" };
  }
  if (value.length > 24) {
    return { code: "maxlength", text: "Email is too long" };
  }
};

export const validateCode = (value) => {
  if (!value) {
    return { code: "required", text: "Code is required" };
  }
  if (isNaN(value)) {
    return { code: "invalid", text: "Code is invalid" };
  }
  if (`${value}`.length < 6) {
    return { code: "minlength", text: "Code is too short" };
  }
  if (`${value}`.length > 6) {
    return { code: "maxlength", text: "Code is too long" };
  }
};

const isMin = (value, min) => value <= min;

const isMax = (value, min) => value >= min;

const isMinLength = (value, minLength) => value.length <= minLength;

const isMaxLength = (value, maxLength) => value.length >= maxLength;

const isPattern = (value, pattern) => value.match(new RegExp(pattern));

export const validateString = (
  value,
  field,
  { minLength, maxLength, required, pattern } = {}
) => {
  if (required && !value) {
    return { code: "required", text: `${field} is required` };
  }

  if (pattern && !isPattern(value)) {
    return { code: "pattern mismatch", text: `${field} is invalid` };
  }

  if (!isNaN(minLength) && !isMinLength(value, minLength)) {
    return {
      code: "minLength",
      text: `${field} length is less than ${minLength}`,
    };
  }

  if (!isNaN(maxLength) && !isMaxLength(value, maxLength)) {
    return {
      code: "maxLength",
      text: `${field} length is less than ${maxLength}`,
    };
  }
};

export const validateNumber = (value, field, { min, max, required }) => {
  if (required && !isNaN(value)) {
    return { code: "required", text: `${field} is required` };
  }

  if (!isNaN(min) && !isMin(value, min)) {
    return {
      code: "minLength",
      text: `${field} is less than ${min}`,
    };
  }

  if (!isNaN(max) && !isMax(value, max)) {
    return {
      code: "maxLength",
      text: `${field} is less than ${max}`,
    };
  }
};

export const isFormValid = R.pipe(
  R.values,
  R.reject(R.isNil),
  R.propEq("length", 0)
);

export const validateTimeSpan = (value, field) => {
  if (!value || R.isEmpty(value)) {
    return { code: "required", text: `${field} is required` };
  }
  const errors = [];

  for (const row of value) {
    const {
      starts,
      duration: { days, minutes, hours } = { days: 0, minutes: 0, hours: 0 },
    } = row;
    errors.push({
      starts: validateString(starts && starts.format(), "Starts at", {
        required: true,
      }),
      duration: {
        days: validateNumber(days, "Days", { required: true, min: 0 }),
        minutes: validateNumber(minutes, "Minutes", {
          required: true,
          min: 0,
        }),
        hours: validateNumber(hours, "Hours", { required: true, min: 0 }),
      },
    });
  }

  if (R.find(R.find(isFormValid), R.pluck("duration", errors))) {
    return errors;
  }

  if (R.find(R.find(isFormValid), R.map(R.pick("starts"), errors))) {
    return errors;
  }
};
