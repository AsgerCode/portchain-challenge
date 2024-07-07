import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getVessels, getVesselPortCalls } from "../services/dataService";
import { Vessel } from "../types/Vessel";
import { PortLog } from "../types/PortLog";

describe("getVessels function", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    it("should return a list of vessels", async () => {
        const vessels: Vessel[] = [
            { imo: "1234567", name: "Test Vessel 1" },
            { imo: "7654321", name: "Test Vessel 2" },
        ];

        mock.onGet("https://import-coding-challenge-api.portchain.com/api/v2/vessels").reply(200, vessels);

        const result = await getVessels();

        expect(result).toEqual(vessels);
    });

    it("should throw an error if the API request fails", async () => {
        mock.onGet("https://import-coding-challenge-api.portchain.com/api/v2/vessels").reply(500);

        await expect(getVessels()).rejects.toThrow("Error fetching the vessels list.");
    });

    it("should handle empty response", async () => {
        mock.onGet("https://import-coding-challenge-api.portchain.com/api/v2/vessels").reply(200, []);

        const result = await getVessels();

        expect(result).toEqual([]);
    });

    it("should handle network errors", async () => {
        mock.onGet("https://import-coding-challenge-api.portchain.com/api/v2/vessels").networkError();

        await expect(getVessels()).rejects.toThrow("Error fetching the vessels list.");
    });
});

describe("getVesselPortCalls function", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    it('should return port calls data when successful', async () => {
        const imo = '123456789';
        const mockData: PortLog = {
            vessel: {
                imo: "123456789",
                name: "Boat A"
            },
            portCalls: [
                {
                    arrival: "2018-12-30T08:00:00+00:00",
                    departure: "2018-12-31T03:00:00+00:00",
                    createdDate: "2018-11-15T14:58:44.813629+00:00",
                    isOmitted: false,
                    service: "East Coast Loop 4",
                    port: {
                        id: "HKHKG",
                        name: "Hong Kong"
                    },
                    logEntries: [
                        {
                            updatedField: "departure",
                            arrival: null,
                            departure: "2018-12-31T03:00:00+00:00",
                            isOmitted: null,
                            createdDate: "2018-11-15T14:58:44.813629+00:00"
                        }]
                }
            ]
        };
        mock.onGet(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${imo}`).reply(200, mockData);

        const result = await getVesselPortCalls(imo);
        expect(result).toEqual(mockData);
    });

    test("should throw an error when a timeout occurs", async () => {
        const imo = "123456789";
        const errorMessage = "Error fetching the vessel's port calls.";

        mock.onGet(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${imo}`).timeout();

        await expect(getVesselPortCalls(imo)).rejects.toThrow(errorMessage);
    });
});