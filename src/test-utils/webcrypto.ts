// Jest's jsdom environment does not expose crypto.getRandomValues, although
// every browser this app runs in does. Installing Node's WebCrypto here lets
// the real secure-random code run under test, instead of mocking it away.
import { webcrypto } from 'crypto'

if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })
}
