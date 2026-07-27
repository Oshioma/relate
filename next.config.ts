import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Plant ID posts the photo straight to a Server Action (see
      // plant-id-panel.tsx), which validates it at 5MB. Server Actions default
      // to a 1MB request-body cap, so without this a normal phone photo is
      // rejected by the framework before the action runs. Leave headroom above
      // 5MB for multipart boundaries and the other form fields.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
