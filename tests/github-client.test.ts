import { Buffer } from "node:buffer";
import { describe, expect, it } from "vitest";
import { fetchRepositorySnapshot } from "../src/github/client.js";

describe("fetchRepositorySnapshot", () => {
  it("fetches repository metadata, README, releases, tree, and common config files", async () => {
    const readme = "# WidgetKit\n\nTiny widgets.";
    const fetchImpl = async (url: string | URL | Request) => {
      const href = String(url);
      if (href.endsWith("/repos/acme/widgetkit")) {
        return jsonResponse({
          name: "widgetkit",
          full_name: "acme/widgetkit",
          description: "Tiny widgets",
          html_url: "https://github.com/acme/widgetkit",
          homepage: "",
          default_branch: "main",
          stargazers_count: 7,
          topics: ["widgets"],
          language: "TypeScript",
          license: { name: "MIT", spdx_id: "MIT", url: "https://api.github.com/licenses/mit" }
        });
      }

      if (href.endsWith("/repos/acme/widgetkit/readme")) {
        return jsonResponse({
          content: Buffer.from(readme, "utf8").toString("base64"),
          encoding: "base64"
        });
      }

      if (href.endsWith("/repos/acme/widgetkit/releases?per_page=10")) {
        return jsonResponse([
          {
            name: "First",
            tag_name: "v1.0.0",
            html_url: "https://github.com/acme/widgetkit/releases/tag/v1.0.0",
            published_at: "2026-06-16T00:00:00Z",
            body: "Initial release"
          }
        ]);
      }

      if (href.includes("/git/trees/main?recursive=1")) {
        return jsonResponse({
          tree: [
            { path: "package.json", type: "blob", size: 10 },
            { path: "src/index.ts", type: "blob", size: 20 }
          ]
        });
      }

      return jsonResponse({}, 404);
    };

    const snapshot = await fetchRepositorySnapshot("acme/widgetkit", { fetchImpl: fetchImpl as typeof fetch });

    expect(snapshot.metadata).toMatchObject({
      fullName: "acme/widgetkit",
      stars: 7,
      topics: ["widgets"],
      license: { name: "MIT", spdxId: "MIT" }
    });
    expect(snapshot.readme).toBe(readme);
    expect(snapshot.releases).toHaveLength(1);
    expect(snapshot.configFiles).toEqual([{ path: "package.json", type: "blob", size: 10, url: undefined }]);
  });
});

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" }
  });
}
