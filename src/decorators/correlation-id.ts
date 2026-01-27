import { getCorrelationId } from "../correlation/get-correlation-id";

import { createParamInjector } from "./utils/create-param-injector";

export const CorrelationId = createParamInjector(() => getCorrelationId());
