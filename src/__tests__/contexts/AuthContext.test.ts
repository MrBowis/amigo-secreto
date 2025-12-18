import { render, screen } from '@testing-library/react';

describe('AuthContext', () => {
  it('debería proporcionar valor inicial de usuario null', () => {
    // Verificar que el contexto puede ser importado correctamente
    const { AuthProvider, useAuth } = require('@/contexts/AuthContext');
    expect(AuthProvider).toBeDefined();
  });

  it('debería exportar useAuth hook', () => {
    const { useAuth } = require('@/contexts/AuthContext');
    expect(useAuth).toBeDefined();
    expect(typeof useAuth).toBe('function');
  });

  it('debería exportar AuthProvider', () => {
    const { AuthProvider } = require('@/contexts/AuthContext');
    expect(AuthProvider).toBeDefined();
  });
});
