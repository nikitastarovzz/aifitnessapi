import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — Awesome Fitness APIs";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Awesome list",
      title: "Awesome Fitness APIs",
      line: "APIs, SDK bridges, MCP servers, open datasets and free tools · generated from sourced data",
    }),
    { ...OG_SIZE },
  );
}
