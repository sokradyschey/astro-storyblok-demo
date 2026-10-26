import { n as createComponent, r as __exportAll } from "./compiler_sJrg8zXo.mjs";
import { A as renderComponent, M as renderTemplate } from "./server_Dl6dlGyj.mjs";
import { s as useStoryblokApi } from "./dist_BeY9ae4X.mjs";
import { n as $$StoryblokComponent, t as $$Layout } from "./Layout_v2PeIenN.mjs";
// src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const { data } = await useStoryblokApi().get("cdn/stories/home", { version: "draft" });
	const story = data.story;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": story.content })}` })}`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/index.astro", void 0);
var $$file = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/pages/index.astro";
// \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
export { page };
