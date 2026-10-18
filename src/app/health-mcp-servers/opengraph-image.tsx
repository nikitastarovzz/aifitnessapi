import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { MCP_HEALTH_SERVERS, MCP_SERVERS_FETCHED_ON } from "@/data/mcpHealthServers";

/** The count and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "MCP servers for health and fitness data";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "Directory · MCP",
      title: "MCP Servers for Health and Fitness Data",
      line: `${MCP_HEALTH_SERVERS.length} servers from the official MCP Registry · read ${MCP_SERVERS_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
