<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';
	import { registryInstallCommand } from '../../../docs/site';

	const packageInstall = 'pnpm add pdfcn-svelte\npnpm add @formepdf/svelte @formepdf/core  # Forme\npnpm add takumi-pdf @takumi-rs/helpers   # Takumi';
	const localBuild = 'pnpm install\npnpm run package\npnpm pack';
	const registry = [
		registryInstallCommand('forme', 'alert'),
		registryInstallCommand('takumi', 'invoice-modern')
	].join('\n');
</script>

<svelte:head><title>Installation — pdfcn / svelte</title></svelte:head>

<DocPage title="Installation" description="Use pdfcn-svelte as a package when you want stable imports, or use the shadcn-style registry when you want the readable component source inside your application.">
	<Callout title="Package status" tone="warning"><p>The package examples apply to a packed or workspace-linked build until a package release is published. The source registry is hosted from this repository through GitHub Pages.</p></Callout>

	<h2>Package or workspace</h2>
	<p>For a published or linked package, install the library and your renderer dependencies. Forme dependencies are optional at the package level because Takumi consumers do not use them.</p>
	<CodeBlock code={packageInstall} label="terminal" />
	<p>To consume this checkout directly, build and pack it first:</p>
	<CodeBlock code={localBuild} label="terminal" />

	<h2>Copy source through the registry</h2>
	<p>The registry workflow follows shadcn-svelte conventions: it resolves the selected item and its source dependencies into your own project. Your target project needs a valid <code>components.json</code>.</p>
	<CodeBlock code={registry} label="terminal" />
	<p>Replace <code>forme</code> with <code>takumi</code> to choose that base. Templates and theme presets are registry items too.</p>

	<h2>Requirements</h2>
	<ul>
		<li>Svelte 5.30 or newer</li>
		<li>A TypeScript-capable Svelte project</li>
		<li><code>@formepdf/svelte</code> and <code>@formepdf/core</code> 0.11.x for Forme rendering</li>
		<li><code>takumi-pdf</code> 0.11.x and <code>@takumi-rs/helpers</code> 2.12.x for Takumi PDF rendering</li>
		<li><code>components.json</code> only when using the source registry</li>
	</ul>

	<h2>Import boundaries</h2>
	<p>The theme provider and theme presets are renderer-neutral. Components and primitives come from a renderer namespace:</p>
	<CodeBlock label="imports.ts" code={`import { PdfcnThemeProvider } from 'pdfcn-svelte';\nimport { forestTheme } from 'pdfcn-svelte/themes';\nimport { Document, Page, Text } from 'pdfcn-svelte/bases/forme';`} />
</DocPage>
