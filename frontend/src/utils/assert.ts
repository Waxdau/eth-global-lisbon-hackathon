export default function assert(
  condition: boolean,
  msg = 'assertion failed',
): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
