import { PortStatistics } from "../types/PortStatistics";
import { getBottomPortsStatistics, getPercentiles, getTopPortsStatistics } from "./analysisService";
import { formatTimeToString } from "./timeService";

export function getIntroductoryMessage(): void {
    console.log("---------------------------------------------------------------------------------------\n" +
        "Please choose an option below using your keyboard's arrow keys and hit enter to select.\n"
    );
}

export async function getFormattedTopPortStatistics(): Promise<void> {
    const portStatistics: PortStatistics[] = await getTopPortsStatistics();

    if (!portStatistics || portStatistics.length === 0) {
        console.log("No port statistics were found.");
        return;
    }

    const headerStr: string = `The 5 ports with the highest number of port calls are:\n\n`;
    let resultStr: string = "";

    let index: number = 0;
    portStatistics.forEach(e => {
        index++;
        resultStr += `${index}. ${e.portName} - ${e.portId} - # of port calls: ${e.portCalls}\n`
    });

    const finalStr: string = headerStr + resultStr;

    console.log(finalStr);
}

export async function getFormattedBottomPortStatistics(): Promise<void> {
    const portStatistics: PortStatistics[] = await getBottomPortsStatistics();

    if (!portStatistics || portStatistics.length === 0) {
        console.log("No port statistics were found.");
        return;
    }

    const headerStr: string = `The 5 ports with the lowest number of port calls are:\n\n`;
    let resultStr: string = "";

    let index: number = 0;
    portStatistics.forEach(e => {
        index++;
        resultStr += `${index}. ${e.portName} - ${e.portId} - # of port calls: ${e.portCalls}\n`
    });

    const finalStr: string = headerStr + resultStr;

    console.log(finalStr);
}

export async function getPortsAtPercentiles(): Promise<void> {
    const portStatisticsWithPercentiles: PortStatistics[] = await getPercentiles([5, 20, 50, 75, 90]);
    
    if (!portStatisticsWithPercentiles || portStatisticsWithPercentiles.length === 0) {
        console.log("No port statistics were found.");
        return;
    }

    const headerStr: string = "Here are the ports calculated at each of the following percentiles:\n\n";
    let resultStr: string = "";

    portStatisticsWithPercentiles.forEach(e => {
        resultStr += `${e.portCallDurationPercentile}th. ${e.portName} - ${e.portId} - Avg port call duration: ${formatTimeToString(e.portCallDurationAvg)}\n`
    });

    const finalStr: string = headerStr + resultStr;

    console.log(finalStr);
}