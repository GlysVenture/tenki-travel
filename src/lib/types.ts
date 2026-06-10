export interface Station {
    id: string,
    name: string,
    score?: string | null,
    coordinate: {
        type: "WGS84",
        x: number,
        y: number
    },
    distance?: string | null,
    icon: string
}

export interface StationTime {
    station: Station,
    departure: string | null, // datetime
    departureTimestamp: number | null,
    arrival: string | null, // datetime
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
    journey: Journey,
    walk: null | string
}

export interface Connection {
    from: StationTime
    to: StationTime
    duration: string // time
    transfers: number,
    sections: Section[]
}

