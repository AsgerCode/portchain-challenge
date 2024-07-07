export function getAverage(numbers: number[]): number {
    return parseFloat((numbers.reduce((sum, currentValue) => sum + currentValue, 0) / numbers.length).toFixed(2));
}