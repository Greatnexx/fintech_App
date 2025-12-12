// utils/excludeFields.js
export function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}

// object.entries turns the user object into an array of [key, value] pairs. // e.g ["name", "Daniel"],
// filter out any key that is in this array
// object.from entries convert the filtered array back to object
