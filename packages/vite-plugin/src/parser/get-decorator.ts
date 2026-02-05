import { canHaveDecorators, Decorator, getDecorators, isCallExpression, isIdentifier, Node } from "typescript";

export const getDecorator = (node: Node, name: string): Decorator | undefined => {
  if (!canHaveDecorators(node)) return undefined;

  const decorators = getDecorators(node);
  if (!decorators) return undefined;

  return decorators.find(
    (m) =>
      isCallExpression(m.expression) && isIdentifier(m.expression.expression) && m.expression.expression.text === name,
  );
};
