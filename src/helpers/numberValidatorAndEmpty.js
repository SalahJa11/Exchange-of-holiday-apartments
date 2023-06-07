export function numberValidatorAndEmpty(number) {
  // console.log("received ", number, typeof number, number == "");
  if (number == "") return "";
  // console.log(number);
  // if (!number) return "Can't be empty.";
  if (isNaN(number)) return "Please enter Numeric value";
  var phoneno = /^([0-9]){1,4}$/;
  // var phoneno2 = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  if (!phoneno.test(number)) {
    return "Please enter a right number 0 - 9999";
  }
  return "";
}
