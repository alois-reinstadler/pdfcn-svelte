/** A request resolved before rendering, so renderer and browser never discard request options. */
export interface ImageRequest {
 uri: string;
 method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
 headers?: Record<string, string>;
 body?: string;
}

/** Fetch a PNG/JPEG and return a portable data URI. Run on the server for private credentials. */
export async function loadImage(source: string | ImageRequest): Promise<string> {
 const request: ImageRequest = typeof source === 'string' ? { uri: source } : source;
 if (!request || typeof request.uri !== 'string' || !request.uri.trim()) throw new TypeError('[loadImage] Provide an image URL in uri.');
 const unknown = Object.keys(request).filter(key => !['uri', 'method', 'headers', 'body'].includes(key));
 if (unknown.length) throw new TypeError(`[loadImage] Unsupported request options: ${unknown.join(', ')}.`);
 const method = request.method ?? 'GET';
 if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) throw new TypeError('[loadImage] method must retrieve image bytes; HEAD is not supported.');
 if (method === 'GET' && request.body !== undefined) throw new TypeError('[loadImage] GET cannot have a body. Use POST or remove body.');
 let response: Response;
 try { response = await fetch(request.uri, { method, headers: request.headers, body: request.body }); }
 catch (cause) { throw new Error('[loadImage] Image request failed. Check URL, network access, and request options.', { cause }); }
 if (!response.ok) throw new Error(`[loadImage] Image request failed with HTTP ${response.status}.`);
 const bytes = new Uint8Array(await response.arrayBuffer());
 return imageDataUri(bytes);
}

/** Validate portable image structure before an engine can silently omit corrupt bytes. */
export function imageDataUri(bytes: Uint8Array): string {
 const png = bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((value, index) => bytes[index] === value);
 let mime: string;
 if (png) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8, ended = false, hasData = false, first = true;
  while (offset + 12 <= bytes.length) {
   const length = view.getUint32(offset), end = offset + 12 + length;
   if (end > bytes.length) throw new Error('[Image] PNG contains a truncated chunk.');
   const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
   if (first && (type !== 'IHDR' || length !== 13 || view.getUint32(offset + 8) === 0 || view.getUint32(offset + 12) === 0)) throw new Error('[Image] PNG has an invalid IHDR header.');
   let crc = 0xffffffff;
   for (const byte of bytes.subarray(offset + 4, offset + 8 + length)) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
   if (((crc ^ 0xffffffff) >>> 0) !== view.getUint32(offset + 8 + length)) throw new Error(`[Image] PNG ${type} checksum is invalid.`);
   if (type === 'IDAT' && length > 0) hasData = true;
   offset = end; first = false;
   if (type === 'IEND') { ended = length === 0; break; }
  }
  if (!ended || !hasData || offset !== bytes.length) throw new Error('[Image] PNG requires complete image data and an IEND chunk.');
  mime = 'image/png';
 } else if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216) {
  if (bytes.at(-2) !== 255 || bytes.at(-1) !== 217) throw new Error('[Image] JPEG is truncated (missing end marker).');
  let offset = 2, frame = false, scan = false;
  while (offset + 3 < bytes.length) {
   if (bytes[offset++] !== 255) throw new Error('[Image] JPEG contains an invalid segment.');
   while (bytes[offset] === 255) offset++;
   const marker = bytes[offset++];
   if (marker === 217) break;
   const length = bytes[offset] * 256 + bytes[offset + 1];
   if (length < 2 || offset + length > bytes.length) throw new Error('[Image] JPEG contains a truncated segment.');
   if ([192,193,194].includes(marker)) { if (length < 8 || bytes[offset + 3] * 256 + bytes[offset + 4] === 0 || bytes[offset + 5] * 256 + bytes[offset + 6] === 0) throw new Error('[Image] JPEG dimensions are invalid.'); frame = true; }
   if (marker === 218) { scan = offset + length < bytes.length - 2; break; }
   offset += length;
  }
  if (!frame || !scan) throw new Error('[Image] JPEG requires a supported frame and image scan.');
  mime = 'image/jpeg';
 } else throw new Error('[Image] Expected PNG or JPEG image bytes. Convert other formats before rendering.');
 let binary = '';
 for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
 return `data:${mime};base64,${btoa(binary)}`;
}

/** Forme does not report failed image loads, so require validated, resolved data. */
export function validateImageSource(source: unknown): string {
 if (typeof source !== 'string') throw new TypeError('[Image] src must be a PNG/JPEG data URI string. Resolve requests with loadImage before rendering.');
 const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=\s]+)$/.exec(source);
 if (!match) throw new Error('[Image] Provide a PNG/JPEG data URI. Resolve URLs with await loadImage(url); convert local file bytes with imageDataUri(bytes) before rendering.');
 let binary: string;
 try { binary = atob(match[2]); } catch { throw new Error('[Image] Invalid base64 image data.'); }
 return imageDataUri(Uint8Array.from(binary, character => character.charCodeAt(0)));
}
