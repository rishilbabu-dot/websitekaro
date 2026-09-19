/**
 * Staff token.
 *
 * The passcode a staff member unlocked with is kept for the browser session so
 * server functions that return internal data (e.g. launch leads) can verify the
 * caller. Replace with a real session token when staff auth moves to the
 * backend — only this file changes.
 */
const KEY = "wk_staff_token";

export const setStaffToken = (token: string) => {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable — listing simply asks for the passcode again */
  }
};

export const getStaffToken = (): string => {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

export const clearStaffToken = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
};
