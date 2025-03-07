// ratioFilter.ts - The module that implements the ratio filtering logic

export function filterRatios(ratios: number[], filterValue: number): { displayed: number[], filtered: number[] } {
    if (!Number.isFinite(filterValue)) {
        throw new Error("Invalid filter value");
    }

    const displayed: number[] = [];
    const filtered: number[] = [];

    for (const ratio of ratios) {
        if (!Number.isFinite(ratio)) {
            throw new Error("Invalid ratio value");
        }
        if (ratio >= filterValue) {
            filtered.push(ratio);
        } else {
            displayed.push(ratio);
        }
    }

    return { displayed, filtered };
}
