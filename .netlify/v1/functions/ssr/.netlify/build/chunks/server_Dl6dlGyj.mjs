import { $ as AstroError, B as PrerenderClientAddressNotAvailable, D as MiddlewareNoDataOrNextCalled, E as LocalsReassigned, F as NoMatchingImport, G as RewriteWithBodyUsed, I as NoMatchingRenderer, J as StaticClientAddressNotAvailable, K as SessionStorageInitError, L as NoMatchingStaticPathFound, M as NoClientOnlyHint, O as MiddlewareNotAResponse, P as NoManifestAvailable, Q as i18nNoLocaleFoundInPath, R as OnlyResponseCanBeReturned, S as InvalidGetStaticPathsReturn, U as ReservedSlotName, V as PrerenderDynamicEndpointPathCollide, W as ResponseSentError, _ as GetStaticPathsRequired, a as CacheNotEnabled, g as GetStaticPathsInvalidRouteParam, h as GetStaticPathsExpectedParams, i as AstroResponseHeadersReassigned, j as MissingMediaQueryDirective, m as ForbiddenRewrite, n as ActionNotFoundError, o as ClientAddressNotAvailable, q as SessionStorageSaveError, r as ActionsReturnedInvalidDataError, s as EndpointDidNotReturnAResponse, t as shorthash, tt as isAstroError, x as InvalidGetStaticPathsEntry, z as PageNumberParamNotFound } from "./shorthash_CfQhfpnz.mjs";
import { decodeBase64, decodeHex, encodeBase64, encodeHexUpperCase } from "@oslojs/encoding";
import * as z from "zod/v4";
import { parse, stringify, unflatten } from "devalue";
import colors from "piccolore";
import { parseCookie, stringifySetCookie } from "cookie";
import { clsx } from "clsx";
import { escape } from "html-escaper";
import { createStorage } from "unstorage";
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/csp/config.js
var ALGORITHMS = {
	"SHA-256": "sha256-",
	"SHA-384": "sha384-",
	"SHA-512": "sha512-"
};
var ALGORITHM_VALUES = Object.values(ALGORITHMS);
z.enum(Object.keys(ALGORITHMS)).optional().default("SHA-256");
var cspHashSchema = z.custom((value) => {
	if (typeof value !== "string") return false;
	return ALGORITHM_VALUES.some((allowedValue) => {
		return value.startsWith(allowedValue);
	});
});
var cspKindSchema = z.enum([
	"element",
	"attribute",
	"default"
]);
var ATTRIBUTE_ALLOWED_RESOURCES = [
	"'none'",
	"'unsafe-hashes'",
	"'unsafe-inline'",
	"'report-sample'"
];
z.union([z.string(), z.object({
	resource: z.string(),
	kind: cspKindSchema
})]).superRefine((value, ctx) => {
	const resource = typeof value === "string" ? value : value.resource;
	const kind = typeof value === "string" ? "default" : value.kind;
	if (kind === "element" && resource === "'unsafe-hashes'") ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: `The source \`'unsafe-hashes'\` is not valid for \`element\` resources (it is rejected by \`script-src-elem\`/\`style-src-elem\`).`,
		fatal: true
	});
	else if (kind === "attribute" && !ATTRIBUTE_ALLOWED_RESOURCES.includes(resource)) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: `The source \`${resource}\` is not valid for \`attribute\` resources. \`script-src-attr\`/\`style-src-attr\` only accept: ${ATTRIBUTE_ALLOWED_RESOURCES.join(", ")}.`,
		fatal: true
	});
});
z.union([cspHashSchema, z.object({
	hash: cspHashSchema,
	kind: cspKindSchema
})]);
var ALLOWED_DIRECTIVES = [
	"base-uri",
	"child-src",
	"connect-src",
	"default-src",
	"fenced-frame-src",
	"font-src",
	"form-action",
	"frame-ancestors",
	"frame-src",
	"img-src",
	"manifest-src",
	"media-src",
	"object-src",
	"referrer",
	"report-to",
	"report-uri",
	"require-trusted-types-for",
	"sandbox",
	"trusted-types",
	"upgrade-insecure-requests",
	"worker-src"
];
z.custom((v) => typeof v === "string").superRefine((value, ctx) => {
	if (!ALLOWED_DIRECTIVES.some((allowedValue) => {
		return value.startsWith(allowedValue);
	})) {
		if (value.startsWith("script-src") || value.startsWith("style-src")) ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Directives \`script-src\` and \`style-src\` (including their \`-elem\`/\`-attr\` variants) are not allowed in \`security.csp.directives\`. Please use \`security.csp.scriptDirective\` and \`security.csp.styleDirective\` instead, scoping resources/hashes to the more specific directives with the \`kind\` option (\`"element"\` or \`"attribute"\`).`,
			fatal: true
		});
		else ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid directive: "${value}". Allowed directives are: ${ALLOWED_DIRECTIVES.join(", ")}`,
			fatal: true
		});
	}
});
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/encryption.js
var ALGORITHM = "AES-GCM";
/**
* Decodes a base64 string into bytes and then imports the key.
*/
async function decodeKey(encoded) {
	const bytes = decodeBase64(encoded);
	return crypto.subtle.importKey("raw", bytes.buffer, ALGORITHM, true, ["encrypt", "decrypt"]);
}
var encoder$1 = new TextEncoder();
var decoder$1 = new TextDecoder();
var IV_LENGTH = 24;
/**
* Using a CryptoKey, encrypt a string into a base64 string.
* @param additionalData Optional authenticated context (e.g. "props:ComponentName") that is
*   verified during decryption but not included in the ciphertext. Both sides must agree on
*   the same value or decryption will fail.
*/
async function encryptString(key, raw, additionalData) {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
	const data = encoder$1.encode(raw);
	const params = {
		name: ALGORITHM,
		iv
	};
	if (additionalData) params.additionalData = encoder$1.encode(additionalData);
	const buffer = await crypto.subtle.encrypt(params, key, data);
	return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer));
}
/**
* Takes a base64 encoded string, decodes it and returns the decrypted text.
* @param additionalData Must match the value used during encryption, or decryption will fail.
*/
async function decryptString(key, encoded, additionalData) {
	const iv = decodeHex(encoded.slice(0, IV_LENGTH));
	const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
	const params = {
		name: ALGORITHM,
		iv
	};
	if (additionalData) params.additionalData = encoder$1.encode(additionalData);
	const decryptedBuffer = await crypto.subtle.decrypt(params, key, dataArray);
	return decoder$1.decode(decryptedBuffer);
}
/**
* Generates an SHA-256 digest of the given string.
* @param {string} data The string to hash.
* @param {CspAlgorithm} algorithm The algorithm to use.
*/
async function generateCspDigest(data, algorithm) {
	const hashBuffer = await crypto.subtle.digest(algorithm, encoder$1.encode(data));
	const hash = encodeBase64(new Uint8Array(hashBuffer));
	return `${ALGORITHMS[algorithm]}${hash}`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/noop-middleware.js
var NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
	return await next();
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/app/manifest.js
function deserializeManifest(serializedManifest, routesList) {
	const routes = [];
	if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) routes.push({
		...serializedRoute,
		routeData: deserializeRouteData(serializedRoute.routeData)
	});
	if (routesList) for (const route of routesList?.routes) routes.push({
		file: "",
		links: [],
		scripts: [],
		styles: [],
		routeData: route
	});
	const assets = new Set(serializedManifest.assets);
	const componentMetadata = new Map(serializedManifest.componentMetadata);
	const inlinedScripts = new Map(serializedManifest.inlinedScripts);
	const clientDirectives = new Map(serializedManifest.clientDirectives);
	const key = decodeKey(serializedManifest.key);
	return {
		middleware() {
			return { onRequest: NOOP_MIDDLEWARE_FN };
		},
		...serializedManifest,
		rootDir: new URL(serializedManifest.rootDir),
		srcDir: new URL(serializedManifest.srcDir),
		publicDir: new URL(serializedManifest.publicDir),
		outDir: new URL(serializedManifest.outDir),
		cacheDir: new URL(serializedManifest.cacheDir),
		buildClientDir: new URL(serializedManifest.buildClientDir),
		buildServerDir: new URL(serializedManifest.buildServerDir),
		assets,
		componentMetadata,
		inlinedScripts,
		clientDirectives,
		routes,
		key
	};
}
function deserializeRouteData(rawRouteData) {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		pathname: rawRouteData.pathname || void 0,
		segments: rawRouteData.segments,
		prerender: rawRouteData.prerender,
		redirect: rawRouteData.redirect,
		redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
		fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
			return deserializeRouteData(fallback);
		}),
		isIndex: rawRouteData.isIndex,
		origin: rawRouteData.origin,
		distURL: rawRouteData.distURL
	};
}
function deserializeRouteInfo(rawRouteInfo) {
	return {
		styles: rawRouteInfo.styles,
		file: rawRouteInfo.file,
		links: rawRouteInfo.links,
		scripts: rawRouteInfo.scripts,
		routeData: deserializeRouteData(rawRouteInfo.routeData)
	};
}
// \0virtual:astro:renderers
var renderers = [];
[
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"component": "_server-islands.astro",
			"params": ["name"],
			"segments": [[{
				"content": "_server-islands",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "name",
				"dynamic": true,
				"spread": false
			}]],
			"pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
			"prerender": false,
			"isIndex": false,
			"fallbackRoutes": [],
			"route": "/_server-islands/[name]",
			"origin": "internal",
			"distURL": [],
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/_image",
			"component": "node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/assets/endpoint/generic.js",
			"params": [],
			"pathname": "/_image",
			"pattern": "^\\/_image\\/?$",
			"segments": [[{
				"content": "_image",
				"dynamic": false,
				"spread": false
			}]],
			"type": "endpoint",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"isIndex": false,
			"origin": "internal",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/$",
			"segments": [],
			"params": [],
			"component": "src/pages/index.astro",
			"pathname": "/",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/[...slug]",
			"isIndex": false,
			"type": "page",
			"pattern": "^(?:\\/(.*?))?\\/?$",
			"segments": [[{
				"content": "...slug",
				"dynamic": true,
				"spread": true
			}]],
			"params": ["...slug"],
			"component": "src/pages/[...slug].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	}
].map(deserializeRouteInfo);
// \0virtual:astro:pages
var _page0 = () => import("./generic_Df250Pd_.mjs").then((n) => n.t);
var _page1 = () => import("./index_D9HKMqN1.mjs");
var _page2 = () => import("./_.._BVa5tzzj.mjs");
var pageMap = /* @__PURE__ */ new Map([
	["node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
	["src/pages/index.astro", _page1],
	["src/pages/[...slug].astro", _page2]
]);
// \0virtual:astro:manifest
var _manifest = deserializeManifest({"rootDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/","cacheDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/node_modules/.astro/","outDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/dist/","srcDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/src/","publicDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/public/","buildClientDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/dist/","buildServerDir":"file:///Users/sokradychey/Documents/projects/astro-storyblok-demo/.netlify/build/","adapterName":"@astrojs/netlify","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.BI0W3Si6.js"}],"styles":[],"routeData":{"route":"/_image","component":"node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.BI0W3Si6.js"}],"styles":[{"type":"external","src":"_astro/Layout.DvGZtPNm.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.BI0W3Si6.js"}],"styles":[{"type":"external","src":"_astro/Layout.DvGZtPNm.css"}],"routeData":{"route":"/[...slug]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","base":"/","trailingSlash":"ignore","compressHTML":"jsx","componentMetadata":[["/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}],["/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(function(){let e=(e,t)=>{let n=async()=>{await(await e())()},r=typeof t.value==`object`?t.value:void 0,i={timeout:r==null?void 0:r.timeout};`requestIdleCallback`in window?window.requestIdleCallback(n,i):setTimeout(n,i.timeout||200)};(self.Astro||(self.Astro={})).idle=e,window.dispatchEvent(new Event(`astro:idle`))})();"],["load","(function(){let e=async e=>{await(await e())()};(self.Astro||(self.Astro={})).load=e,window.dispatchEvent(new Event(`astro:load`))})();"],["media","(function(){let e=(e,t)=>{let n=async()=>{await(await e())()};if(t.value){let e=matchMedia(t.value);e.matches?n():e.addEventListener(`change`,n,{once:!0})}};(self.Astro||(self.Astro={})).media=e,window.dispatchEvent(new Event(`astro:media`))})();"],["only","(function(){let e=async e=>{await(await e())()};(self.Astro||(self.Astro={})).only=e,window.dispatchEvent(new Event(`astro:only`))})();"],["visible","(function(){let e=(e,t,n)=>{let r=async()=>{await(await e())()},i=typeof t.value==`object`?t.value:void 0,a={rootMargin:i==null?void 0:i.rootMargin},o=new IntersectionObserver(e=>{for(let t of e)if(t.isIntersecting){o.disconnect(),r();break}},a);for(let e of n.children)o.observe(e)};(self.Astro||(self.Astro={})).visible=e,window.dispatchEvent(new Event(`astro:visible`))})();"]],"entryModules":{"\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_BhTW5IeR.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_C7c7ma6M.mjs","\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_CxXy0p4B.mjs","@astrojs/netlify/ssr-function.js":"entry.mjs","\u0000virtual:astro:page:src/pages/[...slug]@_@astro":"chunks/_.._BVa5tzzj.mjs","\u0000virtual:astro:page:node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_Df250Pd_.mjs","/Users/sokradychey/Documents/projects/astro-storyblok-demo/node_modules/.pnpm/@astrojs+netlify@8.2.10_@types+node@26.6.5_astro@7.4.2_@netlify+blobs@11.1.6_@types+nod_fd670dd5033cbacf7031f1bf03c63e8d/node_modules/@astrojs/netlify/dist/image-service.js":"chunks/image-service_zMyrBiGh.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_D9HKMqN1.mjs","astro:scripts/page.js":"_astro/page.BI0W3Si6.js","/Users/sokradychey/Documents/projects/astro-storyblok-demo/node_modules/.pnpm/@storyblok+preview-bridge@2.5.0/node_modules/@storyblok/preview-bridge/dist/esm/index.js":"_astro/esm.CpNqpgRh.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/Layout.DvGZtPNm.css","/_astro/esm.CpNqpgRh.js","/_astro/page.BI0W3Si6.js","/_astro/page.BI0W3Si6.js","/favicon.ico","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"gcXeNfXI9Cb1DPhz+5BBkslcRsS48y2s+4CR5a5nZt0=","sessionConfig":{"driver":"unstorage/drivers/netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
	renderers,
	actions: () => import("./noop-entrypoint_CxXy0p4B.mjs"),
	middleware: () => import("../virtual_astro_middleware.mjs"),
	sessionDriver: () => import("./_virtual_astro_session-driver_C7c7ma6M.mjs"),
	serverIslandMappings: () => import("./_virtual_astro_server-island-manifest_BhTW5IeR.mjs"),
	routes: manifestRoutes,
	pageMap
});
/**
* The ambient manifest: the explicitly registered one, else the virtual
* module's. Throws lazily when neither is available, so merely importing a
* module that uses this never fails — only actually handling a request does.
*/
function getAmbientManifest() {
	const manifest$1 = manifest;
	if (!manifest$1) throw new AstroError(NoManifestAvailable);
	return manifest$1;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/app/render-options.js
/**
* Symbol used to attach `ResolvedRenderOptions` to a `Request` object so
* that they can flow through the `FetchHandler` signature (which only takes
* a request) into the request handler chain. This is an internal implementation
* detail between `BaseApp` and the default handler pipeline.
*/
var renderOptionsSymbol = Symbol.for("astro.renderOptions");
/**
* Reads `ResolvedRenderOptions` that were attached to a request via
* `renderOptionsSymbol`. Returns `undefined` if no options are attached.
*/
function getRenderOptions(request) {
	return Reflect.get(request, renderOptionsSymbol);
}
/**
* Attaches `ResolvedRenderOptions` to a request via `renderOptionsSymbol` so
* that downstream handlers can read them.
*/
function setRenderOptions(request, options) {
	Reflect.set(request, renderOptionsSymbol, options);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/defineMiddleware.js
function defineMiddleware(fn) {
	return fn;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/app/origin-check.js
/**
* Content types that can be passed when sending a request via a form
*
* https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype
* @private
*/
var FORM_CONTENT_TYPES = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
];
var SAFE_METHODS = [
	"GET",
	"HEAD",
	"OPTIONS"
];
/**
* Determines whether a request should be rejected because it is a cross-site
* submission for a route rendered on demand.
*
* This encapsulates the shared logic used by both the origin-check middleware
* and the Astro Actions dispatch, so the check is applied consistently
* regardless of where the request is handled.
*
* @private
*/
function isForbiddenCrossOriginRequest(request, url, isPrerendered) {
	if (isPrerendered) return false;
	if (SAFE_METHODS.includes(request.method)) return false;
	const contentType = request.headers.get("content-type");
	if (contentType && !hasFormLikeHeader(contentType)) return false;
	switch (request.headers.get("sec-fetch-site")) {
		case "":
		case null: break;
		case "same-origin":
		case "none": return false;
		default: return true;
	}
	const origin = request.headers.get("origin");
	if (!origin) return false;
	return origin !== url.origin;
}
/**
* Builds the 403 response returned when a cross-site submission is rejected.
*
* @private
*/
function createCrossOriginForbiddenResponse(request) {
	return new Response(`Cross-site ${request.method} form submissions are forbidden`, { status: 403 });
}
/**
* Returns middleware that rejects cross-origin form submissions.
*
* @private
*/
function createOriginCheckMiddleware() {
	return defineMiddleware((context, next) => {
		const { request, url, isPrerendered } = context;
		if (isForbiddenCrossOriginRequest(request, url, isPrerendered)) return createCrossOriginForbiddenResponse(request);
		return next();
	});
}
function hasFormLikeHeader(contentType) {
	if (contentType) {
		for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) return true;
	}
	return false;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/fetch/features.js
/**
* Bit flags for features that handler functions register as "used" when a
* custom `src/fetch.ts` fetch handler is in play. After the first request
* (dev) or at runtime (prod SSR), we compare against the manifest to warn
* about features the user configured but forgot to include in their custom
* fetch handler.
*/
var FetchFeatures = {
	redirects: 1,
	sessions: 2,
	actions: 4,
	middleware: 8,
	i18n: 16,
	cache: 32
};
/** All feature bits ORed together. Keep next to `FetchFeatures` so
*  new flags are hard to forget. */
var ALL_FETCH_FEATURES = FetchFeatures.redirects | FetchFeatures.sessions | FetchFeatures.actions | FetchFeatures.middleware | FetchFeatures.i18n | FetchFeatures.cache;
var usedFeatures = /* @__PURE__ */ new WeakMap();
/** ORs a feature bit into the manifest's used-features bitmask. */
function markFeatureUsed(manifest, feature) {
	const entry = usedFeatures.get(manifest);
	if (entry) entry.bits |= feature;
	else usedFeatures.set(manifest, { bits: feature });
}
/** The used-features bitmask for a manifest; `0` when nothing was marked. */
function getUsedFeatures(manifest) {
	return usedFeatures.get(manifest)?.bits ?? 0;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/build/util.js
/**
* Given the Astro configuration, it tells if a slash should be appended or not
*/
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
	switch (trailingSlash) {
		case "always": return true;
		case "never": return false;
		case "ignore": switch (buildFormat) {
			case "directory": return true;
			case "preserve":
			case "file": return false;
		}
	}
}
var ASTRO_GENERATOR = `Astro v7.4.2`;
/**
* Set by internal handlers (e.g. PagesHandler) to signal that a
* response should be replaced with the corresponding error page.
*/
var ASTRO_ERROR_HEADER = "X-Astro-Error";
/**
* The value of the `component` field of the default 404 page, which is used when there is no user-provided 404.astro page.
*/
var DEFAULT_404_COMPONENT = "astro-default-404.astro";
/**
* A response with one of these status codes will create a redirect response.
*/
var REDIRECT_STATUS_CODES = [
	301,
	302,
	303,
	307,
	308,
	300,
	304
];
/**
* A response with one of these status codes will be rewritten
* with the result of rendering the respective error page.
*/
var REROUTABLE_STATUS_CODES = [404, 500];
/**
* Pages Astro serves for an HTTP status rather than for their own URL.
*
* They are always written as `<name>.html`, never as `<name>/index.html`,
* whatever `build.format` says, because a host reaches them by status code and
* needs them at a predictable file path. Being status pages rather than site
* content, they are also skipped by i18n routing.
*/
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set([
	"/404",
	"/500",
	"/3xx"
]);
/**
* The symbol which is used as a field on the request object to store the client address.
* The clientAddress provided by the adapter (or the dev server) is stored on this field.
*/
var clientAddressSymbol = Symbol.for("astro.clientAddress");
/**
* Use this symbol to set and retrieve the original pathname of a request. This is useful when working with redirects and rewrites
*/
var originPathnameSymbol = Symbol.for("astro.originPathname");
/**
* Use this symbol to stash the active `FetchState` on an `APIContext`
* (or `ActionAPIContext`). Consumed by internal shims that need access
* to per-request state without appearing in the public context shape
* — e.g. the manual-strategy i18n middleware wrapper in
* `src/i18n/middleware.ts`.
*/
var fetchStateSymbol = Symbol.for("astro.fetchState");
/**
* The symbol used as a field on the response object to keep track of streaming.
*
* It is set when the `<head>` element has been completely generated, rendered, and the response object has been passed onto the adapter.
*
* Used to provide helpful errors and warnings when headers or cookies are added during streaming, after the response has already been sent.
*/
var responseSentSymbol$1 = Symbol.for("astro.responseSent");
// node_modules/.pnpm/@astrojs+internal-helpers@0.13.0/node_modules/@astrojs/internal-helpers/dist/path.js
function appendForwardSlash(path) {
	return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
	return path[0] === "/" ? path : "/" + path;
}
var MANY_LEADING_SLASHES = /^\/{2,}/;
function collapseDuplicateLeadingSlashes(path) {
	if (!path) return path;
	return path.replace(MANY_LEADING_SLASHES, "/");
}
var MANY_SLASHES = /\/{2,}/g;
function collapseDuplicateSlashes(path) {
	if (!path) return path;
	return path.replace(MANY_SLASHES, "/");
}
var MANY_TRAILING_SLASHES = /\/{2,}$/g;
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
	if (!path) return path;
	return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
	return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
	return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
	return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
	return typeof path === "string" || path instanceof String;
}
var INTERNAL_PREFIXES = /* @__PURE__ */ new Set([
	"/_",
	"/@",
	"/.",
	"//"
]);
var JUST_SLASHES = /^\/{2,}$/;
function isInternalPath(path) {
	const prefix = path.slice(0, 2).replace(/\\/g, "/");
	return INTERNAL_PREFIXES.has(prefix) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
	return paths.filter(isString).map((path, i) => {
		if (i === 0) return removeTrailingForwardSlash(path);
		else if (i === paths.length - 1) return removeLeadingForwardSlash(path);
		else return trimSlashes(path);
	}).join("/");
}
function removeQueryString(path) {
	const index = path.lastIndexOf("?");
	return index > 0 ? path.substring(0, index) : path;
}
/**
* Checks whether the path is considered a remote path.
* Remote means untrusted in this context, so anything that isn't a straightforward
* local path is considered remote.
*
* @param src
*/
function isRemotePath(src) {
	if (!src) return false;
	const trimmed = src.trim();
	if (!trimmed) return false;
	let decoded = trimmed;
	let previousDecoded = "";
	let maxIterations = 10;
	while (decoded !== previousDecoded && maxIterations > 0) {
		previousDecoded = decoded;
		try {
			decoded = decodeURIComponent(decoded);
		} catch {
			break;
		}
		maxIterations--;
	}
	if (/^[a-zA-Z]:/.test(decoded)) return false;
	if (decoded[0] === "/" && /^\/[\w.@-]/.test(decoded)) return false;
	if (decoded[0] === "\\") return true;
	if (decoded.startsWith("//")) return true;
	try {
		const url = new URL(decoded, "http://n");
		if (url.username || url.password) return true;
		if (decoded.includes("@") && !url.pathname.includes("@") && !url.search.includes("@")) return true;
		if (url.origin !== "http://n") {
			if (url.protocol.toLowerCase() === "file:") return false;
			return true;
		}
		if (URL.canParse(decoded)) return true;
		return false;
	} catch {
		return true;
	}
}
function slash(path) {
	return path.replace(/\\/g, "/");
}
function fileExtension(path) {
	const ext = path.split(".").pop();
	return ext !== path ? `.${ext}` : "";
}
function removeBase(path, base) {
	if (path.startsWith(base)) return path.slice(removeTrailingForwardSlash(base).length);
	return path;
}
/**
* Strips a configured request `base` from a pathname, only when the pathname is
* the base itself or lies under it at a path-segment boundary. `stripRequestBase('/appX/admin', '/app')`
* leaves the pathname untouched, whereas `stripRequestBase('/app/admin', '/app')` returns `/admin`.
*
* Leading slashes are collapsed first so `//admin` cannot pose as being under a
* `/` base. Route matching and `context.url.pathname` derive from separate
* copies of the request path, so a mismatch here lets a request reach a route
* whose base-prefixed pathname middleware never observes.
*/
function stripRequestBase(pathname, base) {
	pathname = collapseDuplicateLeadingSlashes(pathname);
	const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
	if (pathname === baseWithoutTrailingSlash) return "/";
	if (pathname.startsWith(baseWithoutTrailingSlash + "/")) return pathname.slice(baseWithoutTrailingSlash.length);
	return pathname;
}
var WITH_FILE_EXT = /\/[^/]+\.\w+$/;
function hasFileExtension(path) {
	return WITH_FILE_EXT.test(path);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/consts.js
var ACTION_QUERY_PARAMS = {
	actionName: "_action",
	actionPayload: "_astroActionPayload"
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/runtime/client.js
var codeToStatusMap = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	CONTENT_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_CONTENT: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError extends Error {
	type = "AstroActionError";
	code = "INTERNAL_SERVER_ERROR";
	status = 500;
	constructor(params) {
		super(params.message);
		this.code = params.code;
		this.status = ActionError.codeToStatus(params.code);
		if (params.stack) this.stack = params.stack;
	}
	static codeToStatus(code) {
		return codeToStatusMap[code];
	}
	static statusToCode(status) {
		return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
	}
	static fromJson(body) {
		if (isInputError(body)) return new ActionInputError(body.issues);
		if (isActionError(body)) return new ActionError(body);
		return new ActionError({ code: "INTERNAL_SERVER_ERROR" });
	}
};
function isActionError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
var ActionInputError = class extends ActionError {
	type = "AstroActionInputError";
	issues;
	fields;
	constructor(issues) {
		super({
			message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
			code: "BAD_REQUEST"
		});
		this.issues = issues;
		this.fields = {};
		for (const issue of issues) if (issue.path.length > 0) {
			const key = issue.path[0].toString();
			this.fields[key] ??= [];
			this.fields[key]?.push(issue.message);
		}
	}
};
function deserializeActionResult(res) {
	if (res.type === "error") {
		let json;
		try {
			json = JSON.parse(res.body);
		} catch {
			return {
				data: void 0,
				error: new ActionError({
					message: res.body,
					code: "INTERNAL_SERVER_ERROR"
				})
			};
		}
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.PROD) return {
			error: ActionError.fromJson(json),
			data: void 0
		};
		else {
			const error = ActionError.fromJson(json);
			error.stack = actionResultErrorStack.get();
			return {
				error,
				data: void 0
			};
		}
	}
	if (res.type === "empty") return {
		data: void 0,
		error: void 0
	};
	return {
		data: parse(res.body, { URL: (href) => new URL(href) }),
		error: void 0
	};
}
var actionResultErrorStack = (function actionResultErrorStackFn() {
	let errorStack;
	return {
		set(stack) {
			errorStack = stack;
		},
		get() {
			return errorStack;
		}
	};
})();
function getActionQueryString(name) {
	return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/utils.js
function hasActionPayload(locals) {
	return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
	return (actionFn) => {
		if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
		return deserializeActionResult(locals._actionPayload.actionResult);
	};
}
function createCallAction(context) {
	return (baseAction, input) => {
		Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
		return baseAction.bind(context)(input);
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cookies/cookies.js
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol = Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
	value;
	constructor(value) {
		this.value = value;
	}
	json() {
		if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
		return JSON.parse(this.value);
	}
	number() {
		return Number(this.value);
	}
	boolean() {
		if (this.value === "false") return false;
		if (this.value === "0") return false;
		return Boolean(this.value);
	}
};
var AstroCookies = class {
	#request;
	#requestValues;
	#outgoing;
	#consumed;
	#logger;
	constructor(request, logger) {
		this.#request = request;
		this.#requestValues = null;
		this.#outgoing = null;
		this.#consumed = false;
		this.#logger = logger;
	}
	/**
	* Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
	* in a Set-Cookie header added to the response.
	* @param key The cookie to delete
	* @param options Options related to this deletion, such as the path of the cookie.
	*/
	delete(key, options) {
		this.#ensureOutgoingMap().set(key, [
			DELETED_VALUE,
			stringifySetCookie({
				...options,
				name: key,
				value: DELETED_VALUE,
				expires: DELETED_EXPIRATION,
				maxAge: void 0
			}),
			false
		]);
	}
	/**
	* Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
	* request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
	* from that set call, overriding any values already part of the request.
	* @param key The cookie to get.
	* @returns An object containing the cookie value as well as convenience methods for converting its value.
	*/
	get(key, options = void 0) {
		if (this.#outgoing?.has(key)) {
			let [serializedValue, , isSetValue] = this.#outgoing.get(key);
			if (isSetValue) return new AstroCookie(serializedValue);
			else return;
		}
		const decode = options?.decode ?? decodeURIComponent;
		const values = this.#ensureParsed();
		if (key in values) {
			const value = values[key];
			if (value !== void 0) {
				let decodedValue;
				try {
					decodedValue = decode(value);
				} catch (_error) {
					decodedValue = value;
				}
				return new AstroCookie(decodedValue);
			}
		}
	}
	/**
	* Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
	* part of the initial request or set via Astro.cookies.set(key)
	* @param key The cookie to check for.
	* @param _options This parameter is no longer used.
	* @returns
	*/
	has(key, _options) {
		if (this.#outgoing?.has(key)) {
			let [, , isSetValue] = this.#outgoing.get(key);
			return isSetValue;
		}
		return this.#ensureParsed()[key] !== void 0;
	}
	/**
	* Astro.cookies.set(key, value) is used to set a cookie's value. If provided
	* an object it will be stringified via JSON.stringify(value). Additionally you
	* can provide options customizing how this cookie will be set, such as setting httpOnly
	* in order to prevent the cookie from being read in client-side JavaScript.
	* @param key The name of the cookie to set.
	* @param value A value, either a string or other primitive or an object.
	* @param options Options for the cookie, such as the path and security settings.
	*/
	set(key, value, options) {
		if (this.#consumed) this.#logger.warn("SKIP_FORMAT", "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else {
			let toStringValue = value.toString();
			if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
			else serializedValue = toStringValue;
		}
		const { encode, ...attributes } = options ?? {};
		this.#ensureOutgoingMap().set(key, [
			serializedValue,
			stringifySetCookie({
				...attributes,
				name: key,
				value: serializedValue
			}, { encode }),
			true
		]);
		if (this.#request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
	}
	/**
	* Merges a new AstroCookies instance into the current instance. Any new cookies
	* will be added to the current instance, overwriting any existing cookies with the same name.
	*/
	merge(cookies) {
		const outgoing = cookies.#outgoing;
		if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
	}
	/**
	* Astro.cookies.header() returns an iterator for the cookies that have previously
	* been set by either Astro.cookies.set() or Astro.cookies.delete().
	* This method is primarily used by adapters to set the header on outgoing responses.
	* @returns
	*/
	*headers() {
		if (this.#outgoing == null) return;
		for (const [, value] of this.#outgoing) yield value[1];
	}
	/**
	* Marks the cookies as consumed and returns the header values.
	* After consumption, any subsequent `set()` calls will warn.
	*/
	consume() {
		this.#consumed = true;
		return this.headers();
	}
	/**
	* @deprecated Use the instance method `cookies.consume()` instead.
	* Kept for backward compatibility with adapters.
	*/
	static consume(cookies) {
		return cookies.consume();
	}
	#ensureParsed() {
		if (!this.#requestValues) this.#parse();
		if (!this.#requestValues) this.#requestValues = Object.create(null);
		return this.#requestValues;
	}
	#ensureOutgoingMap() {
		if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
		return this.#outgoing;
	}
	#parse() {
		const raw = this.#request.headers.get("cookie");
		if (!raw) return;
		this.#requestValues = parseCookie(raw, { decode: identity });
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cookies/response.js
var astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
	Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
	let cookies = Reflect.get(response, astroCookiesSymbol);
	if (cookies != null) return cookies;
	else return;
}
function* getSetCookiesFromResponse(response) {
	const cookies = getCookiesFromResponse(response);
	if (!cookies) return [];
	for (const headerValue of cookies.consume()) yield headerValue;
	return [];
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/path.js
function pathHasLocale(path, locales) {
	const segments = path.split("/").map(normalizeThePath);
	for (const segment of segments) for (const locale of locales) if (typeof locale === "string") {
		if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) return true;
	} else if (segment === locale.path) return true;
	return false;
}
/**
*
* Given a locale, this function:
* - replaces the `_` with a `-`;
* - transforms all letters to be lowercase;
*/
function normalizeTheLocale(locale) {
	return locale.replaceAll("_", "-").toLowerCase();
}
/**
*
* Given a path or path segment, this function:
* - removes the `.html` extension if it exists
*/
function normalizeThePath(path) {
	return path.endsWith(".html") ? path.slice(0, -5) : path;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/error-routes.js
function isLocalizedErrorRoute(route, status, locales) {
	if (!locales) return false;
	const suffix = `/${status}`;
	if (!route.endsWith(suffix)) return false;
	const localeSegment = route.slice(0, -suffix.length);
	if (!localeSegment || localeSegment.includes("/", 1)) return false;
	return pathHasLocale(localeSegment, locales);
}
function getErrorRoutePath(pathname, status, routes, locales, appendTrailingSlash = false) {
	const suffix = appendTrailingSlash ? "/" : "";
	if (locales) {
		const firstSegment = pathname.split("/").find(Boolean);
		if (firstSegment && pathHasLocale(`/${firstSegment}`, locales)) {
			const localized = `/${firstSegment}/${status}`;
			if (routes.some((route) => route.route === localized)) return `${localized}${suffix}`;
		}
	}
	return `/${status}${suffix}`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/internal/route-errors.js
var ROUTE404_RE = /^\/404\/?$/;
var ROUTE500_RE = /^\/500\/?$/;
var ROUTE3XX_RE = /^\/3xx\/?$/;
function isRoute404(route) {
	return ROUTE404_RE.test(route);
}
function isRoute500(route) {
	return ROUTE500_RE.test(route);
}
/** Matches the route of the user-provided redirect page, `src/pages/3xx.astro`. */
function isRoute3xx(route) {
	return ROUTE3XX_RE.test(route);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/helpers.js
/**
* Function guard that checks if a route is redirect. If so, `RouteData.redirectRoute` and
* `RouteData.redirect` aren't `undefined` anymore
* @param route
*/
function routeIsRedirect(route) {
	return route?.type === "redirect";
}
/**
* True if the route represents a fallback entry.
*/
function routeIsFallback(route) {
	return route?.type === "fallback";
}
/**
* Give a route, it returns its fallback routes from a `list` of `RouteInfo[]`.
*
* It throws an error if no fallback routes were found. This means there's an error
* when we construct the list of routes
* @param route
* @param routeList
*/
function getFallbackRoute(route, routeList) {
	const fallbackRoute = routeList.find((r) => {
		if (route.route === "/" && r.routeData.route === "/") return true;
		return r.routeData.fallbackRoutes.find((f) => {
			return f.route === route.route;
		});
	});
	if (!fallbackRoute) throw new Error(`No fallback route found for route ${route.route}`);
	return fallbackRoute.routeData;
}
/**
* Return a user-provided 404 route if one exists.
*/
function getCustom404Route(manifestData) {
	return manifestData.routes.find((r) => isRoute404(r.route));
}
/**
* Return a user-provided 500 route if one exists.
*/
function getCustom500Route(manifestData) {
	return manifestData.routes.find((r) => isRoute500(r.route));
}
/**
* Computes the default HTTP status code a route renders with:
* `302` for i18n fallback matches, `404`/`500` for (possibly localized)
* error routes, `200` otherwise.
*/
function getDefaultStatusCode(manifest, routeData, pathname) {
	if (!routeData.pattern.test(pathname)) {
		for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(pathname)) return 302;
	}
	const route = removeTrailingForwardSlash(routeData.route);
	const locales = manifest.i18n?.locales;
	if (isRoute404(route) || isLocalizedErrorRoute(route, 404, locales)) return 404;
	if (isRoute500(route) || isLocalizedErrorRoute(route, 500, locales)) return 500;
	return 200;
}
/**
* Returns true if the route definition contains `.html` as a static segment part,
* as is the case for routes like `[slug].html.astro`. Used to avoid stripping the
* `.html` suffix from pathnames that intentionally include it.
*/
function routeHasHtmlExtension(route) {
	return route.segments.some((segment) => segment.some((part) => !part.dynamic && part.content.includes(".html")));
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/redirects/component.js
var RedirectComponentInstance = { default() {
	return new Response(null, { status: 301 });
} };
var RedirectSinglePageBuiltModule = {
	page: () => Promise.resolve(RedirectComponentInstance),
	onRequest: (_, next) => next()
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/assets/utils/getAssetsPrefix.js
function getAssetsPrefix(fileExtension, assetsPrefix) {
	let prefix = "";
	if (!assetsPrefix) prefix = "";
	else if (typeof assetsPrefix === "string") prefix = assetsPrefix;
	else prefix = assetsPrefix[fileExtension.slice(1)] || assetsPrefix.fallback;
	return prefix;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/render/ssr-element.js
var URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
	const parsed = new URL(path, URL_PARSE_BASE);
	return {
		pathname: !URL.canParse(path) && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname,
		suffix: `${parsed.search}${parsed.hash}`
	};
}
function appendQueryParams(path, queryParams) {
	const queryString = queryParams.toString();
	if (!queryString) return path;
	const hashIndex = path.indexOf("#");
	const basePath = hashIndex === -1 ? path : path.slice(0, hashIndex);
	const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
	return `${basePath}${basePath.includes("?") ? "&" : "?"}${queryString}${hash}`;
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
	const { pathname, suffix } = splitAssetPath(href);
	let url = "";
	if (assetsPrefix) url = joinPaths(getAssetsPrefix(fileExtension(pathname), assetsPrefix), slash(pathname)) + suffix;
	else if (base) url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
	else url = href;
	if (queryParams) url = appendQueryParams(url, queryParams);
	return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
	if (stylesheet.type === "inline") return {
		props: {},
		children: stylesheet.content
	};
	else return {
		props: {
			rel: "stylesheet",
			href: createAssetLink(stylesheet.src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
	return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix, queryParams)));
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
	if (script.type === "external") return createModuleScriptElementWithSrc(script.value, base, assetsPrefix, queryParams);
	else return {
		props: { type: "module" },
		children: script.value
	};
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
	return {
		props: {
			type: "module",
			src: createAssetLink(src, base, assetsPrefix, queryParams)
		},
		children: ""
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/manifest/memo.js
function createManifestMemo(derive) {
	const cache = /* @__PURE__ */ new WeakMap();
	return {
		get(manifest) {
			if (cache.has(manifest)) return cache.get(manifest);
			const value = derive(manifest);
			cache.set(manifest, value);
			return value;
		},
		has(manifest) {
			return cache.has(manifest);
		},
		set(manifest, value) {
			cache.set(manifest, value);
		},
		invalidate(manifest) {
			cache.delete(manifest);
		}
	};
}
/**
* Caches the PROMISE (single-flight: concurrent callers share one derivation).
* On rejection the entry is DELETED so the next call retries a failed lazy
* resolve instead of caching the failure forever.
*/
function createAsyncManifestMemo(derive) {
	const cache = /* @__PURE__ */ new WeakMap();
	return {
		get(manifest) {
			let promise = cache.get(manifest);
			if (!promise) {
				promise = derive(manifest);
				cache.set(manifest, promise);
				promise.catch(() => {
					if (cache.get(manifest) === promise) cache.delete(manifest);
				});
			}
			return promise;
		},
		invalidate(manifest) {
			cache.delete(manifest);
		}
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/endpoint.js
/** Renders an endpoint request to completion, returning the body. */
async function renderEndpoint(mod, context, isPrerendered, logger, state) {
	const { request, url } = context;
	const method = request.method.toUpperCase();
	let handler = mod[method] ?? mod["ALL"];
	if (!handler && method === "HEAD" && mod["GET"]) handler = mod["GET"];
	if (isPrerendered && !["GET", "HEAD"].includes(method)) logger.warn("router", `${url.pathname} ${colors.bold(method)} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`);
	if (handler === void 0) {
		logger.warn("router", `No API Route handler exists for the method "${method}" for the route "${url.pathname}".\nFound handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}\n` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?\n` : ""));
		return new Response(null, { status: 404 });
	}
	if (typeof handler !== "function") {
		logger.error("router", `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`);
		return new Response(null, { status: 500 });
	}
	let response = await handler.call(mod, context);
	if (!response || response instanceof Response === false) throw new AstroError(EndpointDidNotReturnAResponse);
	if (state && REROUTABLE_STATUS_CODES.includes(response.status)) state.skipErrorReroute = true;
	if (method === "HEAD") return new Response(null, response);
	return response;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/util.js
function isPromise(value) {
	return typeof value === "object" && value !== null && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) return;
			yield value;
		}
	} finally {
		reader.releaseLock();
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/escape.js
var ESCAPABLE = /[&<>'"]/g;
function entityFor(code) {
	switch (code) {
		case 38: return "&amp;";
		case 60: return "&lt;";
		case 62: return "&gt;";
		case 39: return "&#39;";
		default: return "&quot;";
	}
}
function escapeHTML(value) {
	ESCAPABLE.lastIndex = 0;
	if (!ESCAPABLE.test(value)) return value;
	let output = "";
	let last = 0;
	do {
		const index = ESCAPABLE.lastIndex - 1;
		if (last !== index) output += value.slice(last, index);
		output += entityFor(value.charCodeAt(index));
		last = index + 1;
	} while (ESCAPABLE.test(value));
	return last === value.length ? output : output + value.slice(last);
}
/**
* Serializes a value to a JSON string that is safe to embed inside a `<script>` tag.
* All `<` characters are escaped to `\u003c` so the browser's HTML parser cannot be
* tricked into closing the script block early via `<\/script>` variants (case-insensitive,
* whitespace, or self-closing forms) or `<!--` comment injection.
* @see https://mathiasbynens.be/notes/etago
*/
function stringifyForScript(value) {
	return JSON.stringify(value)?.replace(/</g, "\\u003c");
}
/** Escapes CSS text so it can be embedded inside a `<style>` tag. */
function escapeStyleText(value) {
	return value.replaceAll("<", "\\3C ");
}
var HTMLBytes = class extends Uint8Array {};
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, { get() {
	return "HTMLBytes";
} });
var htmlStringSymbol = Symbol.for("astro:html-string");
/**
* A "blessed" extension of String that tells Astro that the string
* has already been escaped. This helps prevent double-escaping of HTML.
*/
var HTMLString = class extends String {};
Object.defineProperty(HTMLString.prototype, htmlStringSymbol, { value: true });
/**
* markHTMLString marks a string as raw or "already escaped" by returning
* a `HTMLString` instance. This is meant for internal use, and should not
* be returned through any public JS API.
*/
var markHTMLString = (value) => {
	if (isHTMLString(value)) return value;
	if (typeof value === "string") return new HTMLString(value);
	return value;
};
function isHTMLString(value) {
	return typeof value === "object" && value !== null && value[htmlStringSymbol] === true;
}
function markHTMLBytes(bytes) {
	return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
	return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
	if (hasGetReader(iterable)) for await (const chunk of streamAsyncIterator(iterable)) yield unescapeHTML(chunk);
	else for await (const chunk of iterable) yield unescapeHTML(chunk);
}
function* unescapeChunks(iterable) {
	for (const chunk of iterable) yield unescapeHTML(chunk);
}
function unescapeHTML(str) {
	if (!!str && typeof str === "object") {
		if (str instanceof Uint8Array) return markHTMLBytes(str);
		else if (str instanceof Response && str.body) {
			const body = str.body;
			return unescapeChunksAsync(body);
		} else if (typeof str.then === "function") return Promise.resolve(str).then((value) => {
			return unescapeHTML(value);
		});
		else if (str[Symbol.for("astro:slot-string")]) return str;
		else if (Symbol.iterator in str) return unescapeChunks(str);
		else if (Symbol.asyncIterator in str || hasGetReader(str)) return unescapeChunksAsync(str);
	}
	return markHTMLString(str);
}
function isVNode(vnode) {
	return vnode && typeof vnode === "object" && vnode["astro:jsx"];
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/head-propagation/resolver.js
/** Returns true when a hint should register a component as a propagator. */
function isPropagatingHint(hint) {
	return hint === "self" || hint === "in-tree";
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/astro/factory.js
function isAstroComponentFactory(obj) {
	return obj == null ? false : obj.isAstroComponentFactory === true;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/serialize.js
var PROP_TYPE = {
	Value: 0,
	JSON: 1,
	RegExp: 2,
	Date: 3,
	Map: 4,
	Set: 5,
	BigInt: 6,
	URL: 7,
	Uint8Array: 8,
	Uint16Array: 9,
	Uint32Array: 10,
	Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
	if (parents.has(value)) throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
	parents.add(value);
	const serialized = value.map((v) => {
		return convertToSerializedForm(v, metadata, parents);
	});
	parents.delete(value);
	return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
	if (parents.has(value)) throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
	parents.add(value);
	const serialized = Object.fromEntries(Object.entries(value).map(([k, v]) => {
		return [k, convertToSerializedForm(v, metadata, parents)];
	}));
	parents.delete(value);
	return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
	switch (Object.prototype.toString.call(value)) {
		case "[object Date]": return [PROP_TYPE.Date, value.toISOString()];
		case "[object RegExp]": return [PROP_TYPE.RegExp, value.source];
		case "[object Map]": return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
		case "[object Set]": return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
		case "[object BigInt]": return [PROP_TYPE.BigInt, value.toString()];
		case "[object URL]": return [PROP_TYPE.URL, value.toString()];
		case "[object Array]": return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
		case "[object Uint8Array]": return [PROP_TYPE.Uint8Array, Array.from(value)];
		case "[object Uint16Array]": return [PROP_TYPE.Uint16Array, Array.from(value)];
		case "[object Uint32Array]": return [PROP_TYPE.Uint32Array, Array.from(value)];
		default:
			if (value !== null && typeof value === "object") return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
			if (value === Number.POSITIVE_INFINITY) return [PROP_TYPE.Infinity, 1];
			if (value === Number.NEGATIVE_INFINITY) return [PROP_TYPE.Infinity, -1];
			if (value === void 0) return [PROP_TYPE.Value];
			return [PROP_TYPE.Value, value];
	}
}
function serializeProps(props, metadata) {
	return JSON.stringify(serializeObject(props, metadata));
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/hydration.js
var transitionDirectivesToCopyOnIsland = /* @__PURE__ */ new Set([
	"data-astro-transition-scope",
	"data-astro-transition-persist",
	"data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
	let extracted = {
		isPage: false,
		hydration: null,
		props: {},
		propsWithoutTransitionAttributes: {}
	};
	for (const key of Object.keys(inputProps)) {
		const value = inputProps[key];
		if (key.startsWith("server:")) {
			if (key === "server:root") extracted.isPage = true;
		}
		if (key.startsWith("client:")) {
			if (!extracted.hydration) extracted.hydration = {
				directive: "",
				value: "",
				componentUrl: "",
				componentExport: { value: "" }
			};
			switch (key) {
				case "client:component-path":
					extracted.hydration.componentUrl = value;
					break;
				case "client:component-export":
					extracted.hydration.componentExport.value = value;
					break;
				case "client:component-hydration": break;
				case "client:display-name": break;
				default:
					extracted.hydration.directive = key.split(":")[1];
					extracted.hydration.value = value;
					if (!clientDirectives.has(extracted.hydration.directive)) {
						const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
						throw new Error(`Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`);
					}
					if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") throw new AstroError(MissingMediaQueryDirective);
			}
		} else {
			extracted.props[key] = value;
			if (!transitionDirectivesToCopyOnIsland.has(key)) extracted.propsWithoutTransitionAttributes[key] = value;
		}
	}
	for (const sym of Object.getOwnPropertySymbols(inputProps)) {
		extracted.props[sym] = inputProps[sym];
		extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
	}
	return extracted;
}
/** For hydrated components, generate a <script type="module"> to load the component */
async function generateHydrateScript(scriptOptions, metadata) {
	const { renderer, result, astroId, props, attrs } = scriptOptions;
	const { hydrate, componentUrl, componentExport } = metadata;
	if (!componentExport.value) throw new AstroError({
		...NoMatchingImport,
		message: NoMatchingImport.message(metadata.displayName)
	});
	const island = {
		children: "",
		props: { uid: astroId }
	};
	if (attrs) for (const [key, value] of Object.entries(attrs)) island.props[key] = escapeHTML(String(value));
	island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
	if (renderer.clientEntrypoint) {
		island.props["component-export"] = componentExport.value;
		island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint.toString()));
		island.props["props"] = escapeHTML(serializeProps(props, metadata));
	}
	island.props["ssr"] = "";
	island.props["client"] = hydrate;
	let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
	if (beforeHydrationUrl.length) island.props["before-hydration-url"] = beforeHydrationUrl;
	island.props["opts"] = escapeHTML(JSON.stringify({
		name: metadata.displayName,
		value: metadata.hydrateArgs || ""
	}));
	transitionDirectivesToCopyOnIsland.forEach((name) => {
		if (typeof props[name] !== "undefined") island.props[name] = escapeHTML(String(props[name]));
	});
	return island;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/astro/head-and-content.js
var headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
	return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createThinHead() {
	return { [headAndContentSym]: true };
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/astro-island.prebuilt.js
/**
* This file is prebuilt from packages/astro/src/runtime/server/astro-island.ts
* Do not edit this directly, but instead edit that file and rerun the prebuild
* to generate this file.
*/
var astro_island_prebuilt_default = `(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==\`function\`&&typeof Symbol.iterator==\`symbol\`?function(e){return typeof e}:function(e){return e&&typeof Symbol==\`function\`&&e.constructor===Symbol&&e!==Symbol.prototype?\`symbol\`:typeof e},e(t)}function t(t,n){if(e(t)!=\`object\`||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,n||\`default\`);if(e(i)!=\`object\`)return i;throw TypeError(\`@@toPrimitive must return a primitive value.\`)}return(n===\`string\`?String:Number)(t)}function n(n){var r=t(n,\`string\`);return e(r)==\`symbol\`?r:r+\`\`}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}let i=/* @__PURE__ */ new Set([\`__proto__\`,\`constructor\`,\`prototype\`]);{let e={0:e=>a(e),1:e=>n(e),2:e=>new RegExp(e),3:e=>new Date(e),4:e=>new Map(n(e)),5:e=>new Set(n(e)),6:e=>BigInt(e),7:e=>new URL(e),8:e=>new Uint8Array(e),9:e=>new Uint16Array(e),10:e=>new Uint32Array(e),11:e=>1/0*e},t=t=>{let[n,r]=t;return n in e?e[n](r):void 0},n=e=>e.map(t),a=e=>typeof e!=\`object\`||!e?e:Object.fromEntries(Object.entries(e).map(([e,n])=>[e,t(n)]));class o extends HTMLElement{constructor(...e){super(...e),r(this,\`Component\`,void 0),r(this,\`hydrator\`,void 0),r(this,\`hydrate\`,async()=>{var e;if(!this.hydrator||!this.isConnected)return;let t=(e=this.parentElement)==null?void 0:e.closest(\`astro-island[ssr]\`);if(t){t.addEventListener(\`astro:hydrate\`,this.hydrate,{once:!0});return}let n=this.querySelectorAll(\`astro-slot\`),r={},i=this.querySelectorAll(\`template[data-astro-template]\`);for(let e of i){let t=e.closest(this.tagName);t!=null&&t.isSameNode(this)&&(r[e.getAttribute(\`data-astro-template\`)||\`default\`]=e.innerHTML,e.remove())}for(let e of n){let t=e.closest(this.tagName);t!=null&&t.isSameNode(this)&&(r[e.getAttribute(\`name\`)||\`default\`]=e.innerHTML)}let o;try{o=this.hasAttribute(\`props\`)?a(JSON.parse(this.getAttribute(\`props\`))):{}}catch(e){let t=this.getAttribute(\`component-url\`)||\`<unknown>\`,n=this.getAttribute(\`component-export\`);throw n&&(t+=\` (export \${n})\`),console.error(\`[hydrate] Error parsing props for component \${t}\`,this.getAttribute(\`props\`),e),e}await this.hydrator(this)(this.Component,o,r,{client:this.getAttribute(\`client\`)}),this.removeAttribute(\`ssr\`),this.dispatchEvent(new CustomEvent(\`astro:hydrate\`))}),r(this,\`unmount\`,()=>{this.isConnected||this.dispatchEvent(new CustomEvent(\`astro:unmount\`))})}disconnectedCallback(){document.removeEventListener(\`astro:after-swap\`,this.unmount),document.addEventListener(\`astro:after-swap\`,this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute(\`await-children\`)||document.readyState===\`interactive\`||document.readyState===\`complete\`)this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener(\`DOMContentLoaded\`,e),t.disconnect(),this.childrenConnectedCallback()},t=new MutationObserver(()=>{var t;((t=this.lastChild)==null?void 0:t.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue===\`astro:end\`&&(this.lastChild.remove(),e())});t.observe(this,{childList:!0}),document.addEventListener(\`DOMContentLoaded\`,e)}}async childrenConnectedCallback(){let e=this.getAttribute(\`before-hydration-url\`);e&&await import(e),this.start()}getRetryImportUrl(e){let t=new URL(e,document.baseURI);return t.searchParams.set(\`astro-retry\`,Date.now().toString()),t.toString()}async importWithRetry(e){try{return await import(e)}catch(t){return await new Promise(e=>setTimeout(e,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let t=this.getAttribute(\`component-url\`),n=new CustomEvent(\`astro:hydration-error\`,{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:t}});this.dispatchEvent(n)&&console.error(\`[astro-island] Error hydrating \${t}\`,e)}async start(){let e=JSON.parse(this.getAttribute(\`opts\`)),t=this.getAttribute(\`client\`);if(Astro[t]===void 0)window.addEventListener(\`astro:\${t}\`,()=>this.start(),{once:!0});else try{await Astro[t](async()=>{let e=this.getAttribute(\`renderer-url\`);try{let[t,{default:n}]=await Promise.all([this.importWithRetry(this.getAttribute(\`component-url\`)),e?this.importWithRetry(e):Promise.resolve({default:()=>()=>{}})]),r=this.getAttribute(\`component-export\`)||\`default\`;if(r.includes(\`.\`)){this.Component=t;for(let e of r.split(\`.\`)){if(i.has(e)||!this.Component||typeof this.Component!=\`object\`&&typeof this.Component!=\`function\`||!Object.hasOwn(this.Component,e))throw Error(\`Invalid component export path: \${r}\`);this.Component=this.Component[e]}}else{if(i.has(r))throw Error(\`Invalid component export path: \${r}\`);this.Component=t[r]}return this.hydrator=n,this.hydrate}catch(e){return this.handleHydrationError(e),()=>{}}},e,this)}catch(e){this.handleHydrationError(e)}}attributeChangedCallback(){this.hydrate()}}r(o,\`observedAttributes\`,[\`props\`]),customElements.get(\`astro-island\`)||customElements.define(\`astro-island\`,o)}})();`;
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/astro-island.prebuilt-dev.js
/**
* This file is prebuilt from packages/astro/src/runtime/server/astro-island.ts
* Do not edit this directly, but instead edit that file and rerun the prebuild
* to generate this file.
*/
var astro_island_prebuilt_dev_default = `(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==\`function\`&&typeof Symbol.iterator==\`symbol\`?function(e){return typeof e}:function(e){return e&&typeof Symbol==\`function\`&&e.constructor===Symbol&&e!==Symbol.prototype?\`symbol\`:typeof e},e(t)}function t(t,n){if(e(t)!=\`object\`||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,n||\`default\`);if(e(i)!=\`object\`)return i;throw TypeError(\`@@toPrimitive must return a primitive value.\`)}return(n===\`string\`?String:Number)(t)}function n(n){var r=t(n,\`string\`);return e(r)==\`symbol\`?r:r+\`\`}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}let i=/* @__PURE__ */ new Set([\`__proto__\`,\`constructor\`,\`prototype\`]);{let e={0:e=>a(e),1:e=>n(e),2:e=>new RegExp(e),3:e=>new Date(e),4:e=>new Map(n(e)),5:e=>new Set(n(e)),6:e=>BigInt(e),7:e=>new URL(e),8:e=>new Uint8Array(e),9:e=>new Uint16Array(e),10:e=>new Uint32Array(e),11:e=>1/0*e},t=t=>{let[n,r]=t;return n in e?e[n](r):void 0},n=e=>e.map(t),a=e=>typeof e!=\`object\`||!e?e:Object.fromEntries(Object.entries(e).map(([e,n])=>[e,t(n)]));class o extends HTMLElement{constructor(...e){super(...e),r(this,\`Component\`,void 0),r(this,\`hydrator\`,void 0),r(this,\`hydrate\`,async()=>{var e;if(!this.hydrator||!this.isConnected)return;let t=(e=this.parentElement)==null?void 0:e.closest(\`astro-island[ssr]\`);if(t){t.addEventListener(\`astro:hydrate\`,this.hydrate,{once:!0});return}let n=this.querySelectorAll(\`astro-slot\`),r={},i=this.querySelectorAll(\`template[data-astro-template]\`);for(let e of i){let t=e.closest(this.tagName);t!=null&&t.isSameNode(this)&&(r[e.getAttribute(\`data-astro-template\`)||\`default\`]=e.innerHTML,e.remove())}for(let e of n){let t=e.closest(this.tagName);t!=null&&t.isSameNode(this)&&(r[e.getAttribute(\`name\`)||\`default\`]=e.innerHTML)}let o;try{o=this.hasAttribute(\`props\`)?a(JSON.parse(this.getAttribute(\`props\`))):{}}catch(e){let t=this.getAttribute(\`component-url\`)||\`<unknown>\`,n=this.getAttribute(\`component-export\`);throw n&&(t+=\` (export \${n})\`),console.error(\`[hydrate] Error parsing props for component \${t}\`,this.getAttribute(\`props\`),e),e}let s,c=this.hydrator(this);s=performance.now(),await c(this.Component,o,r,{client:this.getAttribute(\`client\`)}),s&&this.setAttribute(\`client-render-time\`,(performance.now()-s).toString()),this.removeAttribute(\`ssr\`),this.dispatchEvent(new CustomEvent(\`astro:hydrate\`))}),r(this,\`unmount\`,()=>{this.isConnected||this.dispatchEvent(new CustomEvent(\`astro:unmount\`))})}disconnectedCallback(){document.removeEventListener(\`astro:after-swap\`,this.unmount),document.addEventListener(\`astro:after-swap\`,this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute(\`await-children\`)||document.readyState===\`interactive\`||document.readyState===\`complete\`)this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener(\`DOMContentLoaded\`,e),t.disconnect(),this.childrenConnectedCallback()},t=new MutationObserver(()=>{var t;((t=this.lastChild)==null?void 0:t.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue===\`astro:end\`&&(this.lastChild.remove(),e())});t.observe(this,{childList:!0}),document.addEventListener(\`DOMContentLoaded\`,e)}}async childrenConnectedCallback(){let e=this.getAttribute(\`before-hydration-url\`);e&&await import(e),this.start()}getRetryImportUrl(e){let t=new URL(e,document.baseURI);return t.searchParams.set(\`astro-retry\`,Date.now().toString()),t.toString()}async importWithRetry(e){try{return await import(e)}catch(t){return await new Promise(e=>setTimeout(e,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let t=this.getAttribute(\`component-url\`),n=new CustomEvent(\`astro:hydration-error\`,{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:t}});this.dispatchEvent(n)&&console.error(\`[astro-island] Error hydrating \${t}\`,e)}async start(){let e=JSON.parse(this.getAttribute(\`opts\`)),t=this.getAttribute(\`client\`);if(Astro[t]===void 0)window.addEventListener(\`astro:\${t}\`,()=>this.start(),{once:!0});else try{await Astro[t](async()=>{let e=this.getAttribute(\`renderer-url\`);try{let[t,{default:n}]=await Promise.all([this.importWithRetry(this.getAttribute(\`component-url\`)),e?this.importWithRetry(e):Promise.resolve({default:()=>()=>{}})]),r=this.getAttribute(\`component-export\`)||\`default\`;if(r.includes(\`.\`)){this.Component=t;for(let e of r.split(\`.\`)){if(i.has(e)||!this.Component||typeof this.Component!=\`object\`&&typeof this.Component!=\`function\`||!Object.hasOwn(this.Component,e))throw Error(\`Invalid component export path: \${r}\`);this.Component=this.Component[e]}}else{if(i.has(r))throw Error(\`Invalid component export path: \${r}\`);this.Component=t[r]}return this.hydrator=n,this.hydrate}catch(e){return this.handleHydrationError(e),()=>{}}},e,this)}catch(e){this.handleHydrationError(e)}}attributeChangedCallback(){this.hydrate()}}r(o,\`observedAttributes\`,[\`props\`]),customElements.get(\`astro-island\`)||customElements.define(\`astro-island\`,o)}})();`;
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/astro-island-styles.js
var ISLAND_STYLES = "astro-island,astro-slot,astro-static-slot{display:contents}";
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/scripts.js
function determineIfNeedsHydrationScript(result) {
	if (result._metadata.templateDepth > 0) return !result._metadata.hasHydrationScript;
	if (result._metadata.hasHydrationScript) return false;
	return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
	if (result._metadata.templateDepth > 0) return !result._metadata.hasDirectives.has(directive);
	if (result._metadata.hasDirectives.has(directive)) return false;
	result._metadata.hasDirectives.add(directive);
	return true;
}
function getDirectiveScriptText(result, directive) {
	const clientDirective = result.clientDirectives.get(directive);
	if (!clientDirective) throw new Error(`Unknown directive: ${directive}`);
	return clientDirective;
}
function getPrescripts(result, type, directive) {
	switch (type) {
		case "both": return `<style>${ISLAND_STYLES}</style><script>${getDirectiveScriptText(result, directive)}<\/script><script>${process.env.NODE_ENV === "development" ? astro_island_prebuilt_dev_default : astro_island_prebuilt_default}<\/script>`;
		case "directive": return `<script>${getDirectiveScriptText(result, directive)}<\/script>`;
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/head-propagation/buffer.js
/**
* Runs all registered propagators and collects the head HTML they emit.
*
* Components with head content are discovered as we go. Initializing one
* propagator can register more of them: a component marked `in-tree` renders
* its children, and one of those children may be a `self` component that emits
* styles. Slots add a second way to find them — a slot whose markup contains an
* `await` only reaches the components after that `await` once it resolves, so
* the pending slot pre-renders are fully drained before moving on to the next
* propagator.
*
* A single pass over the live `Set` reaches every late registration: a `Set`
* iterator visits entries added during iteration (in insertion order), and
* because slots are drained before the iterator advances, nothing can register
* a propagator after the iterator has reported `done`.
*
* Set `awaitPendingSlots` to `false` when collecting from inside a render that
* may itself be one of the pending slot pre-renders (a server island rendered
* through `renderComponentToString`). Awaiting them there would wait on the
* caller's own enclosing slot and never resolve (#18156).
*
* @example
* If a layout initializes and discovers a nested component that also emits
* `<link rel="stylesheet">`, both head chunks are collected before flush.
*/
async function collectPropagatedHeadParts(input) {
	const collectedHeadParts = [];
	const pendingSlotEvaluations = input.awaitPendingSlots === false ? [] : input.result._metadata?.pendingSlotEvaluations ?? [];
	const drainPendingSlots = async () => {
		while (pendingSlotEvaluations.length > 0) {
			const batch = pendingSlotEvaluations.splice(0, pendingSlotEvaluations.length);
			await Promise.all(batch);
		}
	};
	await drainPendingSlots();
	for (const propagator of input.propagators) {
		const returnValue = await propagator.init(input.result);
		if (input.isHeadAndContent(returnValue) && returnValue.head) collectedHeadParts.push(returnValue.head);
		await drainPendingSlots();
	}
	return collectedHeadParts;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/head-propagation/policy.js
/**
* Policy for explicit `head` instructions.
*
* @example
* A page with `<head>{Astro.head}</head>` renders once, then blocks repeats.
*/
function shouldRenderHeadInstruction(state) {
	return !state.hasRenderedHead && !state.partial;
}
/**
* Policy for fallback `maybe-head` instructions.
*
* @example
* A layout without `<head>` can inject styles with `maybe-head`, but only when
* no explicit `<head>` exists in the rendered tree.
*/
function shouldRenderMaybeHeadInstruction(state) {
	return !state.hasRenderedHead && !state.headInTree && !state.partial;
}
/** Dispatches to the policy function for `head` or `maybe-head`. */
function shouldRenderInstruction$1(type, state) {
	return type === "head" ? shouldRenderHeadInstruction(state) : shouldRenderMaybeHeadInstruction(state);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/head-propagation/runtime.js
/**
* Registers an instance in the propagation set when its hint requires buffering.
*
* @example
* A runtime-created component with `propagation: 'self'` is registered so its
* styles can be collected before head flush.
*/
function registerIfPropagating(result, factory, instance) {
	if (factory.propagation === "self" || factory.propagation === "in-tree") {
		result._metadata.propagators.add(instance);
		return;
	}
	if (factory.moduleId) {
		const hint = result.componentMetadata.get(factory.moduleId)?.propagation;
		if (isPropagatingHint(hint ?? "none")) result._metadata.propagators.add(instance);
	}
}
/**
* Initializes all registered propagators and appends the head parts they emit
* to `extraHead`. See `collectPropagatedHeadParts` for `awaitPendingSlots`.
*/
async function bufferPropagatedHead(result, options = {}) {
	const collected = await collectPropagatedHeadParts({
		propagators: result._metadata.propagators,
		result,
		isHeadAndContent,
		awaitPendingSlots: options.awaitPendingSlots
	});
	result._metadata.extraHead.push(...collected);
}
/** Facade helper for render instruction gating (`head` vs `maybe-head`). */
function shouldRenderInstruction(type, state) {
	return shouldRenderInstruction$1(type, state);
}
/** Projects `SSRResult` into the minimal state needed by instruction policy. */
function getInstructionRenderState(result) {
	return {
		hasRenderedHead: result._metadata.hasRenderedHead,
		headInTree: result._metadata.headInTree,
		partial: result.partial
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/csp/runtime.js
function normalizeCspResourceEntry(entry) {
	if (typeof entry === "string") return {
		resource: entry,
		kind: "default"
	};
	return {
		resource: entry.resource,
		kind: entry.kind ?? "default"
	};
}
function normalizeCspHashEntry(entry) {
	if (typeof entry === "string") return {
		hash: entry,
		kind: "default"
	};
	return {
		hash: entry.hash,
		kind: entry.kind ?? "default"
	};
}
/**
* Groups a directive's `resources`/`hashes` entries by their `kind`.
*/
function partitionByKind(directive) {
	const groups = {
		default: {
			resources: [],
			hashes: []
		},
		element: {
			resources: [],
			hashes: []
		},
		attribute: {
			resources: [],
			hashes: []
		}
	};
	for (const entry of directive.resources) {
		const { resource, kind } = normalizeCspResourceEntry(entry);
		groups[kind].resources.push(resource);
	}
	for (const entry of directive.hashes) {
		const { hash, kind } = normalizeCspHashEntry(entry);
		groups[kind].hashes.push(hash);
	}
	return groups;
}
/**
* `existingDirective` is something like `img-src 'self'`. Same as `newDirective`.
*
* Returns `undefined` if no directive has been deduped
* @param existingDirective
* @param newDirective
*/
function deduplicateDirectiveValues(existingDirective, newDirective) {
	const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
	const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
	if (directiveName !== newDirectiveName) return;
	return `${directiveName} ${Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues])).join(" ")}`;
}
function pushDirective(directives, newDirective) {
	if (directives.length === 0) return [newDirective];
	const finalDirectives = [];
	let matched = false;
	for (const directive of directives) {
		if (matched) {
			finalDirectives.push(directive);
			continue;
		}
		const result = deduplicateDirectiveValues(directive, newDirective);
		if (result) {
			finalDirectives.push(result);
			matched = true;
		} else finalDirectives.push(directive);
	}
	if (!matched) finalDirectives.push(newDirective);
	return finalDirectives;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/csp.js
function renderCspContent(result) {
	const { scriptDirective, styleDirective, directives } = result;
	const script = partitionByKind(scriptDirective);
	const style = partitionByKind(styleDirective);
	const finalScriptHashes = /* @__PURE__ */ new Set();
	for (const scriptHash of script.default.hashes) finalScriptHashes.add(`'${scriptHash}'`);
	for (const scriptHash of result._metadata.extraScriptHashes) finalScriptHashes.add(`'${scriptHash}'`);
	const finalStyleHashes = /* @__PURE__ */ new Set();
	for (const styleHash of style.default.hashes) finalStyleHashes.add(`'${styleHash}'`);
	for (const styleHash of result._metadata.extraStyleHashes) finalStyleHashes.add(`'${styleHash}'`);
	let directivesContent;
	if (directives.length > 0) directivesContent = directives.join(";") + ";";
	const scriptResources = script.default.resources.length > 0 ? script.default.resources.join(" ") : "'self'";
	const styleResources = style.default.resources.length > 0 ? style.default.resources.join(" ") : "'self'";
	const scriptElementDefaultResource = script.default.resources.length > 0 ? "" : "'self'";
	const styleElementDefaultResource = style.default.resources.length > 0 ? "" : "'self'";
	const scriptElemActive = isEnabled(script.element);
	const styleElemActive = isEnabled(style.element);
	const strictDynamicSuffix = scriptDirective.strictDynamic ? ` 'strict-dynamic'` : "";
	const scriptDefaultHasUnsafeInline = hasUnsafeInline(script.default.resources);
	const styleDefaultHasUnsafeInline = hasUnsafeInline(style.default.resources);
	const scriptSrc = `script-src ${scriptResources} ${[...scriptElemActive || scriptDefaultHasUnsafeInline ? [] : [...finalScriptHashes], ...scriptDirective.strictDynamic ? [`'strict-dynamic'`] : []].join(" ")};`;
	const styleSrc = `style-src ${styleResources} ${(styleElemActive || styleDefaultHasUnsafeInline ? [] : [...finalStyleHashes]).join(" ")};`;
	const scriptSrcElem = scriptElemActive ? renderSpecificDirective("script-src-elem", script.element.resources, scriptElementDefaultResource, finalScriptHashes, script.element.hashes, strictDynamicSuffix) : void 0;
	const scriptSrcAttr = isEnabled(script.attribute) ? renderSpecificDirective("script-src-attr", script.attribute.resources, "'none'", void 0, script.attribute.hashes) : void 0;
	const styleSrcElem = styleElemActive ? renderSpecificDirective("style-src-elem", style.element.resources, styleElementDefaultResource, finalStyleHashes, style.element.hashes) : void 0;
	const styleSrcAttr = isEnabled(style.attribute) ? renderSpecificDirective("style-src-attr", style.attribute.resources, "'none'", void 0, style.attribute.hashes) : void 0;
	return [
		directivesContent,
		scriptSrc,
		scriptSrcElem,
		scriptSrcAttr,
		styleSrc,
		styleSrcElem,
		styleSrcAttr
	].filter(Boolean).join(" ");
}
function hasUnsafeInline(resources) {
	return resources.includes("'unsafe-inline'");
}
/** A more specific directive is emitted only when the user scoped at least one source/hash to it. */
function isEnabled(sources) {
	return sources.resources.length > 0 || sources.hashes.length > 0;
}
/**
* Builds one of the narrower directive strings: `script-src-elem`, `script-src-attr`,
* `style-src-elem`, or `style-src-attr`.
*
* @param name The directive name, e.g. `"script-src-elem"`.
* @param resources The sources the user scoped to this directive (e.g. `'self'` or a URL).
* @param defaultResource The source to use when `resources` is empty. This is `'self'` for `-elem` without configured default resources and `'none'` for `-attr`.
* @param sharedHashes Already-quoted hashes to also include here — Astro's tag hashes for `-elem`, or `undefined` for `-attr` (which never receives them).
* @param ownHashes Unquoted hashes the user scoped to this directive.
* @param suffix Optional text added at the end, e.g. ` 'strict-dynamic'`.
*/
function renderSpecificDirective(name, resources, defaultResource, sharedHashes, ownHashes, suffix = "") {
	const unsafeInline = hasUnsafeInline(resources);
	const hashes = new Set(unsafeInline ? void 0 : sharedHashes);
	if (!unsafeInline) for (const hash of ownHashes) hashes.add(`'${hash}'`);
	let finalResources;
	if (resources.length > 0) finalResources = resources.map((r) => `${r}`).join(" ");
	else if (defaultResource === "'none'" && hashes.size > 0) finalResources = "";
	else finalResources = defaultResource;
	return `${name} ${[finalResources, ...hashes].filter(Boolean).join(" ")}${suffix};`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/instruction.js
var RenderInstructionSymbol = Symbol.for("astro:render");
function createRenderInstruction(instruction) {
	instruction[RenderInstructionSymbol] = true;
	return instruction;
}
function isRenderInstruction(chunk) {
	return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function isScriptInstruction(chunk) {
	return chunk && typeof chunk === "object" && "type" in chunk && chunk.type === "script";
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/util.js
var voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
var htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|inert|loop|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
var AMPERSAND_REGEX = /&/g;
var DOUBLE_QUOTE_REGEX = /"/g;
var STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
var INVALID_ATTR_NAME_CHAR = /[\s"'>/=]/;
var toIdent = (k) => k.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
	if (/\W/.test(match)) return "";
	return index === 0 ? match : match.toUpperCase();
});
var toAttributeString = (value, shouldEscape = true) => {
	if (!shouldEscape) return value;
	const str = String(value);
	if (!str.includes("&") && !str.includes("\"")) return str;
	return str.replace(AMPERSAND_REGEX, "&amp;").replace(DOUBLE_QUOTE_REGEX, "&quot;");
};
var kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
var toStyleString = (obj) => {
	let output = "";
	for (const key of Object.keys(obj)) {
		const value = obj[key];
		if (!(typeof value === "string" && value.trim() || typeof value === "number")) continue;
		if (output) output += ";";
		output += key[0] !== "-" && key[1] !== "-" ? `${kebab(key)}:${value}` : `${key}:${value}`;
	}
	return output;
};
function defineScriptVars(vars) {
	let output = "";
	for (const [key, value] of Object.entries(vars)) output += `const ${toIdent(key)} = ${stringifyForScript(value)};\n`;
	return markHTMLString(output);
}
function formatList(values) {
	if (values.length === 1) return values[0];
	return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function isCustomElement(tagName) {
	return tagName.includes("-");
}
function handleBooleanAttribute(key, value, shouldEscape, tagName) {
	if (key === "popover") return markHTMLString(value ? ` ${key}` : "");
	if (tagName && isCustomElement(tagName)) return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
	return markHTMLString(value ? ` ${key}` : "");
}
var ATTRIBUTE_KIND = {
	ORDINARY: 0,
	INVALID_NAME: 1,
	STATIC_DIRECTIVE: 2,
	CLASS_LIST: 3,
	STYLE: 4,
	CLASS_NAME: 5,
	BOOLEAN: 6,
	BOOLEAN_IF_BOOLEAN: 7
};
function classifyAttribute(key) {
	if (INVALID_ATTR_NAME_CHAR.test(key)) return ATTRIBUTE_KIND.INVALID_NAME;
	if (STATIC_DIRECTIVES.has(key)) return ATTRIBUTE_KIND.STATIC_DIRECTIVE;
	if (key === "class:list") return ATTRIBUTE_KIND.CLASS_LIST;
	if (key === "style") return ATTRIBUTE_KIND.STYLE;
	if (key === "className") return ATTRIBUTE_KIND.CLASS_NAME;
	if (htmlBooleanAttributes.test(key)) return ATTRIBUTE_KIND.BOOLEAN;
	if (key === "popover" || key === "download" || key === "hidden") return ATTRIBUTE_KIND.BOOLEAN_IF_BOOLEAN;
	return ATTRIBUTE_KIND.ORDINARY;
}
function addAttribute(value, key, shouldEscape = true, tagName = "") {
	if (value == null) return "";
	switch (classifyAttribute(key)) {
		case ATTRIBUTE_KIND.INVALID_NAME: return "";
		case ATTRIBUTE_KIND.STATIC_DIRECTIVE:
			console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
			return "";
		case ATTRIBUTE_KIND.CLASS_LIST: {
			const listValue = toAttributeString(clsx(value), shouldEscape);
			if (listValue === "") return "";
			return markHTMLString(` class="${listValue}"`);
		}
		case ATTRIBUTE_KIND.STYLE:
			if (!(value instanceof HTMLString)) {
				if (Array.isArray(value) && value.length === 2) return markHTMLString(` style="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`);
				if (typeof value === "object") return markHTMLString(` style="${toAttributeString(toStyleString(value), shouldEscape)}"`);
			}
			break;
		case ATTRIBUTE_KIND.CLASS_NAME: return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
		case ATTRIBUTE_KIND.BOOLEAN: return handleBooleanAttribute(key, value, shouldEscape, tagName);
		case ATTRIBUTE_KIND.BOOLEAN_IF_BOOLEAN:
			if (typeof value === "boolean") return handleBooleanAttribute(key, value, shouldEscape, tagName);
			break;
		case ATTRIBUTE_KIND.ORDINARY:
	}
	if (value === "") return markHTMLString(` ${key}`);
	return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function spreadElementAttributes(values) {
	let output = "";
	for (const key of Object.keys(values)) {
		if (key === "children") continue;
		output += addAttribute(values[key], key, true);
	}
	return output;
}
function internalSpreadAttributes(values, shouldEscape = true, tagName) {
	let output = "";
	for (const key of Object.keys(values)) output += addAttribute(values[key], key, shouldEscape, tagName);
	return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
	const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
	if (defineVars) {
		if (name === "style") {
			delete props["is:global"];
			delete props["is:scoped"];
		}
		if (name === "script") {
			delete props.hoist;
			children = defineScriptVars(defineVars) + "\n" + children;
		}
	}
	if ((children == null || children === "") && voidElementNames.test(name)) return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>`;
	return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>${children}</${name}>`;
}
var noop = () => {};
/**
* Renders into a buffer until `flush` is called (which
* flushes the buffer)
*/
var BufferedRenderer = class {
	chunks = [];
	renderPromise;
	destination;
	/**
	* Determines whether buffer has been flushed
	* to the final destination.
	*/
	flushed = false;
	constructor(destination, renderFunction) {
		this.destination = destination;
		this.renderPromise = renderFunction(this);
		if (isPromise(this.renderPromise)) Promise.resolve(this.renderPromise).catch(noop);
	}
	write(chunk) {
		if (this.flushed) this.destination.write(chunk);
		else this.chunks.push(chunk);
	}
	flush() {
		if (this.flushed) throw new Error("The render buffer has already been flushed.");
		this.flushed = true;
		for (const chunk of this.chunks) this.destination.write(chunk);
		return this.renderPromise;
	}
};
/**
* Executes the `bufferRenderFunction` to prerender it into a buffer destination, and return a promise
* with an object containing the `flush` function to flush the buffer to the final
* destination.
*
* @example
* ```ts
* // Render components in parallel ahead of time
* const finalRenders = [ComponentA, ComponentB].map((comp) => {
*   return createBufferedRenderer(finalDestination, async (bufferDestination) => {
*     await renderComponentToDestination(bufferDestination);
*   });
* });
* // Render array of components serially
* for (const finalRender of finalRenders) {
*   await finalRender.flush();
* }
* ```
*/
function createBufferedRenderer(destination, renderFunction) {
	return new BufferedRenderer(destination, renderFunction);
}
var isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
var isDeno = typeof Deno !== "undefined";
var isWorkerd = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
function promiseWithResolvers() {
	let resolve, reject;
	return {
		promise: new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		}),
		resolve,
		reject
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/head.js
function stablePropsKey(props) {
	const keys = Object.keys(props).sort();
	let result = "{";
	for (let i = 0; i < keys.length; i++) {
		if (i > 0) result += ",";
		result += JSON.stringify(keys[i]) + ":" + JSON.stringify(props[keys[i]]);
	}
	result += "}";
	return result;
}
function deduplicateElements(elements) {
	if (elements.length <= 1) return elements;
	const seen = /* @__PURE__ */ new Set();
	return elements.filter((item) => {
		const key = stablePropsKey(item.props) + item.children;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function renderAllHeadContent(result) {
	result._metadata.hasRenderedHead = true;
	let content = "";
	if (result.shouldInjectCspMetaTags && result.cspDestination === "meta") content += renderElement$1("meta", {
		props: {
			"http-equiv": "content-security-policy",
			content: renderCspContent(result)
		},
		children: ""
	}, false);
	const styles = deduplicateElements(Array.from(result.styles)).map((style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style));
	result.styles.clear();
	const scripts = deduplicateElements(Array.from(result.scripts)).map((script) => {
		if (result.userAssetsBase) script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
		return renderElement$1("script", script, false);
	});
	const links = deduplicateElements(Array.from(result.links)).map((link) => renderElement$1("link", link, false));
	const sep = result.compressHTML === true || result.compressHTML === "jsx" ? "" : "\n";
	content += styles.join(sep) + links.join(sep) + scripts.join(sep);
	if (result.speculationRulesContent) content += renderElement$1("script", {
		props: { type: "speculationrules" },
		children: result.speculationRulesContent
	}, false);
	content += result._metadata.extraHead.join("");
	return markHTMLString(content);
}
var HEAD_INSTRUCTION = Object.freeze(createRenderInstruction({ type: "head" }));
var MAYBE_HEAD_INSTRUCTION = Object.freeze(createRenderInstruction({ type: "maybe-head" }));
function renderHead() {
	return HEAD_INSTRUCTION;
}
function maybeRenderHead() {
	return MAYBE_HEAD_INSTRUCTION;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/server-islands-shared.js
var SERVER_ISLAND_START = "[if astro]>server-island-start<![endif]";
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/astro/render-template.js
var renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
var markedHtmlParts = /* @__PURE__ */ new WeakMap();
function markHtmlParts(htmlParts) {
	let marked = markedHtmlParts.get(htmlParts);
	if (marked === void 0) {
		marked = new Array(htmlParts.length);
		for (let i = 0; i < htmlParts.length; i++) marked[i] = htmlParts[i] ? markHTMLString(htmlParts[i]) : htmlParts[i];
		markedHtmlParts.set(htmlParts, marked);
	}
	return marked;
}
var RenderTemplateResult = class {
	[renderTemplateResultSym] = true;
	htmlParts;
	expressions;
	error;
	wrapped;
	constructor(htmlParts, expressions) {
		this.htmlParts = htmlParts;
		this.error = void 0;
		this.expressions = expressions;
	}
	catchExpressionError(index, expression) {
		if (this.wrapped?.has(index)) return expression;
		const wrapped = Promise.resolve(expression).catch((err) => {
			if (!this.error) {
				this.error = err;
				throw err;
			}
		});
		(this.wrapped ??= /* @__PURE__ */ new Set()).add(index);
		this.expressions[index] = wrapped;
		return wrapped;
	}
	render(destination) {
		const { expressions } = this;
		const htmlParts = markHtmlParts(this.htmlParts);
		for (let i = 0; i < htmlParts.length; i++) {
			const html = htmlParts[i];
			if (html) destination.write(html);
			if (i >= expressions.length) break;
			let exp = expressions[i];
			if (!(exp || exp === 0)) continue;
			if (isPromise(exp)) exp = this.catchExpressionError(i, exp);
			const result = renderChild(destination, exp);
			if (isPromise(result)) {
				const startIdx = i + 1;
				const remaining = expressions.length - startIdx;
				const flushers = new Array(remaining);
				for (let j = 0; j < remaining; j++) {
					let rExp = expressions[startIdx + j];
					if (isPromise(rExp)) rExp = this.catchExpressionError(startIdx + j, rExp);
					flushers[j] = createBufferedRenderer(destination, (bufferDestination) => {
						if (rExp || rExp === 0) return renderChild(bufferDestination, rExp);
					});
				}
				return result.then(() => {
					let k = 0;
					const iterate = () => {
						while (k < flushers.length) {
							const rHtml = htmlParts[startIdx + k];
							if (rHtml) destination.write(rHtml);
							const flushResult = flushers[k++].flush();
							if (isPromise(flushResult)) return flushResult.then(iterate);
						}
						const lastHtml = htmlParts[htmlParts.length - 1];
						if (lastHtml) destination.write(lastHtml);
					};
					return iterate();
				});
			}
		}
	}
};
function isRenderTemplateResult(obj) {
	return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
	return new RenderTemplateResult(htmlParts, expressions);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/slot.js
var slotString = Symbol.for("astro:slot-string");
var SlotString = class extends HTMLString {
	instructions;
	/**
	* The slot's content as an ordered stream. Unlike `instructions` (which holds
	* position-independent instructions like head/hydration content), scripts are
	* kept inline here so they render at their original position instead of being
	* hoisted to the start of the slot output.
	*/
	chunks;
	[slotString];
	constructor(content, instructions, chunks = []) {
		super(content);
		this.instructions = instructions;
		this.chunks = chunks;
		this[slotString] = true;
	}
};
function isSlotString(str) {
	return !!str[slotString];
}
/**
* Collects instructions from a SlotString into the target array.
* Returns the (possibly newly created) instructions array.
*/
function mergeSlotInstructions(target, source) {
	if (source.instructions?.length) {
		target ??= [];
		target.push(...source.instructions);
	}
	return target;
}
var SlotRenderInstance = class {
	result;
	slotted;
	constructor(result, slotted) {
		this.result = result;
		this.slotted = slotted;
	}
	/** Must be called at most once per instance. */
	evaluate() {
		const { slotted } = this;
		return typeof slotted === "function" ? slotted(this.result) : slotted;
	}
	render(destination) {
		return renderChild(destination, this.evaluate());
	}
};
function renderSlot(result, slotted, fallback) {
	if (!slotted && fallback) return renderSlot(result, fallback);
	return new SlotRenderInstance(result, slotted);
}
async function renderSlotToString(result, slotted, fallback) {
	let content = "";
	let instructions = null;
	const chunks = [];
	await renderSlot(result, slotted, fallback).render({ write(chunk) {
		if (chunk instanceof SlotString) {
			content += chunk;
			if (chunk.chunks.length) chunks.push(...chunk.chunks);
			instructions = mergeSlotInstructions(instructions, chunk);
		} else if (chunk instanceof Response) return;
		else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
			if (isScriptInstruction(chunk)) chunks.push(chunk);
			else {
				if (instructions === null) instructions = [];
				instructions.push(chunk);
			}
		} else {
			const str = chunkToString(result, chunk);
			content += str;
			chunks.push(str);
		}
	} });
	return markHTMLString(new SlotString(content, instructions, chunks));
}
async function renderSlots(result, slots = {}) {
	let slotInstructions = null;
	let children = {};
	if (slots) await Promise.all(Object.entries(slots).map(([key, value]) => renderSlotToString(result, value).then((output) => {
		if (output.instructions) {
			if (slotInstructions === null) slotInstructions = [];
			slotInstructions.push(...output.instructions);
		}
		if (output.chunks) {
			for (const part of output.chunks) if (typeof part !== "string") {
				if (slotInstructions === null) slotInstructions = [];
				slotInstructions.push(part);
			}
		}
		children[key] = output;
	})));
	return {
		slotInstructions,
		children
	};
}
function createSlotValueFromString(content) {
	return function() {
		return renderTemplate`${unescapeHTML(content)}`;
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/server-islands.js
var internalProps = /* @__PURE__ */ new Set([
	"server:component-path",
	"server:component-export",
	"server:component-directive",
	"server:defer"
]);
function containsServerDirective(props) {
	return "server:component-directive" in props;
}
function createSearchParams(encryptedComponentExport, encryptedProps, slots) {
	const params = new URLSearchParams();
	params.set("e", encryptedComponentExport);
	params.set("p", encryptedProps);
	params.set("s", slots);
	return params;
}
function isWithinURLLimit(pathname, params) {
	return (pathname + "?" + params.toString()).length < 2048;
}
var ServerIslandComponent = class {
	result;
	props;
	slots;
	displayName;
	hostId;
	islandContent;
	componentPath;
	componentExport;
	componentId;
	initPromise;
	constructor(result, props, slots, displayName) {
		this.result = result;
		this.props = props;
		this.slots = slots;
		this.displayName = displayName;
	}
	/**
	* Pre-renders the island slots and records its CSP script hashes. Runs once;
	* later calls (every head-collection pass revisits all propagators) return
	* the first result.
	*/
	init() {
		this.initPromise ??= this.initImpl();
		return this.initPromise;
	}
	async initImpl() {
		const content = await this.getIslandContent();
		if (this.result.cspDestination) {
			this.result._metadata.extraScriptHashes.push(await generateCspDigest(SERVER_ISLAND_REPLACER, this.result.cspAlgorithm));
			const contentDigest = await generateCspDigest(content, this.result.cspAlgorithm);
			this.result._metadata.extraScriptHashes.push(contentDigest);
		}
		return createThinHead();
	}
	async render(destination) {
		const hostId = await this.getHostId();
		const islandContent = await this.getIslandContent();
		destination.write(createRenderInstruction({ type: "server-island-runtime" }));
		destination.write(`<!--${SERVER_ISLAND_START}-->`);
		for (const name in this.slots) if (name === "fallback") await renderChild(destination, this.slots.fallback(this.result));
		destination.write(`<script type="module" data-astro-rerun data-island-id="${hostId}">${islandContent}<\/script>`);
	}
	getComponentPath() {
		if (this.componentPath) return this.componentPath;
		const componentPath = this.props["server:component-path"];
		if (!componentPath) throw new Error(`Could not find server component path`);
		this.componentPath = componentPath;
		return componentPath;
	}
	getComponentExport() {
		if (this.componentExport) return this.componentExport;
		const componentExport = this.props["server:component-export"];
		if (!componentExport) throw new Error(`Could not find server component export`);
		this.componentExport = componentExport;
		return componentExport;
	}
	async getHostId() {
		if (!this.hostId) this.hostId = await crypto.randomUUID();
		return this.hostId;
	}
	async getIslandContent() {
		if (this.islandContent) return this.islandContent;
		const componentPath = this.getComponentPath();
		const componentExport = this.getComponentExport();
		let componentId = (await this.result.getServerIslandNameMap()).get(componentPath);
		if (!componentId) throw new Error(`Could not find server component name ${componentPath}`);
		for (const key of Object.keys(this.props)) if (internalProps.has(key)) delete this.props[key];
		const renderedSlots = {};
		for (const name in this.slots) if (name !== "fallback") {
			const content = await renderSlotToString(this.result, this.slots[name]);
			const slotContent = content;
			let slotHtml = "";
			if (slotContent.chunks?.length) for (const part of slotContent.chunks) slotHtml += typeof part === "string" ? part : part.content;
			else slotHtml = content.toString();
			renderedSlots[name] = slotHtml;
		}
		const key = await this.result.key;
		const componentExportEncrypted = await encryptString(key, componentExport, `export:${componentId}`);
		const propsEncrypted = Object.keys(this.props).length === 0 ? "" : await encryptString(key, JSON.stringify(this.props), `props:${componentId}`);
		const slotsEncrypted = Object.keys(renderedSlots).length === 0 ? "" : await encryptString(key, JSON.stringify(renderedSlots), `slots:${componentId}`);
		const hostId = await this.getHostId();
		const slash = this.result.base.endsWith("/") ? "" : "/";
		let serverIslandUrl = `${this.result.base}${slash}_server-islands/${componentId}${this.result.trailingSlash === "always" ? "/" : ""}`;
		const potentialSearchParams = createSearchParams(componentExportEncrypted, propsEncrypted, slotsEncrypted);
		const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
		if (useGETRequest) {
			serverIslandUrl += "?" + potentialSearchParams.toString();
			this.result._metadata.extraHead.push(markHTMLString(`<link rel="preload" as="fetch" href="${toAttributeString(serverIslandUrl)}" crossorigin="anonymous">`));
		}
		const headersJson = stringifyForScript(this.result.internalFetchHeaders || {});
		const serverIslandUrlJson = stringifyForScript(serverIslandUrl);
		const method = useGETRequest ? `const headers = new Headers(${headersJson});
let response = await fetch(${serverIslandUrlJson}, { headers });` : `let data = {
	encryptedComponentExport: ${stringifyForScript(componentExportEncrypted)},
	encryptedProps: ${stringifyForScript(propsEncrypted)},
	encryptedSlots: ${stringifyForScript(slotsEncrypted)},
};
const headers = new Headers({ 'Content-Type': 'application/json', ...${headersJson} });
let response = await fetch(${serverIslandUrlJson}, {
	method: 'POST',
	body: JSON.stringify(data),
	headers,
});`;
		this.islandContent = `${method}replaceServerIsland(${stringifyForScript(hostId)}, response);`;
		return this.islandContent;
	}
};
var renderServerIslandRuntime = () => {
	return `<script>${SERVER_ISLAND_REPLACER}<\/script>`;
};
var SERVER_ISLAND_REPLACER = markHTMLString(`async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '${SERVER_ISLAND_START}')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" "));
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/common.js
var Fragment = Symbol.for("astro:fragment");
var Renderer = Symbol.for("astro:renderer");
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
	if (typeof chunk === "string") return chunk;
	if (isRenderInstruction(chunk)) {
		const instruction = chunk;
		switch (instruction.type) {
			case "directive": {
				const { hydration } = instruction;
				const needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
				const needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
				if (needsHydrationScript) return markHTMLString(getPrescripts(result, "both", hydration.directive));
				else if (needsDirectiveScript) return markHTMLString(getPrescripts(result, "directive", hydration.directive));
				else return "";
			}
			case "head":
				if (!shouldRenderInstruction("head", getInstructionRenderState(result))) return "";
				return renderAllHeadContent(result);
			case "maybe-head":
				if (!shouldRenderInstruction("maybe-head", getInstructionRenderState(result))) return "";
				return renderAllHeadContent(result);
			case "renderer-hydration-script": {
				const { rendererSpecificHydrationScripts } = result._metadata;
				const { rendererName } = instruction;
				if (result._metadata.templateDepth > 0) return instruction.render();
				if (!rendererSpecificHydrationScripts.has(rendererName)) {
					rendererSpecificHydrationScripts.add(rendererName);
					return instruction.render();
				}
				return "";
			}
			case "server-island-runtime":
				if (result._metadata.templateDepth > 0) return renderServerIslandRuntime();
				if (result._metadata.hasRenderedServerIslandRuntime) return "";
				result._metadata.hasRenderedServerIslandRuntime = true;
				return renderServerIslandRuntime();
			case "script": {
				const { id, content } = instruction;
				if (result._metadata.templateDepth > 0) return content;
				if (result._metadata.renderedScripts.has(id)) return "";
				result._metadata.renderedScripts.add(id);
				return content;
			}
			case "template-enter":
				result._metadata.templateDepth++;
				return "";
			case "template-exit":
				if (result._metadata.templateDepth <= 0) throw new Error("Unexpected template-exit instruction without a matching template-enter. This may indicate that the compiler emitted unbalanced template boundaries, or that a component manually injected a template-exit render instruction.");
				result._metadata.templateDepth--;
				return "";
			default: throw new Error(`Unknown chunk type: ${chunk.type}`);
		}
	} else if (chunk instanceof Response) return "";
	else if (isSlotString(chunk)) {
		let out = "";
		const c = chunk;
		if (c.instructions) for (const instr of c.instructions) out += stringifyChunk(result, instr);
		if (c.chunks.length) for (const part of c.chunks) out += typeof part === "string" ? part : stringifyChunk(result, part);
		else out += chunk.toString();
		return out;
	}
	return chunk.toString();
}
function chunkToString(result, chunk) {
	if (ArrayBuffer.isView(chunk)) return decoder.decode(chunk);
	else return stringifyChunk(result, chunk);
}
function chunkToByteArray(result, chunk) {
	if (ArrayBuffer.isView(chunk)) return chunk;
	else {
		const stringified = stringifyChunk(result, chunk);
		return encoder.encode(stringified.toString());
	}
}
function chunkToByteArrayOrString(result, chunk) {
	if (ArrayBuffer.isView(chunk)) return chunk;
	else return stringifyChunk(result, chunk).toString();
}
function isRenderInstance(obj) {
	return typeof obj === "object" && obj !== null && typeof obj.render === "function";
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/any.js
function renderChild(destination, child) {
	if (typeof child === "string") {
		destination.write(markHTMLString(escapeHTML(child)));
		return;
	}
	if (isRenderInstruction(child)) {
		destination.write(child);
		return;
	}
	if (isPromise(child)) return child.then((x) => renderChild(destination, x));
	if (isRenderInstance(child)) return child.render(destination);
	if (child instanceof SlotString) {
		destination.write(child);
		return;
	}
	if (isHTMLString(child)) {
		destination.write(child);
		return;
	}
	if (!child && child !== 0) return;
	if (Array.isArray(child)) return renderArray(destination, child);
	if (typeof child === "function") return renderChild(destination, child());
	if (ArrayBuffer.isView(child)) {
		destination.write(child);
		return;
	}
	if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
		if (Symbol.asyncIterator in child) return renderAsyncIterable(destination, child);
		return renderIterable(destination, child);
	}
	destination.write(child);
}
function renderArray(destination, children) {
	for (let i = 0; i < children.length; i++) {
		const result = renderChild(destination, children[i]);
		if (isPromise(result)) {
			if (i + 1 >= children.length) return result;
			const remaining = children.length - i - 1;
			const flushers = new Array(remaining);
			for (let j = 0; j < remaining; j++) flushers[j] = createBufferedRenderer(destination, (bufferDestination) => {
				return renderChild(bufferDestination, children[i + 1 + j]);
			});
			return result.then(() => {
				let k = 0;
				const iterate = () => {
					while (k < flushers.length) {
						const flushResult = flushers[k++].flush();
						if (isPromise(flushResult)) return flushResult.then(iterate);
					}
				};
				return iterate();
			});
		}
	}
}
function renderIterable(destination, children) {
	const iterator = children[Symbol.iterator]();
	const iterate = () => {
		for (;;) {
			const { value, done } = iterator.next();
			if (done) break;
			const result = renderChild(destination, value);
			if (isPromise(result)) return result.then(iterate);
		}
	};
	return iterate();
}
async function renderAsyncIterable(destination, children) {
	for await (const value of children) await renderChild(destination, value);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/astro/instance.js
var astroComponentInstanceSym = Symbol.for("astro.componentInstance");
var CLIENT_DIRECTIVE_PREFIX = "client:";
var AstroComponentInstance = class {
	[astroComponentInstanceSym] = true;
	result;
	props;
	slotValues;
	factory;
	returnValue;
	constructor(result, props, slots, factory) {
		this.result = result;
		this.props = props;
		this.factory = factory;
		this.slotValues = slots;
		for (const name in slots) {
			if (this.slotValues === slots) this.slotValues = {};
			let didRender = false;
			let value = slots[name](result);
			if (result._metadata.routeHasPropagation && isPromise(value)) result._metadata.pendingSlotEvaluations.push(value);
			this.slotValues[name] = () => {
				if (!didRender) {
					didRender = true;
					return value;
				}
				return slots[name](result);
			};
		}
	}
	init(result) {
		if (this.returnValue !== void 0) return this.returnValue;
		this.returnValue = this.factory(result, this.props, this.slotValues);
		if (isPromise(this.returnValue)) this.returnValue.then((resolved) => {
			this.returnValue = resolved;
		}).catch(() => {});
		return this.returnValue;
	}
	render(destination) {
		const returnValue = this.init(this.result);
		if (isPromise(returnValue)) return returnValue.then((x) => this.renderImpl(destination, x));
		return this.renderImpl(destination, returnValue);
	}
	renderImpl(destination, returnValue) {
		if (isHeadAndContent(returnValue)) return returnValue.content.render(destination);
		else return renderChild(destination, returnValue);
	}
};
function validateComponentProps(props, clientDirectives, displayName) {
	if (props != null) {
		for (const prop in props) if (prop.startsWith(CLIENT_DIRECTIVE_PREFIX) && clientDirectives.has(prop.slice(7))) console.warn(`You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`);
	}
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
	validateComponentProps(props, result.clientDirectives, displayName);
	const instance = new AstroComponentInstance(result, props, slots, factory);
	registerIfPropagating(result, factory, instance);
	return instance;
}
function isAstroComponentInstance(obj) {
	return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/streaming.js
var ClientOnlyPlaceholder$1 = "astro-client-only";
/**
* Cursor over a RenderTemplateResult. Lets us interleave static HTML parts and
* dynamic expressions without pushing each part onto the stack or wrapping it
* in an HTMLString — static parts are appended straight to the batch buffer.
*/
var TemplateFrame = class {
	/** The RenderTemplateResult this frame walks. */
	templateResult;
	/** Resume position: the next `htmlParts`/`expressions` index to process. */
	cursor;
	constructor(templateResult) {
		this.templateResult = templateResult;
		this.cursor = 0;
	}
	storeCursor(index) {
		this.cursor = index;
	}
};
/**
* Streaming render engine.
*
* Walks the component tree in a single forward pass (explicit stack), batching
* consecutive static fragments into one write. The static structure
* (RenderTemplateResult HTML parts, arrays, primitives) never allocates a node
* object and never wraps HTML parts in `markHTMLString`, so static-heavy pages
* render with minimal overhead.
*
* Dynamic subtrees (components, render instances, promises, JSX) are rendered
* via `renderChild`. While their output stays synchronous, the engine streams
* it straight to `destination`. As soon as a dynamic node renders
* asynchronously, the engine switches to a buffered tail: every remaining
* dynamic node is started eagerly (so async work runs in parallel) and the
* buffers are flushed in order. This mirrors `RenderTemplateResult.render`, so
* async components render concurrently rather than serially.
*
* Head propagation is handled by the caller (`bufferHeadContent`) before this
* runs.
*/
var StreamingRenderState = class {
	pendingStaticOutput = "";
	isBuffering = false;
	bufferedStaticOutput = "";
	appendStatic(output) {
		if (!output) return;
		if (this.isBuffering) this.bufferedStaticOutput += output;
		else this.pendingStaticOutput += output;
	}
};
async function renderStreaming(root, result, destination) {
	const stack = [root];
	const openTagCache = /* @__PURE__ */ new Map();
	const closeTagCache = /* @__PURE__ */ new Map();
	const closeTagFor = (type) => {
		let tag = closeTagCache.get(type);
		if (tag === void 0) {
			tag = new HTMLString(`</${type}>`);
			closeTagCache.set(type, tag);
		}
		return tag;
	};
	const streamingState = new StreamingRenderState();
	let firstAsyncRender = null;
	const bufferedTail = [];
	const flushBufferedStaticOutput = () => {
		if (streamingState.bufferedStaticOutput) {
			bufferedTail.push(streamingState.bufferedStaticOutput);
			streamingState.bufferedStaticOutput = "";
		}
	};
	const renderDynamic = (node) => (d) => {
		if (isVNode(node)) return renderJSX(result, node).then((out) => renderChild(d, out));
		return renderChild(d, node);
	};
	const handleVNode = (vnode) => {
		const type = vnode.type;
		if (!type) throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!\nDid you forget to import the component or is it possible there is a typo?`);
		if (type === Fragment) {
			stack.push(vnode.props?.children);
			return;
		}
		if (isAstroComponentFactory(type)) {
			const props = {};
			const slots = {};
			for (const [key, value] of Object.entries(vnode.props ?? {})) if (key === "children" || value && typeof value === "object" && value["$$slot"]) slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
			else props[key] = value;
			const displayName = type.name || "Anonymous";
			if (containsServerDirective(props)) {
				const island = new ServerIslandComponent(result, props, slots, displayName);
				result._metadata.propagators.add(island);
				stack.push(island);
				return;
			}
			stack.push(createAstroComponentInstance(result, displayName, type, props, slots));
			return;
		}
		if (typeof type === "string" && type !== ClientOnlyPlaceholder$1) {
			const props = vnode.props;
			let hasAttrs = false;
			if (props) {
				for (const key in props) if (key !== "children") {
					hasAttrs = true;
					break;
				}
			}
			const children = props?.children;
			const isVoid = (children == null || children === "") && voidElementNames.test(type);
			if (!hasAttrs) {
				const key = isVoid ? `${type}/` : type;
				let openTag = openTagCache.get(key);
				if (openTag === void 0) {
					openTag = isVoid ? `<${type}/>` : `<${type}>`;
					openTagCache.set(key, openTag);
				}
				streamingState.appendStatic(openTag);
				if (!isVoid) stack.push(closeTagFor(type));
			} else {
				const attrs = spreadElementAttributes(props);
				if (isVoid) {
					streamingState.appendStatic(`<${type}${attrs}/>`);
					return;
				}
				streamingState.appendStatic(`<${type}${attrs}>`);
				stack.push(closeTagFor(type));
			}
			if (!isVoid && children != null && children !== "") {
				if (typeof children === "string" && type === "style") stack.push(markHTMLString(escapeStyleText(children)));
				else stack.push(children);
			}
			return;
		}
		if (typeof type === "function" && vnode.props?.["server:root"]) {
			stack.push(type(vnode.props ?? {}));
			return;
		}
		stack.push(renderJSX(result, vnode));
	};
	while (stack.length > 0) {
		const node = stack.pop();
		if (node == null || node === false) continue;
		if (node instanceof TemplateFrame) {
			const htmlParts = node.templateResult.htmlParts;
			const expressions = node.templateResult.expressions;
			let i = node.cursor;
			while (i < htmlParts.length) {
				if (htmlParts[i]) streamingState.appendStatic(htmlParts[i]);
				if (i >= expressions.length) break;
				const expression = expressions[i];
				i++;
				if (expression == null || expression === false) continue;
				const expressionType = typeof expression;
				if (expressionType === "string") {
					streamingState.appendStatic(escapeHTML(expression));
					continue;
				}
				if (expressionType === "number" || expressionType === "bigint" || expressionType === "boolean") {
					streamingState.appendStatic(String(expression));
					continue;
				}
				if (expression instanceof HTMLString || isHTMLString(expression)) {
					if (!(expression instanceof SlotString)) {
						streamingState.appendStatic(expression.toString());
						continue;
					}
				}
				node.storeCursor(i);
				stack.push(node);
				stack.push(isPromise(expression) ? node.templateResult.catchExpressionError(i - 1, expression) : expression);
				break;
			}
			continue;
		}
		const nodeType = typeof node;
		if (nodeType === "string") {
			streamingState.appendStatic(escapeHTML(node));
			continue;
		}
		if (nodeType === "number" || nodeType === "bigint" || nodeType === "boolean") {
			streamingState.appendStatic(String(node));
			continue;
		}
		if (node instanceof HTMLString || isHTMLString(node)) {
			if (!(node instanceof SlotString)) {
				streamingState.appendStatic(node.toString());
				continue;
			}
		}
		if (Array.isArray(node)) {
			for (let i = node.length - 1; i >= 0; i--) stack.push(node[i]);
			continue;
		}
		if (isRenderTemplateResult(node)) {
			stack.push(new TemplateFrame(node));
			continue;
		}
		if (isVNode(node)) {
			handleVNode(node);
			continue;
		}
		if (node instanceof SlotRenderInstance) {
			stack.push(node.evaluate());
			continue;
		}
		if (isAstroComponentInstance(node)) {
			const returnValue = node.init(result);
			if (!isPromise(returnValue)) {
				stack.push(isHeadAndContent(returnValue) ? returnValue.content : returnValue);
				continue;
			}
		}
		if (!streamingState.isBuffering) {
			if (streamingState.pendingStaticOutput) {
				destination.write(streamingState.pendingStaticOutput);
				streamingState.pendingStaticOutput = "";
			}
			const rendered = renderDynamic(node)(destination);
			if (isPromise(rendered)) {
				streamingState.isBuffering = true;
				firstAsyncRender = rendered;
			}
		} else {
			flushBufferedStaticOutput();
			bufferedTail.push(createBufferedRenderer(destination, renderDynamic(node)));
		}
	}
	if (!streamingState.isBuffering) {
		if (streamingState.pendingStaticOutput) destination.write(streamingState.pendingStaticOutput);
		return;
	}
	await firstAsyncRender;
	flushBufferedStaticOutput();
	for (const segment of bufferedTail) if (typeof segment === "string") destination.write(segment);
	else {
		const flushResult = segment.flush();
		if (isPromise(flushResult)) await flushResult;
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/astro/render.js
var DOCTYPE_EXP = /<!doctype html/i;
/**
* Renders a component tree to a string using the streaming engine.
*/
async function renderStreamToString(result, templateResult, isPage) {
	let str = "";
	let renderedFirstPageChunk = false;
	if (isPage) await bufferHeadContent(result);
	await renderStreaming(templateResult, result, { write(chunk) {
		if (isPage && !renderedFirstPageChunk) {
			renderedFirstPageChunk = true;
			if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
				const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
				str += doctype;
			}
		}
		if (chunk instanceof Response) return;
		str += chunkToString(result, chunk);
	} });
	return str;
}
/**
* Renders a component tree to a `ReadableStream` using the streaming engine.
*/
async function renderStreamToStream(result, templateResult, isPage, route) {
	let renderedFirstPageChunk = false;
	if (isPage) await bufferHeadContent(result);
	return new ReadableStream({
		start(controller) {
			const destination = { write(chunk) {
				if (isPage && !renderedFirstPageChunk) {
					renderedFirstPageChunk = true;
					if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
						const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
						controller.enqueue(encoder.encode(doctype));
					}
				}
				if (chunk instanceof Response) throw new AstroError({ ...ResponseSentError });
				const bytes = chunkToByteArray(result, chunk);
				controller.enqueue(bytes);
			} };
			(async () => {
				try {
					await renderStreaming(templateResult, result, destination);
					controller.close();
				} catch (e) {
					if (AstroError.is(e) && !e.loc) e.setLocation({ file: route?.component });
					setTimeout(() => controller.error(e), 0);
				}
			})();
		},
		cancel() {
			result.cancelled = true;
		}
	});
}
/**
* Renders a component tree to an `AsyncIterable` using the streaming engine.
*/
async function renderStreamToAsyncIterable(result, templateResult, isPage, _route) {
	let renderedFirstPageChunk = false;
	let error = null;
	let next = null;
	const buffer = [];
	let hasBytes = false;
	let lastIsString = false;
	let renderingComplete = false;
	if (isPage) await bufferHeadContent(result);
	const iterator = {
		async next() {
			if (result.cancelled) return {
				done: true,
				value: void 0
			};
			if (next !== null) await next.promise;
			else if (!renderingComplete && !buffer.length) {
				next = promiseWithResolvers();
				await next.promise;
			}
			if (!renderingComplete) next = promiseWithResolvers();
			if (error) throw error;
			let mergedArray;
			if (!hasBytes) {
				let text = "";
				for (let i = 0, len = buffer.length; i < len; i++) text += buffer[i];
				mergedArray = encoder.encode(text);
			} else {
				let length = 0;
				let stringToEncode = "";
				for (let i = 0, len = buffer.length; i < len; i++) {
					const bufferEntry = buffer[i];
					if (typeof bufferEntry === "string") {
						const nextIsString = i + 1 < len && typeof buffer[i + 1] === "string";
						stringToEncode += bufferEntry;
						if (!nextIsString) {
							const encoded = encoder.encode(stringToEncode);
							length += encoded.length;
							stringToEncode = "";
							buffer[i] = encoded;
						} else buffer[i] = "";
					} else length += bufferEntry.length;
				}
				mergedArray = new Uint8Array(length);
				let offset = 0;
				for (let i = 0, len = buffer.length; i < len; i++) {
					const item = buffer[i];
					if (item === "") continue;
					mergedArray.set(item, offset);
					offset += item.length;
				}
			}
			buffer.length = 0;
			hasBytes = false;
			lastIsString = false;
			return {
				done: mergedArray.length === 0 && renderingComplete,
				value: mergedArray
			};
		},
		async return() {
			result.cancelled = true;
			return {
				done: true,
				value: void 0
			};
		}
	};
	const destination = { write(chunk) {
		if (isPage && !renderedFirstPageChunk) {
			renderedFirstPageChunk = true;
			if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
				const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
				buffer.push(doctype);
				lastIsString = true;
			}
		}
		if (chunk instanceof Response) throw new AstroError(ResponseSentError);
		const bytes = chunkToByteArrayOrString(result, chunk);
		if (bytes.length > 0) {
			if (typeof bytes === "string") {
				if (lastIsString) buffer[buffer.length - 1] = buffer[buffer.length - 1] + bytes;
				else {
					buffer.push(bytes);
					lastIsString = true;
				}
			} else {
				buffer.push(bytes);
				hasBytes = true;
				lastIsString = false;
			}
			next?.resolve();
		} else if (buffer.length > 0) next?.resolve();
	} };
	toPromise(() => renderStreaming(templateResult, result, destination)).catch((err) => {
		error = err;
	}).finally(() => {
		renderingComplete = true;
		next?.resolve();
	});
	return { [Symbol.asyncIterator]() {
		return iterator;
	} };
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
	const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
	if (templateResult instanceof Response) return templateResult;
	return await renderStreamToString(result, templateResult, isPage);
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
	const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
	if (templateResult instanceof Response) return templateResult;
	return await renderStreamToStream(result, templateResult, isPage, route);
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
	const factoryResult = await componentFactory(result, props, children);
	if (factoryResult instanceof Response) return factoryResult;
	else if (isHeadAndContent(factoryResult)) {
		if (!isRenderTemplateResult(factoryResult.content)) throw new AstroError({
			...OnlyResponseCanBeReturned,
			message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
			location: { file: route?.component }
		});
		return factoryResult.content;
	} else if (!isRenderTemplateResult(factoryResult)) throw new AstroError({
		...OnlyResponseCanBeReturned,
		message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
		location: { file: route?.component }
	});
	return factoryResult;
}
async function bufferHeadContent(result) {
	await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
	const templateResult = await callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route);
	if (templateResult instanceof Response) return templateResult;
	return await renderStreamToAsyncIterable(result, templateResult, isPage, route);
}
function toPromise(fn) {
	try {
		const result = fn();
		return isPromise(result) ? result : Promise.resolve(result);
	} catch (err) {
		return Promise.reject(err);
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/dom.js
function componentIsHTMLElement(Component) {
	return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
	const name = getHTMLElementName(constructor);
	let attrHTML = "";
	for (const attr in props) {
		if (INVALID_ATTR_NAME_CHAR.test(attr)) continue;
		attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
	}
	return markHTMLString(`<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`);
}
function getHTMLElementName(constructor) {
	const definedName = customElements.getName(constructor);
	if (definedName) return definedName;
	return constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/component.js
var needsHeadRenderingSymbol = Symbol.for("astro.needsHeadRendering");
var rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
var clientOnlyValues = /* @__PURE__ */ new Set([
	"solid-js",
	"react",
	"preact",
	"vue",
	"svelte"
]);
function guessRenderers(componentUrl) {
	switch (componentUrl?.split(".").pop()) {
		case "svelte": return ["@astrojs/svelte"];
		case "vue": return ["@astrojs/vue"];
		case "jsx":
		case "tsx": return [
			"@astrojs/react",
			"@astrojs/preact",
			"@astrojs/solid-js",
			"@astrojs/vue (jsx)"
		];
		case void 0:
		default: return [
			"@astrojs/react",
			"@astrojs/preact",
			"@astrojs/solid-js",
			"@astrojs/vue",
			"@astrojs/svelte"
		];
	}
}
function isFragmentComponent(Component) {
	return Component === Fragment;
}
function isHTMLComponent(Component) {
	return Component && Component["astro:html"] === true;
}
var ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
var ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
	const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
	return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
	if (!Component && "client:only" in _props === false) throw new Error(`Unable to render ${displayName} because it is ${Component}!\nDid you forget to import the component or is it possible there is a typo?`);
	const { renderers, clientDirectives } = result;
	const metadata = {
		astroStaticSlot: true,
		displayName
	};
	const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(_props, clientDirectives);
	let html = "";
	let attrs = void 0;
	if (hydration) {
		metadata.hydrate = hydration.directive;
		metadata.hydrateArgs = hydration.value;
		metadata.componentExport = hydration.componentExport;
		metadata.componentUrl = hydration.componentUrl;
	}
	const probableRendererNames = guessRenderers(metadata.componentUrl);
	const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
	const { children, slotInstructions } = await renderSlots(result, slots);
	let renderer;
	if (metadata.hydrate !== "only") {
		let isTagged = false;
		try {
			isTagged = Component && Component[Renderer];
		} catch {}
		if (isTagged) {
			const rendererName = Component[Renderer];
			renderer = renderers.find(({ name }) => name === rendererName);
		}
		if (!renderer) {
			let error;
			for (const r of renderers) try {
				if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
					renderer = r;
					break;
				}
			} catch (e) {
				error ??= e;
			}
			if (!renderer && error) throw error;
		}
		if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
			const output = await renderHTMLElement(result, Component, _props, slots);
			return { render(destination) {
				destination.write(output);
			} };
		}
	} else {
		if (metadata.hydrateArgs) {
			const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
			if (clientOnlyValues.has(rendererName)) renderer = renderers.find(({ name }) => name === `@astrojs/${rendererName}` || name === rendererName);
		}
		if (!renderer && validRenderers.length === 1) renderer = validRenderers[0];
		if (!renderer) {
			const extname = metadata.componentUrl?.split(".").pop();
			renderer = renderers.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
		}
		if (!renderer && metadata.hydrateArgs) {
			const rendererName = metadata.hydrateArgs;
			if (typeof rendererName === "string") renderer = renderers.find(({ name }) => name === rendererName);
		}
	}
	let componentServerRenderEndTime;
	if (!renderer) {
		if (metadata.hydrate === "only") {
			const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
			if (clientOnlyValues.has(rendererName)) {
				const plural = validRenderers.length > 1;
				throw new AstroError({
					...NoMatchingRenderer,
					message: NoMatchingRenderer.message(metadata.displayName, metadata?.componentUrl?.split(".").pop(), plural, validRenderers.length),
					hint: NoMatchingRenderer.hint(formatList(probableRendererNames.map((r) => "`" + r + "`")))
				});
			} else throw new AstroError({
				...NoClientOnlyHint,
				message: NoClientOnlyHint.message(metadata.displayName),
				hint: NoClientOnlyHint.hint(probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|"))
			});
		} else if (typeof Component !== "string") {
			const matchingRenderers = validRenderers.filter((r) => probableRendererNames.includes(r.name));
			const plural = validRenderers.length > 1;
			if (matchingRenderers.length === 0) throw new AstroError({
				...NoMatchingRenderer,
				message: NoMatchingRenderer.message(metadata.displayName, metadata?.componentUrl?.split(".").pop(), plural, validRenderers.length),
				hint: NoMatchingRenderer.hint(formatList(probableRendererNames.map((r) => "`" + r + "`")))
			});
			else if (matchingRenderers.length === 1) {
				renderer = matchingRenderers[0];
				({html, attrs} = await renderer.ssr.renderToStaticMarkup.call({ result }, Component, propsWithoutTransitionAttributes, children, metadata));
			} else throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
		}
	} else if (metadata.hydrate === "only") html = await renderSlotToString(result, slots?.fallback);
	else {
		const componentRenderStartTime = performance.now();
		({html, attrs} = await renderer.ssr.renderToStaticMarkup.call({ result }, Component, propsWithoutTransitionAttributes, children, metadata));
		if (process.env.NODE_ENV === "development") componentServerRenderEndTime = performance.now() - componentRenderStartTime;
	}
	if (!html && typeof Component === "string") {
		const Tag = sanitizeElementName(Component);
		const childSlots = Object.values(children).join("");
		const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(props, true, Tag)}${markHTMLString(childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`)}`;
		html = "";
		await renderTemplateResult.render({ write(chunk) {
			if (chunk instanceof Response) return;
			html += chunkToString(result, chunk);
		} });
	}
	if (!hydration) return { render(destination) {
		if (slotInstructions) for (const instruction of slotInstructions) destination.write(instruction);
		if (isPage || renderer?.name === "astro:jsx") destination.write(html);
		else if (html && html.length > 0) {
			const output = renderer ? removeStaticAstroSlot(html, renderer.ssr?.supportsAstroStaticSlot) : html;
			destination.write(markHTMLString(output));
		}
	} };
	const astroId = shorthash(`<!--${metadata.componentExport.value}:${metadata.componentUrl}-->\n${html}\n${serializeProps(props, metadata)}`);
	const island = await generateHydrateScript({
		renderer,
		result,
		astroId,
		props,
		attrs
	}, metadata);
	if (componentServerRenderEndTime && process.env.NODE_ENV === "development") island.props["server-render-time"] = componentServerRenderEndTime;
	let unrenderedSlots = [];
	if (html) {
		if (Object.keys(children).length > 0) for (const key of Object.keys(children)) {
			let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
			let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
			if (!html.includes(expectedHTML)) unrenderedSlots.push(key);
		}
	} else unrenderedSlots = Object.keys(children);
	const template = unrenderedSlots.length > 0 ? unrenderedSlots.map((key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`).join("") : "";
	island.children = `${html ?? ""}${template}`;
	if (island.children) {
		island.props["await-children"] = "";
		island.children += `<!--astro:end-->`;
	}
	return { render(destination) {
		if (slotInstructions) for (const instruction of slotInstructions) destination.write(instruction);
		destination.write(createRenderInstruction({
			type: "directive",
			hydration
		}));
		if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) destination.write(createRenderInstruction({
			type: "renderer-hydration-script",
			rendererName: renderer.name,
			render: renderer.ssr.renderHydrationScript
		}));
		const renderedElement = renderElement$1("astro-island", island, false);
		destination.write(markHTMLString(renderedElement));
	} };
}
function sanitizeElementName(tag) {
	const unsafe = /[&<>'"\s]+/;
	if (!unsafe.test(tag)) return tag;
	return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
	const slot = slots?.default;
	const preRendered = slot?.(result);
	return { render(destination) {
		if (preRendered == null) return;
		return renderChild(destination, preRendered);
	} };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
	const { slotInstructions, children } = await renderSlots(result, slots);
	const html = Component({ slots: children });
	const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
	return { render(destination) {
		destination.write(markHTMLString(hydrationHtml + html));
	} };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
	if (containsServerDirective(props)) {
		const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
		result._metadata.propagators.add(serverIslandComponent);
		return serverIslandComponent;
	}
	return createAstroComponentInstance(result, displayName, Component, props, slots);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
	if (isAstroComponentFactory(Component)) return renderAstroComponent(result, displayName, Component, normalizeProps(props), slots);
	if (isPromise(Component)) return Component.catch(handleCancellation).then((x) => {
		return renderComponent(result, displayName, x, props, slots);
	});
	if (isFragmentComponent(Component)) return renderFragmentComponent(result, slots);
	props = normalizeProps(props);
	if (isHTMLComponent(Component)) return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
	return renderFrameworkComponent(result, displayName, Component, props, slots).catch(handleCancellation);
	function handleCancellation(e) {
		if (result.cancelled) return { render() {} };
		throw e;
	}
}
function normalizeProps(props) {
	if (props["class:list"] !== void 0) {
		const value = props["class:list"];
		delete props["class:list"];
		props["class"] = clsx(props["class"], value);
		if (props["class"] === "") delete props["class"];
	}
	return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
	let str = "";
	let renderedFirstPageChunk = false;
	let head = "";
	if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) head += chunkToString(result, maybeRenderHead());
	try {
		const destination = { write(chunk) {
			if (isPage && !result.partial && !renderedFirstPageChunk) {
				renderedFirstPageChunk = true;
				if (!/<!doctype html/i.test(String(chunk))) {
					const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
					str += doctype + head;
				}
			}
			if (chunk instanceof Response) return;
			str += chunkToString(result, chunk);
		} };
		const renderInstance = await renderComponent(result, displayName, Component, props, slots);
		if (containsServerDirective(props)) await bufferPropagatedHead(result, { awaitPendingSlots: false });
		await renderInstance.render(destination);
	} catch (e) {
		if (AstroError.is(e) && !e.loc) e.setLocation({ file: route?.component });
		throw e;
	}
	return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
	return !!pageComponent?.[needsHeadRenderingSymbol];
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/jsx.js
var ClientOnlyPlaceholder = "astro-client-only";
var hasTriedRenderComponentSymbol = Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
	switch (true) {
		case vnode instanceof HTMLString:
			if (vnode.toString().trim() === "") return "";
			return vnode;
		case typeof vnode === "string": return markHTMLString(escapeHTML(vnode));
		case typeof vnode === "function": return vnode;
		case !vnode && vnode !== 0: return "";
		case Array.isArray(vnode): {
			const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
			let instructions = null;
			let content = "";
			for (const item of renderedItems) if (item instanceof SlotString) {
				content += item;
				instructions = mergeSlotInstructions(instructions, item);
			} else content += item;
			if (instructions) return markHTMLString(new SlotString(content, instructions));
			return markHTMLString(content);
		}
	}
	return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
	if (isVNode(vnode)) {
		switch (true) {
			case !vnode.type: throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
			case vnode.type === Symbol.for("astro:fragment"): return renderJSX(result, vnode.props.children);
			case isAstroComponentFactory(vnode.type): {
				let props = {};
				let slots = {};
				for (const [key, value] of Object.entries(vnode.props ?? {})) if (key === "children" || value && typeof value === "object" && value["$$slot"]) slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
				else props[key] = value;
				return markHTMLString(await renderComponentToString(result, vnode.type.name, vnode.type, props, slots));
			}
			case !vnode.type && vnode.type !== 0: return "";
			case typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder && !vnode.type.includes("-"): return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
		}
		if (vnode.type) {
			if (typeof vnode.type === "function" && vnode.props["server:root"]) return await renderJSX(result, await vnode.type(vnode.props ?? {}));
			if (typeof vnode.type === "function") {
				if (vnode.props[hasTriedRenderComponentSymbol]) {
					delete vnode.props[hasTriedRenderComponentSymbol];
					const output = await vnode.type(vnode.props ?? {});
					if (output?.["astro:jsx"] || !output) return await renderJSXVNode(result, output);
					else return;
				} else vnode.props[hasTriedRenderComponentSymbol] = true;
			}
			const { children = null, ...props } = vnode.props ?? {};
			const _slots = { default: [] };
			const isCustomElement = typeof vnode.type === "string" && vnode.type.includes("-");
			function extractSlots(child) {
				if (Array.isArray(child)) return child.map((c) => extractSlots(c));
				if (!isVNode(child)) {
					_slots.default.push(child);
					return;
				}
				if ("slot" in child.props && !isCustomElement) {
					_slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
					delete child.props.slot;
					return;
				}
				_slots.default.push(child);
			}
			extractSlots(children);
			for (const [key, value] of Object.entries(props)) if (value?.["$$slot"]) {
				_slots[key] = value;
				delete props[key];
			}
			const slotPromises = [];
			const slots = {};
			for (const [key, value] of Object.entries(_slots)) slotPromises.push(renderJSX(result, value).then((output) => {
				if (output.toString().trim().length === 0) return;
				slots[key] = () => output;
			}));
			await Promise.all(slotPromises);
			let output;
			if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) output = await renderComponentToString(result, vnode.props["client:display-name"] ?? "", null, props, slots);
			else output = await renderComponentToString(result, typeof vnode.type === "function" ? vnode.type.name : vnode.type, vnode.type, props, slots);
			return markHTMLString(output);
		}
	}
	return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
	return markHTMLString(`<${tag}${spreadAttributes(props)}${markHTMLString((children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`)}`);
}
/**
* Pre-render the children with the given `tag` information
*/
function prerenderElementChildren(tag, children) {
	if (typeof children === "string" && tag === "style") return markHTMLString(escapeStyleText(children));
	return children;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/render/page.js
async function renderPage(result, componentFactory, props, children, streaming, route) {
	if (!isAstroComponentFactory(componentFactory)) {
		const nonAstroMeta = result.componentMetadata.get(componentFactory.moduleId);
		result._metadata.headInTree = nonAstroMeta?.containsHead ?? false;
		result._metadata.routeHasPropagation = isPropagatingHint(nonAstroMeta?.propagation ?? "none");
		const pageProps = {
			...props ?? {},
			"server:root": true
		};
		const str = await renderComponentToString(result, componentFactory.name, componentFactory, pageProps, {}, true, route);
		const bytes = encoder.encode(str);
		const headers = new Headers([["Content-Type", "text/html"], ["Content-Length", bytes.byteLength.toString()]]);
		if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) headers.set("content-security-policy", renderCspContent(result));
		return new Response(bytes, {
			headers,
			status: result.response.status
		});
	}
	const pageMeta = result.componentMetadata.get(componentFactory.moduleId);
	result._metadata.headInTree = pageMeta?.containsHead ?? false;
	result._metadata.routeHasPropagation = isPropagatingHint(pageMeta?.propagation ?? "none");
	let body;
	if (streaming) {
		if (isNode && !isDeno) {
			const nodeBody = await renderToAsyncIterable(result, componentFactory, props, children, true, route);
			if (isWorkerd && !(nodeBody instanceof Response)) body = ReadableStream.from(nodeBody);
			else body = nodeBody;
		} else body = await renderToReadableStream(result, componentFactory, props, children, true, route);
	} else body = await renderToString(result, componentFactory, props, children, true, route);
	if (body instanceof Response) return body;
	const init = result.response;
	const headers = new Headers(init.headers);
	if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") headers.set("content-security-policy", renderCspContent(result));
	if (!streaming && typeof body === "string") {
		body = encoder.encode(body);
		headers.set("Content-Length", body.byteLength.toString());
	}
	let status = init.status;
	let statusText = init.statusText;
	if (route?.route && isRoute404(route.route)) {
		status = 404;
		if (statusText === "OK") statusText = "Not Found";
	} else if (route?.route && isRoute500(route.route)) {
		status = 500;
		if (statusText === "OK") statusText = "Internal Server Error";
	}
	if (status) return new Response(body, {
		...init,
		headers,
		status,
		statusText
	});
	else return new Response(body, {
		...init,
		headers
	});
}
Object.freeze(createRenderInstruction({ type: "template-enter" }));
Object.freeze(createRenderInstruction({ type: "template-exit" }));
"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
"-0123456789_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/runtime/server/index.js
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
	let output = "";
	if (scopedClassName) {
		if (typeof values.class !== "undefined") values.class += ` ${scopedClassName}`;
		else if (typeof values["class:list"] !== "undefined") values["class:list"] = [values["class:list"], scopedClassName];
		else values.class = scopedClassName;
	}
	for (const key of Object.keys(values)) output += addAttribute(values[key], key, true, _name);
	return markHTMLString(output);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/request-body.js
/**
* Shared utility for reading request bodies with a size limit.
* Used by both Actions and Server Islands to enforce `security.actionBodySizeLimit`
* and `security.serverIslandBodySizeLimit` respectively.
*/
/**
* Read the request body as a `Uint8Array`, enforcing a maximum size limit.
* Checks the `Content-Length` header for early rejection, then streams the body
* and tracks bytes received.
*
* @throws {BodySizeLimitError} if the body exceeds the configured limit
*/
async function readBodyWithLimit(request, limit) {
	const contentLengthHeader = request.headers.get("content-length");
	if (contentLengthHeader) {
		const contentLength = Number.parseInt(contentLengthHeader, 10);
		if (Number.isFinite(contentLength) && contentLength > limit) throw new BodySizeLimitError(limit);
	}
	if (!request.body) return /* @__PURE__ */ new Uint8Array();
	const reader = request.body.getReader();
	const chunks = [];
	let received = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			received += value.byteLength;
			if (received > limit) throw new BodySizeLimitError(limit);
			chunks.push(value);
		}
	}
	const buffer = new Uint8Array(received);
	let offset = 0;
	for (const chunk of chunks) {
		buffer.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return buffer;
}
var BodySizeLimitError = class extends Error {
	limit;
	constructor(limit) {
		super(`Request body exceeds the configured limit of ${limit} bytes`);
		this.name = "BodySizeLimitError";
		this.limit = limit;
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/pattern.js
function getPattern(segments, base, addTrailingSlash) {
	const pathname = segments.map((segment) => {
		if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
		else return "\\/" + segment.map((part) => {
			if (part.spread) return "(.*?)";
			else if (part.dynamic) return "([^/]+?)";
			else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}).join("");
	}).join("");
	const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
	let initial = "\\/";
	if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
	return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
	if (addTrailingSlash === "always") return "\\/$";
	if (addTrailingSlash === "never") return "$";
	return "\\/?$";
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/server-islands/endpoint.js
var SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
var SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
	return new Response(null, {
		status: 400,
		statusText: "Bad request: " + reason
	});
}
var DEFAULT_BODY_SIZE_LIMIT = 1048576;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
	switch (request.method) {
		case "GET": {
			const params = new URL(request.url).searchParams;
			if (!params.has("s") || !params.has("e") || !params.has("p")) return badRequest("Missing required query parameters.");
			const encryptedSlots = params.get("s");
			return {
				encryptedComponentExport: params.get("e"),
				encryptedProps: params.get("p"),
				encryptedSlots
			};
		}
		case "POST": try {
			const body = await readBodyWithLimit(request, bodySizeLimit);
			const raw = new TextDecoder().decode(body);
			const data = JSON.parse(raw);
			if (Object.hasOwn(data, "slots") && typeof data.slots === "object") return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
			if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") return badRequest("Plaintext componentExport is not allowed. componentExport must be encrypted.");
			return data;
		} catch (e) {
			if (e instanceof BodySizeLimitError) return new Response(null, {
				status: 413,
				statusText: e.message
			});
			if (e instanceof SyntaxError) return badRequest("Request format is invalid.");
			throw e;
		}
		default: return new Response(null, { status: 405 });
	}
}
function createEndpoint(manifest) {
	const page = async (result) => {
		const params = result.params;
		if (!params.name) return new Response(null, {
			status: 400,
			statusText: "Bad request"
		});
		const componentId = params.name;
		const data = await getRequestData(result.request, manifest.serverIslandBodySizeLimit);
		if (data instanceof Response) return data;
		let imp = (await (await manifest.serverIslandMappings?.())?.serverIslandMap)?.get(componentId);
		if (!imp) return new Response(null, {
			status: 404,
			statusText: "Not found"
		});
		const key = await manifest.key;
		let componentExport;
		try {
			componentExport = await decryptString(key, data.encryptedComponentExport, `export:${componentId}`);
		} catch (_e) {
			return badRequest("Encrypted componentExport value is invalid.");
		}
		const encryptedProps = data.encryptedProps;
		let props = {};
		if (encryptedProps !== "") try {
			const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
			props = JSON.parse(propString);
		} catch (_e) {
			return badRequest("Encrypted props value is invalid.");
		}
		let decryptedSlots = {};
		const encryptedSlots = data.encryptedSlots;
		if (encryptedSlots !== "") try {
			const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
			decryptedSlots = JSON.parse(slotsString);
		} catch (_e) {
			return badRequest("Encrypted slots value is invalid.");
		}
		let Component = (await imp())[componentExport];
		const slots = {};
		for (const prop in decryptedSlots) slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
		result.response.headers.set("X-Robots-Tag", "noindex");
		if (isAstroComponentFactory(Component)) {
			const ServerIsland = Component;
			Component = function(...args) {
				return ServerIsland.apply(this, args);
			};
			Object.assign(Component, ServerIsland);
			Component.propagation = "self";
		}
		result._metadata.routeHasPropagation = true;
		const renderPropagatedHead = () => markHTMLString(result._metadata.extraHead.join(""));
		return renderTemplate`${renderPropagatedHead}${renderComponent(result, "Component", Component, props, slots)}`;
	};
	page.isAstroComponentFactory = true;
	return {
		default: page,
		partial: true
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/template/4xx.js
/** Display all errors */
function template({ title, pathname, statusCode = 404, tabTitle, body }) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/internal/astro-designed-error-pages.js
var DEFAULT_404_ROUTE = {
	component: DEFAULT_404_COMPONENT,
	params: [],
	pattern: /^\/404\/?$/,
	prerender: false,
	pathname: "/404",
	segments: [[{
		content: "404",
		dynamic: false,
		spread: false
	}]],
	type: "page",
	route: "/404",
	fallbackRoutes: [],
	isIndex: false,
	origin: "internal",
	distURL: []
};
async function default404Page({ pathname }) {
	return new Response(template({
		statusCode: 404,
		title: "Not found",
		tabTitle: "404: Not Found",
		pathname
	}), {
		status: 404,
		headers: { "Content-Type": "text/html" }
	});
}
default404Page.isAstroComponentFactory = true;
var default404Instance = { default: default404Page };
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/default.js
function createDefaultRoutes(manifest) {
	const root = new URL(manifest.rootDir);
	return [{
		instance: default404Instance,
		matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
		route: DEFAULT_404_ROUTE.route,
		component: DEFAULT_404_COMPONENT
	}, {
		instance: createEndpoint(manifest),
		matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
		route: SERVER_ISLAND_ROUTE,
		component: SERVER_ISLAND_COMPONENT
	}];
}
var defaultRoutesMemo = createManifestMemo(createDefaultRoutes);
/** The built-in internal routes for a manifest, derived once per manifest. */
function getDefaultRoutes(manifest) {
	return defaultRoutesMemo.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/logger/core.js
/** @lintignore */
var dateTimeFormat = new Intl.DateTimeFormat([], {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false
});
var levels = {
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	silent: 90
};
/** Full logging API */
function log(opts, level, label, message, newLine = true) {
	const logLevel = opts.level;
	const dest = opts.destination;
	const event = {
		label,
		level,
		message,
		newLine
	};
	if (!isLogLevelEnabled(logLevel, level)) return;
	dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
	return levels[configuredLogLevel] <= levels[level];
}
/** Emit a user-facing message. Useful for UI and other console messages. */
function info(opts, label, message, newLine = true) {
	return log(opts, "info", label, message, newLine);
}
/** Emit a warning message. Useful for high-priority messages that aren't necessarily errors. */
function warn(opts, label, message, newLine = true) {
	return log(opts, "warn", label, message, newLine);
}
/** Emit an error message, Useful when Astro can't recover from some error. */
function error(opts, label, message, newLine = true) {
	return log(opts, "error", label, message, newLine);
}
function debug(...args) {
	if ("_astroGlobalDebug" in globalThis) globalThis._astroGlobalDebug(...args);
}
/**
* Get the prefix for a log message.
* This includes the timestamp, log level, and label all properly formatted
* with colors. This is shared across different loggers, so it's defined here.
*/
function getEventPrefix({ level, label }) {
	const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
	const prefix = [];
	if (level === "error" || level === "warn") {
		prefix.push(colors.bold(timestamp));
		prefix.push(`[${level.toUpperCase()}]`);
	} else prefix.push(timestamp);
	if (label) prefix.push(`[${label}]`);
	if (level === "error") return colors.red(prefix.join(" "));
	if (level === "warn") return colors.yellow(prefix.join(" "));
	if (prefix.length === 1) return colors.dim(prefix[0]);
	return colors.dim(prefix[0]) + " " + colors.blue(prefix.splice(1).join(" "));
}
var AstroLogger = class {
	options;
	constructor(options) {
		this.options = options;
	}
	info(label, message, newLine = true) {
		info(this.options, label, message, newLine);
	}
	warn(label, message, newLine = true) {
		warn(this.options, label, message, newLine);
	}
	error(label, message, newLine = true) {
		error(this.options, label, message, newLine);
	}
	debug(label, ...messages) {
		debug(label, ...messages);
	}
	level() {
		return this.options.level;
	}
	forkIntegrationLogger(label) {
		return new AstroIntegrationLogger(this.options, label);
	}
	setDestination(destination) {
		this.options.destination = destination;
	}
	/**
	* It calls the `close` function of the provided destination, if it exists.
	*/
	close() {
		if (this.options.destination.close) this.options.destination.close();
	}
	/**
	* It calls the `flush` function of the provided destination, if it exists.
	*/
	flush() {
		if (this.options.destination.flush) this.options.destination.flush();
	}
};
var AstroIntegrationLogger = class AstroIntegrationLogger {
	options;
	label;
	constructor(logging, label) {
		this.options = logging;
		this.label = label;
	}
	/**
	* Creates a new logger instance with a new label, but the same log options.
	*/
	fork(label) {
		return new AstroIntegrationLogger(this.options, label);
	}
	info(message) {
		info(this.options, this.label, message);
	}
	warn(message) {
		warn(this.options, this.label, message);
	}
	error(message) {
		error(this.options, this.label, message);
	}
	debug(message) {
		debug(this.label, message);
	}
	/**
	* It calls the `flush` function of the provided destination, if it exists.
	*/
	flush() {
		if (this.options.destination.flush) this.options.destination.flush();
	}
	/**
	* It calls the `close` function of the provided destination, if it exists.
	*/
	close() {
		if (this.options.destination.close) this.options.destination.close();
	}
};
function astroToRuntimeLogger(logger) {
	return {
		info(msg) {
			logger.info(null, msg);
		},
		warn(msg) {
			logger.warn(null, msg);
		},
		error(msg) {
			logger.error(null, msg);
		}
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/logger/public.js
/**
* Returns `true` if `messageLevel` has a level equals or higher than `configuredLevel`. As a golden rule,
* the first argument should be level of the incoming message, and the second argument should be the
* configured level of the logger.
*
* @param messageLevel The level of the incoming message
* @param configuredLevel The level the logger is configured with
*
* @example
*
* ```js
* matchesLevel('error', 'info') // true, because 'error' has higher priority than 'info'
* matchesLevel('info', 'error') // false, because 'info' has lower priority than 'error'
* ```
*/
function matchesLevel(messageLevel, configuredLevel) {
	return levels[messageLevel] >= levels[configuredLevel];
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/logger/impls/console.js
function consoleLogDestination(config = {}) {
	const { level = "info" } = config;
	return { write(event) {
		let dest = console.error;
		if (levels[event.level] < levels["error"]) dest = console.info;
		if (!matchesLevel(event.level, level)) return;
		if (event.label === "SKIP_FORMAT") dest(event.message);
		else dest(getEventPrefix(event) + " " + event.message);
	} };
}
function createConsoleLogger({ level }) {
	return new AstroLogger({
		level,
		destination: consoleLogDestination()
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/logger/manifest-logger.js
var loggers = /* @__PURE__ */ new WeakMap();
/**
* One identity-stable logger per manifest. Created on first access as a
* console logger at `manifest.logLevel`.
*
* The instance is never replaced: `getResolvedLogger` swaps the
* destination in place via `AstroLogger.setDestination`, so every holder
* (state-captured logger, adapterLogger's retained options) writes to the
* new destination immediately.
*/
function getLogger(manifest) {
	let logger = loggers.get(manifest);
	if (!logger) {
		logger = createConsoleLogger({ level: manifest.logLevel });
		loggers.set(manifest, logger);
	}
	return logger;
}
var resolvedLogger = createAsyncManifestMemo(async (manifest) => {
	const logger = getLogger(manifest);
	try {
		const destination = (await manifest.logger?.())?.default;
		if (destination) logger.setDestination(destination);
	} catch (error) {
		logger.error("config", "Failed to load the configured logger destination; continuing with the console logger.\n" + (error instanceof Error ? error.stack ?? error.message : String(error)));
	}
	return logger;
});
/**
* The manifest's logger with the user-configured destination (the
* `manifest.logger` thunk) resolved and applied via `setDestination` on the
* identity-stable logger. Memoized single-flight; awaited at request entry.
*
* Never rejects: a destination that fails to load is reported through the
* unswapped (console) logger, which stays in place — a broken custom
* destination cannot fail a request. Because the derivation always resolves,
* the memo's delete-on-rejection retry path never triggers: the thunk runs
* at most once per manifest.
*/
function getResolvedLogger(manifest) {
	return resolvedLogger.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/rewrite-validate.js
/**
* Creates the check `findRouteToRewrite` runs on a dynamic route whose
* `distURL` is empty. Returns `true` when `getStaticPaths()` produces the
* pathname, `false` when it throws `NoMatchingStaticPathFound`, and rethrows
* any other error so a broken `getStaticPaths()` is not hidden as a 404.
*/
function createRewriteRouteValidator(manifest, getComponentByRoute) {
	return async (route, pathname) => {
		try {
			await getProps({
				mod: await getComponentByRoute(manifest, route),
				routeData: route,
				routeCache: getRouteCache(manifest),
				pathname,
				logger: getLogger(manifest),
				serverLike: manifest.serverLike,
				base: manifest.base,
				trailingSlash: manifest.trailingSlash
			});
			return true;
		} catch (e) {
			if (isAstroError(e) && e.title === NoMatchingStaticPathFound.title) return false;
			throw e;
		}
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/request.js
/**
* Used by astro internals to create a web standard request object.
*
* The user of this function may provide the data in a runtime-agnostic way.
*
* This is used by the static build to create fake requests for prerendering, and by the dev server to convert node requests into the standard request object.
*/
function createRequest({ url, headers, method = "GET", body = void 0, logger, isPrerendered = false, routePattern, init }) {
	const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(Object.entries(headers).filter(([name]) => !name.startsWith(":")));
	if (typeof url === "string") url = new URL(url);
	if (isPrerendered) url.search = "";
	const request = new Request(url, {
		method,
		headers: headersObj,
		body: isPrerendered ? null : body,
		...init
	});
	if (isPrerendered) {
		let _headers = request.headers;
		const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
		Object.defineProperty(request, "headers", {
			...headersDesc,
			get() {
				logger.warn(null, `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`);
				return _headers;
			},
			set(newHeaders) {
				_headers = newHeaders;
			}
		});
	}
	return request;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/util/pathname.js
/**
* Thrown when a URL path is encoded so many times that we give up decoding it
* (see {@link validateAndDecodePathname}). When this happens we reject the
* request with a `400` instead of guessing the path. If we let a half-decoded
* path through, your middleware might check one path while Astro routes to a
* different one.
*/
var MultiLevelEncodingError = class extends Error {
	constructor() {
		super("URL encoding depth exceeded the maximum number of decode iterations");
		this.name = "MultiLevelEncodingError";
	}
};
/**
* How many times {@link validateAndDecodePathname} will decode a path before
* giving up. A normal URL is encoded once, or at most twice — for example a
* `[` (`%5B`) can arrive as `%255B` when a link is built from a value that was
* already encoded. A path that is still encoded after this many tries is
* almost certainly an attack, so we reject it instead of decoding again.
*/
var MAX_DECODE_ITERATIONS = 10;
/**
* Decodes a URL path over and over until it stops changing, so a path that was
* encoded several times ends up as a single, final path. This stops someone
* from sneaking a path like `/admin` past middleware by encoding it multiple
* times — middleware always sees the real, decoded path.
*
* @param pathname - The path to decode
* @returns The final, fully decoded path
* @throws Error if the path has broken encoding that can't be decoded at all
*   (for example a lone `%` that isn't followed by two hex digits)
* @throws MultiLevelEncodingError if the path is still changing after
*   {@link MAX_DECODE_ITERATIONS} tries (it was encoded too many times).
*   Handing back a half-decoded path here would bring back the security hole
*   this function exists to close.
*/
function validateAndDecodePathname(pathname) {
	let decoded;
	try {
		decoded = decodeURI(pathname);
	} catch (_e) {
		throw new Error("Invalid URL encoding");
	}
	let iterations = 0;
	while (decoded !== pathname) {
		if (iterations >= MAX_DECODE_ITERATIONS) throw new MultiLevelEncodingError();
		pathname = decoded;
		try {
			decoded = decodeURI(pathname);
		} catch {
			break;
		}
		iterations++;
	}
	return decoded;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/rewrite.js
/**
* Shared logic to retrieve the rewritten route. It returns a tuple that represents:
* 1. The new `Request` object. It contains `base`
* 2.
*/
async function findRouteToRewrite({ payload, routes, request, trailingSlash, buildFormat, base, outDir, validate }) {
	let newUrl = void 0;
	if (payload instanceof URL) newUrl = payload;
	else if (payload instanceof Request) newUrl = new URL(payload.url);
	else newUrl = new URL(collapseDuplicateSlashes(payload), new URL(request.url).origin);
	const { pathname, resolvedUrlPathname } = normalizeRewritePathname(newUrl.pathname, base, trailingSlash, buildFormat);
	newUrl.pathname = resolvedUrlPathname;
	const decodedPathname = validateAndDecodePathname(pathname);
	if (isRoute404(decodedPathname)) {
		const errorRoute = routes.find((route) => isRoute404(route.route));
		if (errorRoute) return {
			routeData: errorRoute,
			newUrl,
			pathname: decodedPathname
		};
	}
	if (isRoute500(decodedPathname)) {
		const errorRoute = routes.find((route) => isRoute500(route.route));
		if (errorRoute) return {
			routeData: errorRoute,
			newUrl,
			pathname: decodedPathname
		};
	}
	let foundRoute;
	let firstValidationError = null;
	for (const route of routes) if (route.pattern.test(decodedPathname)) {
		if (route.params && route.params.length !== 0) {
			if (route.distURL && route.distURL.length !== 0) {
				if (!route.distURL.find((url) => url.href.replace(outDir.toString(), "").replace(/(?:\/index\.html|\.html)$/, "") === trimSlashes(pathname))) continue;
			} else {
				let ownsPathname;
				try {
					ownsPathname = await validate(route, decodedPathname);
				} catch (error) {
					firstValidationError ??= error;
					continue;
				}
				if (!ownsPathname) continue;
			}
		}
		foundRoute = route;
		break;
	}
	if (foundRoute) return {
		routeData: foundRoute,
		newUrl,
		pathname: decodedPathname
	};
	else if (firstValidationError) throw firstValidationError;
	else {
		const custom404 = routes.find((route) => isRoute404(route.route));
		if (custom404) return {
			routeData: custom404,
			newUrl,
			pathname
		};
		else return {
			routeData: DEFAULT_404_ROUTE,
			newUrl,
			pathname
		};
	}
}
/**
* Utility function that creates a new `Request` with a new URL from an old `Request`.
*
* @param newUrl The new `URL`
* @param oldRequest The old `Request`
* @param isPrerendered It needs to be the flag of the previous routeData, before the rewrite
* @param logger
* @param routePattern
*/
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
	const canHaveBody = oldRequest.method !== "GET" && oldRequest.method !== "HEAD";
	if (canHaveBody && oldRequest.bodyUsed) throw new AstroError(RewriteWithBodyUsed);
	return createRequest({
		url: newUrl,
		method: oldRequest.method,
		body: canHaveBody ? oldRequest.body : void 0,
		isPrerendered,
		logger,
		headers: isPrerendered ? {} : oldRequest.headers,
		routePattern,
		init: {
			referrer: oldRequest.referrer,
			referrerPolicy: oldRequest.referrerPolicy,
			mode: oldRequest.mode,
			credentials: oldRequest.credentials,
			cache: oldRequest.cache,
			redirect: oldRequest.redirect,
			integrity: oldRequest.integrity,
			signal: oldRequest.signal,
			keepalive: oldRequest.keepalive,
			duplex: "half"
		}
	});
}
function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
	if (!pathname) pathname = "/";
	const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
	let finalPathname;
	if (pathname === "/") finalPathname = "/";
	else if (shouldAppendSlash) finalPathname = appendForwardSlash(pathname);
	else finalPathname = removeTrailingForwardSlash(pathname);
	Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}
function getOriginPathname(request) {
	const origin = Reflect.get(request, originPathnameSymbol);
	if (origin) return decodeURIComponent(origin);
	return new URL(request.url).pathname;
}
/**
* Pure function that normalizes a rewrite target pathname by stripping the base,
* handling trailing slashes, removing `.html` suffixes, and computing the final
* full URL pathname (with base re-prepended).
*/
function normalizeRewritePathname(urlPathname, base, trailingSlash, buildFormat) {
	let pathname = collapseDuplicateSlashes(urlPathname);
	const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
	if (base !== "/") {
		if (urlPathname === base || urlPathname === removeTrailingForwardSlash(base)) pathname = "/";
		else if (urlPathname.startsWith(base)) {
			pathname = shouldAppendSlash ? appendForwardSlash(urlPathname) : removeTrailingForwardSlash(urlPathname);
			pathname = pathname.slice(base.length);
		}
	}
	if (!pathname.startsWith("/") && shouldAppendSlash && urlPathname.endsWith("/")) pathname = prependForwardSlash(pathname);
	if (buildFormat === "file") pathname = pathname.replace(/\.html$/, "");
	let resolvedUrlPathname;
	if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) resolvedUrlPathname = removeTrailingForwardSlash(base);
	else resolvedUrlPathname = joinPaths(...[base, pathname].filter(Boolean));
	return {
		pathname,
		resolvedUrlPathname
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/environment/production.js
async function getModuleForRoute(manifest, route) {
	for (const defaultRoute of getDefaultRoutes(manifest)) if (route.component === defaultRoute.component) return { page: () => Promise.resolve(defaultRoute.instance) };
	let routeToProcess = route;
	if (routeIsRedirect(route)) {
		if (route.redirectRoute) routeToProcess = route.redirectRoute;
		else return RedirectSinglePageBuiltModule;
	} else if (routeIsFallback(route)) routeToProcess = getFallbackRoute(route, manifest.routes);
	if (manifest.pageMap) {
		const importComponentInstance = manifest.pageMap.get(routeToProcess.component);
		if (!importComponentInstance) throw new Error(`Unexpectedly unable to find a component instance for route ${route.route}`);
		return await importComponentInstance();
	} else if (manifest.pageModule) return manifest.pageModule;
	throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
}
async function getComponentByRoute(manifest, routeData) {
	return (await getModuleForRoute(manifest, routeData)).page();
}
/**
* The production / bundled environment — the default when nothing is
* registered. A stateless module constant derived from the manifest alone.
*/
var productionEnvironment = {
	name: "production",
	runtimeMode: "production",
	defaultStreaming: () => true,
	async resolve(manifest, specifier) {
		if (!(specifier in manifest.entryModules)) throw new Error(`Unable to resolve [${specifier}]`);
		const bundlePath = manifest.entryModules[specifier];
		if (bundlePath.startsWith("data:") || bundlePath.length === 0) return bundlePath;
		else return createAssetLink(bundlePath, manifest.base, manifest.assetsPrefix);
	},
	async headElements(manifest, routeData) {
		const { assetsPrefix, base } = manifest;
		const routeInfo = manifest.routes.find((route) => route.routeData.route === routeData.route);
		const links = /* @__PURE__ */ new Set();
		const scripts = /* @__PURE__ */ new Set();
		const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
		for (const script of routeInfo?.scripts ?? []) if ("stage" in script) {
			if (script.stage === "head-inline") scripts.add({
				props: {},
				children: script.children
			});
		} else scripts.add(createModuleScriptElement(script, base, assetsPrefix));
		return {
			links,
			styles,
			scripts
		};
	},
	componentMetadata() {},
	getComponentByRoute,
	getModuleForRoute,
	async tryRewrite(manifest, payload, request) {
		const { newUrl, pathname, routeData } = await findRouteToRewrite({
			payload,
			request,
			routes: manifest.routes.map((r) => r.routeData),
			trailingSlash: manifest.trailingSlash,
			buildFormat: manifest.buildFormat,
			base: manifest.base,
			outDir: manifest.serverLike ? manifest.buildClientDir : manifest.outDir,
			validate: createRewriteRouteValidator(manifest, getComponentByRoute)
		});
		return {
			newUrl,
			pathname,
			componentInstance: await getComponentByRoute(manifest, routeData),
			routeData
		};
	},
	getRenderers(manifest) {
		return manifest.renderers;
	},
	errorStrategy: "default",
	rendersRedirectPage: () => false,
	injectCspMetaTagsOnErrorPages: false,
	logRequest() {}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/environment/index.js
var environments = /* @__PURE__ */ new WeakMap();
/**
* The environment for a manifest. Defaults to the production (bundled)
* implementation, which is derivable from the manifest alone — so a bare
* `new FetchState(request)` in a bundled worker needs no registration.
*/
function getEnvironment(manifest) {
	return environments.get(manifest) ?? productionEnvironment;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/generator.js
/**
* Sanitizes the parameters object by normalizing string values and replacing certain characters with their URL-encoded equivalents.
* @param {Record<string, string | number>} params - The parameters object to be sanitized.
* @returns {Record<string, string | number>} The sanitized parameters object.
*/
function sanitizeParams(params) {
	return Object.fromEntries(Object.entries(params).map(([key, value]) => {
		if (typeof value === "string") return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
		return [key, value];
	}));
}
function getParameter(part, params) {
	if (part.spread) return params[part.content.slice(3)] ?? "";
	if (part.dynamic) {
		if (params[part.content] === void 0) throw new TypeError(`Missing parameter: ${part.content}`);
		return params[part.content];
	}
	return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
	const segmentPath = segment.map((part) => getParameter(part, params)).join("");
	return segmentPath ? collapseDuplicateLeadingSlashes("/" + segmentPath) : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
	return (params) => {
		const sanitizedParams = sanitizeParams(params);
		let trailing = "";
		if (addTrailingSlash === "always" && segments.length) trailing = "/";
		return segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing || "/";
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/internal/validation.js
var VALID_PARAM_TYPES = ["string", "undefined"];
/** Throws error for invalid parameter in getStaticPaths() response */
function validateGetStaticPathsParameter([key, value], route) {
	if (!VALID_PARAM_TYPES.includes(typeof value)) throw new AstroError({
		...GetStaticPathsInvalidRouteParam,
		message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
		location: { file: route }
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/params.js
/**
* given a route's Params object, validate parameter
* values and create a stringified key for the route
* that can be used to match request routes
*/
function stringifyParams(params, route, trailingSlash) {
	if (route.type === "endpoint" && hasFileExtension(route.route)) trailingSlash = "never";
	const validatedParams = {};
	for (const [key, value] of Object.entries(params)) {
		validateGetStaticPathsParameter([key, value], route.component);
		if (value !== void 0) validatedParams[key] = trimSlashes(value);
	}
	return getRouteGenerator(route.segments, trailingSlash)(validatedParams);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/validation.js
/** Error for deprecated or malformed route components */
function validateDynamicRouteModule(mod, { ssr, route }) {
	if ((!ssr || route.prerender) && route.origin !== "internal" && !mod.getStaticPaths) throw new AstroError({
		...GetStaticPathsRequired,
		location: { file: route.component }
	});
}
/** Throw error and log warnings for malformed getStaticPaths() response */
function validateGetStaticPathsResult(result, route) {
	if (!Array.isArray(result)) throw new AstroError({
		...InvalidGetStaticPathsReturn,
		message: InvalidGetStaticPathsReturn.message(typeof result),
		location: { file: route.component }
	});
	result.forEach((pathObject) => {
		if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) throw new AstroError({
			...InvalidGetStaticPathsEntry,
			message: InvalidGetStaticPathsEntry.message(Array.isArray(pathObject) ? "array" : typeof pathObject)
		});
		if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) throw new AstroError({
			...GetStaticPathsExpectedParams,
			location: { file: route.component }
		});
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/render/paginate.js
function generatePaginateFunction(routeMatch, base, trailingSlash) {
	return function paginateUtility(data, args = {}) {
		const generate = getRouteGenerator(routeMatch.segments, trailingSlash);
		let { pageSize: _pageSize, params: _params, props: _props, format: _format } = args;
		const pageSize = _pageSize || 10;
		const paramName = "page";
		const additionalParams = _params || {};
		const additionalProps = _props || {};
		const formatUrl = _format || ((url) => url);
		let includesFirstPageNumber;
		if (routeMatch.params.includes(`...${paramName}`)) includesFirstPageNumber = false;
		else if (routeMatch.params.includes(`${paramName}`)) includesFirstPageNumber = true;
		else throw new AstroError({
			...PageNumberParamNotFound,
			message: PageNumberParamNotFound.message(paramName)
		});
		const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
		return [...Array(lastPage).keys()].map((num) => {
			const pageNum = num + 1;
			const start = pageSize === Number.POSITIVE_INFINITY ? 0 : (pageNum - 1) * pageSize;
			const end = Math.min(start + pageSize, data.length);
			const params = {
				...additionalParams,
				[paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
			};
			const current = formatUrl(addRouteBase(generate({ ...params }), base));
			const next = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: String(pageNum + 1)
			}), base));
			const prev = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
			}), base));
			const first = pageNum === 1 ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: includesFirstPageNumber ? "1" : void 0
			}), base));
			const last = pageNum === lastPage ? void 0 : formatUrl(addRouteBase(generate({
				...params,
				page: String(lastPage)
			}), base));
			return {
				params,
				props: {
					...additionalProps,
					page: {
						data: data.slice(start, end),
						start,
						end: end - 1,
						size: pageSize,
						total: data.length,
						currentPage: pageNum,
						lastPage,
						url: {
							current,
							next,
							prev,
							first,
							last
						}
					}
				}
			};
		});
	};
}
function addRouteBase(route, base) {
	let routeWithBase = joinPaths(base, route);
	if (routeWithBase === "") routeWithBase = "/";
	return routeWithBase;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/render/route-cache.js
async function callGetStaticPaths({ mod, route, routeCache, ssr, base, trailingSlash }) {
	const cached = routeCache.get(route);
	if (!mod) throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
	if (cached?.staticPaths && cached.mod === mod) return cached.staticPaths;
	validateDynamicRouteModule(mod, {
		ssr,
		route
	});
	if (ssr && !route.prerender || route.origin === "internal") {
		const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
		routeCache.set(route, {
			...cached,
			mod,
			staticPaths: entry
		});
		return entry;
	}
	const keyedStaticPaths = await computeStaticPaths(mod, route, base, trailingSlash);
	routeCache.set(route, {
		mod,
		staticPaths: keyedStaticPaths
	});
	return keyedStaticPaths;
}
/** Replaces a partial entry with the full result, sharing one `getStaticPaths()` call between concurrent misses. */
function completeStaticPaths({ route, routeCache, base, trailingSlash }) {
	const cached = routeCache.get(route);
	if (!cached?.partial) return void 0;
	cached.complete ??= computeStaticPaths(cached.mod, route, base, trailingSlash).then((staticPaths) => {
		routeCache.set(route, {
			mod: cached.mod,
			staticPaths
		});
		return staticPaths;
	});
	return cached.complete;
}
async function computeStaticPaths(mod, route, base, trailingSlash) {
	let staticPaths = [];
	if (!mod.getStaticPaths) throw new Error("Unexpected Error.");
	staticPaths = await mod.getStaticPaths({
		paginate: generatePaginateFunction(route, base, trailingSlash),
		routePattern: route.route
	});
	validateGetStaticPathsResult(staticPaths, route);
	const keyedStaticPaths = staticPaths;
	keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
	for (const sp of keyedStaticPaths) {
		const paramsKey = stringifyParams(sp.params, route, trailingSlash);
		keyedStaticPaths.keyed.set(paramsKey, sp);
	}
	return keyedStaticPaths;
}
/**
* Manage the route cache, responsible for caching data related to each route,
* including the result of calling getStaticPaths(). This gives route matching,
* params/props resolution, and prerender generation a shared static-path table.
*
* In dev, this cache intentionally survives requests. It is invalidated by route
* module identity changes after HMR or by explicit cache clears from content data
* changes, not by each request. Dev route matching can call getStaticPaths()
* before rendering, and render-time props resolution may ask for it again.
*/
var RouteCache = class {
	logger;
	cache = {};
	runtimeMode;
	constructor(logger, runtimeMode = "production") {
		this.logger = logger;
		this.runtimeMode = runtimeMode;
	}
	/** Clear the cache. */
	clearAll() {
		this.cache = {};
	}
	set(route, entry) {
		const key = this.key(route);
		const existing = this.cache[key];
		if (this.runtimeMode === "production" && existing?.staticPaths && !existing.partial) this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
		this.cache[key] = entry;
	}
	get(route) {
		return this.cache[this.key(route)];
	}
	key(route) {
		return `${route.route}_${route.component}`;
	}
};
var routeCaches = createManifestMemo((manifest) => new RouteCache(getLogger(manifest), getEnvironment(manifest).runtimeMode));
/**
* The `RouteCache` for a manifest. Cleared via
* `getRouteCache(manifest).clearAll()` on dev `astro:content-changed`.
*/
function getRouteCache(manifest) {
	return routeCaches.get(manifest);
}
function findPathItemByKey(staticPaths, params, route, logger, trailingSlash) {
	const paramsKey = stringifyParams(params, route, trailingSlash);
	const matchedStaticPath = staticPaths.keyed.get(paramsKey);
	if (matchedStaticPath) return matchedStaticPath;
	logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/render/params-and-props.js
async function getProps(opts) {
	const { logger, mod, routeData: route, routeCache, pathname, serverLike, base, trailingSlash } = opts;
	if (!route || route.pathname) return {};
	if (routeIsRedirect(route) || routeIsFallback(route) || route.component === "astro-default-404.astro") return {};
	const getStaticPathsOptions = {
		mod,
		route,
		routeCache,
		ssr: serverLike,
		base,
		trailingSlash
	};
	const staticPaths = await callGetStaticPaths(getStaticPathsOptions);
	const params = getParams(route, pathname);
	let matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger, trailingSlash);
	if (!matchedStaticPath) {
		const allStaticPaths = await completeStaticPaths(getStaticPathsOptions);
		if (allStaticPaths) matchedStaticPath = findPathItemByKey(allStaticPaths, params, route, logger, trailingSlash);
	}
	if (!matchedStaticPath && route.origin !== "internal" && (serverLike ? route.prerender : true)) throw new AstroError({
		...NoMatchingStaticPathFound,
		message: NoMatchingStaticPathFound.message(pathname),
		hint: NoMatchingStaticPathFound.hint([route.component])
	});
	if (mod) validatePrerenderEndpointCollision(route, mod, params);
	return matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
}
/**
* When given a route with the pattern `/[x]/[y]/[z]/svelte`, and a pathname `/a/b/c/svelte`,
* returns the params object: { x: "a", y: "b", z: "c" }.
*/
function getParams(route, pathname) {
	if (!route.params.length) return {};
	const hasHtmlSuffix = pathname.endsWith(".html") && !routeHasHtmlExtension(route);
	const path = hasHtmlSuffix && route.type === "page" ? pathname.slice(0, -5) : pathname;
	const allPatterns = [route, ...route.fallbackRoutes].map((r) => r.pattern);
	let paramsMatch = allPatterns.map((pattern) => pattern.exec(path)).find((x) => x);
	if (!paramsMatch && hasHtmlSuffix && route.type !== "page") {
		const strippedPath = pathname.endsWith("/index.html") ? pathname.slice(0, -11) || "/" : pathname.slice(0, -5);
		paramsMatch = allPatterns.map((pattern) => pattern.exec(strippedPath)).find((x) => x);
	}
	if (!paramsMatch) return {};
	const params = {};
	route.params.forEach((key, i) => {
		if (key.startsWith("...")) params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
		else params[key] = paramsMatch[i + 1];
	});
	return params;
}
/**
* If we have an endpoint at `src/pages/api/[slug].ts` that's prerendered, and the `slug`
* is `undefined`, throw an error as we can't generate the `/api` file and `/api` directory
* at the same time. Using something like `[slug].json.ts` instead will work.
*/
function validatePrerenderEndpointCollision(route, mod, params) {
	if (route.type === "endpoint" && mod.getStaticPaths) {
		const lastSegment = route.segments[route.segments.length - 1];
		const paramValues = Object.values(params);
		const lastParam = paramValues[paramValues.length - 1];
		if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) throw new AstroError({
			...PrerenderDynamicEndpointPathCollide,
			message: PrerenderDynamicEndpointPathCollide.message(route.route),
			hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
			location: { file: route.component }
		});
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/render/slots.js
function getFunctionExpression(slot) {
	if (!slot) return;
	const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false || isRenderTemplateResult(e));
	if (expressions?.length !== 1) return;
	const expression = expressions[0];
	if (isRenderTemplateResult(expression)) return getFunctionExpression(expression);
	return expression;
}
var Slots = class {
	#result;
	#slots;
	#logger;
	constructor(result, slots, logger) {
		this.#result = result;
		this.#slots = slots;
		this.#logger = logger;
		if (slots) for (const key of Object.keys(slots)) {
			if (this[key] !== void 0) throw new AstroError({
				...ReservedSlotName,
				message: ReservedSlotName.message(key)
			});
			Object.defineProperty(this, key, {
				get() {
					return true;
				},
				enumerable: true
			});
		}
	}
	has(name) {
		if (!this.#slots) return false;
		return Boolean(this.#slots[name]);
	}
	async render(name, args = []) {
		if (!this.#slots || !this.has(name)) return;
		const result = this.#result;
		if (!Array.isArray(args)) this.#logger.warn(null, `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
		else if (args.length > 0) {
			const slotValue = this.#slots[name];
			const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
			const expression = getFunctionExpression(component);
			if (expression) {
				const slot = async () => typeof expression === "function" ? expression(...args) : expression;
				return await renderSlotToString(result, slot).then((res) => {
					return res;
				});
			}
			if (typeof component === "function") return await renderJSX(result, component(...args)).then((res) => res != null ? String(res) : res);
		}
		return chunkToString(result, await renderSlotToString(result, this.#slots[name]));
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/fallback.js
/**
* Compute fallback route for failed responses.
* Pure function - no APIContext, no Response objects, no URL objects.
*
* This function determines whether a failed request should be redirected or rewritten
* to a fallback locale based on the i18n configuration.
*/
function computeFallbackRoute(options) {
	const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy } = options;
	if (responseStatus !== 404) return { type: "none" };
	if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
	const segments = pathname.split("/");
	const urlLocale = segments.find((segment) => {
		for (const locale of locales) if (typeof locale === "string") {
			if (locale === segment) return true;
		} else if (locale.path === segment) return true;
		return false;
	});
	if (!urlLocale) return { type: "none" };
	if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
	const fallbackLocale = fallback[urlLocale];
	const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
	const localeIndex = segments.indexOf(urlLocale);
	let newPathname;
	if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
		segments.splice(localeIndex, 1);
		newPathname = segments.join("/") || "/";
	} else {
		segments[localeIndex] = pathFallbackLocale;
		newPathname = segments.join("/");
	}
	return {
		type: fallbackType,
		pathname: newPathname
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/router.js
/**
* Router for i18n routing strategy decisions.
* Determines whether to continue, redirect, or return 404 based on pathname and locale.
*
* This is a pure class that returns decision objects (not HTTP Responses).
* The middleware layer is responsible for converting decisions to HTTP responses.
*/
var I18nRouter = class {
	#strategy;
	#defaultLocale;
	#locales;
	#base;
	#domains;
	constructor(options) {
		this.#strategy = options.strategy;
		this.#defaultLocale = options.defaultLocale;
		this.#locales = options.locales;
		this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
		this.#domains = options.domains;
	}
	/**
	* Evaluate routing strategy for a pathname.
	* Returns decision object (not HTTP Response).
	*/
	match(pathname, context) {
		if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
		switch (this.#strategy) {
			case "manual": return { type: "continue" };
			case "pathname-prefix-always": return this.matchPrefixAlways(pathname, context);
			case "domains-prefix-always":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlways(pathname, context);
			case "pathname-prefix-other-locales": return this.matchPrefixOtherLocales(pathname, context);
			case "domains-prefix-other-locales":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixOtherLocales(pathname, context);
			case "pathname-prefix-always-no-redirect": return this.matchPrefixAlwaysNoRedirect(pathname, context);
			case "domains-prefix-always-no-redirect":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlwaysNoRedirect(pathname, context);
			default: return { type: "continue" };
		}
	}
	/**
	* Check if i18n processing should be skipped for this request
	*/
	shouldSkipProcessing(pathname, context) {
		for (const page of STATUS_CODE_PAGES) if (pathname.includes(page)) return true;
		if (pathname.includes("/_server-islands/")) return true;
		if (context.isReroute) return true;
		if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
		return false;
	}
	/**
	* Strategy: pathname-prefix-always
	* All locales must have a prefix, including the default locale.
	*/
	matchPrefixAlways(pathname, context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return {
			type: "redirect",
			location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
		};
		if (!context.allowUnprefixedPath && !pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-other-locales
	* Default locale has no prefix, other locales must have a prefix.
	*/
	matchPrefixOtherLocales(pathname, _context) {
		let pathnameContainsDefaultLocale = false;
		for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
			pathnameContainsDefaultLocale = true;
			break;
		}
		if (pathnameContainsDefaultLocale) return {
			type: "notFound",
			location: pathname.replace(`/${this.#defaultLocale}`, "")
		};
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-always-no-redirect
	* Like prefix-always but allows root to serve instead of redirecting
	*/
	matchPrefixAlwaysNoRedirect(pathname, context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
		if (!context.allowUnprefixedPath && !pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Check if the current locale doesn't belong to the configured domain.
	* Used for domain-based routing strategies.
	*/
	localeHasntDomain(currentLocale, currentDomain) {
		if (!this.#domains || !currentDomain) return false;
		if (!currentLocale) return false;
		const localesForDomain = this.#domains[currentDomain];
		if (!localesForDomain) return true;
		return !localesForDomain.includes(currentLocale);
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/i18n/handler.js
/**
* Pure compile from explicit values — used by `astro:i18n`'s manual-mode
* middleware wrapper (`src/i18n/middleware.ts`), which receives the values as
* arguments rather than reading a manifest.
*/
function compileI18n(i18n, base, trailingSlash, format) {
	return {
		config: i18n,
		base,
		trailingSlash,
		format,
		router: new I18nRouter({
			strategy: i18n.strategy,
			defaultLocale: i18n.defaultLocale,
			locales: i18n.locales,
			base,
			domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
				const locale = i18n.domainLookupTable[domain];
				if (!acc[domain]) acc[domain] = [];
				acc[domain].push(locale);
				return acc;
			}, {}) : void 0
		})
	};
}
var i18nMemo = createManifestMemo((manifest) => {
	const config = manifest.i18n;
	return config && config.strategy !== "manual" ? compileI18n(config, manifest.base, manifest.trailingSlash, manifest.buildFormat) : null;
});
/**
* The compiled i18n post-processor for a manifest, or `null` when i18n is
* unset or the routing strategy is `manual`.
*/
function getI18n(manifest) {
	return i18nMemo.get(manifest);
}
/**
* Post-processes a rendered `Response` against the compiled i18n
* configuration, as an explicit step in `handleRequest` after the middleware
* chain returns. The manual-strategy public API (`astro:i18n.middleware(...)`)
* wraps this in a middleware-shaped closure.
*/
async function finalizeI18n(compiled, state, response) {
	markFeatureUsed(state.manifest, FetchFeatures.i18n);
	const i18n = compiled.config;
	if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
	if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
	const url = state.url;
	const currentLocale = state.computeCurrentLocale();
	const routeData = state.routeData;
	const isPrerendered = routeData.prerender;
	const routerContext = {
		currentLocale,
		currentDomain: url.hostname,
		routeType: state.responseRouteType,
		isReroute: false,
		allowUnprefixedPath: routeData.origin === "external" && !routeData.segments?.[0]?.some((part) => part.dynamic)
	};
	const routeDecision = compiled.router.match(url.pathname, routerContext);
	switch (routeDecision.type) {
		case "redirect": {
			let location = routeDecision.location;
			if (shouldAppendForwardSlash(compiled.trailingSlash, compiled.format)) location = appendForwardSlash(location);
			return new Response(null, {
				status: routeDecision.status ?? 302,
				headers: { Location: location }
			});
		}
		case "notFound": {
			if (isPrerendered) {
				const prerenderedRes = new Response(response.body, {
					status: 404,
					headers: response.headers
				});
				state.skipErrorReroute = true;
				if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
				return prerenderedRes;
			}
			const headers = new Headers();
			if (routeDecision.location) headers.set("Location", routeDecision.location);
			return new Response(null, {
				status: 404,
				headers
			});
		}
	}
	if (i18n.fallback && i18n.fallbackType) {
		const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
		const fallbackDecision = computeFallbackRoute({
			pathname: url.pathname,
			responseStatus: effectiveStatus,
			currentLocale,
			fallback: i18n.fallback,
			fallbackType: i18n.fallbackType,
			locales: i18n.locales,
			defaultLocale: i18n.defaultLocale,
			strategy: i18n.strategy,
			base: compiled.base
		});
		switch (fallbackDecision.type) {
			case "redirect": return new Response(null, {
				status: 302,
				headers: { Location: fallbackDecision.pathname + url.search }
			});
			case "rewrite": try {
				return await state.rewrite(fallbackDecision.pathname + url.search);
			} catch {
				break;
			}
		}
	}
	return response;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/index.js
/**
* Given a locale (code), it returns its corresponding path
* @param locale
* @param locales
*/
function getPathByLocale(locale, locales) {
	for (const loopLocale of locales) if (typeof loopLocale === "string") {
		if (loopLocale === locale) return loopLocale;
	} else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
	throw new AstroError(i18nNoLocaleFoundInPath);
}
/**
* Returns an array of only locales, by picking the `code`
* @param locales
*/
function getAllCodes(locales) {
	const result = [];
	for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
	else result.push(...loopLocale.codes);
	return result;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/i18n/utils.js
/**
* Parses the value of the `Accept-Language` header:
*
* More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
*
* Complex example: `fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`
*
*/
function parseLocale(header) {
	if (header === "*") return [{
		locale: header,
		qualityValue: void 0
	}];
	const result = [];
	const localeValues = header.split(",").map((str) => str.trim());
	for (const localeValue of localeValues) {
		const split = localeValue.split(";").map((str) => str.trim());
		const localeName = split[0];
		const qualityValue = split[1];
		if (!split) continue;
		if (qualityValue && qualityValue.startsWith("q=")) {
			const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
			if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
				locale: localeName,
				qualityValue: void 0
			});
			else result.push({
				locale: localeName,
				qualityValue: qualityValueAsFloat
			});
		} else result.push({
			locale: localeName,
			qualityValue: void 0
		});
	}
	return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
	const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
	return browserLocaleList.filter((browserLocale) => {
		if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
		return true;
	}).sort((a, b) => {
		const qa = a.locale === "*" ? a.qualityValue ?? 0 : a.qualityValue ?? 1;
		return (b.locale === "*" ? b.qualityValue ?? 0 : b.qualityValue ?? 1) - qa;
	});
}
/**
* Set the current locale by parsing the value passed from the `Accept-Header`.
*
* If multiple locales are present in the header, they are sorted by their quality value and the highest is selected as current locale.
*
*/
function computePreferredLocale(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = void 0;
	if (acceptHeader) {
		const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
		if (firstResult && firstResult.locale !== "*") {
			outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
				if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
					result = currentLocale;
					break;
				}
			} else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
				result = currentCode;
				break outer;
			}
		}
	}
	return result;
}
function computePreferredLocaleList(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = [];
	if (acceptHeader) {
		const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
		if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
		else if (browserLocaleList.length > 0) {
			for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
				if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
			} else for (const code of loopLocale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(browserLocale.locale)) result.push(code);
		}
	}
	return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
	for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
		if (!segment.includes(locale)) continue;
		if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
	} else if (locale.path === segment) return locale.codes.at(0);
	else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
	for (const locale of locales) if (typeof locale === "string") {
		if (locale === defaultLocale) return locale;
	} else if (locale.path === defaultLocale) return locale.codes.at(0);
}
/**
* Check if any of the route's resolved param values match a configured locale.
* This handles dynamic routes like `[locale]` or `[...path]` where the locale
* isn't in a static segment of the route pathname.
*/
function computeCurrentLocaleFromParams(params, locales) {
	const byNormalizedCode = /* @__PURE__ */ new Map();
	const byPath = /* @__PURE__ */ new Map();
	for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
	else {
		byPath.set(locale.path, locale.codes[0]);
		for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
	}
	for (const value of Object.values(params)) {
		if (!value) continue;
		const pathMatch = byPath.get(value);
		if (pathMatch) return pathMatch;
		const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
		if (codeMatch) return codeMatch;
	}
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/app/prepare-response.js
/**
* Appends cookies written via `Astro.cookie.set()` to the `Set-Cookie` header
* and marks the response as sent.
*
* This is a pure function with no dependencies on the app; it is shared by
* `handleRequest` and the various error handlers.
*/
function prepareResponse(response, { addCookieHeader }) {
	if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
	Reflect.set(response, responseSentSymbol$1, true);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/pages/handler.js
var EMPTY_SLOTS = Object.freeze({});
/**
* Handles dispatch of a matched route (endpoint / redirect / page / fallback)
* at the bottom of the middleware chain. This is a pure dispatch layer — it
* renders whatever route the `FetchState` currently points to without any
* rewrite logic. Rewrites are handled upstream: `executeRewrite()` for
* `Astro.rewrite()` and `handleMiddleware` for `next(payload)`.
*
* `handlePages` is the `next` callback that `handleMiddleware` invokes at
* the end of the middleware chain. Error handlers and the container also
* use it directly for the same dispatch behavior.
*/
async function handlePages(state, ctx) {
	const { logger, streaming } = state;
	state.resetResponseMetadata();
	let response;
	const componentInstance = await state.loadComponentInstance();
	switch (state.routeData.type) {
		case "endpoint":
			response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
			break;
		case "page": {
			const props = await state.getProps();
			const actionApiContext = state.getActionAPIContext();
			const result = await state.createResult(componentInstance, actionApiContext);
			try {
				response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
			} catch (e) {
				result.cancelled = true;
				throw e;
			}
			state.responseRouteType = "page";
			if (isRoute404(state.routeData.route) || isRoute500(state.routeData.route)) state.skipErrorReroute = true;
			break;
		}
		case "redirect": return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		case "fallback":
			state.responseRouteType = "fallback";
			return new Response(null, { status: 500 });
	}
	const responseCookies = getCookiesFromResponse(response);
	if (responseCookies) state.cookies.merge(responseCookies);
	state.response = response;
	return response;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/match.js
/** Find matching route from pathname */
function matchRoute$1(pathname, manifest) {
	if (isRoute404(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
		if (errorRoute) return errorRoute;
	}
	if (isRoute500(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
		if (errorRoute) return errorRoute;
	}
	return manifest.routes.find((route) => {
		return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
	});
}
/**
* Determines if the given route matches a 404 or 500 error page.
*
* @param {RouteData} route - The route data to check.
* @returns {boolean} `true` if the route matches a 404 or 500 error page; otherwise, `false`.
*/
function isRoute404or500(route) {
	return isRoute404(route.route) || isRoute500(route.route);
}
/**
* Determines if a given route is associated with the server island component.
*
* @param {RouteData} route - The route data object to evaluate.
* @return {boolean} Returns true if the route's component is the server island component; otherwise, false.
*/
function isRouteServerIsland(route) {
	return route.component === SERVER_ISLAND_COMPONENT;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/astro-designed-error-pages.js
function ensure404Route(manifest) {
	if (!manifest.routes.some((route) => isRoute404(route.route))) manifest.routes.push(DEFAULT_404_ROUTE);
	return manifest;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/priority.js
/**
* Comparator for sorting routes in resolution order.
*
* The routes are sorted in by the following rules in order, following the first rule that
* applies:
* - More specific routes are sorted before less specific routes. Here, "specific" means
*   the number of segments in the route, so a parent route is always sorted after its children.
*   For example, `/foo/bar` is sorted before `/foo`.
*   Index routes, originating from a file named `index.astro`, are considered to have one more
*   segment than the URL they represent.
* - Static routes are sorted before dynamic routes.
*   For example, `/foo/bar` is sorted before `/foo/[bar]`.
* - Dynamic routes with single parameters are sorted before dynamic routes with rest parameters.
*   For example, `/foo/[bar]` is sorted before `/foo/[...bar]`.
* - Prerendered routes are sorted before non-prerendered routes.
* - Endpoints are sorted before pages.
*   For example, a file `/foo.ts` is sorted before `/bar.astro`.
* - If both routes are equal regarding all previous conditions, they are sorted alphabetically.
*   For example, `/bar` is sorted before `/foo`.
*   The definition of "alphabetically" is dependent on the default locale of the running system.
*/
function routeComparator(a, b) {
	const commonLength = Math.min(a.segments.length, b.segments.length);
	for (let index = 0; index < commonLength; index++) {
		const aSegment = a.segments[index];
		const bSegment = b.segments[index];
		const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
		const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
		if (aIsStatic && bIsStatic) {
			const aContent = aSegment.map((part) => part.content).join("");
			const bContent = bSegment.map((part) => part.content).join("");
			if (aContent !== bContent) return aContent.localeCompare(bContent);
		}
		if (aIsStatic !== bIsStatic) return aIsStatic ? -1 : 1;
		const aAllDynamic = aSegment.every((part) => part.dynamic);
		if (aAllDynamic !== bSegment.every((part) => part.dynamic)) return aAllDynamic ? 1 : -1;
		const aHasSpread = aSegment.some((part) => part.spread);
		if (aHasSpread !== bSegment.some((part) => part.spread)) return aHasSpread ? 1 : -1;
	}
	const aLength = a.segments.length;
	const bLength = b.segments.length;
	if (aLength !== bLength) {
		const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
		const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
		if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
			if (aLength > bLength && aEndsInRest) return 1;
			if (bLength > aLength && bEndsInRest) return -1;
		}
		return aLength > bLength ? -1 : 1;
	}
	if (a.type === "endpoint" !== (b.type === "endpoint")) return a.type === "endpoint" ? -1 : 1;
	return a.route.localeCompare(b.route);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/router.js
/**
* Matches request pathnames against a route list with base and trailing slash rules.
*/
var Router = class {
	#routes;
	#base;
	#baseWithoutTrailingSlash;
	#buildFormat;
	#trailingSlash;
	constructor(routes, options) {
		this.#routes = [...routes].sort(routeComparator);
		this.#base = normalizeBase(options.base);
		this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
		this.#buildFormat = options.buildFormat;
		this.#trailingSlash = options.trailingSlash;
	}
	/**
	* Match an input pathname against the route list.
	* If allowWithoutBase is true, a non-base-prefixed path is still considered.
	*/
	match(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return {
			type: "redirect",
			location: normalized.redirect,
			status: 301
		};
		if (this.#base !== "/") {
			const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
			if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) return {
				type: "redirect",
				location: baseWithSlash,
				status: 301
			};
			if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) return {
				type: "redirect",
				location: this.#baseWithoutTrailingSlash,
				status: 301
			};
		}
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult) {
			if (!allowWithoutBase) return {
				type: "none",
				reason: "outside-base"
			};
		}
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		const route = this.#routes.find((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
		if (!route) return {
			type: "none",
			reason: "no-match"
		};
		return {
			type: "match",
			route,
			params: getParams(route, pathname),
			pathname
		};
	}
	/**
	* Returns all routes that match the given pathname, in priority order.
	* Used when the first match (e.g. a prerendered route) cannot serve
	* the request and subsequent matches need to be tried.
	*/
	matchAll(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return [];
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult && !allowWithoutBase) return [];
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		return this.#routes.filter((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
	}
};
/**
* Normalize a base path to a leading-slash form.
*/
function normalizeBase(base) {
	if (!base) return "/";
	if (base === "/") return base;
	return prependForwardSlash(base);
}
/**
* Provide a redirect target for pathnames that need correction.
* - Ensures a leading slash.
* - Collapses multiple leading slashes into a single slash redirect.
*/
function getRedirectForPathname(pathname) {
	let value = prependForwardSlash(pathname);
	if (value.startsWith("//")) return {
		pathname: value,
		redirect: `/${value.replace(/^\/+/, "")}`
	};
	return { pathname: value };
}
/**
* Strip the configured base from the pathname and account for trailing slash policies.
* Returns null if the pathname is outside the base or should be redirected elsewhere.
*/
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
	if (base === "/") return pathname;
	const baseWithSlash = `${baseWithoutTrailingSlash}/`;
	if (pathname === baseWithoutTrailingSlash || pathname === base) return trailingSlash === "always" ? null : "/";
	if (pathname === baseWithSlash) return trailingSlash === "never" ? null : "/";
	if (pathname.startsWith(baseWithSlash)) return pathname.slice(baseWithoutTrailingSlash.length);
	return null;
}
/**
* Normalize file-format pathnames by removing .html and /index.html suffixes.
*/
function normalizeFileFormatPathname(pathname) {
	if (pathname.endsWith("/index.html")) {
		const trimmed = pathname.slice(0, -11);
		return trimmed === "" ? "/" : trimmed;
	}
	if (pathname.endsWith(".html")) {
		const trimmed = pathname.slice(0, -5);
		return trimmed === "" ? "/" : trimmed;
	}
	return pathname;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/route-table.js
function compileRouteTable(manifest, routes) {
	const routesList = ensure404Route({ routes });
	const router = new Router(routesList.routes, {
		base: manifest.base,
		trailingSlash: manifest.trailingSlash,
		buildFormat: manifest.buildFormat
	});
	return {
		routes: routesList.routes,
		router
	};
}
var routeTables = createManifestMemo((manifest) => compileRouteTable(manifest, (manifest.routes ?? []).map((route) => route.routeData)));
/**
* The route table for a manifest: the derived route list (with the default
* 404 ensured) and the compiled router. All route reads — matching, rewrites,
* custom-404 fallbacks, `manifestData` accessors — go through this single
* entry so dev HMR updates are visible to every consumer at once.
*/
function getRouteTable(manifest) {
	return routeTables.get(manifest);
}
/**
* Atomically replaces the route table for a manifest (dev `astro:routes-updated`).
* Runs `ensure404Route` on the new list, compiles a fresh `Router`, and swaps
* the memo entry in one step, so no consumer can observe a half-updated table.
*/
function updateRouteTable(manifest, routes) {
	routeTables.set(manifest, compileRouteTable(manifest, [...routes]));
}
/**
* Low-level route matching against the manifest routes. Returns the matched
* `RouteData` or `undefined`. Does not filter prerendered routes or check
* public assets — use the app-level match for that.
*/
function matchRoute(manifest, pathname) {
	const match = getRouteTable(manifest).router.match(pathname, { allowWithoutBase: true });
	if (match.type !== "match") return void 0;
	return match.route;
}
/**
* Returns all routes matching the given pathname, in priority order. Used when
* the first match cannot serve the request (e.g. a prerendered dynamic route
* that doesn't cover this specific path) and the caller needs to try
* subsequent matches.
*/
function matchAllRoutes(manifest, pathname) {
	return getRouteTable(manifest).router.matchAll(pathname, { allowWithoutBase: true });
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/provider.js
var cacheProviderMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.cacheProvider) {
		const factory = (await manifest.cacheProvider())?.default || null;
		return factory ? factory(manifest.cacheConfig?.options) : null;
	}
	return null;
});
/** Resolves the cache provider from the manifest, `null` when none. */
function getCacheProvider(manifest) {
	return cacheProviderMemo.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/runtime/utils.js
/**
* Generate default cache response headers from CacheOptions.
* Used when the provider doesn't supply its own `setHeaders()`.
*/
function defaultSetHeaders(options) {
	const headers = new Headers();
	const directives = [];
	if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
	if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
	if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
	if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
	if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
	if (options.etag) headers.set("ETag", options.etag);
	return headers;
}
function isLiveDataEntry(value) {
	return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/runtime/cache.js
var APPLY_HEADERS = Symbol.for("astro:cache:apply");
var IS_ACTIVE = Symbol.for("astro:cache:active");
var AstroCache = class {
	#options = {};
	#tags = /* @__PURE__ */ new Set();
	#disabled = false;
	#provider;
	enabled = true;
	constructor(provider) {
		this.#provider = provider;
	}
	set(input) {
		if (input === false) {
			this.#disabled = true;
			this.#tags.clear();
			this.#options = {};
			return;
		}
		this.#disabled = false;
		let options;
		if (isLiveDataEntry(input)) {
			if (!input.cacheHint) return;
			options = input.cacheHint;
		} else options = input;
		if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
		if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
		if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
		if (options.lastModified !== void 0) {
			if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
		}
		if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
	}
	get tags() {
		return [...this.#tags];
	}
	/**
	* Get the current cache options (read-only snapshot).
	* Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
	*/
	get options() {
		return {
			...this.#options,
			tags: this.tags
		};
	}
	async invalidate(input) {
		if (!this.#provider) throw new AstroError(CacheNotEnabled);
		let options;
		if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
		else options = input;
		return this.#provider.invalidate(options);
	}
	/** @internal */
	[APPLY_HEADERS](response, request) {
		if (this.#disabled) return;
		const finalOptions = {
			...this.#options,
			tags: this.tags
		};
		if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
		const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
		for (const [key, value] of headers) response.headers.set(key, value);
		if (!response.headers.has("Cache-Control") && !response.headers.has("Expires") && (response.headers.has("Last-Modified") || response.headers.has("ETag"))) response.headers.set("Cache-Control", "no-cache");
	}
	/** @internal */
	get [IS_ACTIVE]() {
		return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
	}
};
/**
* Apply cache headers to a response.
*/
function applyCacheHeaders(cache, response, request) {
	if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/runtime/noop.js
/**
* A no-op cache implementation used in dev mode when cache is configured.
* The API is available so user code doesn't need conditional checks,
* but nothing is actually cached.
*/
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
	enabled = false;
	set() {}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {}
};
var hasWarned = false;
/**
* A no-op cache used when cache is not configured.
* Logs a warning on first use instead of throwing, so libraries
* can call cache methods without needing try/catch.
* `invalidate()` still throws since it implies the caller
* expects purging to actually work.
*/
var DisabledAstroCache = class {
	enabled = false;
	#logger;
	constructor(logger) {
		this.#logger = logger;
	}
	#warn() {
		if (!hasWarned) {
			hasWarned = true;
			this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
		}
	}
	set() {
		this.#warn();
	}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {
		throw new AstroError(CacheNotEnabled);
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/routing/parts.js
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
	const result = [];
	part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;
		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
		if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} — parameter name must match /^[a-zA-Z0-9_$]+$/`);
		result.push({
			content,
			dynamic,
			spread: dynamic && ROUTE_SPREAD.test(content)
		});
	});
	return result;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/runtime/route-matching.js
/**
* Compile config-level cache route patterns into RegExps.
* The result is memoized on the pipeline — this function is only called once,
* on the first request that needs route matching.
* Returns compiled patterns sorted by Astro's standard route priority (most specific first).
*/
function compileCacheRoutes(routes, base, trailingSlash) {
	const compiled = Object.entries(routes).map(([path, options]) => {
		const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
		return {
			pattern: getPattern(segments, base, trailingSlash),
			options,
			segments,
			route: path
		};
	});
	compiled.sort((a, b) => routeComparator({
		segments: a.segments,
		route: a.route,
		type: "page"
	}, {
		segments: b.segments,
		route: b.route,
		type: "page"
	}));
	return compiled;
}
/**
* Called per-request to find the first matching cache rule for a given pathname.
*/
function matchCacheRoute(pathname, compiledRoutes) {
	for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
	return null;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/cache/handler.js
var CACHE_KEY = "cache";
/**
* Registers a cache provider on the given `FetchState`. When
* `state.resolve('cache')` is first called, the appropriate cache
* implementation is created (disabled, noop for dev, or real).
*
* Returns synchronously when cache is not configured or in dev mode.
*/
function provideCache(state) {
	const manifest = state.manifest;
	if (!manifest.cacheConfig) {
		state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(state.logger) });
		return;
	}
	if (getEnvironment(manifest).runtimeMode === "development") {
		state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
		return;
	}
	return provideCacheAsync(state, manifest);
}
async function provideCacheAsync(state, manifest) {
	const cacheProvider = await getCacheProvider(manifest);
	state.provide(CACHE_KEY, { create() {
		const cache = new AstroCache(cacheProvider);
		if (manifest.cacheConfig?.routes) {
			const matched = matchCacheRoute(state.pathname, getCompiledCacheRoutes(manifest));
			if (matched) cache.set(matched);
		}
		return cache;
	} });
}
/**
* Wraps a render callback with cache provider logic. Handles both
* runtime caching (onRequest) and CDN-based providers (headers only).
*
* - When a cache provider with `onRequest` is configured, the callback
*   is wrapped so the provider can serve from cache or fall through.
* - When only CDN headers are needed, the callback runs directly and
*   cache headers are applied to the response.
* - When no cache provider is configured, the callback runs as-is.
*
* Cache headers (`CDN-Cache-Control`, `Cache-Tag`) are stripped from
* the final response after the runtime provider has read them.
*/
async function handleCache(state, next) {
	markFeatureUsed(state.manifest, FetchFeatures.cache);
	if (!state.manifest.cacheProvider) return next();
	const cache = state.resolve(CACHE_KEY);
	const cacheProvider = await getCacheProvider(state.manifest);
	if (cacheProvider?.onRequest) {
		const response = await cacheProvider.onRequest({
			request: state.request,
			url: new URL(state.request.url),
			waitUntil: state.renderOptions.waitUntil,
			logger: {
				info(msg) {
					state.logger.info("cache", msg);
				},
				warn(msg) {
					state.logger.warn("cache", msg);
				},
				error(msg) {
					state.logger.error("cache", msg);
				}
			}
		}, async () => {
			const res = await next();
			applyCacheHeaders(cache, res, state.request);
			return res;
		});
		response.headers.delete("CDN-Cache-Control");
		response.headers.delete("Cache-Tag");
		return response;
	}
	const response = await next();
	applyCacheHeaders(cache, response, state.request);
	return response;
}
var compiledCacheRoutesMemo = createManifestMemo((manifest) => manifest.cacheConfig?.routes ? compileCacheRoutes(manifest.cacheConfig.routes, manifest.base, manifest.trailingSlash) : []);
/**
* Config-level cache routes compiled from `manifest.cacheConfig`, derived
* lazily on the first cache-seeded request.
*/
function getCompiledCacheRoutes(manifest) {
	return compiledCacheRoutesMemo.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/session/driver.js
var sessionDriverMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.sessionDriver) return (await manifest.sessionDriver())?.default || null;
	return null;
});
/** Resolves the session driver factory from the manifest, `null` when none. */
function getSessionDriver(manifest) {
	return sessionDriverMemo.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/session/runtime.js
var PERSIST_SYMBOL = Symbol();
var DEFAULT_COOKIE_NAME = "astro-session";
var VALID_COOKIE_REGEX = /^[\w-]+$/;
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var unflatten$1 = (parsed, _) => {
	return unflatten(parsed, { URL: (href) => new URL(href) });
};
var stringify$1 = (data, _) => {
	return stringify(data, { URL: (val) => val instanceof URL && val.href });
};
var AstroSession = class AstroSession {
	#cookies;
	#config;
	#cookieConfig;
	#cookieName;
	#storage;
	#data;
	#sessionID;
	#toDestroy = /* @__PURE__ */ new Set();
	#toDelete = /* @__PURE__ */ new Set();
	#dirty = false;
	#cookieSet = false;
	#sessionIDFromCookie = false;
	#partial = true;
	#logger;
	#driverFactory;
	static #sharedStorage = /* @__PURE__ */ new Map();
	constructor({ cookies, config, runtimeMode, driverFactory, mockStorage, logger }) {
		this.#logger = logger;
		if (!config) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("No driver was defined in the session configuration and the adapter did not provide a default driver.")
		});
		this.#cookies = cookies;
		this.#driverFactory = driverFactory;
		const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
		let cookieConfigObject;
		if (typeof cookieConfig === "object") {
			const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
			this.#cookieName = name;
			cookieConfigObject = rest;
		} else this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
		this.#cookieConfig = {
			sameSite: "lax",
			secure: runtimeMode === "production",
			path: "/",
			...cookieConfigObject,
			httpOnly: true
		};
		this.#config = configRest;
		if (mockStorage) this.#storage = mockStorage;
	}
	/**
	* Gets a session value. Returns `undefined` if the session or value does not exist.
	*/
	async get(key) {
		return (await this.#ensureData()).get(key)?.data;
	}
	/**
	* Checks if a session value exists.
	*/
	async has(key) {
		return (await this.#ensureData()).has(key);
	}
	/**
	* Gets all session values.
	*/
	async keys() {
		return (await this.#ensureData()).keys();
	}
	/**
	* Gets all session values.
	*/
	async values() {
		return [...(await this.#ensureData()).values()].map((entry) => entry.data);
	}
	/**
	* Gets all session entries.
	*/
	async entries() {
		return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
	}
	/**
	* Deletes a session value.
	*/
	delete(key) {
		this.#data ??= /* @__PURE__ */ new Map();
		this.#data.delete(key);
		if (this.#partial) this.#toDelete.add(key);
		this.#dirty = true;
	}
	/**
	* Sets a session value. The session is created if it does not exist.
	*/
	set(key, value, { ttl } = {}) {
		if (!key) throw new AstroError({
			...SessionStorageSaveError,
			message: "The session key was not provided."
		});
		let cloned;
		try {
			cloned = unflatten$1(JSON.parse(stringify$1(value)));
		} catch (err) {
			throw new AstroError({
				...SessionStorageSaveError,
				message: `The session data for ${key} could not be serialized.`,
				hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
			}, { cause: err });
		}
		if (!this.#cookieSet) {
			this.#setCookie();
			this.#cookieSet = true;
		}
		this.#data ??= /* @__PURE__ */ new Map();
		const lifetime = ttl ?? this.#config.ttl;
		const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
		this.#data.set(key, {
			data: cloned,
			expires
		});
		this.#dirty = true;
	}
	/**
	* Destroys the session, clearing the cookie and storage if it exists.
	*/
	destroy() {
		const cookieValue = this.#cookies.get(this.#cookieName)?.value;
		const sessionId = this.#sessionID ?? (cookieValue && UUID_REGEX.test(cookieValue) ? cookieValue : void 0);
		if (sessionId) this.#toDestroy.add(sessionId);
		this.#cookies.delete(this.#cookieName, this.#cookieConfig);
		this.#sessionID = void 0;
		this.#data = void 0;
		this.#dirty = true;
	}
	/**
	* Regenerates the session, creating a new session ID. The existing session data is preserved.
	*/
	async regenerate() {
		let data = /* @__PURE__ */ new Map();
		try {
			data = await this.#ensureData();
		} catch (err) {
			this.#logger.error("session", `Failed to load session data during regeneration: ${err}`);
			this.#partial = false;
		}
		const oldSessionId = this.#sessionID;
		this.#sessionID = crypto.randomUUID();
		this.#sessionIDFromCookie = false;
		this.#data = data;
		this.#dirty = true;
		await this.#setCookie();
		if (oldSessionId && this.#storage) this.#storage.removeItem(oldSessionId).catch((err) => {
			this.#logger.error("session", `Failed to remove old session ${oldSessionId}: ${err}`);
		});
	}
	async [PERSIST_SYMBOL]() {
		if (!this.#dirty && !this.#toDestroy.size) return;
		const storage = await this.#ensureStorage();
		if (this.#dirty && this.#data) {
			const data = await this.#ensureData();
			this.#toDelete.forEach((key) => data.delete(key));
			const key = this.#ensureSessionID();
			let serialized;
			try {
				serialized = stringify$1(data);
			} catch (err) {
				throw new AstroError({
					...SessionStorageSaveError,
					message: SessionStorageSaveError.message("The session data could not be serialized.", this.#config.driver)
				}, { cause: err });
			}
			await storage.setItem(key, serialized);
			this.#dirty = false;
		}
		if (this.#toDestroy.size > 0) {
			const cleanupPromises = [...this.#toDestroy].map((sessionId) => storage.removeItem(sessionId).catch((err) => {
				this.#logger.error("session", `Failed to remove session ${sessionId}: ${err}`);
			}));
			await Promise.all(cleanupPromises);
			this.#toDestroy.clear();
		}
	}
	get sessionID() {
		return this.#sessionID;
	}
	/**
	* Loads a session from storage with the given ID, and replaces the current session.
	* Any changes made to the current session will be lost.
	* This is not normally needed, as the session is automatically loaded using the cookie.
	* However it can be used to restore a session where the ID has been recorded somewhere
	* else (e.g. in a database).
	*/
	async load(sessionID) {
		this.#sessionID = sessionID;
		this.#data = void 0;
		await this.#setCookie();
		await this.#ensureData();
	}
	/**
	* Sets the session cookie.
	*/
	async #setCookie() {
		if (!VALID_COOKIE_REGEX.test(this.#cookieName)) throw new AstroError({
			...SessionStorageSaveError,
			message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
		});
		const value = this.#ensureSessionID();
		this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
	}
	/**
	* Attempts to load the session data from storage, or creates a new data object if none exists.
	* If there is existing partial data, it will be merged into the new data object.
	*/
	async #ensureData() {
		if (this.#data && !this.#partial) return this.#data;
		this.#data ??= /* @__PURE__ */ new Map();
		if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
			this.#partial = false;
			return this.#data;
		}
		const raw = await (await this.#ensureStorage()).get(this.#ensureSessionID());
		if (!raw) {
			if (this.#sessionIDFromCookie) {
				this.#sessionID = crypto.randomUUID();
				this.#sessionIDFromCookie = false;
				if (this.#cookieSet) await this.#setCookie();
			}
			return this.#data;
		}
		try {
			const storedMap = unflatten$1(raw);
			if (!(storedMap instanceof Map)) {
				this.destroy();
				throw new AstroError({
					...SessionStorageInitError,
					message: SessionStorageInitError.message("The session data was an invalid type.", this.#config.driver)
				});
			}
			const now = Date.now();
			for (const [key, value] of storedMap) {
				const expired = typeof value.expires === "number" && value.expires < now;
				if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) this.#data.set(key, value);
			}
			this.#partial = false;
			return this.#data;
		} catch (err) {
			this.destroy();
			if (err instanceof AstroError) throw err;
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("The session data could not be parsed.", this.#config.driver)
			}, { cause: err });
		}
	}
	/**
	* Returns the session ID, generating a new one if it does not exist.
	*/
	#ensureSessionID() {
		if (!this.#sessionID) {
			const cookieValue = this.#cookies.get(this.#cookieName)?.value;
			if (cookieValue && UUID_REGEX.test(cookieValue)) {
				this.#sessionID = cookieValue;
				this.#sessionIDFromCookie = true;
			} else this.#sessionID = crypto.randomUUID();
		}
		return this.#sessionID;
	}
	/**
	* Ensures the storage is initialized.
	* This is called automatically when a storage operation is needed.
	*/
	async #ensureStorage() {
		if (this.#storage) return this.#storage;
		if (AstroSession.#sharedStorage.has(this.#config.driver)) {
			this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
			return this.#storage;
		}
		if (!this.#driverFactory) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("Astro could not load the driver correctly. Does it exist?", this.#config.driver)
		});
		const driver = this.#driverFactory;
		try {
			this.#storage = createStorage({ driver: {
				...driver(this.#config.options),
				hasItem() {
					return false;
				},
				getKeys() {
					return [];
				}
			} });
			AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
			return this.#storage;
		} catch (err) {
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("Unknown error", this.#config.driver)
			}, { cause: err });
		}
	}
};
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/session/handler.js
var SESSION_KEY = "session";
/**
* Registers a session provider on the given `FetchState`. When
* `state.resolve('session')` is first called, the `AstroSession` is
* created lazily. When `state.finalizeAll()` runs, any mutations are
* persisted.
*
* No-op (returns synchronously) if sessions are not configured on the
* manifest, avoiding promise allocation on the hot path.
*/
function provideSession(state) {
	markFeatureUsed(state.manifest, FetchFeatures.sessions);
	const config = state.manifest.sessionConfig;
	if (!config) return;
	return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
	const driverFactory = await getSessionDriver(state.manifest);
	if (!driverFactory) return;
	state.provide(SESSION_KEY, {
		create() {
			const cookies = state.cookies;
			return new AstroSession({
				cookies,
				config,
				runtimeMode: getEnvironment(state.manifest).runtimeMode,
				driverFactory,
				mockStorage: null,
				logger: state.logger
			});
		},
		finalize(session) {
			return session[PERSIST_SYMBOL]();
		}
	});
}
// node_modules/.pnpm/@astrojs+internal-helpers@0.13.0/node_modules/@astrojs/internal-helpers/dist/remote.js
/**
* Evaluates whether a given URL matches the specified remote pattern based on protocol, hostname, port, and pathname.
*
* @param {URL} url - The URL object to be matched against the remote pattern.
* @param {RemotePattern} remotePattern - The remote pattern object containing the protocol, hostname, port, and pathname to match.
* @return {boolean} Returns `true` if the URL matches the given remote pattern; otherwise, `false`.
*/
function matchPattern(url, remotePattern) {
	return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
/**
* Checks if the given URL's port matches the specified port. If no port is provided, it returns `true`.
*
* @param {URL} url - The URL object whose port will be checked.
* @param {string} [port=] - The port to match against the URL's port. Optional.
* @return {boolean} Returns `true` if the URL's port matches the specified port or if no port is provided; otherwise, `false`.
*/
function matchPort(url, port) {
	return !port || port === url.port;
}
/**
* Compares the protocol of the provided URL with a specified protocol.
*
* @param {URL} url - The URL object whose protocol needs to be checked.
* @param {string} [protocol] - The protocol to compare against, without the trailing colon. If not provided, the method will always return `true`.
* @return {boolean} Returns `true` if the protocol matches or if no protocol is specified; otherwise, `false`.
*/
function matchProtocol(url, protocol) {
	return !protocol || protocol === url.protocol.slice(0, -1);
}
/**
* Matches a given URL's hostname against a specified hostname, with optional support for wildcard patterns.
*
* @param {URL} url - The URL object whose hostname is to be matched.
* @param {string} [hostname] - The hostname to match against. Supports wildcard patterns if `allowWildcard` is `true`.
* @param {boolean} [allowWildcard=false] - Indicates whether wildcard patterns in the `hostname` parameter are allowed.
* @return {boolean} - Returns `true` if the URL's hostname matches the given hostname criteria; otherwise, `false`.
*/
function matchHostname(url, hostname, allowWildcard = false) {
	if (!hostname) return true;
	else if (!allowWildcard || !hostname.startsWith("*")) return hostname === url.hostname;
	else if (hostname.startsWith("**.")) {
		const slicedHostname = hostname.slice(2);
		return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
	} else if (hostname.startsWith("*.")) {
		const slicedHostname = hostname.slice(1);
		if (!url.hostname.endsWith(slicedHostname)) return false;
		const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
		return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
	}
	return false;
}
/**
* Matches a given URL's pathname against a specified pattern, with optional support for wildcards.
*
* @param {URL} url - The URL object containing the pathname to be matched.
* @param {string} [pathname] - The pathname pattern to match the URL against.
* @param {boolean} [allowWildcard=false] - Determines whether wildcard matching is allowed.
* @return {boolean} - Returns `true` if the URL's pathname matches the specified pattern; otherwise, `false`.
*/
function matchPathname(url, pathname, allowWildcard = false) {
	if (!pathname) return true;
	else if (!allowWildcard || !pathname.endsWith("*")) return pathname === url.pathname;
	else if (pathname.endsWith("/**")) {
		const slicedPathname = pathname.slice(0, -2);
		return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
	} else if (pathname.endsWith("/*")) {
		const slicedPathname = pathname.slice(0, -1);
		if (!url.pathname.startsWith(slicedPathname)) return false;
		return url.pathname.slice(slicedPathname.length).split("/").filter(Boolean).length === 1;
	}
	return false;
}
/**
* Determines whether a given remote resource, identified by its source URL,
* is allowed based on specified domains and remote patterns.
*
* @param {string} src - The source URL of the remote resource to be validated.
* @param {Object} options - The configuration options for domain and pattern matching.
* @param {string[]} options.domains - A list of allowed domain names.
* @param {RemotePattern[]} options.remotePatterns - A list of allowed remote patterns for matching.
* @return {boolean} Returns `true` if the source URL matches any of the specified domains or remote patterns; otherwise, `false`.
*/
function isRemoteAllowed(src, { domains, remotePatterns }) {
	if (!URL.canParse(src)) return false;
	const url = new URL(src);
	if (![
		"http:",
		"https:",
		"data:"
	].includes(url.protocol)) return false;
	return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/app/validate-headers.js
/**
* Parses a potentially comma-separated multi-value header (as produced by
* proxy chains) and returns the first value, trimmed of whitespace.
* Returns `undefined` when the header is absent or empty.
*/
function getFirstForwardedValue(multiValueHeader) {
	return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
/**
* Sanitize a hostname by rejecting any with path separators.
* Prevents path injection attacks. Invalid hostnames return undefined.
*/
function sanitizeHost(hostname) {
	if (!hostname) return void 0;
	if (/[/\\]/.test(hostname)) return void 0;
	return hostname;
}
/**
* Parse a host string into hostname and port components. Returns `undefined`
* for a host that carries more than a single `hostname:port` pair (e.g.
* `example.com:8080:8080`), which is not a valid host and would otherwise be
* accepted by inspecting only the first two segments.
*/
function parseHost(host) {
	const parts = host.split(":");
	if (parts.length > 2) return void 0;
	return {
		hostname: parts[0],
		port: parts[1]
	};
}
/**
* Check if a host matches any of the allowed domain patterns.
* Assumes hostname and port are already sanitized/parsed.
*/
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
	const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
	if (!URL.canParse(urlString)) return false;
	const testUrl = new URL(urlString);
	return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
/**
* Validate a host against allowedDomains.
* Returns the host only if it matches an allowed pattern; otherwise, undefined.
* This prevents SSRF attacks by ensuring the Host header is trusted.
*/
function validateHost(host, protocol, allowedDomains) {
	if (!host || host.length === 0) return void 0;
	if (!allowedDomains || allowedDomains.length === 0) return void 0;
	const sanitized = sanitizeHost(host);
	if (!sanitized) return void 0;
	const parsed = parseHost(sanitized);
	if (!parsed) return void 0;
	const { hostname, port } = parsed;
	if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
/**
* Validate forwarded headers (proto, host, port) against allowedDomains.
* Returns validated values or undefined for rejected headers.
* Uses strict defaults: http/https only for proto, rejects port if not in allowedDomains.
*/
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
	const result = {};
	if (forwardedProtocol) {
		if (allowedDomains && allowedDomains.length > 0) {
			if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
				const testUrl = new URL(`${forwardedProtocol}://example.com`);
				if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
			} catch {}
			else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
		}
	}
	if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
		if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
			if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
		}
	}
	if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
		const protoForValidation = result.protocol || "https";
		const sanitized = sanitizeHost(forwardedHost);
		const parsed = sanitized ? parseHost(sanitized) : void 0;
		if (sanitized && parsed) {
			const { hostname, port: portFromHost } = parsed;
			if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
		}
	}
	return result;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/output-filename.js
function getOutputFilename(buildFormat, name, routeData) {
	if (routeData.type === "endpoint") return name;
	if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
	if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
	if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
	return `${removeTrailingForwardSlash(name)}/index.html`;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/errors/default-handler.js
/**
* The default error strategy used in production SSR. Attempts to render the
* matching error route (404.astro / 500.astro), falling back to a plain
* response with the given status. Handles prerendered error pages via
* `prerenderedErrorPageFetch`.
*/
async function renderDefaultError(manifest, request, { status, response: originalResponse, skipMiddleware = false, error, pathname, ...resolvedRenderOptions }) {
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const routeTable = getRouteTable(manifest);
	const errorRouteData = matchRoute$1(getErrorRoutePath(resolvedPathname, status, routeTable.routes, manifest.i18n?.locales, manifest.trailingSlash === "always"), routeTable);
	const url = new URL(request.url);
	if (errorRouteData) {
		if (errorRouteData.prerender) {
			const allowedDomains = manifest.allowedDomains;
			const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
			const statusURL = new URL(`${removeTrailingForwardSlash(manifest.base)}${getOutputFilename(manifest.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
			if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
				const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
					status,
					removeContentEncodingHeaders: true
				});
				prepareResponse(newResponse, resolvedRenderOptions);
				return newResponse;
			} catch {
				const response = mergeResponses(new Response(null, { status }), originalResponse);
				prepareResponse(response, resolvedRenderOptions);
				return response;
			}
		}
		const mod = await getEnvironment(manifest).getComponentByRoute(manifest, errorRouteData);
		const errorState = new FetchState(manifest, request);
		errorState.skipMiddleware = skipMiddleware;
		errorState.clientAddress = resolvedRenderOptions.clientAddress;
		errorState.routeData = errorRouteData;
		errorState.pathname = resolvedPathname;
		errorState.status = status;
		errorState.componentInstance = mod;
		errorState.locals = resolvedRenderOptions.locals ?? {};
		errorState.initialProps = { error };
		try {
			await provideSession(errorState);
			await provideCache(errorState);
			const response = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response)) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
			const newResponse = mergeResponses(response, originalResponse);
			prepareResponse(newResponse, resolvedRenderOptions);
			return newResponse;
		} catch {
			if (skipMiddleware === false) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
		} finally {
			await errorState.finalizeAll();
		}
	}
	const response = mergeResponses(new Response(null, { status }), originalResponse);
	prepareResponse(response, resolvedRenderOptions);
	return response;
}
function mergeResponses(newResponse, originalResponse, override) {
	let newResponseHeaders = newResponse.headers;
	if (override?.removeContentEncodingHeaders) {
		newResponseHeaders = new Headers(newResponseHeaders);
		newResponseHeaders.delete("Content-Encoding");
		newResponseHeaders.delete("Content-Length");
	}
	if (!originalResponse) {
		if (override !== void 0) return new Response(newResponse.body, {
			status: override.status,
			statusText: newResponse.statusText,
			headers: newResponseHeaders
		});
		return newResponse;
	}
	const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
	try {
		originalResponse.headers.delete("Content-type");
		originalResponse.headers.delete("Content-Length");
		originalResponse.headers.delete("Transfer-Encoding");
	} catch {}
	const newHeaders = new Headers();
	const seen = /* @__PURE__ */ new Set();
	for (const [name, value] of originalResponse.headers) {
		newHeaders.append(name, value);
		seen.add(name.toLowerCase());
	}
	for (const [name, value] of newResponseHeaders) {
		const lower = name.toLowerCase();
		if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
	}
	const mergedResponse = new Response(newResponse.body, {
		status,
		statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
		headers: newHeaders
	});
	const originalCookies = getCookiesFromResponse(originalResponse);
	const newCookies = getCookiesFromResponse(newResponse);
	if (originalCookies) {
		if (newCookies) originalCookies.merge(newCookies);
		attachCookiesToResponse(mergedResponse, originalCookies);
	} else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
	return mergedResponse;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/errors/build-handler.js
/**
* The error strategy used during static build / prerendering.
*
* - For 500 errors, returns the original response if present, otherwise
*   throws so the build surfaces the underlying error to the developer.
* - For other errors (e.g. 404), delegates to `renderDefaultError` with
*   `prerenderedErrorPageFetch` cleared (the build pipeline can't fetch
*   prerendered pages the way production SSR can).
*/
async function renderBuildError(manifest, request, options) {
	if (options.status === 500) {
		if (options.response) return options.response;
		throw options.error;
	}
	return renderDefaultError(manifest, request, {
		...options,
		prerenderedErrorPageFetch: void 0
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/errors/dev-handler.js
/**
* The dev-server error strategy. Renders custom 404/500 routes if the user
* has them, otherwise throws so Vite's dev overlay is shown. Shared between
* the Vite dev server and the non-runnable dev pipeline; only
* `shouldInjectCspMetaTags` differs between them (carried by the
* environment record's `injectCspMetaTagsOnErrorPages` static).
*/
async function renderDevError(manifest, request, { skipMiddleware = false, error, status, response: _response, pathname, ...resolvedRenderOptions }, { shouldInjectCspMetaTags }) {
	if (isAstroError(error) && [MiddlewareNoDataOrNextCalled.name, MiddlewareNotAResponse.name].includes(error.name)) throw error;
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const renderRoute = async (routeData) => {
		try {
			const preloadedComponent = await getEnvironment(manifest).getComponentByRoute(manifest, routeData);
			const errorState = new FetchState(manifest, request);
			errorState.skipMiddleware = skipMiddleware;
			errorState.clientAddress = resolvedRenderOptions.clientAddress;
			errorState.shouldInjectCspMetaTags = shouldInjectCspMetaTags ? !!manifest.csp : false;
			errorState.routeData = routeData;
			errorState.pathname = resolvedPathname;
			errorState.status = status;
			errorState.componentInstance = preloadedComponent;
			errorState.locals = resolvedRenderOptions.locals ?? {};
			errorState.initialProps = { error };
			await provideCache(errorState);
			const response = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, routeData, errorState.routeData, response)) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				skipMiddleware: true,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			if (error) getLogger(manifest).error("router", error.stack || error.message);
			return response;
		} catch (_err) {
			if (skipMiddleware === false) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status: 500,
				skipMiddleware: true,
				error: _err,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			throw _err;
		}
	};
	if (status === 404) {
		const custom404 = getCustom404Route(getRouteTable(manifest));
		if (custom404) return renderRoute(custom404);
	}
	const custom500 = getCustom500Route(getRouteTable(manifest));
	if (!custom500) throw error;
	else return renderRoute(custom500);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/errors/handler.js
/**
* Renders the error page (404.astro / 500.astro or a plain response) for a
* request, dispatching to the strategy the manifest's environment selects:
* production/container default, dev (overlay + custom error routes, with or
* without CSP meta-tag injection), or build (500s throw so the build fails).
*/
function renderErrorPage(manifest, request, options) {
	const env = getEnvironment(manifest);
	switch (env.errorStrategy) {
		case "dev": return renderDevError(manifest, request, options, { shouldInjectCspMetaTags: env.injectCspMetaTagsOnErrorPages });
		case "build": return renderBuildError(manifest, request, options);
		case "default": return renderDefaultError(manifest, request, options);
	}
}
/**
* Dispatches an internal error render for a request flowing through the
* handler chain: through the facade's late-bound `renderError` hook when the
* state was built by `BaseApp.render`'s fast path (preserving instance
* overrides/reassignments, e.g. cloudflare's prerender-error propagation),
* else through the environment's strategy via {@link renderErrorPage}.
*/
function renderErrorFromState(state, request, options) {
	if (state.renderError) return state.renderError(request, options);
	return renderErrorPage(state.manifest, request, options);
}
/**
* Whether a middleware rewrite (`ctx.rewrite()` / `next(payload)`) issued while
* rendering the error page dead-ended in another empty reroutable (404/500)
* response. The rewrite swaps the state's routeData away from the error route,
* so returning that render as-is would produce a blank page; the error handler
* should instead retry rendering the error page without middleware.
*
* @param skipMiddleware Whether middleware was already skipped for this render.
* @param errorRouteData The error route matched before middleware ran.
* @param renderedRouteData The route data on the state after middleware ran.
* @param response The response produced by the middleware-driven render.
*/
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
	return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/callMiddleware.js
/**
* Utility function that is in charge of calling the middleware.
*
* It accepts a `R` generic, which usually is the `Response` returned.
* It is a generic because endpoints can return a different payload.
*
* When calling a middleware, we provide a `next` function, this function might or
* might not be called.
*
* A middleware, to behave correctly, can:
* - return a `Response`;
* - call `next`;
*
* Failing doing so will result an error. A middleware can call `next` and do not return a
* response. A middleware cannot call `next` and return a new `Response` from scratch (maybe with a redirect).
*
* ```js
* const onRequest = async (context, next) => {
*   const response = await next(context);
*   return response;
* }
* ```
*
* ```js
* const onRequest = async (context, next) => {
*   context.locals = "foo";
*   next();
* }
* ```
*
* @param onRequest The function called which accepts a `context` and a `resolve` function
* @param apiContext The API context
* @param responseFunction A callback function that should return a promise with the response
*/
async function callMiddleware(onRequest, apiContext, responseFunction) {
	let nextCalled = false;
	let responseFunctionPromise = void 0;
	const next = async (payload) => {
		nextCalled = true;
		responseFunctionPromise = responseFunction(apiContext, payload);
		return responseFunctionPromise;
	};
	const middlewarePromise = onRequest(apiContext, next);
	return await Promise.resolve(middlewarePromise).then(async (value) => {
		if (nextCalled) {
			/**
			* Then we check if a value is returned. If so, we need to return the value returned by the
			* middleware.
			* e.g.
			* ```js
			* 	const response = await next();
			* 	const new Response(null, { status: 500, headers: response.headers });
			* ```
			*/
			if (typeof value !== "undefined") {
				if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
				return value;
			} else if (responseFunctionPromise) return responseFunctionPromise;
			else throw new AstroError(MiddlewareNotAResponse);
		} else if (typeof value === "undefined")
 /**
		* There might be cases where `next` isn't called and the middleware **must** return
		* something.
		*
		* If not thing is returned, then we raise an Astro error.
		*/
		throw new AstroError(MiddlewareNoDataOrNextCalled);
		else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
		else return value;
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/sequence.js
/**
*
* It accepts one or more middleware handlers and makes sure that they are run in sequence.
*/
function sequence(...handlers) {
	const filtered = handlers.filter((h) => !!h);
	const length = filtered.length;
	if (!length) return defineMiddleware((_context, next) => {
		return next();
	});
	return defineMiddleware((context, next) => {
		/**
		* This variable is used to carry the rerouting payload across middleware functions.
		*/
		let carriedPayload = void 0;
		return applyHandle(0, context);
		function applyHandle(i, handleContext) {
			const handle = filtered[i];
			return handle(handleContext, async (payload) => {
				if (i < length - 1) {
					if (payload) {
						const oldPathname = handleContext.url.pathname;
						const state = Reflect.get(handleContext, fetchStateSymbol);
						if (!state) throw new Error("FetchState not found on APIContext. `next(payload)` rewrites require a context created through Astro's request pipeline.");
						const manifest = state.manifest;
						const { routeData, pathname } = await getEnvironment(manifest).tryRewrite(manifest, payload, handleContext.request);
						let newRequest;
						if (payload instanceof Request) newRequest = payload;
						else {
							const request = handleContext.request.method === "GET" || handleContext.request.method === "HEAD" ? handleContext.request : handleContext.request.clone();
							newRequest = copyRequest(payload instanceof URL ? payload : new URL(payload, handleContext.url.origin), request, false, state.logger, routeData.route);
						}
						if (manifest.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) throw new AstroError({
							...ForbiddenRewrite,
							message: ForbiddenRewrite.message(handleContext.url.pathname, pathname, routeData.component),
							hint: ForbiddenRewrite.hint(routeData.component)
						});
						carriedPayload = payload;
						handleContext.request = newRequest;
						handleContext.url = new URL(newRequest.url);
						handleContext.params = getParams(routeData, pathname);
						handleContext.routePattern = routeData.route;
						setOriginPathname(handleContext.request, oldPathname, manifest.trailingSlash, manifest.buildFormat);
					}
					return applyHandle(i + 1, handleContext);
				} else return next(payload ?? carriedPayload);
			});
		}
	});
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/load.js
var resolvedMiddleware = /* @__PURE__ */ new WeakMap();
var middlewareMemo = createAsyncManifestMemo(async (manifest) => {
	let handler;
	if (manifest.middleware) {
		const internalMiddlewares = [(await manifest.middleware()).onRequest ?? NOOP_MIDDLEWARE_FN];
		if (manifest.checkOrigin) internalMiddlewares.unshift(createOriginCheckMiddleware());
		handler = sequence(...internalMiddlewares);
	} else handler = NOOP_MIDDLEWARE_FN;
	resolvedMiddleware.set(manifest, handler);
	return handler;
});
/**
* Resolves the middleware from the manifest and returns the `onRequest`
* function (prefixed with the origin-check middleware when configured). If
* `onRequest` isn't there, it returns a no-op function.
*/
function getMiddleware(manifest) {
	return middlewareMemo.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/middleware/astro-middleware.js
/**
* Runs Astro's middleware chain (origin check + user `onRequest`) for a
* single render, reading the composed middleware from the manifest and
* per-request data (componentInstance, slots, props, API contexts) off the
* supplied `FetchState`. The actual route dispatch (endpoint / redirect /
* page / fallback) is supplied by the caller as `renderRouteCallback` —
* typically `handlePages`.
*/
async function handleMiddleware(state, renderRouteCallback) {
	markFeatureUsed(state.manifest, FetchFeatures.middleware);
	await state.getProps();
	const apiContext = state.getAPIContext();
	state.counter++;
	if (state.counter === 4) return new Response("Loop Detected", {
		status: 508,
		statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
	});
	const next = async (ctx, payload) => {
		if (payload) {
			state.logger.debug("router", "Called rewriting to:", payload);
			applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request));
		}
		return renderRouteCallback(state, ctx);
	};
	let response;
	if (state.skipMiddleware) response = await next(apiContext);
	else response = await callMiddleware(sequence(await getMiddleware(state.manifest)), apiContext, next);
	attachCookiesToResponse(response, state.cookies);
	state.response = response;
	return response;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/util/normalized-url.js
/**
* Creates a normalized URL from a request URL string.
* Decodes and validates the pathname, collapses duplicate slashes.
*/
function createNormalizedUrl(requestUrl) {
	return normalizeUrl(new URL(requestUrl));
}
/**
* Assigns `url.pathname` only when the value differs.
* The setter re-parses the whole URL, so a no-op write is still expensive.
*/
function setPathname(url, pathname) {
	if (url.pathname !== pathname) url.pathname = pathname;
}
/**
* Normalizes an already-parsed URL in place: decodes and validates the
* pathname, collapses duplicate slashes. Returns the same URL object.
*
* Collapse runs after the decode is written back: the pathname setter
* rewrites `\` to `/`, so a decoded backslash only becomes `//` once assigned.
*/
function normalizeUrl(url) {
	try {
		setPathname(url, validateAndDecodePathname(url.pathname));
	} catch {
		try {
			setPathname(url, decodeURI(url.pathname));
		} catch {}
	}
	setPathname(url, collapseDuplicateSlashes(url.pathname));
	return url;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/rewrites/handler.js
/**
* Validates and applies a rewrite target to the given `FetchState`.
*
* - Validates that SSR→prerender rewrites are not attempted (except
*   for i18n fallback routes).
* - Mutates `state` to reflect the new route: request, URL, cookies,
*   params, pathname, component instance, etc.
* - Invalidates cached API contexts so they're re-derived from the
*   new route.
*
* Called by both `executeRewrite()` (user-triggered `Astro.rewrite`)
* and `handleMiddleware` (middleware `next(payload)`).
*/
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
	const oldPathname = state.pathname;
	const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
	if (state.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
		...ForbiddenRewrite,
		message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
		hint: ForbiddenRewrite.hint(routeData.component)
	});
	state.routeData = routeData;
	state.componentInstance = componentInstance;
	if (payload instanceof Request) state.request = payload;
	else state.request = copyRequest(newUrl, state.request, routeData.prerender, state.logger, state.routeData.route);
	state.url = createNormalizedUrl(state.request.url);
	if (mergeCookies) {
		const newCookies = new AstroCookies(state.request, state.logger);
		if (state.cookies) newCookies.merge(state.cookies);
		state.cookies = newCookies;
	}
	state.params = getParams(routeData, pathname);
	state.pathname = pathname;
	state.isRewriting = true;
	state.status = 200;
	setOriginPathname(state.request, oldPathname, state.manifest.trailingSlash, state.manifest.buildFormat);
	state.invalidateContexts();
}
/**
* Executes a user-triggered rewrite (`Astro.rewrite(...)` /
* `ctx.rewrite(...)`) against a `FetchState`. Resolves the rewrite
* target via the environment's `tryRewrite`, validates it, mutates the
* `FetchState` to reflect the new route, and re-runs the middleware
* and page dispatch to produce the new response.
*/
async function executeRewrite(state, payload) {
	state.logger.debug("router", "Calling rewrite: ", payload);
	applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request), { mergeCookies: true });
	return handleMiddleware(state, handlePages);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/i18n/domain.js
/**
* For domain-based i18n routing strategies, derives the locale-prefixed
* pathname from the request's `Host` header rather than its URL. For example,
* a request for `/foo` served from `https://example.fr` resolves to `/fr/foo`.
*
* Returns `undefined` when the strategy isn't domain-based or the host isn't
* mapped to a locale — in which case normal pathname routing applies.
*
*/
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, allowedDomains, logger, pathnameFromRequest) {
	let pathname = void 0;
	if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
		const validated = validateForwardedHeaders(getFirstForwardedValue(request.headers.get("X-Forwarded-Proto") ?? void 0), getFirstForwardedValue(request.headers.get("X-Forwarded-Host") ?? void 0), getFirstForwardedValue(request.headers.get("X-Forwarded-Port") ?? void 0), allowedDomains);
		const protocol = validated.protocol ? `${validated.protocol}:` : url.protocol;
		const requestHost = request.headers.get("Host") ?? void 0;
		const validatedRequestHost = allowedDomains?.length ? validateHost(requestHost, protocol.slice(0, -1), allowedDomains) : requestHost;
		let host = validated.host ?? validatedRequestHost;
		if (host && protocol) {
			host = host.split(":")[0];
			try {
				let locale;
				const hostAsUrl = new URL(`${protocol}//${host}`);
				for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
					const domainKeyAsUrl = new URL(domainKey);
					if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
						locale = localeValue;
						break;
					}
				}
				if (locale) {
					const requestPathname = pathnameFromRequest ?? stripRequestBase(url.pathname, base);
					pathname = prependForwardSlash(joinPaths(normalizeTheLocale(locale), requestPathname));
					if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
					else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
					else if (url.pathname.endsWith("/")) pathname = appendForwardSlash(pathname);
				}
			} catch (e) {
				logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
				logger.error("router", `Error: ${e}`);
			}
		}
	}
	return pathname;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/manifest/derived.js
var sites = createManifestMemo((manifest) => manifest.site ? new URL(manifest.site) : void 0);
/** The manifest's `site` as a `URL` (used for `Astro.site`). */
function getSite(manifest) {
	return sites.get(manifest);
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/server-islands/mappings.js
/**
* The server-island mappings for a manifest. Deliberately NOT memoized: the
* manifest thunk is a module import, which is cheap.
*/
async function getServerIslands(manifest) {
	if (manifest.serverIslandMappings) return manifest.serverIslandMappings();
	return {
		serverIslandMap: /* @__PURE__ */ new Map(),
		serverIslandNameMap: /* @__PURE__ */ new Map()
	};
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/core/fetch/fetch-state.js
var slotValuesSymbol = Symbol("astro.slotValues");
/**
* Retrieves the `FetchState` stashed on an `APIContext` by
* `FetchState.getAPIContext()`. Throws if not found — this indicates
* the context was not created through Astro's request pipeline.
*/
function getFetchStateFromAPIContext(context) {
	const state = context[fetchStateSymbol];
	if (!state) throw new Error("FetchState not found on APIContext. This is an internal error — the context was not created through Astro's request pipeline.");
	return state;
}
/**
* Holds per-request state as it flows through the handler pipeline.
*
* **This class is user-facing** via `astro/fetch` and `astro/hono`.
* The {@link AstroFetchState} interface defines the stable public
* surface. Members not on that interface are internal and
* may change without notice.
*
* Performance note: fields on this class are plain properties — ES
* private fields (`#foo`) have a non-zero per-access cost in V8
* which is measurable on the hot render path, so `#` is used only
* for rarely-accessed memoized caches and Maps.
*/
var FetchState = class {
	/** The manifest — the single ambient source of static, build-time data. */
	manifest;
	/** The manifest's identity-stable logger, captured once at construction. */
	logger;
	/**
	* Whether page renders stream. From the facade hooks on the fast path,
	* else the environment's default.
	*/
	streaming;
	/**
	* Internal facade hook: late-bound `app.renderError` dispatch. Undefined on
	* bare and custom-handler paths — those fall through to the environment's
	* error strategy (`renderErrorPage`).
	*/
	renderError;
	/**
	* Internal facade hook: late-bound `app.logThisRequest` dispatch. Undefined
	* on bare and custom-handler paths — those fall through to the
	* environment's `logRequest` behavior.
	*/
	logRequest;
	/**
	* The request to render. Mutated during rewrites so subsequent renders
	* see the rewritten URL.
	*/
	request;
	routeData;
	/**
	* The pathname to use for routing and rendering. Starts out as the raw,
	* base-stripped, decoded pathname from the request. May be further
	* normalized by `handleRequest` after routeData is known (in dev, when
	* the matched route has no `.html` extension, `.html` / `/index.html`
	* suffixes are stripped).
	*/
	pathname;
	/** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
	renderOptions;
	/** When the request started, used to log duration. */
	timeStart;
	/**
	* The route's loaded component module. Set before middleware runs; may
	* be swapped during in-flight rewrites from inside the middleware chain.
	*/
	componentInstance;
	/**
	* Slot overrides supplied by the container API. `undefined` for HTTP
	* requests — `PagesHandler` coalesces to `{}` on read so we don't
	* allocate an empty object per request.
	*/
	slots;
	/**
	* The `Response` produced by handlers, if any. Set after page
	* rendering or middleware completes.
	*/
	response;
	/** Explicitly assigned status; `undefined` until a caller sets one. */
	#status;
	/**
	* Default HTTP status for the rendered response. Callers override
	* before rendering runs (e.g. `handleRequest` sets this from
	* `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
	* Reads `200` until assigned.
	*/
	get status() {
		return this.#status ?? 200;
	}
	set status(value) {
		this.#status = value;
	}
	/**
	* Sets `status` from the matched route (see `getDefaultStatusCode`)
	* unless a caller already assigned one.
	*/
	applyDefaultStatus() {
		if (this.#status === void 0 && this.routeData) this.#status = getDefaultStatusCode(this.manifest, this.routeData, this.pathname);
	}
	/** Whether user middleware should be skipped for this request. */
	skipMiddleware = false;
	/**
	* Set to `true` when the request path was encoded too many times to fully
	* decode (see {@link validateAndDecodePathname}). These requests are
	* rejected with a `400` before middleware or routing run.
	*/
	invalidEncoding = false;
	/** A flag that tells the render content if the rewriting was triggered. */
	isRewriting = false;
	/** A safety net in case of loops (rewrite counter). */
	counter = 0;
	/** Cookies for this request. Created lazily on first access. */
	cookies;
	/** Route params derived from routeData + pathname. Computed lazily. */
	#params;
	get params() {
		if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
		return this.#params;
	}
	set params(value) {
		this.#params = value;
	}
	/** Normalized URL for this request. */
	url;
	/** Client address for this request. */
	clientAddress;
	/** Whether this is a partial render (container API). */
	partial;
	/** Internal metadata about the current response route type. */
	responseRouteType;
	/** Internal flag to prevent rerouting this response to an error page. */
	skipErrorReroute = false;
	/** Whether to inject CSP meta tags. */
	shouldInjectCspMetaTags;
	/** Request-scoped locals object, shared with user middleware. */
	locals = {};
	/**
	* Memoized `props` (see `getProps`). `null` means "not yet computed"
	* — using `null` (rather than `undefined`) keeps the hidden class
	* stable and distinct from a valid-but-empty result.
	*/
	props = null;
	/** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
	actionApiContext = null;
	/** Memoized `APIContext` (see `getAPIContext`). */
	apiContext = null;
	/** Registered context providers keyed by name. Lazy-initialized on first provide(). */
	#providers;
	/** Cached values from resolved providers. Lazy-initialized on first resolve(). */
	#providersResolvedValues;
	/** Cached promise for lazy component instance loading. */
	#componentInstancePromise;
	/** SSR result for the current page render. */
	result;
	/** Initial props (from container/error handler). */
	initialProps = {};
	/** Memoized Astro page partial. */
	#astroPagePartial;
	/**
	* Locale-prefixed pathname derived from the Host header for domain-based
	* i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
	* isn't served from a locale-mapped domain. When set, `this.pathname` is
	* derived from it so locale/param resolution match the route pattern.
	*/
	#domainPathname;
	/** Memoized current locale. */
	#currentLocale;
	/** Memoized preferred locale. */
	#preferredLocale;
	/** Memoized preferred locale list. */
	#preferredLocaleList;
	constructor(manifest, request, options, hooks) {
		this.manifest = manifest;
		this.logger = getLogger(manifest);
		this.streaming = hooks?.streaming ?? getEnvironment(manifest).defaultStreaming(manifest);
		this.renderError = hooks?.renderError;
		this.logRequest = hooks?.logRequest;
		this.request = request;
		options ??= getRenderOptions(request);
		this.routeData = options?.routeData;
		const self = this;
		this.renderOptions = {
			...options ?? {
				addCookieHeader: false,
				clientAddress: void 0,
				prerenderedErrorPageFetch: fetch,
				routeData: void 0,
				waitUntil: void 0
			},
			get locals() {
				return self.locals;
			}
		};
		this.componentInstance = void 0;
		this.slots = void 0;
		const url = new URL(request.url);
		const publicPathname = this.#normalizePathname(url.pathname);
		const pathname = this.#computePathname(publicPathname);
		setPathname(url, publicPathname);
		setPathname(url, collapseDuplicateSlashes(url.pathname));
		const domainPathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, manifest.allowedDomains, this.logger, pathname);
		if (domainPathname) {
			this.#domainPathname = domainPathname;
			this.pathname = domainPathname;
		} else this.pathname = pathname;
		this.timeStart = performance.now();
		this.clientAddress = options?.clientAddress;
		this.locals = options?.locals ?? {};
		this.url = url;
		this.cookies = new AstroCookies(request, this.logger);
		if (manifest.allowedDomains && manifest.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
		if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, manifest.trailingSlash, manifest.buildFormat);
		this.#resolveRouteData();
	}
	/**
	* Triggers a rewrite. Delegates to the rewrites handler module.
	*/
	rewrite(payload) {
		return executeRewrite(this, payload);
	}
	/**
	* Creates the SSR result for the current page render.
	*/
	async createResult(mod, ctx) {
		const manifest = this.manifest;
		const env = getEnvironment(manifest);
		const { clientDirectives, inlinedScripts, compressHTML } = manifest;
		const renderers = env.getRenderers(manifest);
		const resolve = (specifier) => env.resolve(manifest, specifier);
		const routeData = this.routeData;
		const { links, scripts, styles } = await env.headElements(manifest, routeData);
		const extraStyleHashes = [];
		const extraScriptHashes = [];
		const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
		const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
		if (shouldInjectCspMetaTags) {
			for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
			for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
		}
		const componentMetadata = await env.componentMetadata(manifest, routeData) ?? manifest.componentMetadata;
		const headers = new Headers({ "Content-Type": "text/html" });
		const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
		const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
		const status = this.status;
		const response = {
			status: actionResult?.error ? actionResult?.error.status : status,
			statusText: actionResult?.error ? actionResult?.error.type : "OK",
			get headers() {
				return headers;
			},
			set headers(_) {
				throw new AstroError(AstroResponseHeadersReassigned);
			}
		};
		const state = this;
		const result = {
			base: manifest.base,
			userAssetsBase: manifest.userAssetsBase,
			cancelled: false,
			clientDirectives,
			inlinedScripts,
			componentMetadata,
			compressHTML,
			cookies: this.cookies,
			createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
			links,
			params: this.params,
			partial,
			pathname: this.pathname,
			renderers,
			resolve,
			response,
			request: this.request,
			scripts,
			styles,
			actionResult,
			async getServerIslandNameMap() {
				return (await getServerIslands(manifest)).serverIslandNameMap ?? /* @__PURE__ */ new Map();
			},
			key: manifest.key,
			trailingSlash: manifest.trailingSlash,
			_metadata: {
				hasHydrationScript: false,
				rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
				hasRenderedHead: false,
				renderedScripts: /* @__PURE__ */ new Set(),
				hasDirectives: /* @__PURE__ */ new Set(),
				hasRenderedServerIslandRuntime: false,
				headInTree: false,
				extraHead: [],
				extraStyleHashes,
				extraScriptHashes,
				propagators: /* @__PURE__ */ new Set(),
				routeHasPropagation: false,
				pendingSlotEvaluations: [],
				templateDepth: 0
			},
			cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
			shouldInjectCspMetaTags,
			cspAlgorithm,
			directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
			scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
			scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
			styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
			styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
			isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
			scriptDirective: {
				resources: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.resources] : [],
				hashes: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.hashes] : [],
				strictDynamic: manifest.csp?.scriptDirective?.strictDynamic ?? false
			},
			styleDirective: {
				resources: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.resources] : [],
				hashes: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.hashes] : []
			},
			speculationRulesContent: manifest.csp?.speculationRulesContent,
			internalFetchHeaders: manifest.internalFetchHeaders
		};
		this.result = result;
		return result;
	}
	/**
	* Creates the Astro global object for a component render.
	*/
	createAstro(result, props, slotValues, apiContext) {
		let astroPagePartial;
		if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
		this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
		astroPagePartial = this.#astroPagePartial;
		const Astro = Object.assign(Object.create(astroPagePartial), {
			props,
			self: null
		});
		Object.defineProperty(Astro, slotValuesSymbol, {
			value: slotValues,
			writable: true,
			configurable: true,
			enumerable: false
		});
		return Astro;
	}
	/**
	* Creates the Astro page-level partial (prototype for Astro global).
	*/
	createAstroPagePartial(result, apiContext) {
		const state = this;
		const { cookies, locals, params, logger, url } = this;
		const { response } = result;
		const redirect = (path, status = 302) => {
			if (state.request[responseSentSymbol$1]) throw new AstroError({ ...ResponseSentError });
			return new Response(null, {
				status,
				headers: { Location: path }
			});
		};
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		const callAction = createCallAction(apiContext);
		const partial = {
			generator: ASTRO_GENERATOR,
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			cookies,
			get slots() {
				const slotsByAstro = result._metadata.slotsByAstro ??= /* @__PURE__ */ new WeakMap();
				let slots = slotsByAstro.get(this);
				if (slots === void 0) {
					slots = new Slots(result, this[slotValuesSymbol] ?? null, logger);
					slotsByAstro.set(this, slots);
				}
				return slots;
			},
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			locals,
			redirect,
			rewrite,
			request: this.request,
			response,
			site: getSite(this.manifest),
			getActionResult: createGetActionResult(locals),
			get callAction() {
				return callAction;
			},
			url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(logger);
			}
		};
		this.defineProviderGetters(partial);
		return partial;
	}
	getClientAddress() {
		const { clientAddress } = this;
		const routeData = this.routeData;
		if (routeData.prerender) throw new AstroError({
			...PrerenderClientAddressNotAvailable,
			message: PrerenderClientAddressNotAvailable.message(routeData.component)
		});
		if (clientAddress) return clientAddress;
		if (this.manifest.adapterName) throw new AstroError({
			...ClientAddressNotAvailable,
			message: ClientAddressNotAvailable.message(this.manifest.adapterName)
		});
		throw new AstroError(StaticClientAddressNotAvailable);
	}
	getCookies() {
		return this.cookies;
	}
	getCsp() {
		const state = this;
		if (!this.manifest.csp) {
			if (getEnvironment(this.manifest).runtimeMode === "production") this.logger.warn("csp", `context.csp was used when rendering the route ${colors.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
			return;
		}
		const warnedFallback = /* @__PURE__ */ new Set();
		const warnFallback = (family, kind) => {
			if (kind === "default" || !state.result) return;
			const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
			if (defaultResources.length === 0) return;
			const key = `${family}:${kind}`;
			if (warnedFallback.has(key)) return;
			warnedFallback.add(key);
			const general = `${family}-src`;
			const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
			state.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
		};
		return {
			insertDirective(payload) {
				if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
			},
			insertScriptResource(payload) {
				if (!state.result) return;
				warnFallback("script", normalizeCspResourceEntry(payload).kind);
				state.result.scriptDirective.resources.push(payload);
			},
			insertStyleResource(payload) {
				if (!state.result) return;
				warnFallback("style", normalizeCspResourceEntry(payload).kind);
				state.result.styleDirective.resources.push(payload);
			},
			insertStyleHash(payload) {
				state.result?.styleDirective.hashes.push(payload);
			},
			insertScriptHash(payload) {
				state.result?.scriptDirective.hashes.push(payload);
			}
		};
	}
	computeCurrentLocale() {
		const { url, manifest: { i18n }, routeData } = this;
		if (!i18n || !routeData) return;
		const { defaultLocale, locales, strategy } = i18n;
		const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
		if (this.#currentLocale) return this.#currentLocale;
		let computedLocale;
		if (isRouteServerIsland(routeData)) {
			let referer = this.request.headers.get("referer");
			if (referer) {
				if (URL.canParse(referer)) referer = new URL(referer).pathname;
				computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
			}
		} else {
			let pathname = routeData.pathname;
			if (this.#domainPathname) pathname = this.pathname;
			else if (url && !routeData.pattern.test(url.pathname)) {
				for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
					pathname = fallbackRoute.pathname;
					break;
				}
			}
			pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
			computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
			if (routeData.params.length > 0) {
				const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
				if (localeFromParams) computedLocale = localeFromParams;
			}
		}
		this.#currentLocale = computedLocale ?? fallbackTo;
		return this.#currentLocale;
	}
	computePreferredLocale() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
	}
	computePreferredLocaleList() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
	}
	/**
	* Lazily loads the route's component module. Returns the cached
	* instance if already loaded. The promise is cached so concurrent
	* callers share the same load.
	*/
	async loadComponentInstance() {
		if (this.componentInstance) return this.componentInstance;
		if (this.#componentInstancePromise) return this.#componentInstancePromise;
		this.#componentInstancePromise = getEnvironment(this.manifest).getComponentByRoute(this.manifest, this.routeData).then((mod) => {
			this.componentInstance = mod;
			return mod;
		});
		return this.#componentInstancePromise;
	}
	/**
	* Registers a context provider under the given key. Handlers call
	* this to contribute values to the request context (e.g. sessions).
	* The `create` factory is called lazily on the first `resolve(key)`.
	*/
	provide(key, provider) {
		(this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
	}
	/**
	* Lazily resolves a provider registered under `key`. Calls
	* `provider.create()` on first access and caches the result.
	* Returns `undefined` if no provider was registered for the key.
	*/
	resolve(key) {
		if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
		const provider = this.#providers?.get(key);
		if (!provider) return void 0;
		const value = provider.create();
		(this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
		return value;
	}
	/**
	* Runs all registered `finalize` callbacks. Should be called after
	* the response is produced, typically in a `finally` block.
	*
	* Returns synchronously (no promise allocation) when nothing needs
	* finalizing — important for the hot path where sessions are not used.
	*/
	finalizeAll() {
		if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
		let chain;
		for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
			const result = provider.finalize(this.#providersResolvedValues.get(key));
			if (result) chain = chain ? chain.then(() => result) : result;
		}
		return chain;
	}
	/**
	* Adds lazy getters to `target` for each registered provider key.
	* Used by context creation (APIContext, Astro global) so that
	* provider values like `session` and `cache` appear as properties
	* without hard-coding the keys.
	*
	* Always defines a `session` getter (returning `undefined` when no
	* provider is registered) so `ctx.session` / `Astro.session` is a
	* present property regardless of whether the sessions handler was
	* included in the pipeline.
	*/
	defineProviderGetters(target) {
		const state = this;
		if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
			get: () => state.resolve(key),
			enumerable: true,
			configurable: true
		});
		if (!this.#providers?.has("session")) {
			let warned = false;
			Object.defineProperty(target, "session", {
				get() {
					if (!warned) {
						warned = true;
						state.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
					}
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	/**
	* Resolves the route to use for this request and stores it on
	* `this.routeData`. If the adapter (or the dev server) provided a
	* `routeData` via render options it's already set and this is a
	* no-op. Otherwise we use the app's synchronous route matcher and
	* fall back to a `404.astro` route so middleware can still run.
	*
	* Called eagerly from the constructor so individual handlers
	* (actions, pages, middleware, etc.) always see a resolved route
	* without the caller needing an extra setup step.
	*
	* Once routeData is known, finalizes `this.pathname`: in dev, if the
	* matched route has no `.html` extension, strip `.html` / `/index.html`
	* suffixes so the rendering pipeline sees the canonical pathname.
	*/
	/**
	* Strip `.html` / `/index.html` suffixes from the pathname so the
	* rendering pipeline sees the canonical route path. Only applies to
	* page routes where `.html` is framework-injected. Endpoint routes
	* preserve `.html` because any such suffix is user-provided (e.g.
	* from `getStaticPaths` params). Skipped when the matched route
	* itself has an `.html` extension in its definition.
	*/
	#stripHtmlExtension() {
		if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
			const original = this.pathname;
			this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
			if (this.manifest.trailingSlash === "always" && this.pathname !== "" && !this.pathname.endsWith("/")) this.pathname += "/";
			if (this.pathname !== original && this.routeData.pattern.test(original) && !this.routeData.pattern.test(this.pathname)) this.pathname = original;
		}
	}
	#resolveRouteData() {
		if (this.routeData) {
			this.#stripHtmlExtension();
			return;
		}
		const matched = matchRoute(this.manifest, this.pathname);
		if (matched && matched.prerender && this.manifest.serverLike) {
			if (matched.params.length > 0) {
				const allMatches = matchAllRoutes(this.manifest, this.pathname);
				this.routeData = allMatches.find((r) => !r.prerender);
			} else this.routeData = void 0;
		} else this.routeData = matched;
		this.logger.debug("router", "Astro matched the following route for " + this.request.url);
		this.logger.debug("router", "RouteData:\n" + this.routeData);
		if (!this.routeData) {
			const custom404 = getCustom404Route(getRouteTable(this.manifest));
			if (custom404 && !custom404.prerender) this.routeData = custom404;
		}
		if (!this.routeData) {
			this.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
			this.logger.debug("router", "Here's the available routes:\n", getRouteTable(this.manifest));
			return;
		}
		this.#stripHtmlExtension();
	}
	/**
	* Strips the manifest's base from a normalized request pathname and prepends
	* a forward slash.
	*
	* Mirrors `BaseApp.removeBase`: the router matches against this stripped path
	* while middleware reads the un-stripped `context.url.pathname`, so both must
	* strip the base identically.
	*/
	#computePathname(normalizedPathname) {
		return prependForwardSlash(stripRequestBase(normalizedPathname, this.manifest.base));
	}
	/**
	* Decodes and normalizes the public request pathname before deriving the
	* separate pathname used for route matching.
	*/
	#normalizePathname(pathname) {
		try {
			pathname = validateAndDecodePathname(pathname);
		} catch (e) {
			if (e instanceof MultiLevelEncodingError) this.invalidEncoding = true;
			else this.logger.error(null, e.toString());
		}
		return collapseDuplicateSlashes(pathname);
	}
	/**
	* Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
	* from the request headers, validates them against the manifest's
	* `allowedDomains`, and updates `this.url` accordingly. Also resolves
	* `clientAddress` from X-Forwarded-For when the host is trusted.
	*
	* Only called when `allowedDomains` is configured — without it,
	* forwarded headers are never trusted.
	*/
	#applyForwardedHeaders() {
		const headers = this.request.headers;
		const allowedDomains = this.manifest.allowedDomains;
		const validated = validateForwardedHeaders(getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
		if (!validated.protocol && !validated.host && !validated.port) return;
		if (validated.protocol) this.url.protocol = validated.protocol + ":";
		if (validated.host) {
			const colonIdx = validated.host.indexOf(":");
			if (colonIdx !== -1) {
				this.url.hostname = validated.host.slice(0, colonIdx);
				this.url.port = validated.host.slice(colonIdx + 1);
			} else {
				this.url.hostname = validated.host;
				this.url.port = "";
			}
		}
		if (validated.port) this.url.port = validated.port;
		if (validated.host !== void 0 && !this.clientAddress) {
			const forwardedFor = getFirstForwardedValue(this.request.headers.get("x-forwarded-for") ?? void 0);
			if (forwardedFor) this.clientAddress = forwardedFor;
		}
		this.request = new Request(this.url, this.request);
	}
	/**
	* Returns the resolved `props` for this render, computing them lazily
	* from the route + component module on first access. If the
	* `initialProps` already carries user-supplied props (e.g. the
	* container API) those are used verbatim.
	*/
	async getProps() {
		if (this.props !== null) return this.props;
		if (Object.keys(this.initialProps).length > 0) {
			this.props = this.initialProps;
			return this.props;
		}
		const mod = await this.loadComponentInstance();
		this.props = await getProps({
			mod,
			routeData: this.routeData,
			routeCache: getRouteCache(this.manifest),
			pathname: this.pathname,
			logger: this.logger,
			serverLike: this.manifest.serverLike,
			base: this.manifest.base,
			trailingSlash: this.manifest.trailingSlash
		});
		return this.props;
	}
	/**
	* Returns the `ActionAPIContext` for this render, creating it lazily.
	* Used by middleware, actions, and page dispatch.
	*/
	getActionAPIContext() {
		if (this.actionApiContext !== null) return this.actionApiContext;
		const state = this;
		const ctx = {
			get cookies() {
				return state.cookies;
			},
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			generator: ASTRO_GENERATOR,
			get locals() {
				return state.locals;
			},
			set locals(_) {
				throw new AstroError(LocalsReassigned);
			},
			params: this.params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			request: this.request,
			site: getSite(this.manifest),
			url: this.url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(state.logger);
			}
		};
		this.defineProviderGetters(ctx);
		this.actionApiContext = ctx;
		return this.actionApiContext;
	}
	/**
	* Returns the `APIContext` for this render, creating it lazily from
	* the memoized props + action context.
	*
	* Called before `getProps()` has resolved, the context carries
	* `props: null` and is not memoized; the next call after `getProps()`
	* fills in `props` on the same object. Callers that read `props`
	* must await `getProps()` first.
	*/
	getAPIContext() {
		if (this.apiContext !== null) return this.apiContext;
		const actionApiContext = this.getActionAPIContext();
		const state = this;
		const redirect = (path, status = 302) => new Response(null, {
			status,
			headers: { Location: path }
		});
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		actionApiContext[fetchStateSymbol] = this;
		const apiContext = Object.assign(actionApiContext, {
			props: this.props,
			redirect,
			rewrite,
			getActionResult: createGetActionResult(actionApiContext.locals),
			callAction: createCallAction(actionApiContext)
		});
		if (this.props !== null) this.apiContext = apiContext;
		return apiContext;
	}
	/**
	* Invalidates the cached `APIContext` so the next `getAPIContext()`
	* call re-derives it from the (possibly mutated) state. Used
	* after an in-flight rewrite swaps the route / request / params.
	*/
	invalidateContexts() {
		this.props = null;
		this.actionApiContext = null;
		this.apiContext = null;
	}
	resetResponseMetadata() {
		this.responseRouteType = void 0;
		this.skipErrorReroute = false;
	}
};
// node_modules/.pnpm/@astrojs+internal-helpers@0.13.0/node_modules/@astrojs/internal-helpers/dist/object.js
/**
* Keys that must be rejected when traversing object paths (e.g. dot-separated
* property lookups) to prevent prototype-pollution attacks.
*/
var FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/noop-actions.js
var NOOP_ACTIONS_MOD = { server: {} };
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/load.js
var actionsMemo = createAsyncManifestMemo(async (manifest) => manifest.actions ? await manifest.actions() : NOOP_ACTIONS_MOD);
/** Resolves the actions module from the manifest (a no-op module when none). */
function getActions(manifest) {
	return actionsMemo.get(manifest);
}
/** Looks up a single action handler by its dot-separated path. */
async function getAction(manifest, path) {
	const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
	let { server } = await getActions(manifest);
	if (!server || !(typeof server === "object")) throw new TypeError(`Expected \`server\` export in actions file to be an object. Received ${typeof server}.`);
	for (const key of pathKeys) {
		if (typeof server === "function") throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (FORBIDDEN_PATH_KEYS.has(key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (!Object.hasOwn(server, key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		server = server[key];
	}
	if (typeof server !== "function") throw new TypeError(`Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`);
	return server;
}
// node_modules/.pnpm/astro@7.4.2_@netlify+blobs@11.1.6_@types+node@26.6.5_@vercel+functions@3.10.2_ws@8.22.0_8d817693514efed187e12269f0a1cdba/node_modules/astro/dist/actions/runtime/server.js
/**
* Access information about Action requests from middleware.
*/
function getActionContext(context) {
	const callerInfo = getCallerInfo(context);
	const actionResultAlreadySet = Boolean(context.locals._actionPayload);
	let action = void 0;
	if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
		calledFrom: callerInfo.from,
		name: callerInfo.name,
		handler: async () => {
			const { manifest } = getFetchStateFromAPIContext(context);
			const callerInfoName = shouldAppendForwardSlash(manifest.trailingSlash, manifest.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
			let baseAction;
			try {
				baseAction = await getAction(manifest, callerInfoName);
			} catch (error) {
				if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				if (error instanceof URIError) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				throw error;
			}
			const bodySizeLimit = manifest.actionBodySizeLimit;
			let input;
			try {
				input = await parseRequestBody(context.request, bodySizeLimit);
			} catch (e) {
				if (e instanceof ActionError) return {
					data: void 0,
					error: e
				};
				if (e instanceof TypeError) return {
					data: void 0,
					error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
				};
				if (e instanceof SyntaxError) return {
					data: void 0,
					error: new ActionError({
						code: "BAD_REQUEST",
						message: "Invalid JSON request body"
					})
				};
				throw e;
			}
			const omitKeys = [
				"props",
				"getActionResult",
				"callAction",
				"redirect"
			];
			const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
			Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
			return baseAction.bind(actionAPIContext)(input);
		}
	};
	function setActionResult(actionName, actionResult) {
		context.locals._actionPayload = {
			actionResult,
			actionName
		};
	}
	return {
		action,
		setActionResult,
		serializeActionResult,
		deserializeActionResult
	};
}
function getCallerInfo(ctx) {
	if (ctx.routePattern === "/_actions/[...path]") return {
		from: "rpc",
		name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
	};
	const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
	if (queryParam) return {
		from: "form",
		name: queryParam
	};
}
async function parseRequestBody(request, bodySizeLimit) {
	const contentType = request.headers.get("content-type");
	const contentLengthHeader = request.headers.get("content-length");
	const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
	const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
	if (!contentType) return void 0;
	if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
		code: "CONTENT_TOO_LARGE",
		message: `Request body exceeds ${bodySizeLimit} bytes`
	});
	try {
		if (hasContentType(contentType, formContentTypes)) {
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				return await new Request(request.url, {
					method: request.method,
					headers: request.headers,
					body: toArrayBuffer(body)
				}).formData();
			}
			return await request.clone().formData();
		}
		if (hasContentType(contentType, ["application/json"])) {
			if (contentLength === 0) return void 0;
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				if (body.byteLength === 0) return void 0;
				return JSON.parse(new TextDecoder().decode(body));
			}
			return await request.clone().json();
		}
	} catch (e) {
		if (e instanceof BodySizeLimitError) throw new ActionError({
			code: "CONTENT_TOO_LARGE",
			message: `Request body exceeds ${bodySizeLimit} bytes`
		});
		throw e;
	}
	throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = Symbol.for("astro.actionAPIContext");
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
	const type = contentType.split(";")[0].toLowerCase();
	return expected.some((t) => type === t);
}
function serializeActionResult(res) {
	if (res.error) {
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, {})?.DEV) actionResultErrorStack.set(res.error.stack);
		let body;
		if (res.error instanceof ActionInputError) body = {
			type: res.error.type,
			issues: res.error.issues,
			fields: res.error.fields
		};
		else body = {
			...res.error,
			message: res.error.message
		};
		return {
			type: "error",
			status: res.error.status,
			contentType: "application/json",
			body: JSON.stringify(body)
		};
	}
	if (res.data === void 0) return {
		type: "empty",
		status: 204
	};
	let body;
	try {
		body = stringify(res.data, { URL: (value) => value instanceof URL && value.href });
	} catch (e) {
		let hint = ActionsReturnedInvalidDataError.hint;
		if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
		throw new AstroError({
			...ActionsReturnedInvalidDataError,
			message: ActionsReturnedInvalidDataError.message(String(e)),
			hint
		});
	}
	return {
		type: "data",
		status: 200,
		contentType: "application/json+devalue",
		body
	};
}
function toArrayBuffer(buffer) {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}
export { ASTRO_ERROR_HEADER as $, renderComponent as A, getSetCookiesFromResponse as B, getEnvironment as C, createConsoleLogger as D, getResolvedLogger as E, addAttribute as F, isInternalPath as G, collapseDuplicateTrailingSlashes as H, unescapeHTML as I, prependForwardSlash as J, isRemotePath as K, getAssetsPrefix as L, renderTemplate as M, maybeRenderHead as N, AstroIntegrationLogger as O, renderHead as P, stripRequestBase as Q, getDefaultStatusCode as R, getRouteGenerator as S, getLogger as T, fileExtension as U, appendForwardSlash as V, hasFileExtension as W, removeQueryString as X, removeBase as Y, removeTrailingForwardSlash as Z, updateRouteTable as _, handleMiddleware as a, getUsedFeatures as at, finalizeI18n as b, renderErrorPage as c, isForbiddenCrossOriginRequest as ct, provideSession as d, setRenderOptions as dt, ASTRO_GENERATOR as et, handleCache as f, getAmbientManifest as ft, matchRoute as g, matchAllRoutes as h, computePathnameFromDomain as i, FetchFeatures as it, renderSlot as j, spreadAttributes as k, isRemoteAllowed as l, defineMiddleware as lt, getRouteTable as m, serializeActionResult as n, clientAddressSymbol as nt, sequence as o, markFeatureUsed as ot, provideCache as p, manifest as pt, joinPaths as q, FetchState as r, ALL_FETCH_FEATURES as rt, renderErrorFromState as s, createCrossOriginForbiddenResponse as st, getActionContext as t, REROUTABLE_STATUS_CODES as tt, matchPattern as u, getRenderOptions as ut, handlePages as v, validateAndDecodePathname as w, getI18n as x, prepareResponse as y, isRoute3xx as z };
