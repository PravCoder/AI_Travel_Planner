import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTripPage from '../CreateTripPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('CreateTripPage - No Budget Checkbox', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful API responses
    axios.post.mockResolvedValue({
      data: {
        reply: 'Test response',
        isReadyForPlanning: false
      }
    });
  });

  test('checkbox should be unchecked by default', () => {
    render(<CreateTripPage />);
    const checkbox = screen.getByLabelText('No Budget');
    expect(checkbox).not.toBeChecked();
  });

  test('checking the checkbox should set budget to luxury', () => {
    render(<CreateTripPage />);
    const checkbox = screen.getByLabelText('No Budget');
    
    // Check the checkbox
    fireEvent.click(checkbox);
    
    // Verify the checkbox is checked
    expect(checkbox).toBeChecked();
    
    // Verify the budget parameter was updated to luxury
    const compactTripParams = screen.getByTestId('compact-trip-parameters');
    expect(compactTripParams).toHaveAttribute('data-budget', 'luxury');
  });

  test('unchecking the checkbox should set budget back to medium', () => {
    render(<CreateTripPage />);
    const checkbox = screen.getByLabelText('No Budget');
    
    // Check and then uncheck the checkbox
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    
    // Verify the checkbox is unchecked
    expect(checkbox).not.toBeChecked();
    
    // Verify the budget parameter was updated back to medium
    const compactTripParams = screen.getByTestId('compact-trip-parameters');
    expect(compactTripParams).toHaveAttribute('data-budget', 'medium');
  });

  test('AI response should reflect unlimited budget when checkbox is checked', async () => {
    render(<CreateTripPage />);
    
    // Check the no budget checkbox
    const checkbox = screen.getByLabelText('No Budget');
    fireEvent.click(checkbox);
    
    // Send a message to the AI
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'What can I do here?' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    // Wait for the AI response
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tripParameters: expect.objectContaining({
            budget: 'luxury'
          })
        })
      );
    });
  });

  test('budget parameter should persist in chat history', async () => {
    render(<CreateTripPage />);
    
    // Check the no budget checkbox
    const checkbox = screen.getByLabelText('No Budget');
    fireEvent.click(checkbox);
    
    // Send multiple messages
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'First message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tripParameters: expect.objectContaining({
            budget: 'luxury'
          })
        })
      );
    });
    
    // Send another message
    fireEvent.change(input, { target: { value: 'Second message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tripParameters: expect.objectContaining({
            budget: 'luxury'
          })
        })
      );
    });
  });
}); 