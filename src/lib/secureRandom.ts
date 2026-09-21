// Cryptographically secure random integers, used wherever this app generates
// a credential (the one-time temporary password) or an identifier that must
// not be guessable. Math.random() is not suitable for that: it is not a
// cryptographic random number generator and its output can be predicted.
//
// There is deliberately no Math.random() fallback. If the browser cannot
// provide secure randomness, generating a credential must fail rather than
// quietly produce a weaker one.

const RANGE = 2 ** 32

/** Returns a uniformly distributed integer in [0, maxExclusive). */
export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > RANGE) {
    throw new RangeError('secureRandomInt: maxExclusive must be an integer between 1 and 2^32.')
  }

  const cryptoObject = globalThis.crypto
  if (!cryptoObject || typeof cryptoObject.getRandomValues !== 'function') {
    throw new Error('Secure random number generation is not available in this browser.')
  }

  // Rejection sampling: discard values from the final partial block of the
  // 32-bit range, so every result in [0, maxExclusive) is equally likely
  // (a plain `value % max` would favour the lower numbers).
  const limit = RANGE - (RANGE % maxExclusive)
  const buffer = new Uint32Array(1)
  let value: number
  do {
    cryptoObject.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)

  return value % maxExclusive
}

/** Picks one character from `pool` using secure randomness. */
export function secureRandomChar(pool: string): string {
  return pool[secureRandomInt(pool.length)]
}
