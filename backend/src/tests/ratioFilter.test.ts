import { filterRatios } from "../Functions/ratioFilter"; 

describe("filterRatios function", () => {
    const filterValue = 0.25;

    test("Filters ratios correctly", () => {
        const ratios = [0.1, 0.2, 0.3, 0.4];
        const result = filterRatios(ratios, filterValue);

        expect(result.displayed).toEqual([0.1, 0.2]);
        expect(result.filtered).toEqual([0.3, 0.4]);
    });

    test("Handles empty ratio array", () => {
        const result = filterRatios([], filterValue);
        expect(result.displayed).toEqual([]);
        expect(result.filtered).toEqual([]);
    });
});