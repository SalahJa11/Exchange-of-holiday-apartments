export function idValidator(id) {
  if (!id) return "Id can't be empty.";
  var id = String(id).trim();
  if (id.length > 9 || id.length < 5 || isNaN(id))
    return "Not a valid Id number";

  // Pad string with zeros up to 9 digits
  id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
  //   console.log("id", id);
  if (
    Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) %
      10 ===
    0
  )
    return "";
  else return "Not a valid Id number";
  //   return (
  //     Array.from(id, Number).reduce((counter, digit, i) => {
  //       const step = digit * ((i % 2) + 1);
  //       return counter + (step > 9 ? step - 9 : step);
  //     }) %
  //       10 ===
  //     0
  //   );
}

// Usage
// ["1234567890", "001200343", "231740705", "339677395"].map(function (e) {
//   console.log(
//     e +
//       " is " +
//       (isValidIsraeliID(e) ? "a valid" : "an invalid") +
//       " Israeli ID"
//   );
// });
