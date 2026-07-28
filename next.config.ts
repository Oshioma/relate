import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Plant ID posts the photo bytes straight through a Server Action (the
      // space can be public, so guests have no 'uploads' bucket to stage the
      // file in). The action already accepts images up to 5MB
      // (MAX_IMAGE_BYTES in crop-guides-actions.ts), but Next's default Server
      // Action body limit is only 1MB, so a normal phone photo was rejected
      // before the action ran. Raise it past 5MB, leaving room for the extra
      // bytes multipart/form-data adds so the action's own size check is what
      // surfaces an over-limit photo.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
