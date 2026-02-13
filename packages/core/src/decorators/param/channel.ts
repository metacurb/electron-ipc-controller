import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import type { ParameterInjectionContext } from "../../metadata/types";
import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (_event: IpcMainEvent | IpcMainInvokeEvent, context: ParameterInjectionContext) => context.channel;

export const Channel = createParamDecorator(impl);
