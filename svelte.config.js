import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    sveltePreprocess({
      less: true,
    }),
  ],
  kit: {
    adapter: adapter(),
  },
};

export default config;
