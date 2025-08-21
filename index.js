// Playdeck API wrapper

// слушаем события от Playdeck
window.addEventListener("message", ({ data }) => {
  const pdData = data?.playdeck;
  if (!pdData) return;

  console.log("[Playdeck ▶️]:", pdData.method, pdData.value);

  switch (pdData.method) {
    case "isOpen":
      window.playdeckIsOpen = pdData.value;
      break;
    case "getUser":
      window.playdeckUser = pdData.value;
      break;
    case "getUserLocale":
      window.playdeckUserLocale = pdData.value;
      break;
    case "getScore":
      window.playdeckScore = pdData.value;
      break;
    case "getData":
      window.playdeckData = pdData.value;
      break;
    case "play":
      console.log("▶️ Запуск игры (событие Play)");
      if (window.unityInstance) {
        // Вызываем метод Unity, если нужно (GameManager.StartGame)
        // window.unityInstance.SendMessage("GameManager", "StartGame");
      }
      break;
    case "invoiceClosed":
      console.log("💰 Платёж закрыт:", pdData.value);
      break;
    case "rewardedAd":
      console.log("🎁 Награда за рекламу");
      break;
  }
});

const parentWin = window.parent !== window ? window.parent : null;
const post = (payload) => parentWin?.postMessage({ playdeck: payload }, "*");

const loading = (value) => post({ method: "loading", value });
const getPlaydeckState = () => post({ method: "getPlaydeckState" });
const getScore = () => post({ method: "getScore" });
const setScore = (value, isForce = false) =>
  post({ method: "setScore", value, isForce });
const getData = (key) => post({ method: "getData", key });
const setData = (key, value) => post({ method: "setData", key, value });
const getUserLocale = () => post({ method: "getUserLocale" });
const getUser = () => post({ method: "getUser" });
const gameEnd = () => post({ method: "gameEnd" });
const showAd = () => post({ method: "showAd" });
const requestPayment = (amount, description, externalId) =>
  post({ method: "requestPayment", value: { amount, description, externalId } });

window.PlaydeckAPI = {
  loading,
  getPlaydeckState,
  getScore,
  setScore,
  getData,
  setData,
  getUserLocale,
  getUser,
  gameEnd,
  showAd,
  requestPayment,