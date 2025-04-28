// frontend/src/services/PDFService.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define the interfaces for the trip plan data 
interface TripPlanActivity {
    name: string;
    description: string;
    location: string;
    category: string;
    price: number;
    time: string;
    tags: string[];
}

interface TripPlanDay {
    date: string;
    hotel: string;
    activities: TripPlanActivity[];
    notes?: string;
}

interface TripPlan {
    destination: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    days: TripPlanDay[];
    budget: string;
    travelers: number;
    summary: string;
    tags: string[];
}

// Create a map for budget display
const budgetDisplayMap: Record<string, string> = {
    budget: "Budget ($)",
    economy: "Economy ($$)",
    medium: "Medium ($$$)",
    premium: "Premium ($$$$)",
    luxury: "Luxury ($$$$$)",
};

/**
 * Service for generating PDF files from trip plan data
 */
export const PDFService = {
    generatePDF: (tripPlan: TripPlan): jsPDF => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = { top: 20, left: 15, right: 15 };
        let yPos = margin.top;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(tripPlan.title || 'My Trip Itinerary', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;

        // Summary
        if (tripPlan.summary) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(80);
            doc.text(tripPlan.summary, margin.left, yPos, {
                maxWidth: pageWidth - margin.left - margin.right,
                align: 'left'
            });
            yPos += 20;
        }

        // Horizontal line
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin.left, yPos, pageWidth - margin.right, yPos);
        yPos += 10;

        tripPlan.days.forEach((day, index) => {
            // Page break if needed
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = margin.top;
            }

            // Day header
            const dayLabel = `Day ${index + 1} – ${format(new Date(day.date), 'MMMM d, yyyy')}`;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(30);
            doc.text(dayLabel, pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;

            // Activities table
            const body = day.activities.map(act => [
                act.time,
                act.name,
                act.location,
                act.price
            ]);

            autoTable(doc, {
                startY: yPos,
                margin: { left: margin.left, right: margin.right },
                headStyles: {
                    fillColor: [52, 73, 94],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: {
                    font: 'helvetica',
                    fontSize: 10,
                    cellPadding: 5,
                    textColor: 50
                },
                head: [['Time', 'Activity', 'Location', 'Price']],
                body,
                theme: 'grid',
                didDrawPage: (data) => {
                    // update yPos after table
                    if (data.cursor) {
                        yPos = data.cursor.y + 10;
                    }
                }
            });
        });

        // Footer (page numbers)
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth - margin.right,
                pageHeight - 10,
                { align: 'right' }
            );
        }

        return doc;
    },

    downloadPDF: (tripPlan: TripPlan): void => {
        const doc = PDFService.generatePDF(tripPlan);
        doc.save(`${tripPlan.title || 'itinerary'}.pdf`);
    }
};

export default PDFService;