import assert from 'node:assert/strict';

import * as Root from 'pdfcn-svelte';
import * as Themes from 'pdfcn-svelte/themes';
import * as Forme from 'pdfcn-svelte/bases/forme';
import * as Takumi from 'pdfcn-svelte/bases/takumi';
import { renderDocument as renderFormeDocument } from '@formepdf/svelte';

import FormeDocument from './FormeDocument.svelte';
import TakumiDocument from './TakumiDocument.svelte';

const pdfHeader = (bytes: Uint8Array) => new TextDecoder().decode(bytes.subarray(0, 5));

export async function verifyPackageRuntime() {
	assert.equal(Root.cn('alpha', false, 'beta'), 'alpha beta');
	assert.equal(Themes.THEME_NAMES.length, 9);
	assert.equal(Themes.getTheme('modern')?.theme, Themes.modernTheme);
	assert.ok(Forme.Stack);
	assert.ok(Forme.MaybeFixed);
	assert.deepEqual(Forme.mergeFormeStyles({ padding: 2 }, false, { margin: 1 }), {
		padding: 2,
		margin: 1
	});
	assert.ok(Takumi.Stack);
	assert.equal(Takumi.pointToCssPixel(72), 96);
	assert.equal(typeof Takumi.renderDocument, 'function');

	const [formePdf, takumiPdf] = await Promise.all([
		renderFormeDocument(FormeDocument),
		Takumi.renderDocument(TakumiDocument, { margin: 0, size: 'a4' })
	]);
	assert.equal(pdfHeader(formePdf), '%PDF-');
	assert.equal(pdfHeader(takumiPdf), '%PDF-');

	return {
		formeBytes: formePdf.byteLength,
		takumiBytes: takumiPdf.byteLength
	};
}
