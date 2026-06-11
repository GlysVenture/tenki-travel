<script lang="ts">
    import type { Connection, SectionLine } from '$lib/types';
    import type { Feature } from 'geojson';
    import { LineLayer, GeoJSON, Popup } from 'svelte-maplibre';

    let { connection } : { connection: Connection } = $props();

    const data: SectionLine[] = $derived.by(() => {

        let f: SectionLine[] = [];

        for (const s of connection.sections) {
            let id = s.journey ? `${s.journey.category} ${s.journey.number}` : 'walk';
            const n = `${id}: ${s.departure.station.name}  ->  ${s.arrival.station.name}`;
            f.push({
                color: line_color(s.journey?.category),
                name: n,
                type: s.journey?.category || 'walk',
                feature: {
                    type: 'Feature',
                    properties: {
                        name: n,
                    },
                    geometry: {
                    type: 'LineString',
                    coordinates: s.journey ?
                                s.journey.passList.map((journey_stop) => [
                                    journey_stop.station.coordinate.y,
                                    journey_stop.station.coordinate.x
                                ])
                                :
                                [
                                    [s.departure.station.coordinate.y, s.departure.station.coordinate.x],
                                    [s.arrival.station.coordinate.y, s.arrival.station.coordinate.x],
                                ]
                    },
                }
            })
        }

        return f;
    });

    function line_color(category: string | undefined) {
        if (category === undefined)
            return "#164ff7";
        switch (category) {
            case "B": return "#22c202";
            case "IC": return "#fa0710";
            case "IR": return "#fc0568";
            case "RE": return "#fc8105";
            case "R": return "#fab107";
            case "S": return "#07b3e3";
            default: return "#fcc203";
        }
    }
</script>

{#each data as d }
    <GeoJSON data={d.feature}>
        <LineLayer
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{
                'line-width': 5,
                'line-color': d.color,
                'line-opacity': 0.8,
            }}
        >
            <Popup openOn='hover'>
                {d.name}
            </Popup>
        </LineLayer>
    </GeoJSON>
{/each}
