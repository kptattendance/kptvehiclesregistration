export default function robots() {
  const baseUrl = "https://vehicles.kptmangaluru.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
        ],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}