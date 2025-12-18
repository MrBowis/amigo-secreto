import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import * as firebaseAuth from 'firebase/auth';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

describe('LoginForm Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('debería renderizar el formulario de login', () => {
    render(<LoginForm />);
    expect(screen.getAllByText(/iniciar sesión/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('debería tener los campos requeridos', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
    
    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  it('debería actualizar el email al escribir', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    
    await userEvent.type(emailInput, 'test@example.com');
    expect(emailInput.value).toBe('test@example.com');
  });

  it('debería actualizar la contraseña al escribir', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
    
    await userEvent.type(passwordInput, 'password123');
    expect(passwordInput.value).toBe('password123');
  });

  it('debería mostrar loading mientras se procesa el login', async () => {
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cargando/i })).toBeInTheDocument();
    });
  });

  it('debería llamar a signInWithEmailAndPassword con credenciales correctas', async () => {
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });
  });

  it('debería redirigir al dashboard después del login exitoso', async () => {
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('debería mostrar mensaje de error al fallar el login', async () => {
    const errorMessage = 'Email no encontrado';
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('debería deshabilitar el botón mientras se procesa el login', async () => {
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i }) as HTMLButtonElement;

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    expect(submitButton.disabled).toBe(false);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  it('debería limpiar errores previos al intentar nuevamente', async () => {
    (firebaseAuth.signInWithEmailAndPassword as jest.Mock)
      .mockRejectedValueOnce(new Error('Error inicial'))
      .mockResolvedValueOnce({});

    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Primer intento falla
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error inicial')).toBeInTheDocument();
    });

    // Segundo intento
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Error inicial')).not.toBeInTheDocument();
    });
  });
});
