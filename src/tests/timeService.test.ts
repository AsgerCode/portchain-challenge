import { formatTimeToString, getPortCallDuration } from "../services/timeService"

describe("Test that the difference in port call durations is accurate", () => {
    test("The difference between two ISO formatted time strings should be accurate in ms", () => {
        expect(getPortCallDuration("2019-06-01T09:00:00+00:00", "2019-06-01T09:00:00+00:00")).toEqual(0);
        expect(getPortCallDuration("2019-06-01T09:00:00+00:00", "2019-06-01T10:00:00+00:00")).toEqual(3600000);
        expect(getPortCallDuration("2019-06-01T09:00:00+00:00", "2019-06-02T09:00:00+00:00")).toEqual(86400000);
    })
})

describe("Test that the port call duration is properly being formatted to be shown on the terminal", () => {
    test("Given a number input in seconds, the duration should be converted into a human readable format", () => {
        expect(formatTimeToString(3600000)).toEqual("0 days, 1 hours and 0 minutes");
        expect(formatTimeToString(86400000)).toEqual("1 days, 0 hours and 0 minutes");
    })
})