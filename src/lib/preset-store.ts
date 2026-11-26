"use client";

import type {
  PlaygroundSnapshotRecord,
  ThemePresetRecord,
} from "@/lib/presets";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PresetStoreState {
  customPresets: ThemePresetRecord[];
  snapshots: PlaygroundSnapshotRecord[];
  addCustomPreset: (preset: ThemePresetRecord) => void;
  addSnapshot: (
    snapshot: Omit<PlaygroundSnapshotRecord, "id" | "createdAt">,
  ) => PlaygroundSnapshotRecord;
}

export const usePresetStore = create<PresetStoreState>()(
  persist(
    (set) => ({
      customPresets: [],
      snapshots: [],
      addCustomPreset: (preset) =>
        set((state) => ({
          customPresets: state.customPresets.some((p) => p.slug === preset.slug)
            ? state.customPresets.map((p) =>
                p.slug === preset.slug ? preset : p,
              )
            : [...state.customPresets, preset],
        })),
      addSnapshot: (input) => {
        const record: PlaygroundSnapshotRecord = {
          ...input,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          snapshots: [record, ...state.snapshots].slice(0, 20),
        }));
        return record;
      },
    }),
    {
      name: "forge-ui-local-store",
    },
  ),
);
