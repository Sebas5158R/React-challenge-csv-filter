import { useState } from "react";
import { Toaster, toast } from 'sonner'
import "./App.css";
import { uploadFile } from "./services/upload";
import { Search } from "./steps/Search";

const APP_STATUS = {
  IDLE: "idle", // initial state
  ERROR: "error", // error state
  READY_UPLOAD: "ready_upload", // When choosing the file
  UPLOADING: "uploading", // When sending the file
  READY_USAGE: "ready_usage", // When the file is uploaded
}

const BUTTON_TEXT = {
  READY_UPLOAD: "Upload File",
  UPLOADING: "Uploading...",

}

function App() {

  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const [fileHandle] = e.target.files ?? [];
    if (fileHandle) {
      setFile(fileHandle);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return;
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(file);

    console.log({ newData })

    if (err) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return;
    }

    setAppStatus(APP_STATUS.READY_USAGE);
    if (newData) setData(newData);
    toast.success("File uploaded successfully!");
  };

  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  const showInput = appStatus !== APP_STATUS.READY_USAGE;

  return (
    <div className="App">
      <Toaster />
      <h1>React Challenge: Upload CSV + Search</h1>
      {
        showInput && (
          <form onSubmit={handleSubmit} className="form-file">
            <input
              className="file-input"
              disabled={appStatus === APP_STATUS.UPLOADING}
              type="file"
              onChange={handleInputChange}
              name="file"
              id="file"
              accept=".csv"
            />
            <label htmlFor="file">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="17"
                viewBox="0 0 20 17"
              >
                <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
              </svg>
              {file ? file.name : "Choose a file"}
            </label>
            {
              showButton && (
                <button type="submit" disabled={appStatus === APP_STATUS.UPLOADING}>
                  {appStatus === APP_STATUS.READY_UPLOAD ? BUTTON_TEXT.READY_UPLOAD : BUTTON_TEXT.UPLOADING}
                </button>
              )
            }
          </form>
        )
      }

      {
        appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data} />
        )
      }
    </div>
  );
}

export default App;
