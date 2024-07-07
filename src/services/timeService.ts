import moment from "moment";

export function getPortCallDuration(arrival: string, departure: string): number {
    return moment(departure).diff(arrival);
}

export function formatTimeToString(time: number): string {
    const duration = moment.duration(time);
    return `${duration.days()} days, ${duration.hours()} hours and ${duration.minutes()} minutes`
}