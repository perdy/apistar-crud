import { schema } from "normalizr";

export default {
  resource: new schema.Entity("resource"),
  resourceCollection: new schema.Array(new schema.Entity("resource"))
};
