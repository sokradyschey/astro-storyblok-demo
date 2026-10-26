import camelCase from "camelcase";
import "morphdom";
import { apiPlugin, storyblokEditable, storyblokInit } from "@storyblok/js";
/**
* Returns the Storyblok API client instance.
*
* This function gives you access to the `StoryblokClient` that is initialized
* when setting up the Storyblok SDK in your Astro configuration.
*
* @throws {Error} If the `storyblokApiInstance` has not been initialized in Astro config.
* @returns {StoryblokClient} The initialized Storyblok API client instance.
*
* @example
* ```ts
* // In an Astro route or integration code:
* const storyblokApi = useStoryblokApi();
* const { data } = await storyblokApi.get('cdn/stories/home');
* ```
*/
function useStoryblokApi() {
	if (!globalThis?.storyblokApiInstance) throw new Error("storyblokApiInstance has not been initialized correctly");
	return globalThis.storyblokApiInstance;
}
/**
* Retrieves the live Storyblok story and server data from Astro's `locals` during preview mode.
*
* This function is primarily useful when working with the Storyblok Visual Editor
* and live preview updates in an Astro project.
*
* @template ServerData - The type of server data, constrained to StoryblokServerData
* @template Story - The type of story data, constrained to ISbStoryData
* @param {object} params - The function parameters
* @param {object} params.locals - The Astro locals object
* @returns {Promise<{ story?: Story; serverData?: ServerData }>} An object containing the story and serverData if available
*
* @example
* ```ts
* // Basic usage:
* const payload = await getPayload({ locals: Astro.locals });
* const story = payload.story ?? null;
*
* // With typed server data:
* interface ServerData {
*   users?: User[];
* }
*
* interface MyStory extends ISbStoryData {
*   content: { myField: string };
* }
*
* const payload = await getPayload<ServerData, MyStory>({ locals: Astro.locals });
* const story = payload.story ?? null;
* const users = payload.serverData?.users ?? [];
* ```
*/
async function getPayload({ locals }) {
	const { story, serverData } = locals._storyblok_preview_data || {};
	return {
		story,
		serverData
	};
}
function toCamelCase(str) {
	return camelCase(str);
}
/**
* Required query parameters that must be present in all Storyblok Visual Editor requests.
*/
var REQUIRED_STORYBLOK_PARAMS = [
	"_storyblok",
	"_storyblok_c",
	"_storyblok_tk[space_id]"
];
/**
* Validates whether a given URL is a legitimate request from the Storyblok Visual Editor.
*
* This function performs a multi-layered validation to ensure the request originates from
* the Storyblok Visual Editor by checking for required query parameters and optionally
* validating the space ID.
* @param url - The URL object to validate.
* @param options - Optional validation configuration.
* @param options.spaceId - If provided, validates that the request's space ID matches this value.
*
* @returns `true` if the URL contains all required Storyblok Visual Editor parameters
*          and passes optional space ID validation; `false` otherwise.
*
* @example
* ```typescript
* const url = new URL('https://example.com/?_storyblok=123&_storyblok_c=456&_storyblok_tk[space_id]=789');
*
* // Basic validation
* if (isEditorRequest(url)) {
*   console.log('Valid Storyblok editor request');
* }
*
* // Validation with space ID check
* if (isEditorRequest(url, { spaceId: '789' })) {
*   console.log('Valid request for specific space');
* }
* ```
* @todo Move this to `@storyblok/live-preview` to keep live preview logic centralized.
*/
function isEditorRequest(url, options) {
	const params = url.searchParams;
	if (!REQUIRED_STORYBLOK_PARAMS.every((param) => params.has(param))) return false;
	if (options?.spaceId && params.get("_storyblok_tk[space_id]") !== options.spaceId) return false;
	return true;
}
export { storyblokInit as a, storyblokEditable as i, getPayload as n, toCamelCase as o, isEditorRequest as r, useStoryblokApi as s, apiPlugin as t };
