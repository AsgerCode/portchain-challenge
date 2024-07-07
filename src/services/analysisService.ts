import percentile from "percentile";
import { PortLog } from "../types/PortLog";
import { PortStatistics } from "../types/PortStatistics";
import { Vessel } from "../types/Vessel";
import { getVessels, getVesselPortCalls } from "./dataService";
import { getAverage } from "./mathService";
import { getPortCallDuration } from "./timeService";

export async function getPortsStatistics(): Promise<PortStatistics[]> {
    const vessels: Vessel[] = await getVessels();

    const portStatistics: PortStatistics[] = [];
    for (const vessel of vessels) {
        const portLog: PortLog = await getVesselPortCalls(vessel.imo);

        for (const port of portLog.portCalls) {
            const portExists = portStatistics.some(ele => ele.portId === port.port.id);
            if (!portExists) {
                portStatistics.push({
                    portId: port.port.id,
                    portName: port.port.name,
                    portCalls: 0,
                    portCallDurations: [],
                    portCallDurationAvg: null,
                    portCallDurationPercentile: null,
                });
            }

            if (port.isOmitted === false) {
                const index = portStatistics.findIndex(ele => ele.portId === port.port.id);
                portStatistics[index].portCalls++;
                portStatistics[index].portCallDurations.push(
                    getPortCallDuration(port.arrival, port.departure)
                );
            }
        }
    }

    calculatePortCallAverages(portStatistics);
    return portStatistics;
}

export async function getTopPortsStatistics(): Promise<PortStatistics[]> {
    const portsStatistics: PortStatistics[] = await getPortsStatistics();

    portsStatistics.sort((a, b) => b.portCalls - a.portCalls);
    return portsStatistics.slice(0, portsStatistics.length >= 5 ? 5 : portsStatistics.length);
}

export async function getBottomPortsStatistics(): Promise<PortStatistics[]> {
    const portsStatistics: PortStatistics[] = await getPortsStatistics();

    portsStatistics.sort((a, b) => a.portCalls - b.portCalls);
    return portsStatistics.slice(0, portsStatistics.length >= 5 ? 5 : portsStatistics.length);
}

export function calculatePortCallAverages(portStatistics: PortStatistics[]) {
    for (const port of portStatistics) {
        if (port.portCallDurations.length > 0) {
            port.portCallDurationAvg = getAverage(port.portCallDurations);
        } else {
            port.portCallDurationAvg = null;
        }
    }
}

export async function getPercentiles(percentiles: number[]): Promise<PortStatistics[]> {
    const portsStatistics: PortStatistics[] = await getPortsStatistics();

    // removing ports with no port calls
    const filteredPorts = portsStatistics.filter(e => e.portCallDurationAvg !== null);

    const result: PortStatistics[] = percentile(
        percentiles,
        filteredPorts,
        item => item.portCallDurationAvg
    ) as PortStatistics[]

    for (let i = 0; i < percentiles.length; i++) {
        result[i].portCallDurationPercentile = percentiles[i].toString();
    }

    // filter duplicates
    const uniquesResult = result.reduce((accumulator, current) => {
        if (!accumulator.find((result) => result.portId === current.portId)) {
          accumulator.push(current);
        }
        return accumulator;
      }, []); 

    return uniquesResult;
}