const information = document.getElementById("info");

const electron = require("electron");
const ipc = electron.ipcRenderer;
// ipcRenderer.on("got-access-token", (event, string) => {
//   console.log("aaaa");
//   document.getElementById("info").innerText = string;
// });

console.log(window);
console.log(window.ipcRender);
electron.ipcRenderer.on("got-access-token", function (event, data) {
  information.innerText = data;

  console.log(data);
});
