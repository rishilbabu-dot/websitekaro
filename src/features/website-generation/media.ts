/**
 * Industry-aware stock imagery.
 *
 * Every vertical maps to a curated set of royalty-free Unsplash photographs so
 * a gym never renders dental-clinic pictures. When a blueprint carries its own
 * photos (e.g. pulled from a Google Maps listing) those always win.
 */
import type { BusinessBlueprint } from "@/features/businesses";

const CDN = "https://images.unsplash.com/";

/** Validated Unsplash photo ids, first entry is the hero shot. */
const industryPhotos: Record<string, string[]> = {
  dental: ["photo-1629909613654-28e377c37b09", "photo-1598256989800-fe5f95da9787", "photo-1643660526741-094639fbe53a", "photo-1728342057953-94bfad8f0e7e", "photo-1704455306251-b4634215d98f", "photo-1616391182219-e080b4d1043a"],
  doctor: ["photo-1758691461990-03b49d969495", "photo-1758691462123-8a17ae95d203", "photo-1758691461935-202e2ef6b69f", "photo-1758691462878-6edc3d3da1be", "photo-1758691462126-2ee47c8bf9e7", "photo-1758691462858-f1286e5daf40"],
  restaurant: ["photo-1602232037779-30b01ac3c457", "photo-1712630514718-3830cc6c0d0a", "photo-1727352037068-9091d4789738", "photo-1670819917685-f1040e76b9b7", "photo-1633894980059-f6763469cc79", "photo-1571705042748-55feda1cfadc"],
  hotel: ["photo-1590381105924-c72589b9ef3f", "photo-1660557989725-f511e9fa6267", "photo-1692153142524-60285a93c249", "photo-1637730827702-de34e9ae4ede", "photo-1695706807850-8c66b24b3413", "photo-1646991761123-d83ce47c30c9"],
  resort: ["photo-1584132967334-10e028bd69f7", "photo-1596178067639-5c6e68aea6dc", "photo-1581859814481-bfd944e3122f", "photo-1584132869994-873f9363a562", "photo-1645379033960-72d6cb488c0e", "photo-1583522862616-c7c405b9e0ed"],
  banquet: ["photo-1783314867628-220ab03cac99", "photo-1783314863884-be035ed5ed5c", "photo-1717680281618-442cb9c12b6c", "photo-1780337092331-6580fd9ccb47", "photo-1780337092920-1d65e5d09baa", "photo-1780337092608-aad7948d7a60"],
  event: ["photo-1783979384797-7a5d2ad23fc8", "photo-1762968274962-20c12e6e8ecd", "photo-1768396855390-0728fa9c21e1", "photo-1775113586139-b583cc93517f", "photo-1523580494863-6f3031224c94"],
  wedding: ["photo-1587271636175-90d58cdad458", "photo-1587271407850-8d438ca9fdf2", "photo-1469371670807-013ccf25f16a", "photo-1633104502699-b2ecf0fee294", "photo-1680491026542-a99730a0e235", "photo-1756190564669-215843660e93"],
  photographer: ["photo-1611093791822-15086535830b", "photo-1621024994278-e409544f4085", "photo-1628657485319-5865d0f2791d", "photo-1612242879330-cd06b2696e56", "photo-1526707821106-6428ecac1698"],
  decorator: ["photo-1653821355736-0c2598d0a63e", "photo-1653821355692-03666613499f", "photo-1653821355168-144695e5c0e6", "photo-1632528011905-54e2464961f4", "photo-1648297346835-8a7f7dd44528", "photo-1759124650320-d629a3d73d9f"],
  salon: ["photo-1600948836101-f9ffda59d250", "photo-1633681926022-84c23e8cb2d6", "photo-1521590832167-7bcbfaa6381f", "photo-1633681926035-ec1ac984418a", "photo-1675034743339-0b0747047727"],
  gym: ["photo-1534438327276-14e5300c3a48", "photo-1637430308606-86576d8fef3c", "photo-1590487988256-9ed24133863e", "photo-1576678927484-cc907957088c", "photo-1728486145245-d4cb0c9c3470", "photo-1689877020200-403d8542d95d"],
  lawyer: ["photo-1584556326561-c8746083993b", "photo-1775144657626-29ff0a46ca90", "photo-1775144657610-9a6f171e522f", "photo-1775144657566-e5b093073baf"],
  architect: ["photo-1483366774565-c783b9f70e2c", "photo-1624066969616-69b0b0301d4d", "photo-1631454965644-00510875561f", "photo-1661264083807-5e6a54fb12da", "photo-1653164579768-ea97833b3b03", "photo-1653164494885-a8526f62678c"],
  interior: ["photo-1618221195710-dd6b41faaea6", "photo-1618220179428-22790b461013", "photo-1583847268964-b28dc8f51f92", "photo-1586023492125-27b2c045efd7", "photo-1564078516393-cf04bd966897", "photo-1600210491892-03d54c0aaf87"],
  school: ["photo-1577896851231-70ef18881754", "photo-1581726707445-75cbe4efc586", "photo-1578593139939-cccb1e98698c", "photo-1574130303188-31a915382726", "photo-1527822618093-743f3e57977c"],
  coaching: ["photo-1571260899304-425eee4c7efc", "photo-1530099486328-e021101a494a", "photo-1573894999291-f440466112cc", "photo-1668092547528-62bdec358652", "photo-1758270705067-0d7edee57af0"],
  retail: ["photo-1441984904996-e0b6ba687e04", "photo-1441986300917-64674bd600d8", "photo-1511317559916-56d5ddb62563", "photo-1567958451986-2de427a4a0be", "photo-1591085686350-798c0f9faa7f"],
  "home-services": ["photo-1676210133055-eab6ef033ce3", "photo-1660330589693-99889d60181e", "photo-1454988501794-2992f706932e", "photo-1601462904263-f2fa0c851cb9", "photo-1676210134050-6f12c6898395", "photo-1660330590022-9f4ff56b63f6"],
};

const teamPortraits = [
  "photo-1500648767791-00dcc994a43e",
  "photo-1580489944761-15a19d654956",
  "photo-1506863530036-1efeddceb993",
  "photo-1573496359142-b8d87734a5a2",
];

const url = (id: string, w: number, h: number) =>
  id.startsWith("http") || id.startsWith("/")
    ? id
    : `${CDN}${id}?auto=format&fit=crop&q=80&w=${w}&h=${h}`;

/** Photo ids for a vertical, falling back to a neutral set. */
export const industryPhotoIds = (industry: string): string[] =>
  industryPhotos[industry] ?? industryPhotos["retail"]!;

/**
 * A reliable stock fallback for a vertical, used when a sourced image
 * (official website, listing) refuses to load in the browser.
 */
export const stockImageUrl = (industry: string, index: number, w = 1400, h = 1200): string => {
  const pool = industryPhotoIds(industry);
  return url(pool[((index % pool.length) + pool.length) % pool.length]!, w, h);
};

export interface SiteImages {
  hero: string;
  gallery: string[];
  team: string[];
}

/**
 * Resolve the imagery for a generated site. Listing photos on the blueprint
 * (Google Maps / owner uploads) take priority over the industry stock set.
 */
export const siteImages = (data: BusinessBlueprint, galleryCount = 4): SiteImages => {
  const sourced = (data.media ?? []).sort((a, b) => {
    const priority = { owner: 0, website: 1, "google-maps": 2, social: 3, stock: 4, "ai-generated": 5 } as const;
    return priority[a.source] - priority[b.source];
  }).map((photo) => photo.url);
  const own = [...sourced, ...(data.photos ?? [])].filter((value, index, all) => Boolean(value) && all.indexOf(value) === index);
  const stock = industryPhotoIds(data.industry);
  const pool = own.length ? [...own, ...stock] : stock;

  const gallery = Array.from({ length: galleryCount }, (_, i) => url(pool[(i + 1) % pool.length]!, 1200, 1200));

  const team = data.team.map((m, i) =>
    m.photo ? url(m.photo, 900, 1100) : url(teamPortraits[i % teamPortraits.length]!, 900, 1100),
  );

  return { hero: url(pool[0]!, 1600, 1200), gallery, team };
};
