import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '@/components/auth/SignUpForm';
import * as firebaseAuth from 'firebase/auth';
import { useRouter } from 'next/navigation';

describe('SignUpForm Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('debería renderizar el formulario de registro', () => {
    render(<SignUpForm />);
    expect(screen.getAllByText(/crear cuenta/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
  });

  it('debería actualizar el email al escribir', async () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    
    await userEvent.type(emailInput, 'newuser@example.com');
    expect(emailInput.value).toBe('newuser@example.com');
  });

  it('debería actualizar la contraseña al escribir', async () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/^contraseña/i) as HTMLInputElement;
    
    await userEvent.type(passwordInput, 'password123');
    expect(passwordInput.value).toBe('password123');
  });

  it('debería actualizar la confirmación de contraseña al escribir', async () => {
    render(<SignUpForm />);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i) as HTMLInputElement;
    
    await userEvent.type(confirmPasswordInput, 'password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('debería validar que las contraseñas coincidan', async () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password456');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('debería validar que la contraseña tenga al menos 6 caracteres', async () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'pass');
    await userEvent.type(confirmPasswordInput, 'pass');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });

  it('debería llamar a createUserWithEmailAndPassword con credenciales válidas', async () => {
    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'newuser@example.com',
        'password123'
      );
    });
  });

  it('debería redirigir al dashboard después del registro exitoso', async () => {
    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('debería mostrar mensaje de error al fallar el registro', async () => {
    const errorMessage = 'El email ya está registrado';
    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('debería mostrar loading mientras se procesa el registro', async () => {
    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cargando/i })).toBeInTheDocument();
    });
  });

  it('debería deshabilitar el botón mientras se procesa el registro', async () => {
    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i }) as HTMLButtonElement;

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');

    expect(submitButton.disabled).toBe(false);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  it('no debería enviar si las contraseñas no coinciden', async () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'different');
    fireEvent.click(submitButton);

    expect(firebaseAuth.createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('no debería enviar si la contraseña es muy corta', async () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    await userEvent.type(passwordInput, 'pass');
    await userEvent.type(confirmPasswordInput, 'pass');
    fireEvent.click(submitButton);

    expect(firebaseAuth.createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });
});
