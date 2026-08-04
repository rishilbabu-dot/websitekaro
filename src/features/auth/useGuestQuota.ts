import { useCallback, useEffect, useState } from "react";
import { readGuestQuota, recordGuestGeneration, type GuestQuotaState } from "./guest-quota";

const EMPTY: GuestQuotaState = { used: 0, remaining: 3, limit: 3, exhausted: false, resetsAt: null };

/** Reads the rolling guest quota after hydration (storage is client-only). */
export const useGuestQuota = () => {
  const [state, setState] = useState<GuestQuotaState>(EMPTY);

  useEffect(() => { setState(readGuestQuota()); }, []);

  const record = useCallback(() => {
    const next = recordGuestGeneration();
    setState(next);
    return next;
  }, []);

  const refresh = useCallback(() => setState(readGuestQuota()), []);

  return { ...state, record, refresh };
};