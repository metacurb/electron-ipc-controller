export const ipcMain = {
  handle: jest.fn(),
  handleOnce: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeHandler: jest.fn(),
  removeListener: jest.fn(),
};

export const ipcRenderer = {
  invoke: jest.fn(),
  once: jest.fn(),
  send: jest.fn(),
};

export const BrowserWindow = {
  fromWebContents: jest.fn(),
};
