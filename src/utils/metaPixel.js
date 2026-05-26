const fbq = (...args) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};

export const trackEvent = (eventName, data = {}) => {
  fbq("track", eventName, data);
};
