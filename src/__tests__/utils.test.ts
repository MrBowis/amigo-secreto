import { cn } from '@/lib/utils';

describe('Utils - cn (classnames utility)', () => {
  it('debería combinar clases correctamente', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
  });

  it('debería manejar strings vacíos', () => {
    const result = cn('', 'px-2', '');
    expect(result).toContain('px-2');
  });

  it('debería resolver conflictos de Tailwind', () => {
    const result = cn('px-2 px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2 px-4');
  });

  it('debería manejar objetos condicionales', () => {
    const isActive = true;
    const result = cn({ 'bg-red-500': isActive });
    expect(result).toContain('bg-red-500');
  });

  it('debería excluir clases cuando la condición es false', () => {
    const isActive = false;
    const result = cn({ 'bg-red-500': isActive });
    expect(result).not.toContain('bg-red-500');
  });

  it('debería combinar múltiples tipos', () => {
    const result = cn('p-4', { 'bg-blue-500': true }, ['mx-2']);
    expect(result).toContain('p-4');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('mx-2');
  });
});
