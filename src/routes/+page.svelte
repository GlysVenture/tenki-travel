<script lang="ts">
  import TenkiMap from '$lib/components/TenkiMap.svelte';
  import type { Connection, Station, TravelJourney } from '$lib/types';
  import type { LngLat } from 'maplibre-gl';

  let locations: [LngLat, Station][] = $state([]);
  let travels: TravelJourney[] = $state([]);

  $effect(() => console.log(locations));

  async function fetch_connection(start: string, end: string): Promise<Connection[]> {
    return fetch(
        'https://transport.opendata.ch/v1/connections?' + new URLSearchParams({
            from: start,
            to: end,
        }).toString()
    ).then((res) => res.json())
      .then((data) => data.connections);
  }

  async function addLocation(loc: LngLat) {
    let station: Station = await fetch(
        'https://transport.opendata.ch/v1/locations?' + new URLSearchParams({
            type: 'station',
            x: loc.lat.toString(),
            y: loc.lng.toString(),
        }).toString()
    ).then((res) => res.json())
        .then((data) => data.stations?.filter((s: Station) => s.id).at(0));
    
    locations.push([loc, station]);

    if (locations.length > 1) {
      const start = locations[locations.length - 2];
      const end = locations[locations.length - 1];

      fetch_connection(start[1].name, end[1].name)
        .then((connections) => {
          const connection = connections.at(0);
          if (connection) {
            travels.push(
              {
                start: start[0],
                end: end[0],
                connection
              }
            );
          }
        });
    }
  }

</script>

<TenkiMap start={locations.at(0)?.[0]} {travels} onaddlocation={addLocation}/>
