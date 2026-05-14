import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders without crashing', () => {
  render(<App />);
});

test('renders main container', () => {
  render(<App />);
  expect(document.querySelector('.App')).toBeInTheDocument();
});
