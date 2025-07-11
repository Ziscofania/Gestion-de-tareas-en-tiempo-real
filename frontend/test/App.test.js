// frontend/src/__tests__/App.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

test('permite agregar una tarea', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Nueva tarea');
  fireEvent.change(input, { target: { value: 'Tarea de prueba' } });
  fireEvent.click(screen.getByText('Agregar'));
  expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
});