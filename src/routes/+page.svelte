<script lang="ts">
  import TenkiMap from '$lib/components/TenkiMap.svelte';
  import { appendWalk, prependWalk } from '$lib/connections';
  import type { Connection, Station } from '$lib/types';
  import type { LngLat } from 'maplibre-gl';

  let locations: [LngLat, Station][] = $state([]);
  let travels: Connection[] = $state([]);

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
        .then((data) => data.stations?.filter((s: { id: string }) => s.id).at(0));
    
    locations.push([loc, station]);

    if (locations.length > 1) {
      const start = locations[locations.length - 2];
      const end = locations[locations.length - 1];

      fetch_connection(start[1].name, end[1].name)
        .then((connections) => {
          let connection = connections.at(0);
          if (connection) {
            connection = prependWalk(connection, start[0]);
            connection = appendWalk(connection, end[0]);
            console.log(connection);
            travels.push(connection);
          }
        });
    }
  }

</script>

<TenkiMap start={locations.at(0)?.[0]} connections={travels} onaddlocation={addLocation}/>
