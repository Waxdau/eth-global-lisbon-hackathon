import * as io from 'io-ts';
import assert from './assert';

import isType from './isType';

/**
 * Asserts the type provided. This is super useful because the compiler can tell
 * that subsequent uses of value conform to the provided type. (See `assert` for
 * more detail.)
 */
export default function assertType<T>(
  value: unknown,
  type: io.Type<T>,
): asserts value is T {
  assert(
    isType(value, type),
    `assertType failed, value: ${JSON.stringify(value)}, type: ${type.name}`,
  );
}
