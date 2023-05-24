export default function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
  const randomChars = Math.random().toString(36).slice(2, 5); // Generate a random string

  return timestamp + randomChars;
}
