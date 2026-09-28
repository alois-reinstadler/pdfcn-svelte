import type { RenderDocumentOptions } from '../../src/lib/bases/forme/server';
const audited: RenderDocumentOptions<{ label: string }> = { props: { label: 'Retained' }, auditContent: true };
// @ts-expect-error Output validation is mandatory and cannot be disabled.
const unaudited: RenderDocumentOptions = { auditContent: false };
void audited; void unaudited;
