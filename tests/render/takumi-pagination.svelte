<script lang="ts">
 import { Document, Page, View, Text, Heading, KeepTogether, PageHeader, PageFooter, PageNumber, PageBreak, Image, Watermark } from '$lib/bases/takumi';
 let { scenario = 'flow', count = 32, pageStyle = {} }: { scenario?: string; count?: number; pageStyle?: Record<string, unknown> } = $props();
 const margin = { top: 55, right: 24, bottom: 40, left: 33 };
</script>
{#snippet counter()}<PageNumber format={"PHYSICAL {page}/{total}"} size="xs" />{/snippet}
<Document>
 {#if scenario === 'flow-style'}
  <Page flow style={pageStyle}><Text>STYLE</Text></Page>
 {:else if scenario === 'gap' || scenario === 'gap-plain'}
  <Page flow size={{ width: 280, height: 300 }} margin={30}><View style={{ gap: 20 }}><Heading keepWithNext={scenario === 'gap'} noMargin level={6}>GAP HEADING</Heading><Text noMargin>NEXT GAP CONTENT</Text></View></Page>
 {:else if scenario === 'flex-width'}
  <Page flow><View style={{ flexDirection: 'row' }}><View style={{ flex: 1 }}><Heading keepWithNext>Nested</Heading><Text>Following</Text></View><Text>Other column</Text></View></Page>
 {:else if scenario === 'percentage-width'}
  <Page flow size={{ width: 280, height: 300 }} margin={30}><View style={{ width: '50%' }}><Heading keepWithNext noMargin level={6}>NARROW HEADING</Heading><Text noMargin>{'Narrow column content wraps and stays with its heading. '.repeat(6)}</Text></View></Page>
 {:else if scenario === 'overflow'}
  <Page size={{ width: 220, height: 200 }}><View style={{ height: 300 }}><Text>OVERFLOW</Text></View></Page>
 {:else if scenario === 'mixed'}
  <Page flow size="A4"><Text>A</Text></Page><Page flow size="Letter"><Text>B</Text></Page>
 {:else if scenario === 'corrupt-image'}
  <Page flow><Image src="data:image/png;base64,AAAA" /></Page>
 {:else if scenario === 'image'}
  <Page flow><Image src="https://invalid.example.test/missing.png" /></Page>
 {:else if scenario === 'watermark'}
  <Page flow><Watermark text="DRAFT" /></Page>
 {:else if scenario === 'bad-header'}
  <Page flow><PageHeader title="Title" variant="centered" rightText="LOST" /></Page>
 {:else if scenario === 'bad-footer'}
  <Page flow><PageFooter variant="minimal" centerText="LOST" /></Page>
 {:else if scenario === 'negative'}
  <Page flow><KeepTogether minPresenceAhead={-1}><Text>Invalid</Text></KeepTogether></Page>
 {:else if scenario === 'fixed'}
  <Page flow><PageNumber fixed /></Page>
 {:else if scenario === 'small-band'}
  <Page flow margin={5}><PageHeader fixed title="TOO BIG" /><Text>Content</Text></Page>
 {:else}
  <Page flow size={{ width: 280, height: 300 }} {margin} landscape={scenario === 'landscape'}>
   <PageHeader fixed title="REPEATED HEADER" variant="minimal" marginBottom={0} style={{ paddingBottom: 0 }} />
   <PageFooter fixed variant="minimal" leftText="FOOTER ONE" marginTop={0} style={{ paddingTop: 0, paddingBottom: 0 }} />
   <PageFooter fixed variant="minimal" rightText={counter} marginTop={0} style={{ paddingTop: 0, paddingBottom: 0 }} />
   {#if scenario === 'keep' || scenario === 'ahead'}
    <View style={{ height: 180, flexShrink: 0 }}><Text noMargin>FILLER</Text></View>
    {#if scenario === 'keep'}<Heading keepWithNext noMargin level={6}>KEPT HEADING</Heading>{:else}<KeepTogether minPresenceAhead={35}><Text noMargin>MINIMUM GROUP</Text></KeepTogether>{/if}
    <View style={{ height: 35, flexShrink: 0 }}><Text noMargin>NEXT CONTENT</Text></View>
   {:else if scenario === 'oversized'}
    <KeepTogether><View style={{ height: 400 }}><Text>TOO TALL</Text></View></KeepTogether>
   {:else}
    {#each Array.from({ length: count }, (_, i) => i) as i}<Text noMargin style={{ height: 20, flexShrink: 0 }}>ROW-{String(i).padStart(3, '0')}</Text>{/each}
    <PageBreak /><Text noMargin>EXPLICIT BREAK END</Text>
   {/if}
  </Page>
  {#if scenario === 'flow'}<Page flow size={{ width: 280, height: 300 }} {margin}><Text noMargin>AUTHORED SECOND SECTION</Text><PageFooter fixed variant="minimal" leftText="FOOTER ONE" marginTop={0} style={{ paddingTop: 0, paddingBottom: 0 }} /><PageFooter fixed variant="minimal" rightText={counter} marginTop={0} style={{ paddingTop: 0, paddingBottom: 0 }} /></Page>{/if}
 {/if}
</Document>
