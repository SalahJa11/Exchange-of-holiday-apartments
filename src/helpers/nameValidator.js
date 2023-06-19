export function nameValidator(name) {
  if (!name) return "Name can't be empty.";
  if (name.length < 5 || name.length > 15)
    return "Name need to be between 5-15 characters.";
  return "";
}
