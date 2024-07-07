export interface PortStatistics {
    portName: string;
    portId: string;
    portCalls: number;
    portCallDurations: number[];
    portCallDurationAvg: number | null;
    portCallDurationPercentile: string | null;
}