import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

describe('Label Component', () => {
  it('debería renderizar un label', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('debería aceptar htmlFor', () => {
    render(<Label htmlFor="email-input">Email</Label>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('debería vincular con input mediante htmlFor', async () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <Input id="email-input" type="email" />
      </>
    );

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(label).toHaveAttribute('for', 'email-input');
    expect(input.id).toBe('email-input');
  });

  it('debería aceptar className personalizado', () => {
    render(<Label className="text-red-500">Error Label</Label>);
    const label = screen.getByText('Error Label');
    expect(label).toHaveClass('text-red-500');
  });

  it('debería funcionar con diferentes tipos de inputs', () => {
    render(
      <>
        <Label htmlFor="checkbox">Agree</Label>
        <input id="checkbox" type="checkbox" />
      </>
    );

    const label = screen.getByText('Agree');
    expect(label).toHaveAttribute('for', 'checkbox');
  });
});
