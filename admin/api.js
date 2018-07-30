import request from "superagent";
import Swagger from "swagger-client";

const urls = {
  metadata: "/_crud/metadata/"
};

export default class Api {
  static fetchMetadata() {
    return request.get(urls.metadata).then(response => response.body);
  }

  static fetchResourceCollection({ resourceName, query }, client) {
    return client.apis[resourceName].list(query).then(response => response.body);
  }

  static fetchResourceElement({ resourceName, resourceId }, client) {
    return client.apis[resourceName].retrieve({ element_id: resourceId }).then(response => response.body);
  }

  static fetchSwaggerSchema(schemaUrl) {
    return Swagger(schemaUrl).then(client => client);
  }

  static submitResource({ resourceName, resourceData }, client) {
    return client.apis[resourceName].create({}, { requestBody: resourceData }).then(response => response.body);
  }

  static updateResourceElement({ resourceName, resourceId, resourceData }, client) {
    return client.apis[resourceName]
      .update({ element_id: resourceId }, { requestBody: resourceData })
      .then(response => response.body);
  }

  static deleteResourceElement({ resourceName, resourceId }, client) {
    return client.apis[resourceName].delete({ element_id: resourceId }).then(response => response.body);
  }
}
