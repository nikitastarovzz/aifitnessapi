import { getAllPosts } from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";

/**
 * JSON Feed 1.1 for the blog — the same posts `/feed.xml` publishes, in the
 * format a program would rather parse.
 *
 * Why both: RSS is what feed readers speak, but everything else that consumes
 * this site (the answer index, the markdown mirrors, agents) already speaks
 * JSON, and asking a script to pull an XML parser in to read two blog posts is
 * a tax with no upside. Both feeds read `getAllPosts()`, so neither can list a
 * post the other does not.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const posts = getAllPosts();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: site.name,
    home_page_url: site.url,
    feed_url: absoluteUrl("/feed.json"),
    description: site.description,
    language: "en",
    authors: [{ name: site.author.name, url: site.url }],
    items: posts.map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return {
        // JSON Feed wants a permanently stable id and permits any string; the
        // canonical URL is the one identifier this site already treats as
        // stable everywhere else (RSS guid, sitemap, JSON-LD @id).
        id: url,
        url,
        title: post.title,
        summary: post.description,
        // Post dates are plain YYYY-MM-DD. Pin them to UTC midnight rather than
        // letting a parser guess a local zone, and write the offset explicitly
        // because RFC 3339 requires one.
        date_published: `${post.date}T00:00:00Z`,
        ...(post.tags.length ? { tags: post.tags } : {}),
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      // The media type JSON Feed registers for itself; `application/json`
      // would work but tells a client nothing about what it is holding.
      "content-type": "application/feed+json; charset=utf-8",
      link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
    },
  });
}
