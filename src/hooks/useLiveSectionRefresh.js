import { useEffect } from "react";
import { subscribeSectionUpdates } from "../utils/socket.js";

/**
 * Refetch section data whenever the server emits a Socket.IO section:updated event.
 */
export function useLiveSectionRefresh(section, refetch) {
  useEffect(() => {
    if (!section || typeof refetch !== "function") return undefined;
    return subscribeSectionUpdates(section, () => {
      refetch();
    });
  }, [section, refetch]);
}
