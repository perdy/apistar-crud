import request from "superagent";
import Swagger from "swagger-client";

const urls = {
  metadata: "/_crud/metadata/"
};

export default class Api {
  static getOperation(client, resource, verb, collection = true) {
    const path = collection ? `/${resource}/` : `/${resource}/{element_id}/`;
    const { operationId } = client.spec.paths[path][verb];
    return client.apis[resource][operationId];
  }

  static fetchMetadata() {
    return request.get(urls.metadata).then(response => response.body);
  }

  static fetchResourceCollection({ resourceName, query }, client) {
    const operation = Api.getOperation(client, resourceName, "get");

    return operation(query).then(response => response.body);
  }

  static fetchResourceElement({ resourceName, resourceId }, client) {
    const operation = Api.getOperation(client, resourceName, "get", false);

    return operation({ element_id: resourceId }).then(response => response.body);
  }

  static fetchSwaggerSchema(schemaUrl) {
    return Swagger(schemaUrl).then(client => client);
  }

  static submitResource({ resourceName, resourceData }, client) {
    const operation = Api.getOperation(client, resourceName, "post");

    return operation({}, { requestBody: resourceData }).then(response => response.body);
  }

  static updateResourceElement({ resourceName, resourceId, resourceData }, client) {
    const operation = Api.getOperation(client, resourceName, "put", false);

    return operation({ element_id: resourceId }, { requestBody: resourceData }).then(response => response.body);
  }

  static deleteResourceElement({ resourceName, resourceId }, client) {
    const operation = Api.getOperation(client, resourceName, "delete", false);

    return operation({ element_id: resourceId }).then(response => response.body);
  }
}
