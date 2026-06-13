<script lang="ts">
    import type { Connection, Section, SectionLine } from '$lib/types';
    import { ArcLayer } from '@deck.gl/layers';
    import { Popup, DeckGlLayer } from 'svelte-maplibre';
  import { LineColors } from '$lib/constants';

    let { connection } : { connection: Connection } = $props();

    const data: SectionLine[] = $derived.by(() => {
        return connection.sections.flatMap(build_lines);
    });

    function line_color(category: string) {
        return LineColors[category] || LineColors["unknown"];
    }

    function build_lines(s: Section) : SectionLine[] {
        let f: SectionLine[] = [];
        let id = s.journey ? `${s.journey.category} ${s.journey.number}` : 'walk';
        const name = `${id}: ${s.departure.station.name}  ->  ${s.arrival.station.name}`;
        const type = s.journey?.category || 'walk'
        const color = line_color(type);

        if (s.journey === null) {
            return [{
                name,
                color,
                type,
                start: [s.departure.station.coordinate.y, s.departure.station.coordinate.x],
                end: [s.arrival.station.coordinate.y, s.arrival.station.coordinate.x],
            }];
        }
        
        let previous = s.journey.passList[0];
        for (const station_stop of s.journey.passList.slice(1)) {
            f.push({
                name,
                color,
                type,
                start: [previous.station.coordinate.y, previous.station.coordinate.x],
                end: [station_stop.station.coordinate.y, station_stop.station.coordinate.x]
            })
            previous = station_stop;
        }

        return f;
    }
</script>

<DeckGlLayer
type={ArcLayer}
{data}
getSourcePosition={(d: SectionLine) => d.start}
getTargetPosition={(d: SectionLine) => d.end}
getSourceColor={(d: SectionLine) => d.color}
getTargetColor={(d: SectionLine) => d.color}
highlightColor={[30, 255, 30]}
getWidth={6}
getHeight={0.2}
>
<Popup openOn="hover"
  >{#snippet children({ data }: { data: SectionLine | undefined })}
    {#if data}
      {data.name}
    {/if}
  {/snippet}
</Popup>
</DeckGlLayer>
