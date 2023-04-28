export function fixDate(
  date,
  sample = "02/15/23 || 02/15/2023, also accepts numbers  >> 15/02/2023"
) {
  console.log(typeof date);
  if (typeof date === "number") {
    console.log(typeof date);
    let temp = new Date(date).toLocaleDateString("en-US");
    return fixDate(temp);
  }
  if (typeof date === "string") {
    console.log("sample got ", date);
    if (typeof date !== "string") return "UnSet";
    let temp = date.split("/");
    return (
      temp[1] +
      "/" +
      temp[0] +
      "/" +
      (temp[2].length === 2 ? "20/" + temp[2] : temp[2])
    );
  }
}
export function googleDateToJavaDate(timestamp) {
  return new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  ).getTime();
}
