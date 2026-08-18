import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "image.pollinations.ai",
      },
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
