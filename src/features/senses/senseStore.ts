import type { DevicePermissionState } from "@/lib/permissions/devicePermissions";

export type HearState = {
  mode: "hear";
  permissionState: DevicePermissionState;
  deviceState: "idle" | "requesting" | "active" | "completed" | "failed";
  transcript: string;
  fallbackText: string;
  message: string;
  recordingUrl: string | null;
  clipDurationMs: number;
  requiresManualPlayback: boolean;
  playbackState: "idle" | "ready" | "playing" | "failed";
};

export type SeeState = {
  mode: "see";
  permissionState: DevicePermissionState;
  deviceState: "idle" | "requesting" | "active" | "completed" | "failed";
  message: string;
  previewVisible: boolean;
};

export function createInitialHearState(): HearState {
  return {
    mode: "hear",
    permissionState: "unknown",
    deviceState: "idle",
    transcript: "",
    fallbackText: "",
    message: "Hazir oldugunda Dinle dugmesine bas.",
    recordingUrl: null,
    clipDurationMs: 0,
    requiresManualPlayback: false,
    playbackState: "idle"
  };
}

export function createInitialSeeState(): SeeState {
  return {
    mode: "see",
    permissionState: "unknown",
    deviceState: "idle",
    message: "Kamerayi acmak istediginde Gor dugmesine bas.",
    previewVisible: false
  };
}