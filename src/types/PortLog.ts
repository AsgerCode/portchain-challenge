export interface PortLog {
    vessel: {
        imo: string,
        name: string
    };
    portCalls: [
        {
            arrival: string,
            departure: string,
            createdDate: string,
            isOmitted: boolean | null,
            service: string,
            port: {
                id: string,
                name: string
            }
            logEntries: [
                {
                    updatedField: string,
                    arrival: string | null,
                    departure: string | null,
                    isOmitted: boolean | null,
                    createdDate: string
                }
            ]
        }
    ]
}