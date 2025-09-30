window.PlaydeckAPI = {
  loading: (value = 0) =>
    parent.postMessage({ playdeck: { method: "loading", value } }, "*"),

  setScore: (value, isForce = false) =>
    parent.postMessage({ playdeck: { method: "setScore", value, isForce } }, "*"),

  getScore: () =>
    parent.postMessage({ playdeck: { method: "getScore" } }, "*"),

  gameEnd: () =>
    parent.postMessage({ playdeck: { method: "gameEnd" } }, "*"),

  getUser: () =>
    parent.postMessage({ playdeck: { method: "getUser" } }, "*"),

  getUserLocale: () =>
    parent.postMessage({ playdeck: { method: "getUserLocale" } }, "*"),

  setData: (key, value) =>
    parent.postMessage({ playdeck: { method: "setData", key, value } }, "*"),

  getData: (key) =>
    parent.postMessage({ playdeck: { method: "getData", key } }, "*"),

  openInvoice: (params) =>
    parent.postMessage({ playdeck: { method: "openInvoice", value: params } }, "*"),
};

window.addEventListener("message", ({ data }) => {
  const pdData = data?.playdeck;
  if (!pdData) return;

  console.log("[Playdeck message]:", pdData.method, pdData.value);

  if (pdData.method === "getUser") {
    window.playdeckUser = pdData.value;
    console.log("User:", pdData.value);
  }

  if (pdData.method === "getUserLocale") {
    window.playdeckUserLocale = pdData.value;
  }

  if (pdData.method === "getScore") {
    window.playdeckScore = pdData.value;
  }
});

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  const tg = window.Telegram.WebApp;
  const initDataUnsafe = tg.initDataUnsafe;
  const userId = initDataUnsafe?.user?.id;
  console.log("Telegram User ID:", userId);
}
