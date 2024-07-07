import { getAverage } from "../services/mathService";

describe("This function should return the average of an array number", () => {
    test("Check that the right int average is calculated", () => {
        expect(getAverage([1, 2, 3, 4, 5])).toEqual(3);
    });
    test("Check that the right float average is calculated", () => {
        expect(getAverage([1.1, 2.23, 3.345, 4.555, 5.777])).toEqual(3.4);
    });
    test("Check that the right float rounding is done", () => {
        expect(getAverage([1.111, 2.999, 3.777])).toEqual(2.63);
    });
});