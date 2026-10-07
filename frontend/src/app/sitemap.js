export default function sitemap() {
  const baseUrl = "https://vehicles.kptmangaluru.in";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}