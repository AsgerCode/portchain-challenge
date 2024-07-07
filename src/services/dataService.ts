import axios from "axios";
import { Vessel } from "../types/Vessel";
import { PortLog } from "../types/PortLog";

export async function getVessels(): Promise<Vessel[]> {
    try {
        const res = await axios.get("https://import-coding-challenge-api.portchain.com/api/v2/vessels");
        const vessels: Vessel[] = res.data;
        return vessels;
    } catch (error) {
        throw new Error("Error fetching the vessels list.")
    }
}

export async function getVesselPortCalls(imo: string): Promise<PortLog> {
    try {
        const res = await axios.get(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${imo}`)
        const portCalls: PortLog = res.data;
        return portCalls;
    } catch (error) {
        throw new Error("Error fetching the vessel's port calls.")
    }
}