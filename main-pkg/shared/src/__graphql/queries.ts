declare module "*/fetchResourceById.graphql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  const fetchResourceById: DocumentNode;

  export { fetchResourceById };

  export default defaultDocument;
}

declare module "*/fetchResources.graphql" {
  import { DocumentNode } from "graphql";
  const defaultDocument: DocumentNode;
  const fetchResources: DocumentNode;

  export { fetchResources };

  export default defaultDocument;
}
