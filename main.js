const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const { dialog } = require("electron");
let fs = require("fs");
var win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("ping", () => "pong");
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  const schema = {
    Name: {
      prop: "Name",
      type: String,
    },
    Gender: {
      prop: "Gender",
      type: String,
    },
    Company: {
      prop: "Company",
      type: String,
    },
  };

  const readXlsxFile = require("read-excel-file/node");
  readXlsxFile("1.xlsx", { schema }).then(({ rows, errors }) => {
    const string =
      "Hello " +
      rows[0].Name +
      "!\n" +
      (rows[0].Gender == "Male" ? "He" : "She") +
      " works at " +
      rows[0].Company;

    console.log(string);

    console.log(win);
    //dialog.showErrorBox("Title", string);

    //event.sender.send("got-access-token", string);

    win.webContents.send("got-access-token", string);
  });
  fs.watch(".", function (event, filename) {
    // console.log("event is: " + event);

    if (filename == "1.xlsx") {
      readXlsxFile("1.xlsx", { schema }).then(({ rows, errors }) => {
        var string =
          "Hello " +
          rows[0].Name +
          "!\n" +
          (rows[0].Gender == "Male" ? "He" : "She") +
          " works at " +
          rows[0].Company;

        //event.sender.send("got-access-token", string);

        win.webContents.send("got-access-token", string);
      });
    } else {
      console.log("filename not provided");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
