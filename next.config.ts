import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * In development Next only serves its client bundles to origins it trusts. Previews of this
   * app run behind proxy hosts (e.g. *.e2b.app), and without this the page would render but
   * never hydrate — no clicks, no dialogs. Keep the local hosts and allow the preview proxies.
   */
  // The MP4 worker is a CLI spawned by the Node API, so keep it in standalone deployments.
  outputFileTracingIncludes: {
    "/api/projects/*/animatic": ["./scripts/neonoire/animatic.mjs", "./scripts/neonoire/voice.mjs", "./scripts/neonoire/plan.mjs", "./scripts/animatic/**", "./docs/neonoire/voice/manifest.json", "./docs/neonoire/music/cues.json"],
  },
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.e2b.app", "*.e2b.dev", "*.arena.ai"],
};

export default nextConfig;
