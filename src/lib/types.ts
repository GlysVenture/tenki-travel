import type { LngLatLike } from 'svelte-maplibre';

export type ColorRGB = [number, number, number];
export type ColorHex = string;

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
    color: ColorRGB,
    name: string,
    type: string,
    start: LngLatLike,
    end: LngLatLike
}
