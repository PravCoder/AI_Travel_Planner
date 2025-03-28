// Schedule.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Schedule from './Schedule';
import { formatDateToISO, getTodayISO } from './ScheduleUtils';

// Mock the UUID function to get predictable IDs for testing
jest.mock('uuid', () => ({
    v4: () => 'test-uuid'
}));

describe('Schedule Component', () => {
    const todayISO = getTodayISO();

    beforeEach(() => {
        // Clear localStorage before each test to ensure clean state
        localStorage.clear();

        // Mock the date to be constant for testing
        jest.useFakeTimers();
        jest.setSystemTime(new Date(todayISO));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    /**
     * Test that a single block can be added and displayed correctly
     */
    test('test_single_block', async () => {
        render(<Schedule />);

        // Click the "Add Event" button
        fireEvent.click(screen.getByText('Add Event'));

        // Fill in the event details
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '09:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: todayISO } });

        // Click the "Add" button to create the event
        fireEvent.click(screen.getByText('Add'));

        // Verify the event appears in the schedule
        const eventElement = await screen.findByText('Test Event');
        expect(eventElement).toBeInTheDocument();

        // Verify the event time is displayed
        const timeElement = await screen.findByText('9:00 AM - 10:00 AM');
        expect(timeElement).toBeInTheDocument();

        // Check that the event is positioned correctly
        const blockElement = eventElement.closest('.time-block');
        expect(blockElement).toHaveStyle({
            top: '45rem', // 9 hours * 5rem
            height: '5rem', // 1 hour * 5rem
        });
    });

    /**
     * Test that a block can span an entire day (24 hours)
     */
    test('test_entire_day_block', async () => {
        render(<Schedule />);

        // Click the "Add Event" button
        fireEvent.click(screen.getByText('Add Event'));

        // Fill in the event details for a 24-hour event
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'All Day Event' } });
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '00:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '23:59' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: todayISO } });

        // Click the "Add" button to create the event
        fireEvent.click(screen.getByText('Add'));

        // Verify the event appears in the schedule
        const eventElement = await screen.findByText('All Day Event');
        expect(eventElement).toBeInTheDocument();

        // Check that the event is positioned to span almost the entire day
        const blockElement = eventElement.closest('.time-block');
        expect(blockElement).toHaveStyle({
            top: '0rem', // Starts at midnight
        });

        // For height, extract the value and use toBeCloseTo
        if (blockElement) {
            const heightValue = parseFloat((blockElement as HTMLElement).style.height);
            expect(heightValue).toBeCloseTo(119.916666, 3);
        } else {
            throw new Error('Block element not found');
        }

        // The event should be visible at different hours of the day
        // Switch to day view if not already
        if (!screen.queryByText('12:00 AM')) {
            fireEvent.click(screen.getByText('Day'));
        }

        // Check that scrolling to various times still shows the event
        // Note: This is a visual test that depends on the implementation details
        // We're checking if the event element is still in the document when scrolled
        const timeColumn = screen.getByText('12:00 AM').closest('.time-column');
        if (timeColumn) {
            fireEvent.scroll(timeColumn, { target: { scrollTop: 500 } }); // Scroll down
        }

        // The event should still be in the document
        expect(eventElement).toBeInTheDocument();
    });

    /**
     * Test that the component can handle the maximum number of blocks
     * This test adds multiple blocks and ensures they all display correctly
     */
    test('test_max_blocks', async () => {
        // Number of blocks to test with (adjust based on what's reasonable)
        const MAX_BLOCKS = 20;

        render(<Schedule />);

        // Add multiple blocks programmatically
        for (let i = 0; i < MAX_BLOCKS; i++) {
            // Click the "Add Event" button
            fireEvent.click(screen.getByText('Add Event'));

            // Calculate start and end times (1-hour blocks starting from 00:00)
            const hour = i % 24;
            const startHour = hour.toString().padStart(2, '0');
            const endHour = ((hour + 1) % 24).toString().padStart(2, '0');

            // Fill in the event details
            fireEvent.change(screen.getByLabelText(/title/i), { target: { value: `Event ${i + 1}` } });
            fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: `${startHour}:00` } });
            fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: `${endHour}:00` } });
            fireEvent.change(screen.getByLabelText(/date/i), { target: { value: todayISO } });

            // Click the "Add" button to create the event
            fireEvent.click(screen.getByText('Add'));

            // Wait for the modal to close before continuing
            await waitFor(() => {
                expect(screen.queryByText('Add Event')).toBeInTheDocument();
            });
        }

        // Switch to day view to see all events
        fireEvent.click(screen.getByText('Day'));

        // Verify that all blocks appear in the schedule
        for (let i = 0; i < MAX_BLOCKS; i++) {
            const eventElement = await screen.findByText(`Event ${i + 1}`);
            expect(eventElement).toBeInTheDocument();
        }

        // Check performance - this is more of a visual test in practice
        // For automated testing, we can check that the component doesn't crash
        expect(screen.getByText('Schedule')).toBeInTheDocument();

        // Check that month view handles many events by showing "+more" indicator
        fireEvent.click(screen.getByText('Month'));

        // Find today's cell in the month view
        const todayCell = screen.getAllByText(new Date(todayISO).getDate().toString())[0]
            .closest('.month-day');

        // // If we have more than 3 events, there should be a "+more" indicator
        // if (MAX_BLOCKS > 3) {
        //     const moreIndicator = await waitFor(() => {
        //         return Array.from(todayCell?.querySelectorAll('.month-event') ?? [])
        //             .find(el => el.textContent?.includes('more'));
        //     });
        //     expect(moreIndicator).toBeTruthy();
        // }
    });

    /**
     * Additional helper tests
     */

    // Test editing an existing block
    test('can edit an existing block', async () => {
        render(<Schedule />);

        // First create a block
        fireEvent.click(screen.getByText('Add Event'));
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Initial Event' } });
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '09:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '10:00' } });
        fireEvent.click(screen.getByText('Add'));

        // Find and click on the event to edit it
        const eventElement = await screen.findByText('Initial Event');
        fireEvent.click(eventElement);

        // Change the title and time
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Event' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '11:00' } });
        fireEvent.click(screen.getByText('Save'));

        // Verify the updated event appears with the new title
        const updatedElement = await screen.findByText('Updated Event');
        expect(updatedElement).toBeInTheDocument();

        // The original title should no longer be present
        expect(screen.queryByText('Initial Event')).not.toBeInTheDocument();

        // Verify the updated time is displayed
        const timeElement = await screen.findByText('9:00 AM - 11:00 AM');
        expect(timeElement).toBeInTheDocument();
    });

    // Test deleting a block
    test('can delete a block', async () => {
        render(<Schedule />);

        // First create a block
        fireEvent.click(screen.getByText('Add Event'));
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Temporary Event' } });
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '09:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '10:00' } });
        fireEvent.click(screen.getByText('Add'));

        // Find and click on the event to edit it
        const eventElement = await screen.findByText('Temporary Event');
        fireEvent.click(eventElement);

        // Click the delete button
        fireEvent.click(screen.getByText('Delete'));

        // Verify the event is no longer in the document
        await waitFor(() => {
            expect(screen.queryByText('Temporary Event')).not.toBeInTheDocument();
        });
    });
});