// frontend/src/__tests__/FamilyVacationRequest.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

// Local component (no need for a separate page anymore)
function FamilyVacationRequest() {
    const [requestText, setRequestText] = useState("");
    const [isFamilyFriendly, setIsFamilyFriendly] = useState(false);

    const mockRequest = {
        destination: requestText,
        familyFriendly: isFamilyFriendly
    };

    return (
        <div>
            <textarea
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Enter your vacation idea..."
            />
            <label>
                <input
                    type="checkbox"
                    checked={isFamilyFriendly}
                    onChange={(e) => setIsFamilyFriendly(e.target.checked)}
                />
                Family Friendly
            </label>
            <pre data-testid="mock-request">
                {JSON.stringify(mockRequest, null, 2)}
            </pre>
        </div>
    );
}

describe("FamilyVacationRequest", () => {
    it("should default to familyFriendly: false", () => {
        render(<FamilyVacationRequest />);
        const mockRequest = screen.getByTestId("mock-request");
        expect(mockRequest).toHaveTextContent('"familyFriendly": false');
    });

    it("should set familyFriendly to true when checkbox is checked", () => {
        render(<FamilyVacationRequest />);

        const checkbox = screen.getByRole('checkbox', { name: /family friendly/i });
        fireEvent.click(checkbox);

        const mockRequest = screen.getByTestId("mock-request");
        expect(mockRequest).toHaveTextContent('"familyFriendly": true');
    });

    it("should update destination text", () => {
        render(<FamilyVacationRequest />);

        const textbox = screen.getByPlaceholderText(/enter your vacation idea/i);
        fireEvent.change(textbox, { target: { value: "Hawaii" } });

        const mockRequest = screen.getByTestId("mock-request");
        expect(mockRequest).toHaveTextContent('"destination": "Hawaii"');
    });
});
// comment for the change so I cna push this
