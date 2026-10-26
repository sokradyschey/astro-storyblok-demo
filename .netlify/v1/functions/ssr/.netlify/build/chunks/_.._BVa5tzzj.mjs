import { n as createComponent, r as __exportAll, t as createAstro } from "./compiler_sJrg8zXo.mjs";
import { A as renderComponent, M as renderTemplate } from "./server_Dl6dlGyj.mjs";
import { n as getPayload, s as useStoryblokApi } from "./dist_BeY9ae4X.mjs";
import { n as $$StoryblokComponent, t as $$Layout } from "./Layout_v2PeIenN.mjs";
// src/pages/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Component;
	const { slug } = Astro.params;
	const payload = await getPayload({ locals: Astro.locals });
	const storyblokApi = useStoryblokApi();
	const story = payload?.story ?? (await storyblokApi.get(`cdn/stories/${slug || "home"}`, { version: "draft" })).data.story;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": story.content })}` })}`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/[...slug].astro", void 0);
var $$file = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/[...slug].astro";
var $$url = "/[...slug]";
// \0virtual:astro:page:src/pages/[...slug]@_@astro
var page = () => ____slug__exports;
export { page };
