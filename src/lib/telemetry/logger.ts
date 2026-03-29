import type { TelemetryEvent, TelemetryEventType, TelemetrySeverity } from "@/lib/telemetry/events";
import type { RobotActionId } from "@/features/robot-actions/types";

const telemetryEvents: TelemetryEvent[] = [];

function sanitizeDetailValue(value: unknown): string | number | boolean | null {
  if (typeof value === "string") {
    return value.replace(/(token|secret|key)=\S+/gi, "$1=[redacted]").slice(0, 240);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return null;
}

export function recordTelemetryEvent(input: {
  eventType: TelemetryEventType;
  severity?: TelemetrySeverity;
  sessionId?: string;
  actionId?: RobotActionId;
  details?: Record<string, unknown>;
}) {
  const event: TelemetryEvent = {
    eventId: crypto.randomUUID(),
    eventType: input.eventType,
    severity: input.severity ?? "info",
    eventAt: new Date().toISOString(),
    sessionId: input.sessionId,
    actionId: input.actionId,
    details: Object.fromEntries(
      Object.entries(input.details ?? {}).map(([key, value]) => [key, sanitizeDetailValue(value)])
    )
  };

  telemetryEvents.push(event);
  return event;
}

export function getTelemetryEvents() {
  return [...telemetryEvents];
}

export function resetTelemetryEvents() {
  telemetryEvents.length = 0;
}