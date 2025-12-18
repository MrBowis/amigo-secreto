import nextJest from 'next/jest.js'

// Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y archivos .env
const createJestConfig = nextJest({
  // Ruta al directorio base del proyecto
  dir: './',
})

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Manejo de alias de rutas (si usas @/components/...)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

// createJestConfig se exporta de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js
export default createJestConfig(customJestConfig)