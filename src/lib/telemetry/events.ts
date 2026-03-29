import type { RobotActionId } from "@/features/robot-actions/types";

export type TelemetryEventType =
  | "login_success"
  | "login_failure"
  | "permission_denied"
  | "action_failed"
  | "action_completed"
  | "session_ended";

export type TelemetrySeverity = "info" | "warning" | "error";

export type TelemetryEvent = {
  eventId: string;
  eventType: TelemetryEventType;
  severity: TelemetrySeverity;
  eventAt: string;
  sessionId?: string;
  actionId?: RobotActionId;
  details: Record<string, string | number | boolean | null>;
};