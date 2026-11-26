import { expect, test } from "@playwright/test";

test.describe("ForgeUI smoke E2E", () => {
  test("renders /, /docs/button, /api/health, and /api/docs with zero console/page errors", async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("ForgeUI Live Console")).toBeVisible();

    await page.goto("/docs/button");
    await expect(
      page.getByRole("heading", { level: 1, name: "Button" }),
    ).toBeVisible();

    const healthRes = await request.get("/api/health");
    expect(healthRes.status()).toBe(200);
    const healthJson = (await healthRes.json()) as {
      status: string;
      service: string;
    };
    expect(healthJson.status).toBe("ok");
    expect(healthJson.service).toBe("forge-ui");

    await page.goto("/api/docs");
    await expect(
      page.getByText("OpenAPI 3.1.0", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("/api/presets").first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
