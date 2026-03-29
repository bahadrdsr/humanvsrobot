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
    message: "Ask the robot to listen when you are ready.",
    recordingUrl: null,
    clipDurationMs: 0,
    playbackState: "idle"
  };
}

export function createInitialSeeState(): SeeState {
  return {
    mode: "see",
    permissionState: "unknown",
    deviceState: "idle",
    message: "Press See when you want the robot to open the camera.",
    previewVisible: false
  };
}