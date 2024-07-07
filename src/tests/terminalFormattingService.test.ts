import { getBottomPortsStatistics, getPercentiles, getPortsStatistics, getTopPortsStatistics } from "../services/analysisService";
import { getFormattedBottomPortStatistics, getFormattedTopPortStatistics, getIntroductoryMessage, getPortsAtPercentiles } from "../services/terminalFormattingService";
import { PortStatistics } from "../types/PortStatistics";

jest.mock("../services/analysisService");
jest.mock("../services/timeService");

describe("getIntroductoryMessage function", () => {
    test("should print the introductory message", () => {
        // Arrange
        const consoleLogSpy = jest.spyOn(console, "log");

        // Act
        getIntroductoryMessage();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(
            "---------------------------------------------------------------------------------------\n" +
            "Please choose an option below using your keyboard's arrow keys and hit enter to select.\n"
        );
    });

    test("should print the introductory message only once", () => {
        // Arrange
        const consoleLogSpy = jest.spyOn(console, "log");

        // Act
        getIntroductoryMessage();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    test("should not throw any error", () => {
        // Arrange
        const consoleLogSpy = jest.spyOn(console, "log");

        // Act
        expect(() => getIntroductoryMessage()).not.toThrow();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });
});

describe("getFormattedTopPortStatistics", () => {
    test("should log the top 5 ports with their statistics when data is available", async () => {
        const mockPortStatistics: PortStatistics[] = [
            {
                portName: "Port1", portId: "1", portCalls: 100,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port2", portId: "2", portCalls: 80,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port3", portId: "3", portCalls: 60,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port4", portId: "4", portCalls: 40,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port5", portId: "5", portCalls: 20,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
        ];

        (getTopPortsStatistics as jest.Mock).mockResolvedValueOnce(mockPortStatistics);

        console.log = jest.fn();

        await getFormattedTopPortStatistics();

        expect(console.log).toHaveBeenCalledWith(
            "The 5 ports with the highest number of port calls are:\n\n" +
            "1. Port1 - 1 - # of port calls: 100\n" +
            "2. Port2 - 2 - # of port calls: 80\n" +
            "3. Port3 - 3 - # of port calls: 60\n" +
            "4. Port4 - 4 - # of port calls: 40\n" +
            "5. Port5 - 5 - # of port calls: 20\n"
        );
    });

    test("should log a message when no port statistics are found", async () => {
        (getTopPortsStatistics as jest.Mock).mockResolvedValueOnce([]);

        console.log = jest.fn();

        await getFormattedTopPortStatistics();

        expect(console.log).toHaveBeenCalledWith("No port statistics were found.");
    });
});

describe("getFormattedBottomPortStatistics", () => {
    test("should log the bottom 5 ports with their statistics when data is available", async () => {
        const mockPortStatistics: PortStatistics[] = [
            {
                portName: "Port5", portId: "5", portCalls: 20,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port4", portId: "4", portCalls: 40,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port3", portId: "3", portCalls: 60,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port2", portId: "2", portCalls: 80,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            },
            {
                portName: "Port1", portId: "1", portCalls: 100,
                portCallDurations: [],
                portCallDurationAvg: 0,
                portCallDurationPercentile: ""
            }
        ];

        (getBottomPortsStatistics as jest.Mock).mockResolvedValueOnce(mockPortStatistics);

        console.log = jest.fn();

        await getFormattedBottomPortStatistics();

        expect(console.log).toHaveBeenCalledWith(
            "The 5 ports with the lowest number of port calls are:\n\n" +
            "1. Port5 - 5 - # of port calls: 20\n" +
            "2. Port4 - 4 - # of port calls: 40\n" +
            "3. Port3 - 3 - # of port calls: 60\n" +
            "4. Port2 - 2 - # of port calls: 80\n" +
            "5. Port1 - 1 - # of port calls: 100\n"
        );
    });

    test("should log a message when no port statistics are found", async () => {
        (getTopPortsStatistics as jest.Mock).mockResolvedValueOnce([]);

        console.log = jest.fn();

        await getFormattedBottomPortStatistics();

        expect(console.log).toHaveBeenCalledWith("No port statistics were found.");
    });
});


describe("getPortsAtPercentiles function", () => {
    test("formats the average port call duration correctly", async () => {
        const mockPortStatistics: PortStatistics[] = [
            {
                portName: "Port 1",
                portId: "123",
                portCalls: 100,
                portCallDurationAvg: 3600000,
                portCallDurationPercentile: "5",
                portCallDurations: []
            },
            {
                portName: "Port 9",
                portId: "1253",
                portCalls: 100,
                portCallDurationAvg: 3600000,
                portCallDurationPercentile: "20",
                portCallDurations: []
            },
            {
                portName: "Port 2",
                portId: "1273",
                portCalls: 100,
                portCallDurationAvg: 3600000,
                portCallDurationPercentile: "50",
                portCallDurations: []
            },
            {
                portName: "Port 6",
                portId: "1283",
                portCalls: 100,
                portCallDurationAvg: 3600000,
                portCallDurationPercentile: "75",
                portCallDurations: []
            },
            {
                portName: "Port 3",
                portId: "1293",
                portCalls: 100,
                portCallDurationAvg: 3600000,
                portCallDurationPercentile: "90",
                portCallDurations: []
            },
        ];

        (getPortsStatistics as jest.Mock).mockReturnValue(mockPortStatistics);
        (getPercentiles as jest.Mock).mockReturnValue(mockPortStatistics);

        await getPortsAtPercentiles();


        expect(console.log).toHaveBeenCalledWith(
            "Here are the ports calculated at each of the following percentiles:\n\n" +
            "5th. Port 1 - 123 - Avg port call duration: undefined\n" +
            "20th. Port 9 - 1253 - Avg port call duration: undefined\n" +
            "50th. Port 2 - 1273 - Avg port call duration: undefined\n" +
            "75th. Port 6 - 1283 - Avg port call duration: undefined\n" +
            "90th. Port 3 - 1293 - Avg port call duration: undefined\n"
        );
    });

    test("correctly prints the error message when no port statistics are available", async () => {
        const mockPortStatistics: PortStatistics[] = [];

        (getPortsStatistics as jest.Mock).mockReturnValue(mockPortStatistics);
        (getPercentiles as jest.Mock).mockReturnValue(mockPortStatistics);

        await getPortsAtPercentiles();


        expect(console.log).toHaveBeenCalledWith("No port statistics were found.");
    });
});