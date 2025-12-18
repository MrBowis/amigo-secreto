import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('debería renderizar un input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('debería aceptar placeholder', () => {
    render(<Input placeholder="Enter email" />);
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toBeInTheDocument();
  });

  it('debería aceptar type personalizado', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('debería aceptar valor inicial', () => {
    render(<Input value="Initial value" readOnly />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Initial value');
  });

  it('debería aceptar id', () => {
    render(<Input id="email-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('debería tener required cuando es requerido', () => {
    render(<Input required />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.required).toBe(true);
  });
});
