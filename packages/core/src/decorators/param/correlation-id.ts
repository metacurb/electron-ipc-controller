import { getCorrelationId } from "../../correlation/get-correlation-id";
import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = () => getCorrelationId();

export const CorrelationId = createParamDecorator(impl);
