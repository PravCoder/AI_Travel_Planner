import { render, fireEvent, screen } from '@testing-library/react';
import CompactTripParameters from '../../../frontend/src/components/CompactTripParameters';
import CreateTripPage from '../../../frontend/src/pages/CreateTripPage';

describe('Rapid Suggestions Feature Tests', () => {
  // Test that checkbox exists and is initially unchecked
  test('rapid suggestions checkbox should exist and be initially unchecked', () => {
    const mockOnChange = jest.fn();
    render(
      <CompactTripParameters
        parameters={{
          location: '',
          startDate: null,
          endDate: null,
          budget: 'medium',
          travelers: 1,
          rapidSuggestions: false
        }}
        onParametersChange={mockOnChange}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  // Test checkbox state change
  test('rapid suggestions checkbox should update when clicked', () => {
    const mockOnChange = jest.fn();
    render(
      <CompactTripParameters
        parameters={{
          location: '',
          startDate: null,
          endDate: null,
          budget: 'medium',
          travelers: 1,
          rapidSuggestions: false
        }}
        onParametersChange={mockOnChange}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnChange).toHaveBeenCalledWith({ rapidSuggestions: true });
  });

  // Test that message appears in chat when enabled
  test('rapid suggestions should trigger AI message when enabled', () => {
    render(<CreateTripPage />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    const message = screen.getByText('Here is a list of trip options!');
    expect(message).toBeInTheDocument();
  });

  // Test that checkbox state persists in trip parameters
  test('rapid suggestions state should persist in trip parameters', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(
      <CompactTripParameters
        parameters={{
          location: '',
          startDate: null,
          endDate: null,
          budget: 'medium',
          travelers: 1,
          rapidSuggestions: true
        }}
        onParametersChange={mockOnChange}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    
    // Test that state updates when parameters change
    rerender(
      <CompactTripParameters
        parameters={{
          location: '',
          startDate: null,
          endDate: null,
          budget: 'medium',
          travelers: 1,
          rapidSuggestions: false
        }}
        onParametersChange={mockOnChange}
      />
    );
    
    expect(checkbox).not.toBeChecked();
  });

  // Test rapid suggestions with different trip parameters
  test('rapid suggestions should work with various trip parameters', () => {
    const mockOnChange = jest.fn();
    render(
      <CompactTripParameters
        parameters={{
          location: 'Tokyo',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-07'),
          budget: 'luxury',
          travelers: 2,
          rapidSuggestions: false
        }}
        onParametersChange={mockOnChange}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnChange).toHaveBeenCalledWith({ rapidSuggestions: true });
  });
});