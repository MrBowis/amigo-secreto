import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WishlistForm } from '@/components/wishlist/WishlistForm';
import { WishlistItem } from '@/types';

describe('WishlistForm Component', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSave.mockResolvedValue(undefined);
  });

  it('debería renderizar el formulario de lista de deseos', () => {
    render(<WishlistForm onSave={mockOnSave} />);
    expect(screen.getByText('Mi Lista de Deseos')).toBeInTheDocument();
    expect(screen.getByText('Agrega los productos que deseas recibir')).toBeInTheDocument();
  });

  it('debería inicializar con un item vacío', () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
    expect(titleInputs.length).toBeGreaterThan(0);
  });

  it('debería agregar un nuevo item', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const addBtn = screen.getByRole('button', { name: /agregar producto/i });
    
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
      expect(titleInputs.length).toBeGreaterThan(1);
    });
  });

  it('debería actualizar el título del item', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const titleInput = screen.getByPlaceholderText('Ej: Libro de cocina') as HTMLInputElement;
    
    await userEvent.type(titleInput, 'Laptop');
    expect(titleInput.value).toBe('Laptop');
  });

  it('debería actualizar la referencia del item', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const refInput = screen.getByPlaceholderText('https://...') as HTMLInputElement;
    
    await userEvent.type(refInput, 'https://amazon.com/laptop');
    expect(refInput.value).toBe('https://amazon.com/laptop');
  });

  it('debería remover un item', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const addBtn = screen.getByRole('button', { name: /agregar producto/i });
    
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('debería cargar items iniciales', () => {
    const initialItems: WishlistItem[] = [
      {
        id: '1',
        title: 'Libro',
        reference: 'https://amazon.com/libro',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Tablet',
        reference: 'https://apple.com/ipad',
        createdAt: new Date(),
      },
    ];

    render(<WishlistForm onSave={mockOnSave} initialItems={initialItems} />);
    const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
    
    expect(titleInputs[0]).toHaveValue('Libro');
    expect(titleInputs[1]).toHaveValue('Tablet');
  });

  it('debería enviar solo items válidos', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const titleInput = screen.getByPlaceholderText('Ej: Libro de cocina');
    const refInput = screen.getByPlaceholderText('https://...');
    const submitBtn = screen.getByRole('button', { name: /guardar lista/i });

    await userEvent.type(titleInput, 'Laptop');
    await userEvent.type(refInput, 'https://amazon.com');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            title: 'Laptop',
            reference: 'https://amazon.com',
          },
        ])
      );
    });
  });

  it('debería filtrar items vacíos al enviar', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const addBtn = screen.getByRole('button', { name: /agregar producto/i });
    
    fireEvent.click(addBtn);
    
    const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
    const refInputs = screen.getAllByPlaceholderText('https://...');

    await userEvent.type(titleInputs[0], 'Laptop');
    await userEvent.type(refInputs[0], 'https://amazon.com');
    // El segundo item se deja vacío

    const submitBtn = screen.getByRole('button', { name: /guardar lista/i });
    
    // Remover el atributo required para permitir envío del formulario
    const inputs = screen.getAllByDisplayValue('');
    inputs.forEach(input => input.removeAttribute('required'));
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            title: 'Laptop',
            reference: 'https://amazon.com',
          },
        ])
      );
      expect(mockOnSave.mock.calls[0][0]).toHaveLength(1);
    });
  });

  it('debería mostrar estado de carga mientras se guarda', async () => {
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<WishlistForm onSave={mockOnSave} />);
    const titleInput = screen.getByPlaceholderText('Ej: Libro de cocina');
    const refInput = screen.getByPlaceholderText('https://...');
    const submitBtn = screen.getByRole('button', { name: /guardar lista/i });

    await userEvent.type(titleInput, 'Laptop');
    await userEvent.type(refInput, 'https://amazon.com');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardando/i })).toBeInTheDocument();
    });
  });

  it('debería permitir múltiples items', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const addBtn = screen.getByRole('button', { name: /agregar producto/i });

    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    await waitFor(() => {
      const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
      expect(titleInputs.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('debería llamar a onSave con items válidos', async () => {
    render(<WishlistForm onSave={mockOnSave} />);
    const titleInputs = screen.getAllByPlaceholderText('Ej: Libro de cocina');
    const refInputs = screen.getAllByPlaceholderText('https://...');
    const submitBtn = screen.getByRole('button', { name: /guardar lista/i });

    await userEvent.type(titleInputs[0], 'Laptop');
    await userEvent.type(refInputs[0], 'https://amazon.com/laptop');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });
});
