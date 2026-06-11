<script lang="ts">
    import type { Connection, SectionLine } from '$lib/types';
    import type { Feature } from 'geojson';
    import { LineLayer, GeoJSON } from 'svelte-maplibre';

    let { connection } : { connection: Connection } = $props();

    const data: SectionLine[] = $derived.by(() => {

        let f: SectionLine[] = [];

        for (const s of connection.sections) {
            f.push({
                color: line_color(s.journey?.category),
                feature: {
                    type: 'Feature',
                    properties: {
                        name: `${s.journey?.category || 'walk'}: ${s.departure.station.name}  ->  ${s.arrival.station.name}`,
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
            case "RE": return "#fa0ab6";
            case "R": return "#fa6007";
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
                'line-dasharray': [5, 2],
                'line-color': d.color,
                'line-opacity': 0.8,
            }}
        />
    </GeoJSON>
{/each}
