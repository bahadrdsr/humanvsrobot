export type DevicePermissionState = "unknown" | "granted" | "denied" | "unsupported";

export async function queryPermissionState(name: "microphone" | "camera"): Promise<DevicePermissionState> {
  if (!("permissions" in navigator)) {
    return "unknown";
  }

  try {
    const status = await navigator.permissions.query({ name } as PermissionDescriptor);
    if (status.state === "granted") {
      return "granted";
    }
    if (status.state === "denied") {
      return "denied";
    }
    return "unknown";
  } catch {
    return "unsupported";
  }
}