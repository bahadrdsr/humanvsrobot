import { useEffect, useRef } from "react";
import type { RobotActionId, RobotActionStatus } from "@/features/robot-actions/types";

type PhaserCanvasProps = {
  actionId: RobotActionId | null;
  status: RobotActionStatus;
  message: string;
};

export function PhaserCanvas({ actionId, status, message }: PhaserCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<{ destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let isMounted = true;

    void import("@/phaser/core/createGame").then(({ createGame }) => {
      if (!isMounted || !containerRef.current) {
        return;
      }

      gameRef.current = createGame(containerRef.current);
    });

    return () => {
      isMounted = false;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    void import("@/phaser/core/createGame").then(({ broadcastSceneUpdate }) => {
      broadcastSceneUpdate({ actionId, status, message });
    });
  }, [actionId, message, status]);

  return (
    <div className="h-full min-h-0 w-full overflow-hidden rounded-[2.25rem] border border-white/50 bg-white/20 p-2 shadow-bubble backdrop-blur">
      <div className="h-full w-full overflow-hidden rounded-[1.8rem] bg-[#d8f5ff]" ref={containerRef} />
    </div>
  );
}