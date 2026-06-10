<script lang="ts">
  import TenkiMap from '$lib/components/TenkiMap.svelte';
  import type { Connection } from '$lib/types';

  let locations: string[] = $state([]);

  $effect(() => console.log(locations));

  let connections = $derived(await query_connections(locations))


  async function query_connections(locations: string[]) {
    let p = [];
    for(var i=0; i < locations.length - 1; i++){
      p.push(fetch_connection(locations[i], locations[i + 1]));
    }
    return Promise.all(p);
  }

  async function fetch_connection(start: string, end: string): Promise<Connection[]> {
    return fetch(
        'https://transport.opendata.ch/v1/connections?' + new URLSearchParams({
            from: start,
            to: end,
        }).toString()
    ).then((res) => res.json())
      .then((data) => data.connections);
  }
</script>

<TenkiMap bind:locations={locations} connections={connections.map((c) => c.at(0))}/>
