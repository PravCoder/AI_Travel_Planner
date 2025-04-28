import { canDownloadTripPDF } from '../Functions/TripFunctions'; // Adjust relative path accordingly

describe('canDownloadTripPDF', () => {

  it('should return true for a valid trip with destinations', async () => {
    const trip = {
      trip_id: '12345',
      trip_name: 'Summer Vacation',
      start_date: '2025-06-01',
      end_date: '2025-06-15',
      destinations: [
        { name: 'Paris' },
        { name: 'Rome' }
      ]
    };

    const result = await canDownloadTripPDF(trip);
    console.log(result); // Should print: true
    expect(result).toBe(true);
  });

  it('should return false if trip is missing required properties', async () => {
    const trip = {
      trip_id: '12345',
      trip_name: 'Summer Vacation',
      start_date: '2025-06-01',
      end_date: '', // Missing end date
      destinations: [
        { name: 'Paris' },
        { name: 'Rome' }
      ]
    };

    const result = await canDownloadTripPDF(trip);
    console.log(result); // Should print: false
    expect(result).toBe(false);
  });

  it('should return false if no destinations are provided', async () => {
    const trip = {
      trip_id: '12345',
      trip_name: 'Summer Vacation',
      start_date: '2025-06-01',
      end_date: '2025-06-15',
      destinations: [] // Empty destinations
    };

    const result = await canDownloadTripPDF(trip);
    console.log(result); // Should print: false
    expect(result).toBe(false);
  });

});
