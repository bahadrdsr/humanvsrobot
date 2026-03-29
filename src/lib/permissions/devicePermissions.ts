import { queryPermissionState, type DevicePermissionState } from "@/lib/permissions/permissionStatus";

async function requestMedia(constraints: MediaStreamConstraints, permissionName: "microphone" | "camera") {
  const permissionState = await queryPermissionState(permissionName);

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error(`${permissionName} access is not supported in this browser.`);
  }

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return { stream, permissionState: permissionState === "unknown" ? "granted" : permissionState };
}

export async function requestMicrophone() {
  return requestMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }, "microphone");
}

export async function requestCamera() {
  return requestMedia({ video: { facingMode: "user" }, audio: false }, "camera");
}

export function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export type { DevicePermissionState };