<script lang="ts">
    import type { LngLatBoundsLike, LngLatLike } from 'svelte-maplibre';
    import { DefaultMarker, MapEvents, MapLibre } from 'svelte-maplibre';
    import type { LngLat, MapMouseEvent } from 'maplibre-gl';
  import type { Station } from '$lib/types';
  import ConnectionMap from './ConnectionMap.svelte';

    let { locations = $bindable(), connections } = $props();

    let markers: { lngLat: LngLatLike }[] = $state([]);

    async function addMarker(e: MapMouseEvent) {
        let station: Station = await fetch(
            'https://transport.opendata.ch/v1/locations?' + new URLSearchParams({
                type: 'station',
                x: e.lngLat.lat.toString(),
                y: e.lngLat.lng.toString(),
            }).toString()
        ).then((res) => res.json())
            .then((data) => data.stations?.filter((s: { id: any; }) => s.id).at(0));

        locations = [...locations, station.name];
        markers = [...markers, { lngLat: [station.coordinate.y, station.coordinate.x] }];
    }

    const maxbounds: LngLatBoundsLike = [5.02, 45.5, 11.5, 48];
</script>

<MapLibre 
    center={[8.2,46.8]}
    zoom={8}
    class="map"
    standardControls
    maxBounds={maxbounds}
    style="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json">

    <MapEvents onclick={addMarker} />

    {#each markers as marker}
        <DefaultMarker lngLat={marker.lngLat} />
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
