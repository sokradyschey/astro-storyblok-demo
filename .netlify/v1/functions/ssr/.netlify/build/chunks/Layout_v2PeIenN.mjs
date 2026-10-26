import { n as createComponent, r as __exportAll, t as createAstro } from "./compiler_sJrg8zXo.mjs";
import { A as renderComponent, F as addAttribute, M as renderTemplate, N as maybeRenderHead, P as renderHead, j as renderSlot, k as spreadAttributes } from "./server_Dl6dlGyj.mjs";
import { a as storyblokInit, i as storyblokEditable, o as toCamelCase, s as useStoryblokApi, t as apiPlugin } from "./dist_BeY9ae4X.mjs";
// \0virtual:storyblok-init
var { storyblokApi } = storyblokInit({
	accessToken: "eG0YBWNTN7frIHdUQJosGAtt",
	use: [apiPlugin],
	apiOptions: { "region": "eu" }
});
// astro:scripts/page-ssr.js
globalThis.storyblokApiInstance = storyblokApi;
// \0virtual:storyblok-options
var _virtual_storyblok_options_default = {
	"useCustomApi": false,
	"bridge": true,
	"componentsDir": "src",
	"enableFallbackComponent": false,
	"livePreview": true,
	"accessToken": "eG0YBWNTN7frIHdUQJosGAtt",
	"apiOptions": { "region": "eu" },
	"components": {
		"page": "storyblok/Page",
		"grid": "storyblok/Grid",
		"feature": "storyblok/Feature",
		"teaser": "storyblok/Teaser",
		"header": "storyblok/Header",
		"nav_item": "storyblok/NavItem",
		"hero": "storyblok/Hero"
	}
};
// src/storyblok/Feature.astro
var Feature_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Feature,
	file: () => $$file$6,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Feature = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Feature;
	const { blok } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="feature"${spreadAttributes(storyblokEditable(blok))}><p>${blok.name}</p></section>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Feature.astro", void 0);
var $$file$6 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Feature.astro";
// src/storyblok/Grid.astro
var Grid_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Grid,
	file: () => $$file$5,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Grid = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Grid;
	const { blok } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="grid"${spreadAttributes(storyblokEditable(blok))}>${blok.columns?.map((nestedBlok) => {
		return renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": nestedBlok })}`;
	})}</div>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Grid.astro", void 0);
var $$file$5 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Grid.astro";
// src/components/Header.astro
createAstro("https://astro.build");
var $$Header$1 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header$1;
	const { logo, logoAlt = "Bravia Services", navItems = [], ctaText = "Let's Talk", ctaLink = { cached_url: "contact" } } = Astro.props;
	const currentPath = Astro.url.pathname.replace(/\/+$/, "") || "/";
	function getHref(link) {
		if (!link) return "/";
		if (link.linktype === "url" && link.url) return link.url;
		if (link.cached_url) {
			const path = link.cached_url.replace(/^\/+|\/+$/g, "");
			return !path || path === "home" ? "/" : `/${path}`;
		}
		return link.url || "/";
	}
	return renderTemplate`${maybeRenderHead($$result)}<header class="site-header" data-astro-cid-nen7h5rs><a class="logo" href="/" aria-label="Go to homepage" data-astro-cid-nen7h5rs>${logo?.filename ? renderTemplate`<img${addAttribute(logo.filename, "src")}${addAttribute(logoAlt, "alt")} data-astro-cid-nen7h5rs>` : logoAlt}</a><nav class="desktop-nav" aria-label="Main navigation" data-astro-cid-nen7h5rs>${navItems.map((item) => {
		const href = getHref(item.link);
		const normalizedHref = href.replace(/\/+$/, "") || "/";
		const isActive = currentPath === normalizedHref;
		return renderTemplate`<a${spreadAttributes(storyblokEditable(item))}${addAttribute(href, "href")}${addAttribute(["nav-link", { active: isActive }], "class:list")}${addAttribute(isActive ? "page" : void 0, "aria-current")} data-astro-cid-nen7h5rs>${item.label}</a>`;
	})}</nav><a class="contact-button"${addAttribute(getHref(ctaLink), "href")} data-astro-cid-nen7h5rs>${ctaText}</a><details class="mobile-menu" data-astro-cid-nen7h5rs><summary aria-label="Toggle navigation menu" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs></span><span data-astro-cid-nen7h5rs></span><span data-astro-cid-nen7h5rs></span></summary><nav aria-label="Mobile navigation" data-astro-cid-nen7h5rs>${navItems.map((item) => renderTemplate`<a${spreadAttributes(storyblokEditable(item), void 0, { "class": "astro-nen7h5rs" })}${addAttribute(getHref(item.link), "href")} data-astro-cid-nen7h5rs>${item.label}</a>`)}<a${addAttribute(getHref(ctaLink), "href")} data-astro-cid-nen7h5rs>${ctaText}</a></nav></details></header>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/components/Header.astro", void 0);
// src/storyblok/Header.astro
var Header_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Header,
	file: () => $$file$4,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const { blok } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${spreadAttributes(storyblokEditable(blok))}>${renderComponent($$result, "Header", $$Header$1, {
		"logo": blok.logo,
		"logoAlt": blok.logo_alt || "Bravia Services",
		"navItems": blok.nav_items || [],
		"ctaText": blok.cta_text,
		"ctaLink": blok.cta_link
	})}</div>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Header.astro", void 0);
var $$file$4 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Header.astro";
// src/components/Hero.astro
createAstro("https://astro.build");
var $$Hero$1 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Hero$1;
	const { eyebrow = "Service-Disabled Veteran-Owned Small Business", headlineStart = "The speed of change requires the", emphasizedText = "talent", headlineEnd = "of people.", description = "Talent solutions for today's changing business imperatives, from the hospital floor to the job site.", primaryCtaText = "Contact Us", primaryCtaLink = {
		url: "#contact",
		linktype: "url"
	}, secondaryCtaText = "Why Us", secondaryCtaLink = {
		url: "#why-us",
		linktype: "url"
	}, proofPoints = [
		"Hospitals & health systems",
		"State Medicaid programs",
		"VA medical centers"
	], serviceLines = [
		{
			_uid: "hc",
			code: "HC",
			label: "Healthcare Workforce Solutions",
			link: {
				url: "#healthcare",
				linktype: "url"
			}
		},
		{
			_uid: "cw",
			code: "CW",
			label: "Consulting & Workforce Solutions",
			link: {
				url: "#workforce",
				linktype: "url"
			}
		},
		{
			_uid: "ec",
			code: "EC",
			label: "Engineering & Construction",
			link: {
				url: "#construction",
				linktype: "url"
			}
		},
		{
			_uid: "ps",
			code: "PS",
			label: "Procurement Services",
			link: {
				url: "#procurement",
				linktype: "url"
			}
		}
	], location = "Indianapolis, IN" } = Astro.props;
	function getHref(link) {
		if (!link) return "#";
		const href = link.url || link.cached_url || "#";
		if (href.startsWith("#") || href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
		return `/${href}`;
	}
	return renderTemplate`${maybeRenderHead($$result)}<section class="hero" aria-labelledby="heroTitle" data-astro-cid-ge2uvauf><div class="wrap" data-astro-cid-ge2uvauf><div class="hero__copy" data-astro-cid-ge2uvauf><div class="eyebrow" data-astro-cid-ge2uvauf><span class="star" aria-hidden="true" data-astro-cid-ge2uvauf></span>${eyebrow}</div><h1 id="heroTitle" data-astro-cid-ge2uvauf>${headlineStart} <em data-astro-cid-ge2uvauf>${emphasizedText}</em> ${headlineEnd}</h1><p class="lede" data-astro-cid-ge2uvauf>${description}</p><div class="ctas" data-astro-cid-ge2uvauf><a class="btn btn-red"${addAttribute(getHref(primaryCtaLink), "href")} data-astro-cid-ge2uvauf>${primaryCtaText}</a><a class="btn btn-ghost"${addAttribute(getHref(secondaryCtaLink), "href")} data-astro-cid-ge2uvauf>${secondaryCtaText}</a></div>${proofPoints.length > 0 && renderTemplate`<div class="proof" data-astro-cid-ge2uvauf>${proofPoints.map((point) => renderTemplate`<span data-astro-cid-ge2uvauf>${point}</span>`)}</div>`}</div><aside class="dossier" aria-label="Service lines" data-astro-cid-ge2uvauf><div class="head" data-astro-cid-ge2uvauf><span data-astro-cid-ge2uvauf>Service lines</span><span data-astro-cid-ge2uvauf>${location}</span></div><ol data-astro-cid-ge2uvauf>${serviceLines.map((item, index) => renderTemplate`<li${addAttribute([{ "lead-line": index === 0 }], "class:list")} data-astro-cid-ge2uvauf><a${addAttribute(getHref(item.link), "href")} data-astro-cid-ge2uvauf><span class="k" data-astro-cid-ge2uvauf>${item.code}</span><span class="t" data-astro-cid-ge2uvauf>${item.label}</span><span class="arr" aria-hidden="true" data-astro-cid-ge2uvauf>→</span></a></li>`)}</ol></aside></div><div class="ribbon" aria-hidden="true" data-astro-cid-ge2uvauf></div></section>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/components/Hero.astro", void 0);
// src/storyblok/Hero.astro
var Hero_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Hero,
	file: () => $$file$3,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Hero;
	const { blok } = Astro.props;
	const proofPoints = typeof blok.proof_points === "string" ? blok.proof_points.split("\n").map((point) => point.trim()).filter(Boolean) : [];
	return renderTemplate`${maybeRenderHead($$result)}<div${spreadAttributes(storyblokEditable(blok))}>${renderComponent($$result, "Hero", $$Hero$1, {
		"eyebrow": blok.eyebrow,
		"headlineStart": blok.headline_start,
		"emphasizedText": blok.emphasized_text,
		"headlineEnd": blok.headline_end,
		"description": blok.description,
		"primaryCtaText": blok.primary_cta_text,
		"primaryCtaLink": blok.primary_cta_link,
		"secondaryCtaText": blok.secondary_cta_text,
		"secondaryCtaLink": blok.secondary_cta_link,
		"proofPoints": proofPoints,
		"serviceLines": blok.service_lines || [],
		"location": blok.location
	})}</div>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Hero.astro", void 0);
var $$file$3 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Hero.astro";
// src/storyblok/NavItem.astro
var NavItem_exports = /* @__PURE__ */ __exportAll({
	default: () => $$NavItem,
	file: () => $$file$2,
	url: () => void 0
});
createAstro("https://astro.build");
var $$NavItem = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$NavItem;
	const { blok } = Astro.props;
	const href = blok.link?.cached_url ? `/${blok.link.cached_url.replace(/^\/+/, "")}` : blok.link?.url || "/";
	return renderTemplate`${maybeRenderHead($$result)}<a${spreadAttributes(storyblokEditable(blok))}${addAttribute(href, "href")}>${blok.label}</a>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/NavItem.astro", void 0);
var $$file$2 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/NavItem.astro";
// src/storyblok/Page.astro
var Page_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Page,
	file: () => $$file$1,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Page = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Page;
	const { blok } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<main${spreadAttributes(storyblokEditable(blok))}>${blok.body?.map((nestedBlok) => {
		return renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": nestedBlok })}`;
	})}</main>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Page.astro", void 0);
var $$file$1 = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Page.astro";
// src/storyblok/Teaser.astro
var Teaser_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Teaser,
	file: () => $$file,
	url: () => void 0
});
createAstro("https://astro.build");
var $$Teaser = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Teaser;
	const { blok } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="teaser"${spreadAttributes(storyblokEditable(blok))}><h1>${blok.headline}</h1></section>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Teaser.astro", void 0);
var $$file = "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/storyblok/Teaser.astro";
// \0virtual:import-storyblok-components
var modules = /* #__PURE__ */ Object.assign({
	"/src/storyblok/Feature.astro": Feature_exports,
	"/src/storyblok/Grid.astro": Grid_exports,
	"/src/storyblok/Header.astro": Header_exports,
	"/src/storyblok/Hero.astro": Hero_exports,
	"/src/storyblok/NavItem.astro": NavItem_exports,
	"/src/storyblok/Page.astro": Page_exports,
	"/src/storyblok/Teaser.astro": Teaser_exports
});
var storyblokComponents = {};
var createComponentLoader = (module) => {
	return async () => module?.default ?? module;
};
var registerComponent = (name, component) => {
	Object.defineProperty(storyblokComponents, name, {
		enumerable: true,
		configurable: true,
		get: () => createComponentLoader(component)
	});
};
for (const filePath in modules) {
	const fileName = filePath.split("/").pop();
	const componentName = toCamelCase(fileName?.replace(/\.[^/.]+$/, "") ?? "");
	if (componentName) registerComponent(componentName, modules[filePath]);
}
var __page_wrapper__ = { get default() {
	return $$Page;
} };
var __grid_wrapper__ = { get default() {
	return $$Grid;
} };
var __feature_wrapper__ = { get default() {
	return $$Feature;
} };
var __teaser_wrapper__ = { get default() {
	return $$Teaser;
} };
var __header_wrapper__ = { get default() {
	return $$Header;
} };
var __navItem_wrapper__ = { get default() {
	return $$NavItem;
} };
var __hero_wrapper__ = { get default() {
	return $$Hero;
} };
registerComponent("page", __page_wrapper__);
registerComponent("grid", __grid_wrapper__);
registerComponent("feature", __feature_wrapper__);
registerComponent("teaser", __teaser_wrapper__);
registerComponent("header", __header_wrapper__);
registerComponent("navItem", __navItem_wrapper__);
registerComponent("hero", __hero_wrapper__);
// node_modules/.pnpm/@storyblok+astro@10.3.2_@floating-ui+dom@1.8.0_astro@7.4.2_@netlify+blobs@11.1.6_@types_d695bc4e33d04f081a5c356a09f56c18/node_modules/@storyblok/astro/dist/components/StoryblokComponent.astro
createAstro("https://astro.build");
var $$StoryblokComponent = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$StoryblokComponent;
	const { blok, ...props } = Astro.props;
	if (!blok) throw new Error("Cannot render StoryblokComponent. 'blok' prop is undefined.");
	const loader = storyblokComponents[toCamelCase(blok.component)] || storyblokComponents["FallbackComponent"];
	if (!loader) throw new Error(`No component found for blok "${blok.component}". 
      Make sure the component is:
      • Registered in your astro.config.mjs, or
      • Placed in the "/${_virtual_storyblok_options_default.componentsDir}/storyblok" folder, or
      • Enable the "fallbackComponent" option to handle missing components.`);
	const Component = await loader();
	return renderTemplate`${renderComponent($$result, "Component", Component, {
		"blok": blok,
		...props
	})}`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/node_modules/.pnpm/@storyblok+astro@10.3.2_@floating-ui+dom@1.8.0_astro@7.4.2_@netlify+blobs@11.1.6_@types_d695bc4e33d04f081a5c356a09f56c18/node_modules/@storyblok/astro/dist/components/StoryblokComponent.astro", void 0);
// src/components/Subheader.astro
var $$Subheader = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div id="container"><div class="util" role="complementary" aria-label="Contact and quick links"><div class="wrap"><div class="group"><span>+1 317-742-8123</span><span>darrin.forte@braviaservices.com</span></div><div class="group"><a href="https://braviaservices.com/ecommerce.php">E-Commerce</a><a href="https://braviaservices.com/login.php">Login</a><a href="https://braviaservices.com/india/">India Operations</a><a href="https://www.linkedin.com/company/braviaservices/">LinkedIn</a></div></div></div></div>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/components/Subheader.astro", void 0);
// src/components/Certs.astro
var $$Certs = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="creds"><div class="wrap"><span class="lab">Certified</span><div class="chips"><span class="chip"><span class="star"></span>SBA SDVOSB</span><span class="chip">Disability:IN DOBE</span><span class="chip">NVBDC</span><span class="chip">NaVOBA SDVBE</span><span class="chip">Buy Indiana</span></div></div></div>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/components/Certs.astro", void 0);
// src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<footer class="site"><div class="wrap top"><div><img src="data:image/webp;base64,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" alt="Bravia Services" width="300" height="117"><p class="tagline">Honoring Service. Delivering Opportunity. Making an Impact.</p><div class="fcreds"><span>Service-Disabled Veteran-Owned Small Business (SDVOSB)</span><span>Disability:IN Disability-Owned Business Enterprise (DOBE)</span></div></div><div><h4>Quick links</h4><ul><li><a href="#top">Home</a></li><li><a href="#why-us">About Us</a></li><li><a href="#certifications">Certifications</a></li><li><a href="#contact">Contact Us</a></li></ul></div><div><h4>Our services</h4><ul><li><a href="#healthcare">Healthcare Workforce Solutions</a></li><li><a href="#workforce">Consulting &amp; Workforce Solutions</a></li><li><a href="#construction">Construction Services</a></li><li><a href="#procurement">Procurement</a></li><li><a href="https://braviaservices.com/india/">India Operations</a></li></ul></div><div><h4>Get in touch</h4><ul><li><span><b>Headquarters:</b> Indianapolis, IN</span></li><li><span><b>Branches:</b> New York, NY · Los Angeles, CA · Cincinnati, OH · Hyderabad (India)</span></li><li><span>+1 317-742-8123</span></li><li><span>darrin.forte@braviaservices.com</span></li><li><a href="https://www.linkedin.com/company/braviaservices/">LinkedIn</a></li></ul></div></div><div class="bottom"><div class="wrap"><span>© 2026 Bravia Services</span><span>Indianapolis, Indiana</span></div></div></footer>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/components/Footer.astro", void 0);
// src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Bravia Services" } = Astro.props;
	const { data } = await useStoryblokApi().get("cdn/stories/global-header", { version: "draft" });
	const headerStory = data.story;
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${renderHead($$result)}</head><body>${renderComponent($$result, "Subheader", $$Subheader, {})}${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": headerStory.content })}${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "Certs", $$Certs, {})}${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/Users/sokradychey/Documents/projects/astro-storyblok-demo/src/layouts/Layout.astro", void 0);
export { $$StoryblokComponent as n, $$Layout as t };
