<script lang="ts">
    import type { LngLatBoundsLike, LngLatLike } from 'svelte-maplibre';
    import { DefaultMarker, MapEvents, MapLibre } from 'svelte-maplibre';
    import { type MapMouseEvent } from 'maplibre-gl';
    import { type LngLat } from 'maplibre-gl';
    import type { Connection, TravelJourney } from '$lib/types';
    import ConnectionMap from './ConnectionMap.svelte';

    let { start, travels, onaddlocation } :
        { start: LngLatLike | undefined, travels: TravelJourney[], onaddlocation: (loc: LngLat) => Promise<void> } 
        = $props();

    let markers: LngLatLike[] = $derived(start ? [start, ...(travels.map((t) => t.end))] : []);
    let connections: Connection[] = $derived(travels.map((t) => t.connection));

    const maxbounds: LngLatBoundsLike = [5.02, 45.5, 11.5, 48];
</script>

<MapLibre 
    center={[8.2,46.8]}
    zoom={8}
    class="map"
    standardControls
    maxBounds={maxbounds}
    style="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json">

    <MapEvents onclick={(e: MapMouseEvent) => onaddlocation(e.lngLat)} />

    {#each markers as marker}
        <DefaultMarker lngLat={marker} />
    {/each}
    {#each connections as connection}
        <ConnectionMap {connection}/>
    {/each}
</MapLibre>

<style>
    :global(.map) {
        height: 100vh;
    }
</style>
