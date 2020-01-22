export default function(obj, key, fallback = '') {
  return key in obj ? obj[key] : fallback
}
