import { IPC_PARAM_INJECTION_DECORATOR_NAMES } from "@electron-ipc-bridge/shared";

import { Channel } from "./channel";
import { CorrelationId } from "./correlation-id";
import { Origin } from "./origin";
import { ProcessId } from "./process-id";
import { RawEvent } from "./raw-event";
import { Sender } from "./sender";
import { Window } from "./window";

type ParamDecoratorName = (typeof IPC_PARAM_INJECTION_DECORATOR_NAMES)[number];

export const IPC_PARAM_DECORATORS = {
  Channel,
  CorrelationId,
  Origin,
  ProcessId,
  RawEvent,
  Sender,
  Window,
} satisfies Record<ParamDecoratorName, ParameterDecorator>;

export { Channel, CorrelationId, Origin, ProcessId, RawEvent, Sender, Window };
