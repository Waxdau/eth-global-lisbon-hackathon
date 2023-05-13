export default function makeId() {
  // >128 bits of entropy as base36 (0-9a-z)
  return [
    Math.random().toString(36).slice(2, 11),
    Math.random().toString(36).slice(2, 11),
    Math.random().toString(36).slice(2, 11),
  ]
    .join('')
    .slice(0, 25);
}
