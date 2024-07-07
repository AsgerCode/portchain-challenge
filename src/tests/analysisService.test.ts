import { calculatePortCallAverages, getBottomPortsStatistics, getPercentiles, getPortsStatistics, getTopPortsStatistics } from '../services/analysisService';
import { PortStatistics } from '../types/PortStatistics';

jest.mock('../services/dataService', () => ({
  getVessels: jest.fn().mockResolvedValue([
    { imo: '1234567' },
  ]),
  getVesselPortCalls: jest.fn().mockResolvedValue({
    portCalls: [
      { port: { id: '1', name: 'Port A' }, arrival: '2022-01-01T00:00:00', departure: '2022-01-02T00:00:00', isOmitted: false },
      { port: { id: '2', name: 'Port B' }, arrival: '2022-01-03T00:00:00', departure: '2022-01-04T00:00:00', isOmitted: false },
      { port: { id: '1', name: 'Port A' }, arrival: '2022-01-05T00:00:00', departure: '2022-01-06T00:00:00', isOmitted: false },
      { port: { id: '3', name: 'Port C' }, arrival: null, departure: null, isOmitted: true },
    ],
  }),
}));

describe('getPortsStatistics', () => {
  it('handles duplicate port IDs in the portLog.portCalls array', async () => {
    const result: PortStatistics[] = await getPortsStatistics();

    expect(result).toEqual([
      {
        portId: '1',
        portName: 'Port A',
        portCalls: 2,
        portCallDurations: [86400000, 86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portId: '2',
        portName: 'Port B',
        portCalls: 1,
        portCallDurations: [86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portCallDurationAvg: null,
        portCallDurationPercentile: null,
        portCallDurations: [],
        portCalls: 0,
        portId: "3",
        portName: "Port C",
      }
    ]);
  });
});

describe('getTopPortsStatistics', () => {
  it('correctly calculates and orders the number of port calls for a vessel', async () => {
    const result = await getTopPortsStatistics();

    expect(result).toEqual([
      {
        portId: '1',
        portName: 'Port A',
        portCalls: 2,
        portCallDurations: [86400000, 86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portId: '2',
        portName: 'Port B',
        portCalls: 1,
        portCallDurations: [86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portCallDurationAvg: null,
        portCallDurationPercentile: null,
        portCallDurations: [],
        portCalls: 0,
        portId: "3",
        portName: "Port C",
      }
    ]);
  });
});

describe('getBottomPortsStatistics', () => {
  it('correctly calculates and orders the number of port calls for a vessel', async () => {
    const result = await getBottomPortsStatistics();

    expect(result).toEqual([
      {
        portCallDurationAvg: null,
        portCallDurationPercentile: null,
        portCallDurations: [],
        portCalls: 0,
        portId: "3",
        portName: "Port C",
      },
      {
        portId: '2',
        portName: 'Port B',
        portCalls: 1,
        portCallDurations: [86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portId: '1',
        portName: 'Port A',
        portCalls: 2,
        portCallDurations: [86400000, 86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
    ]);
  });
});

describe('calculatePortCallAverages', () => {
  it('correctly calculates the port call averages and ignores cases without port call durations', async () => {
    const result = await getPortsStatistics();
    calculatePortCallAverages(result);

    expect(result).toEqual([
      {
        portId: '1',
        portName: 'Port A',
        portCalls: 2,
        portCallDurations: [86400000, 86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portId: '2',
        portName: 'Port B',
        portCalls: 1,
        portCallDurations: [86400000],
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: null,
      },
      {
        portCallDurationAvg: null,
        portCallDurationPercentile: null,
        portCallDurations: [],
        portCalls: 0,
        portId: "3",
        portName: "Port C",
      },
    ]);
  });
});

describe('getPercentiles function', () => {
  it('should format percentile values as strings', async () => {
    const percentiles: number[] = [50, 75, 90];
    const expectedResult: PortStatistics[] = [
      {
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: "50",
        portCallDurations: [86400000, 86400000],
        portCalls: 2,
        portId: "1",
        portName: "Port A",
      },
      {
        portCallDurationAvg: 86400000,
        portCallDurationPercentile: "90",
        portCallDurations: [86400000],
        portCalls: 1,
        portId: "2",
        portName: "Port B",
      },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({
        portsStatistics: expectedResult,
      }),
    } as Response);

    const result = await getPercentiles(percentiles);
    expect(result).toEqual(expectedResult);
  });

  it('should handle empty percentiles array', async () => {
    const percentiles: number[] = [];
    const result = await getPercentiles(percentiles);
    expect(result).toEqual([]);
  });
});