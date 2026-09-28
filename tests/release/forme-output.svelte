<script lang="ts">
 import {Image as NativeImage} from '@formepdf/svelte';
 import {Document,Page,KeepTogether,Text,View,PageHeader,PageFooter,PageNumber,PageBreak,Card} from '$lib/bases/forme';
 let { scenario = 'oversize' }: {scenario?: string} = $props();
 const fonts = $derived(scenario === 'missingfont' ? [{family:'Missing',src:'/tmp/pdfcn-deliberately-missing-font.ttf'}] : undefined);
</script>
<Document {fonts}><Page size="A5" margin={scenario.startsWith('large') ? 10 : 48}>
 {#if scenario === 'largefooter' || scenario === 'largeheader'}
 {#if scenario === 'largefooter'}<PageFooter fixed leftText="LARGE FOOTER" style={{height:170}}/>{:else}<PageHeader fixed title="LARGE HEADER" style={{height:170}}/>{/if}
 {#each Array.from({length:35}) as _,i}<Text>BAND BODY LINE {i+1}</Text>{/each}
 {:else if scenario === 'oversize'}<KeepTogether><Text>START OVERSIZED</Text><View style={{height:1000}}/><Text>END OVERSIZED</Text></KeepTogether>
 {:else if scenario === 'flow'}<PageFooter fixed leftText="FOOTER"/>{#each Array.from({length:60}) as _,i}<Text>LINE {i+1} retained.</Text>{/each}
 {:else if scenario === 'clip'}<View style={{height:0,overflow:'hidden'}}><Text>MUST NOT DISAPPEAR</Text></View>
 {:else if scenario === 'offpage'}<Text style={{position:'absolute',left:500}}>OUTSIDE PAGE</Text>
 {:else if scenario === 'overlap'}<PageFooter fixed leftText="FIXED FOOTER"/><Text style={{position:'absolute',top:500}}>BODY OVERLAPS FOOTER</Text>
 {:else if scenario === 'partial'}<Text style={{position:'absolute',left:350}}>PARTLY OUTSIDE PAGE</Text>
 {:else if scenario === 'badimage'}<NativeImage src="data:image/png;base64,AAAA"/>
 {:else if scenario === 'missingimage'}<NativeImage src="/tmp/pdfcn-deliberately-missing-image.png"/>
 {:else if scenario === 'image'}<NativeImage src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" width={20}/><Text>IMAGE RETAINED</Text>
 {:else if scenario === 'nowrap'}<Card>{#each Array.from({length:60}) as _,i}<Text>ATOMIC {i+1}</Text>{/each}</Card>
 {:else if scenario === 'empty'}<PageBreak/><Text>INTENTIONAL SECOND PAGE</Text>
 {:else}<KeepTogether><Text>START NORMAL</Text><Text>END NORMAL</Text></KeepTogether>{/if}
</Page></Document>
