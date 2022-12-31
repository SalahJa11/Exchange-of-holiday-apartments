export function phoneNumberValidator(input) {
  let number = "";
  if (!input) return "Phone number can't be empty.";
  if (typeof input === "string" || input instanceof String) number = input;
  else number = input.toString();
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneno.test(number)) {
    if (number.length < 10)
      return "phone number must be at least 10 numbers long.";
    return "";
  } else {
    return "Not a valid Phone Number";
  }
}
