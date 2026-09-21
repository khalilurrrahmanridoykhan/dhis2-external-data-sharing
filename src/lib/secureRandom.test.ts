import '../test-utils/webcrypto'
import { secureRandomChar, secureRandomInt } from './secureRandom'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('secureRandomInt', () => {
  test('returns integers within [0, max)', () => {
    for (let i = 0; i < 500; i++) {
      const value = secureRandomInt(7)
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(7)
    }
  })

  test('max of 1 always returns 0', () => {
    expect(secureRandomInt(1)).toBe(0)
  })

  test('reaches every value in a small range', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 500; i++) seen.add(secureRandomInt(4))
    expect([...seen].sort()).toEqual([0, 1, 2, 3])
  })

  test('rejects invalid bounds', () => {
    expect(() => secureRandomInt(0)).toThrow(RangeError)
    expect(() => secureRandomInt(-3)).toThrow(RangeError)
    expect(() => secureRandomInt(2.5)).toThrow(RangeError)
    expect(() => secureRandomInt(2 ** 32 + 1)).toThrow(RangeError)
  })

  test('discards values from the biased tail of the 32-bit range and draws again', () => {
    // For max = 10 the unbiased limit is 2^32 - (2^32 % 10) = 4294967290.
    // A first draw at or above it must be rejected; the retry is used.
    const draws = [4294967295, 4294967290, 13]
    const getRandomValues = jest.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(((array: Uint32Array) => {
      array[0] = draws.shift() as number
      return array
    }) as typeof globalThis.crypto.getRandomValues)

    expect(secureRandomInt(10)).toBe(3)
    expect(getRandomValues).toHaveBeenCalledTimes(3)
  })

  test('throws instead of falling back to Math.random when secure randomness is unavailable', () => {
    const mathRandom = jest.spyOn(Math, 'random')
    const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true })
    try {
      expect(() => secureRandomInt(10)).toThrow('Secure random number generation is not available')
      expect(mathRandom).not.toHaveBeenCalled()
    } finally {
      if (original) Object.defineProperty(globalThis, 'crypto', original)
    }
  })
})

describe('secureRandomChar', () => {
  test('returns a character from the pool', () => {
    for (let i = 0; i < 100; i++) {
      expect('abc').toContain(secureRandomChar('abc'))
    }
  })
})
