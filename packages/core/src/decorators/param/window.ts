import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) =>
  BrowserWindow.fromWebContents(event.sender);

export const Window = createParamDecorator(impl);
