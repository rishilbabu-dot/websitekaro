import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PlaceResearchResult, VerifiedPlace, VerifiedPlacePhoto } from "./place-research.types";

const inputSchema = z.object({ input: z.string().trim().min(2).max(500) });
const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";
const MAP_HOSTS = new Set(["google.com", "www.google.com", "maps.google.com", "maps.app.goo.gl", "goo.gl"]);

const cleanQuery = (raw: string) => {
  const value = raw.trim();
  if (!/^https?:\/\//i.test(value)) return value;
  try {
    const url = new URL(value);
    if (!MAP_HOSTS.has(url.hostname.toLowerCase())) return value;
    const query = url.searchParams.get("query") ?? url.searchParams.get("q");
    if (query) return query;
    const match = url.pathname.match(/\/place\/([^/]+)/i);
    return match?.[1] ? decodeURIComponent(match[1].replace(/\+/g, " ")) : value;
  } catch {
    return value;
  }
};

const resolveMapsLink = async (raw: string) => {
  if (!/^https?:\/\//i.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (!MAP_HOSTS.has(url.hostname.toLowerCase())) return raw;
    if (url.hostname !== "maps.app.goo.gl" && url.hostname !== "goo.gl") return raw;
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(5_000) });
    return response.url || raw;
  } catch {
    return raw;
  }
};

const parseHours = (descriptions: unknown) => {
  if (!Array.isArray(descriptions)) return [];
  return descriptions.flatMap((entry) => {
    if (typeof entry !== "string") return [];
    const split = entry.indexOf(":");
    return split < 1 ? [] : [{ day: entry.slice(0, split).trim(), open: entry.slice(split + 1).trim() }];
  });
};

const cityFromComponents = (components: unknown, address: string) => {
  if (Array.isArray(components)) {
    for (const component of components) {
      if (!component || typeof component !== "object") continue;
      const row = component as { longText?: unknown; types?: unknown };
      if (Array.isArray(row.types) && row.types.includes("locality") && typeof row.longText === "string") return row.longText;
    }
  }
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length > 2 ? parts[parts.length - 3] ?? "" : "";
};

const fetchPhoto = async (name: string, mapsUrl: string, headers: Record<string, string>, attribution?: string): Promise<VerifiedPlacePhoto | null> => {
  const response = await fetch(`${GATEWAY}/places/v1/${name}/media?maxWidthPx=1600&skipHttpRedirect=true`, { headers });
  if (!response.ok) return null;
  const payload = (await response.json()) as { photoUri?: unknown };
  if (typeof payload.photoUri !== "string") return null;
  return { url: payload.photoUri, sourceUrl: mapsUrl, ...(attribution ? { attribution } : {}) };
};

export const researchGoogleBusiness = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<PlaceResearchResult> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableKey || !mapsKey) return { place: null, notice: "Google business research is unavailable right now." };
    const gatewayHeaders = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": mapsKey };

    try {
      const resolved = await resolveMapsLink(data.input);
      const response = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
        method: "POST",
        headers: {
          ...gatewayHeaders,
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "places.id,places.displayName,places.primaryTypeDisplayName,places.formattedAddress,places.addressComponents,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.regularOpeningHours.weekdayDescriptions,places.rating,places.userRatingCount,places.reviews,places.photos",
        },
        body: JSON.stringify({ textQuery: cleanQuery(resolved), pageSize: 1, languageCode: "en", regionCode: "IN" }),
      });
      if (!response.ok) {
        console.error(`Google Places research failed [${response.status}]: ${await response.text()}`);
        return { place: null, notice: "We couldn't verify this Google business yet. The preview uses unverified draft content." };
      }

      const payload = (await response.json()) as { places?: unknown[] };
      const raw = payload.places?.[0];
      if (!raw || typeof raw !== "object") return { place: null, notice: "No matching Google business was found." };
      const p = raw as Record<string, unknown>;
      const displayName = p["displayName"] as { text?: unknown } | undefined;
      if (typeof p["id"] !== "string" || typeof displayName?.text !== "string") return { place: null, notice: "No matching Google business was found." };

      const mapsUrl = typeof p["googleMapsUri"] === "string" ? p["googleMapsUri"] : resolved;
      const reviews = (Array.isArray(p["reviews"]) ? p["reviews"] : []).flatMap((review, index) => {
        if (!review || typeof review !== "object") return [];
        const row = review as Record<string, unknown>;
        const author = row["authorAttribution"] as { displayName?: unknown } | undefined;
        const text = row["text"] as { text?: unknown } | undefined;
        if (typeof author?.displayName !== "string" || typeof text?.text !== "string" || typeof row["rating"] !== "number") return [];
        return [{ id: `google-review-${index + 1}`, author: author.displayName, rating: row["rating"], text: text.text, source: "Google", date: typeof row["relativePublishTimeDescription"] === "string" ? row["relativePublishTimeDescription"] : "", url: typeof row["googleMapsUri"] === "string" ? row["googleMapsUri"] : mapsUrl, verified: true }];
      });

      const photos = (await Promise.all((Array.isArray(p["photos"]) ? p["photos"] : []).slice(0, 6).map(async (photo) => {
        if (!photo || typeof photo !== "object") return null;
        const row = photo as { name?: unknown; authorAttributions?: unknown };
        if (typeof row.name !== "string") return null;
        const first = Array.isArray(row["authorAttribution"]s) ? row["authorAttribution"]s[0] : undefined;
        const author = first && typeof first === "object" ? first as { displayName?: unknown } : undefined;
        return fetchPhoto(row.name, mapsUrl, gatewayHeaders, typeof author?.displayName === "string" ? author.displayName : undefined);
      }))).filter((photo): photo is VerifiedPlacePhoto => photo !== null);

      const address = typeof p["formattedAddress"] === "string" ? p["formattedAddress"] : "";
      const category = p["primaryTypeDisplayName"] as { text?: unknown } | undefined;
      const location = p["location"] as { latitude?: unknown; longitude?: unknown } | undefined;
      const opening = p["regularOpeningHours"] as { weekdayDescriptions?: unknown } | undefined;
      const verifiedAt = new Date().toISOString();
      const place: VerifiedPlace = {
        placeId: p["id"],
        name: displayName.text,
        category: typeof category?.text === "string" ? category.text : "Local business",
        formattedAddress: address,
        city: cityFromComponents(p["addressComponents"], address),
        phone: typeof p["internationalPhoneNumber"] === "string" ? p["internationalPhoneNumber"] : typeof p["nationalPhoneNumber"] === "string" ? p["nationalPhoneNumber"] : "",
        website: typeof p["websiteUri"] === "string" ? p["websiteUri"] : "",
        mapsUrl,
        ...(typeof location?.latitude === "number" ? { latitude: location.latitude } : {}),
        ...(typeof location?.longitude === "number" ? { longitude: location.longitude } : {}),
        hours: parseHours(opening?.weekdayDescriptions),
        ...(typeof p["rating"] === "number" ? { rating: p["rating"] } : {}),
        ...(typeof p["userRatingCount"] === "number" ? { reviewCount: p["userRatingCount"] } : {}),
        reviews,
        photos,
        verifiedAt,
      };
      return { place };
    } catch (error) {
      console.error("Google business research failed", error);
      return { place: null, notice: "We couldn't verify this Google business yet. The preview uses unverified draft content." };
    }
  });