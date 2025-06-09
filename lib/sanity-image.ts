import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "@/app/sanity/client";

const builder = imageUrlBuilder(client);

export function urlForImage(source: Image) {
  return builder.image(source);
}
