import type { Feature } from 'geojson';

export interface Station {
    name: string,
    coordinate: {
        type: "WGS84",
        x: number,
        y: number
    },
}

export interface StationTime {
    station: Station,
    departureTimestamp: number | null,
    arrivalTimestamp: number | null,
}

export interface Journey {
    name?: string,
    number?: string,
    category?: string,
    operator?: string
    passList: StationTime[]
}

export interface Section {
    arrival: StationTime,
    departure: StationTime,
    journey: Journey | null,
}

export interface Connection {
    from: StationTime
    to: StationTime
    duration: string // time
    transfers: number,
    sections: Section[]
}

export interface SectionLine {
    color: string,
    feature: Feature
}
