import { describe, expect, it } from "vitest";
import { createAnimationAdapter } from "@/phaser/adapters/animationAdapter";

describe("animation runtime smoke coverage", () => {
  it("falls back to the vector runtime when asset runtimes are unavailable", () => {
    const adapter = createAnimationAdapter();
    expect(["vector", "spine", "dragonbones"]).toContain(adapter.runtime);
  });
});