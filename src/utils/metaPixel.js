const fbq = (...args) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};

export const serverEvent = async (eventName, eventData = {}, userData = {}) => {
  try {
    await fetch("/api/meta-conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, eventData, userData }),
    });
  } catch (err) {
    console.error("server event error:", err);
  }
};

export const trackContact = (data = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Contact", {
      content_name: "Contact Form",
      email: data.email || "",
      phone: data.phone || "",
    });
  }
};

export const trackLead = (email) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: "Newsletter Subscription", email });
  }
  serverEvent("Lead", { content_name: "Newsletter" }, { email });
};

export const trackEvent = (eventName, data = {}) => {
  if (eventName === "Purchase") {
    fbq("track", "Purchase", {
      value: data.total || 0,
      currency: "CLP",
      content_name: data.items || "",
      content_type: "product",
      content_ids: data.order_id ? [data.order_id] : [],
      num_items: data.quantity || 1,
    });
  } else {
    fbq("track", eventName, data);
  }
};
