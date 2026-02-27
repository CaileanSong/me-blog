import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

let finalConfig = nextConfig;

if (process.env.NEXT_USE_RSPACK === '1') {
  try {
    // Optional plugin: keep Vercel builds working even when rspack deps are missing.
    const maybePlugin = require('next-rspack');
    const withRspack = (maybePlugin.default ?? maybePlugin) as (config: NextConfig) => NextConfig;
    finalConfig = withRspack(nextConfig);
  } catch {
    finalConfig = nextConfig;
  }
}

export default finalConfig;
