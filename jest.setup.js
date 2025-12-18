import '@testing-library/jest-dom'

// Mock de firebase/app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'default' })),
  getApps: jest.fn(() => []),
}))

// Mock de firebase/auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null)
    return jest.fn()
  }),
}))

// Mock de next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => ''),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))