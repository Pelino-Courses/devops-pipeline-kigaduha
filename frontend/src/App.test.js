import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthProvider } from './AuthContext';

test('renders task management heading', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const heading = screen.getByText(/Task Management App/i);
  expect(heading).toBeInTheDocument();
});

test('renders task form section', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  // Test for the form inputs and submit button using structural elements
  const titleInput = screen.getByPlaceholderText(/task title/i);
  const descriptionInput = screen.getByPlaceholderText(/task description/i);
  // Find submit button by type instead of text to make test resilient to text changes
  const submitButtons = screen.getAllByRole('button');
  const submitButton = submitButtons.find(btn => btn.type === 'submit');

  expect(titleInput).toBeInTheDocument();
  expect(descriptionInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
