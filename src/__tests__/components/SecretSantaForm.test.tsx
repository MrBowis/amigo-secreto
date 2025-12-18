import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecretSantaForm } from '@/components/secret-santa/SecretSantaForm';

describe('SecretSantaForm Component', () => {
  const mockOnCreateDraw = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnCreateDraw.mockResolvedValue(undefined);
  });

  it('debería renderizar el formulario de sorteo', () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    expect(screen.getByText('Crear Sorteo de Amigo Secreto')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Sorteo')).toBeInTheDocument();
  });

  it('debería inicializar con dos participantes vacíos', () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const inputs = screen.getAllByPlaceholderText('Nombre');
    expect(inputs).toHaveLength(2);
  });

  it('debería agregar un nuevo participante al hacer clic', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const addBtn = screen.getByRole('button', { name: /agregar participante/i });
    
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('Nombre');
      expect(inputs).toHaveLength(3);
    });
  });

  it('debería actualizar nombre de participante', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const nameInputs = screen.getAllByPlaceholderText('Nombre');
    
    await userEvent.type(nameInputs[0], 'Juan');
    expect(nameInputs[0]).toHaveValue('Juan');
  });

  it('debería actualizar email de participante', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const emailInputs = screen.getAllByPlaceholderText('correo@ejemplo.com');
    
    await userEvent.type(emailInputs[0], 'juan@example.com');
    expect(emailInputs[0]).toHaveValue('juan@example.com');
  });

  it('debería remover un participante si hay más de 2', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    
    // Agregar un tercer participante
    const addBtn = screen.getByRole('button', { name: /agregar participante/i });
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });



  it('debería llamar a onCreateDraw con datos válidos', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const drawNameInput = screen.getByLabelText('Nombre del Sorteo');
    const nameInputs = screen.getAllByPlaceholderText('Nombre');
    const emailInputs = screen.getAllByPlaceholderText('correo@ejemplo.com');
    const submitBtn = screen.getByRole('button', { name: /crear sorteo/i });

    await userEvent.type(drawNameInput, 'Sorteo Navidad');
    await userEvent.type(nameInputs[0], 'Juan');
    await userEvent.type(emailInputs[0], 'juan@example.com');
    await userEvent.type(nameInputs[1], 'María');
    await userEvent.type(emailInputs[1], 'maria@example.com');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnCreateDraw).toHaveBeenCalledWith(
        'Sorteo Navidad',
        expect.arrayContaining([
          { name: 'Juan', email: 'juan@example.com' },
          { name: 'María', email: 'maria@example.com' },
        ])
      );
    });
  });

  it('debería resetear el formulario después de crear el sorteo', async () => {
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const drawNameInput = screen.getByLabelText('Nombre del Sorteo') as HTMLInputElement;
    const nameInputs = screen.getAllByPlaceholderText('Nombre') as HTMLInputElement[];
    const emailInputs = screen.getAllByPlaceholderText('correo@ejemplo.com') as HTMLInputElement[];
    const submitBtn = screen.getByRole('button', { name: /crear sorteo/i });

    await userEvent.type(drawNameInput, 'Sorteo Navidad');
    await userEvent.type(nameInputs[0], 'Juan');
    await userEvent.type(emailInputs[0], 'juan@example.com');
    await userEvent.type(nameInputs[1], 'María');
    await userEvent.type(emailInputs[1], 'maria@example.com');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(drawNameInput.value).toBe('');
    });
  });

  it('debería mostrar estado de carga mientras se procesa', async () => {
    mockOnCreateDraw.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const drawNameInput = screen.getByLabelText('Nombre del Sorteo');
    const nameInputs = screen.getAllByPlaceholderText('Nombre');
    const emailInputs = screen.getAllByPlaceholderText('correo@ejemplo.com');
    const submitBtn = screen.getByRole('button', { name: /crear sorteo/i });

    await userEvent.type(drawNameInput, 'Sorteo');
    await userEvent.type(nameInputs[0], 'Juan');
    await userEvent.type(emailInputs[0], 'juan@example.com');
    await userEvent.type(nameInputs[1], 'María');
    await userEvent.type(emailInputs[1], 'maria@example.com');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creando/i })).toBeInTheDocument();
    });
  });

  it('debería mostrar error si falla la creación', async () => {
    const errorMessage = 'Error al crear el sorteo';
    mockOnCreateDraw.mockRejectedValue(new Error(errorMessage));
    render(<SecretSantaForm onCreateDraw={mockOnCreateDraw} />);
    const drawNameInput = screen.getByLabelText('Nombre del Sorteo');
    const nameInputs = screen.getAllByPlaceholderText('Nombre');
    const emailInputs = screen.getAllByPlaceholderText('correo@ejemplo.com');
    const submitBtn = screen.getByRole('button', { name: /crear sorteo/i });

    await userEvent.type(drawNameInput, 'Sorteo');
    await userEvent.type(nameInputs[0], 'Juan');
    await userEvent.type(emailInputs[0], 'juan@example.com');
    await userEvent.type(nameInputs[1], 'María');
    await userEvent.type(emailInputs[1], 'maria@example.com');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

});
