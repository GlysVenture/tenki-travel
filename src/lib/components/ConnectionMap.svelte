<script lang="ts">
  import type { Connection } from '$lib/types';
    import type { Feature } from 'geojson';
    import { LineLayer, GeoJSON } from 'svelte-maplibre';

    let { connection } : { connection: Connection } = $props();

    const data: Feature = $derived({
        type: 'Feature',
        properties: {
        name: `${connection.from.station.name}  ->  ${connection.to.station.name}`,
        },
        geometry: {
        type: 'MultiLineString',
        coordinates: connection.sections
            .filter((s) => s.journey)
            .map(
            (s) => s.journey.passList.map((journey_stop) => [
                journey_stop.station.coordinate.y,
                journey_stop.station.coordinate.x
            ])
        ),
        },
    });
</script>

<GeoJSON {data}>
    <LineLayer
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
            'line-width': 5,
            'line-dasharray': [5, 2],
            'line-color': '#008800',
            'line-opacity': 0.8,
        }}
    />
</GeoJSON>
