import ts = require("typescript");

export function importStar<T extends ts.Node>(typeChecker: ts.TypeChecker): ts.TransformerFactory<T> {
  return (context) => {
    let parent;
    const visit: ts.Visitor = (node) => {
      if (ts.isDecorator(node)) {
        return undefined;
      }
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'array_merge'
      ) {

        return ts.createArrayLiteral(
          node.arguments.map(it => {
            return ts.createSpread(
              ts.isConditionalExpression(it) ? ts.createParen(it) : it
            );
          }),
          node.arguments.length > 2
        );
      }

      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}
