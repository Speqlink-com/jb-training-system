/**
 * Compatibility facade while the deployment is running in local-first mode.
 * Backend integration is intentionally paused; no credentials or tokens leave the browser.
 */
export const apiClient = {
  async healthCheck() {
    return { status: "local" };
  },
  async getApiStatus() {
    return { message: "Local-first workspace", status: "running" };
  },
};

export default apiClient;
