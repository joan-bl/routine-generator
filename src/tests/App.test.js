import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { AppProvider } from '../context/AppContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ErrorBoundary>
    <AppProvider>
      {children}
    </AppProvider>
  </ErrorBoundary>
);

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    navigator.clipboard.writeText.mockClear();
  });

  test('renders workout routine generator title', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByText(/workout routine generator/i)).toBeInTheDocument();
  });

  test('displays initial form', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/days per week/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate routine/i })).toBeInTheDocument();
  });

  test('shows motivational quote', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByText(/today is a great day to improve yourself!/i)).toBeInTheDocument();
  });

  test('generates routine when form is submitted', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Fill form
    await user.clear(screen.getByLabelText(/age/i));
    await user.type(screen.getByLabelText(/age/i), '25');
    
    await user.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await user.selectOptions(screen.getByLabelText(/goal/i), 'lose_weight');
    
    await user.clear(screen.getByLabelText(/days per week/i));
    await user.type(screen.getByLabelText(/days per week/i), '3');

    // Submit form
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    // Check if routine is displayed
    await waitFor(() => {
      expect(screen.getByText(/your personalized routine/i)).toBeInTheDocument();
    });
  });

  test('displays routine actions after generation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Generate routine first
    await user.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await user.selectOptions(screen.getByLabelText(/goal/i), 'lose_weight');
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    await waitFor(() => {
      expect(screen.getByText(/share/i)).toBeInTheDocument();
      expect(screen.getByText(/download/i)).toBeInTheDocument();
      expect(screen.getByText(/view history/i)).toBeInTheDocument();
    });
  });

  test('shares routine to clipboard', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Generate routine first
    await user.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await user.selectOptions(screen.getByLabelText(/goal/i), 'lose_weight');
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    await waitFor(() => {
      expect(screen.getByText(/share/i)).toBeInTheDocument();
    });

    // Click share button
    await user.click(screen.getByText(/share/i));

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('restarts routine', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Generate routine first
    await user.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await user.selectOptions(screen.getByLabelText(/goal/i), 'lose_weight');
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    await waitFor(() => {
      expect(screen.getByTitle(/restart/i)).toBeInTheDocument();
    });

    // Click restart button
    await user.click(screen.getByTitle(/restart/i));

    // Should show form again
    expect(screen.getByRole('button', { name: /generate routine/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    // Should not generate routine (still showing form)
    expect(screen.getByRole('button', { name: /generate routine/i })).toBeInTheDocument();
  });

  test('handles age input validation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const ageInput = screen.getByLabelText(/age/i);
    
    // Test minimum age
    await user.clear(ageInput);
    await user.type(ageInput, '5');
    expect(ageInput.value).toBe('5');

    // Test maximum age
    await user.clear(ageInput);
    await user.type(ageInput, '100');
    expect(ageInput.value).toBe('100');
  });

  test('handles days input validation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const daysInput = screen.getByLabelText(/days per week/i);
    
    // Test minimum days
    await user.clear(daysInput);
    await user.type(daysInput, '0');
    expect(daysInput.value).toBe('0');

    // Test maximum days
    await user.clear(daysInput);
    await user.type(daysInput, '10');
    expect(daysInput.value).toBe('10');
  });

  test('persists user data in localStorage', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Generate a routine
    await user.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await user.selectOptions(screen.getByLabelText(/goal/i), 'lose_weight');
    await user.click(screen.getByRole('button', { name: /generate routine/i }));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});