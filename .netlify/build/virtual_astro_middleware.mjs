import { lt as defineMiddleware, o as sequence } from "./chunks/server_Dl6dlGyj.mjs";
import { r as isEditorRequest } from "./chunks/dist_BeY9ae4X.mjs";
// node_modules/.pnpm/@storyblok+astro@10.3.2_@floating-ui+dom@1.8.0_astro@7.4.2_@netlify+blobs@11.1.6_@types_d695bc4e33d04f081a5c356a09f56c18/node_modules/@storyblok/astro/dist/live-preview/middleware.ts
var onRequest$1 = defineMiddleware(async ({ locals, request }, next) => {
	if (request.method === "POST") {
		if (isEditorRequest(new URL(request.url))) try {
			const requestBody = await request.clone().json();
			if (requestBody?.story?.is_storyblok_preview) locals._storyblok_preview_data = requestBody;
		} catch (error) {
			console.error("Error reading request body:", error);
		}
	}
	return next();
});
// \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
export { onRequest };
