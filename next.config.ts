import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * In development Next only serves its client bundles to origins it trusts. Previews of this
   * app run behind proxy hosts (e.g. *.e2b.app), and without this the page would render but
   * never hydrate — no clicks, no dialogs. Keep the local hosts and allow the preview proxies.
   */
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.e2b.app", "*.e2b.dev", "*.arena.ai"],
};

export default nextConfig;
