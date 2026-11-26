import { expect, test } from "@playwright/test";

test("core routes, Shadcn registry, and Edge APIs respond without console or page errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`console.error: ${msg.text()}`);
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/demo");
  await expect(
    page.getByRole("heading", { name: /Live Console Demo/i }),
  ).toBeVisible();

  await page.goto("/docs/button");
  await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
  await expect(page.getByText(/npx shadcn@latest add/i)).toBeVisible();

  const registryRes = await request.get("/r/button.json");
  expect(registryRes.status()).toBe(200);
  const registryJson = (await registryRes.json()) as {
    name: string;
    type: string;
  };
  expect(registryJson.name).toBe("button");
  expect(registryJson.type).toBe("registry:ui");

  const healthRes = await request.get("/api/health");
  expect(healthRes.status()).toBe(200);
  const healthJson = (await healthRes.json()) as {
    status: string;
    service: string;
  };
  expect(healthJson.status).toBe("ok");
  expect(healthJson.service).toBe("ui-component-kit");

  const docsRes = await request.get("/api/docs");
  expect(docsRes.status()).toBe(200);
  expect(await docsRes.text()).toContain("ForgeUI API");

  expect(errors).toEqual([]);
});
