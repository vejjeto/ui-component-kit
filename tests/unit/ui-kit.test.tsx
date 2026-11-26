import { GET as getHealth } from "@/app/api/health/route";
import { DataTable, type DataTableColumn } from "@/components/forge/DataTable";
import { DropdownMenu } from "@/components/forge/DropdownMenu";
import { Modal } from "@/components/forge/Modal";
import { Tabs } from "@/components/forge/Tabs";
import { contrastRatio, evaluateWcagContrast } from "@/core/wcag";
import {
  formatDisplayDate,
  getCalendarDays,
  parseISODate,
  toISODate,
} from "@/lib/date-utils";
import { fuzzyFilter, fuzzyMatch } from "@/lib/fuzzy";
import { createProblemResponse } from "@/lib/problem-details";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

describe("DropdownMenu keyboard navigation", () => {
  it("supports ArrowDown, ArrowUp, and Escape", () => {
    const onFirst = vi.fn();
    const onSecond = vi.fn();
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir menú</button>}
        groups={[
          {
            items: [
              { id: "first", label: "Editar", onSelect: onFirst },
              { id: "second", label: "Duplicar", onSelect: onSecond },
            ],
          },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(trigger);

    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(2);
    expect(document.activeElement).toBe(items[0]);

    if (items[0]) fireEvent.keyDown(items[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);

    if (items[1]) fireEvent.keyDown(items[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[0]);

    if (items[0]) fireEvent.keyDown(items[0], { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Tabs keyboard switching", () => {
  it("switches tabs with ArrowRight and ArrowLeft", () => {
    render(
      <Tabs
        items={[
          { id: "t1", label: "Resumen", content: <p>Contenido Resumen</p> },
          { id: "t2", label: "Tokens", content: <p>Contenido Tokens</p> },
        ]}
      />,
    );

    const tab1 = screen.getByRole("tab", { name: "Resumen" });
    const tab2 = screen.getByRole("tab", { name: "Tokens" });

    expect(screen.getByText("Contenido Resumen")).toBeTruthy();

    fireEvent.keyDown(tab1, { key: "ArrowRight" });
    expect(screen.getByText("Contenido Tokens")).toBeTruthy();
    expect(tab2.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(tab2, { key: "ArrowLeft" });
    expect(screen.getByText("Contenido Resumen")).toBeTruthy();
    expect(tab1.getAttribute("aria-selected")).toBe("true");
  });
});

describe("Modal Escape & focus trap", () => {
  it("traps Tab focus inside dialog and closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmar acción">
        <button type="button">Acción primaria</button>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();

    const closeBtn = screen.getByRole("button", { name: "Cerrar modal" });
    const actionBtn = screen.getByRole("button", { name: "Acción primaria" });

    actionBtn.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(actionBtn);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("DataTable (TanStack Table v8)", () => {
  interface Row extends Record<string, unknown> {
    id: string;
    name: string;
    latency: number;
  }

  const rows: Row[] = [
    { id: "1", name: "Edge Gateway", latency: 42 },
    { id: "2", name: "Auth Worker", latency: 12 },
    { id: "3", name: "CDN Mirror", latency: 25 },
  ];

  const columns: DataTableColumn<Row>[] = [
    { key: "name", header: "Servicio", sortable: true },
    { key: "latency", header: "Latencia", sortable: true },
  ];

  it("sorts and filters rows", () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        pageSize={5}
      />,
    );

    const latencyHeader = screen.getByRole("button", { name: /Latencia/i });
    fireEvent.click(latencyHeader);
    expect(screen.getAllByRole("row").slice(1)[0]?.textContent).toContain(
      "Edge Gateway",
    );

    fireEvent.click(latencyHeader);
    expect(screen.getAllByRole("row").slice(1)[0]?.textContent).toContain(
      "Auth Worker",
    );

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "CDN" } });
    expect(screen.getAllByRole("row").slice(1)).toHaveLength(1);
    expect(screen.getByText("CDN Mirror")).toBeTruthy();
  });
});

describe("WCAG 2.1 Contrast Ratio", () => {
  it("computes >= 19:1 AAA for #ffffff on #09090b and Fail for low contrast", () => {
    const high = evaluateWcagContrast("#ffffff", "#09090b");
    expect(high.ratio).toBeGreaterThanOrEqual(19);
    expect(high.aaaNormal).toBe(true);
    expect(high.grade).toBe("AAA");

    const low = evaluateWcagContrast("#777777", "#888888");
    expect(low.aaNormal).toBe(false);
    expect(low.grade).toBe("Fail");
    expect(contrastRatio("invalid", "#ffffff")).toBe(0);
  });
});

describe("Utilities & Edge API", () => {
  it("matches fuzzy queries and ranks contiguous matches higher", () => {
    const exact = fuzzyMatch("button", "Button");
    const sub = fuzzyMatch("btn", "Button");
    expect(exact.match).toBe(true);
    expect(sub.match).toBe(true);
    expect(exact.score).toBeGreaterThan(sub.score);

    const filtered = fuzzyFilter(["Button", "Modal", "Tabs"], "mod", (x) => x);
    expect(filtered[0]?.item).toBe("Modal");
  });

  it("parses and formats ISO dates", () => {
    expect(parseISODate("2026-11-25")).toEqual({
      year: 2026,
      month: 10,
      day: 25,
    });
    expect(parseISODate("bad-date")).toBeNull();
    expect(toISODate(2026, 10, 25)).toBe("2026-11-25");
    expect(formatDisplayDate("2026-11-25")).toBe("25 Nov 2026");
    expect(getCalendarDays(2026, 10, "2026-11-25")).toHaveLength(42);
  });

  it("returns stateless /api/health and RFC 7807 Problem Details", async () => {
    const req = new Request("http://localhost:3002/api/health", {
      headers: { "x-request-id": "req-test-123" },
    });
    const healthRes = await getHealth(req);
    expect(healthRes.status).toBe(200);
    expect(healthRes.headers.get("x-request-id")).toBe("req-test-123");
    const healthJson = (await healthRes.json()) as {
      status: string;
      service: string;
      dbLatencyMs: number;
    };
    expect(healthJson.status).toBe("ok");
    expect(healthJson.service).toBe("ui-component-kit");
    expect(healthJson.dbLatencyMs).toBe(0);

    const problemRes = createProblemResponse({
      status: 400,
      title: "Bad Request",
      detail: "Invalid payload",
      requestId: "req-err-1",
    });
    expect(problemRes.status).toBe(400);
    expect(problemRes.headers.get("Content-Type")).toContain(
      "application/problem+json",
    );
    expect(problemRes.headers.get("x-request-id")).toBe("req-err-1");
  });
});
