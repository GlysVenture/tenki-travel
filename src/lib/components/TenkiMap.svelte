<script lang="ts">
  import type { LngLatBoundsLike } from 'svelte-maplibre';
  import { MapLibre } from 'svelte-maplibre';

  const maxbounds: LngLatBoundsLike = [5.02, 45.5, 11.5, 48];
</script>

<MapLibre 
  center={[8.2,46.8]}
  zoom={8}
  class="map"
  standardControls
  maxBounds={maxbounds}
  style="https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json" />

<style>
  :global(.map) {
    height: 100vh;
  }
</style>
