import type { LngLatLike } from "svelte-maplibre";
import type { Connection } from "./types";
import * as ML from 'maplibre-gl';
import type { LngLat } from "maplibre-gl";

export function prependWalk(connection: Connection, loc: LngLat) {
    const first_section = connection.sections.at(0);
    if (first_section === undefined)
        return connection;

    const walktime = travel_time(
        loc,
        ML.LngLat.convert([first_section.departure.station.coordinate.y, first_section.departure.station.coordinate.x])
    );

    const end_ts = first_section.departure.departureTimestamp as number;
    const start_ts = Math.floor(end_ts - (walktime * 1000));

    connection.sections = [
        {
            departure: {
                station: {
                    name: `Near ${first_section.departure.station.name}`,
                    coordinate: {
                        y: loc.lng,
                        x: loc.lat,
                        type: "WGS84"
                    },
                },
                departureTimestamp: start_ts,
                arrivalTimestamp: null
            },
            arrival: {
                station: { ...first_section.departure.station },
                departureTimestamp: null,
                arrivalTimestamp: end_ts
            },
            journey: null,
        },
        ...connection.sections
    ]
    return connection;
    // if (first_section.journey) {
    // }
    // else {
    //     const start_ts = Math.floor((first_section.departure.departureTimestamp as number) - (walktime * 1000));

    //     first_section.departure = {
    //         station: {
    //             name: `Near ${first_section.departure.station.name}`,
    //             coordinate: {
    //                 y: loc.lng,
    //                 x: loc.lat,
    //                 type: "WGS84"
    //             },
    //         },
    //         departureTimestamp: start_ts,
    //         arrivalTimestamp: null
    //     }
    // }

    // return connection;
}

export function appendWalk(connection: Connection, loc: LngLat) {
    const last_section = connection.sections.at(-1);
    if (last_section === undefined)
        return connection;

    const walktime = travel_time(
        ML.LngLat.convert([last_section.departure.station.coordinate.y, last_section.departure.station.coordinate.x]),
        loc
    );

    const start_ts = last_section.arrival.arrivalTimestamp as number;
    const end_ts = Math.floor(start_ts + (walktime * 1000));

    connection.sections = [
        ...connection.sections,
        {
            departure: {
                station: { ...last_section.arrival.station },
                departureTimestamp: start_ts,
                arrivalTimestamp: start_ts
            },
            arrival: {
                station: {
                    name: `Near ${last_section.arrival.station.name}`,
                    coordinate: {
                        y: loc.lng,
                        x: loc.lat,
                        type: "WGS84"
                    },
                },
                departureTimestamp: null,
                arrivalTimestamp: end_ts
            },
            journey: null,
        },
    ]
    return connection;
    // if (last_section.journey) {
    // }
    // else {
    //     const end_ts = Math.floor((last_section.arrival.arrivalTimestamp as number) + (walktime * 1000));

    //     last_section.departure = {
    //         station: {
    //             name: `Near ${last_section.departure.station.name}`,
    //             coordinate: {
    //                 y: loc.lng,
    //                 x: loc.lat,
    //                 type: "WGS84"
    //             },
    //         },
    //         departureTimestamp: last_section.departure.departureTimestamp,
    //         arrivalTimestamp: end_ts
    //     }
    // }

    // return connection;
}

function travel_time(l1: LngLat, l2: LngLat) {
    const meters = l1.distanceTo(l2);
    return meters / (50 / 36); // seconds if 5km/h
}
