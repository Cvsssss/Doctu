import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('renders navbar', () => {
  render(<Navbar />);
  expect(document.querySelector('nav')).toBeInTheDocument();
});

test('renders all nav links', () => {
  render(<Navbar />);
  expect(screen.getByText('Inicio')).toBeInTheDocument();
  expect(screen.getByText('Productos')).toBeInTheDocument();
  expect(screen.getByText('FAQ')).toBeInTheDocument();
  expect(screen.getByText('Contáctanos')).toBeInTheDocument();
});

test('renders logo', () => {
  render(<Navbar />);
  expect(screen.getAllByAltText('Logo de Doctu')[0]).toBeInTheDocument();
});
