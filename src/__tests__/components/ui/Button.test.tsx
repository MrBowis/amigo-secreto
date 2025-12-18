import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('debería renderizar un botón', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('debería ejecutar onClick cuando se hace clic', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i }) as HTMLButtonElement;
    
    expect(button.disabled).toBe(true);
  });

  it('debería aceptar className personalizado', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toHaveClass('custom-class');
  });

  it('debería renderizar con type submit', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i }) as HTMLButtonElement;
    
    expect(button.type).toBe('submit');
  });

  it('debería aceptar children como contenido', () => {
    render(
      <Button>
        <span>Custom content</span>
      </Button>
    );
    
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
