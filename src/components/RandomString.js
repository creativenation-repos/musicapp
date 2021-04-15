export default function RandomString() {
  let r = Math.random().toString(36).substring(3);
  return r;
}
