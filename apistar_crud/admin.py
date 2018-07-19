import typing

from apistar import App, Route, types, validators
from apistar.codecs import JSONSchemaCodec
from apistar.exceptions import NotFound


class Metadata(types.Type):
    resources = validators.Object(title="resources", description="Resource list")
    schema = validators.String(title="schema", description="OpenAPI schema")


class Admin:
    def __init__(self, *resources):
        self.resources = {resource.name: resource for resource in resources}

    def _resource_admin_urls(self, app: App) -> typing.Dict[str, str]:
        """
        Build a mapping of resources and admin urls.

        :param app: API Star app.
        :return: Resource admin urls.
        """
        return {
            resource.verbose_name: app.reverse_url("admin:list", resource_name=resource.name)
            for resource in self.resources.values()
        }

    def _resource_schema(self, resource) -> typing.Dict[str, typing.Any]:
        """
        Generate resource input schema.

        :param resource: Resource.
        :return: Schema
        """
        return JSONSchemaCodec().encode_to_data_structure(resource.input_type)

    def main(self, app: App):
        """
        Admin main page presenting a list of resources.
        """
        context = {"resources": self._resource_admin_urls(app)}

        return app.render_template("apistar_crud/admin_main.html", **context)

    def metadata(self, app: App) -> Metadata:
        """
        Admin metadata.
        """
        return Metadata({"resources": self._resource_admin_urls(app), "schema": app.reverse_url("serve_schema")})

    def list(self, app: App, resource_name: str):
        """
        Admin page presenting a list view of resource objects.
        """
        try:
            resource = self.resources[resource_name]
            context = {
                "resources": self._resource_admin_urls(app),
                "resource": {
                    "name": resource.verbose_name,
                    "url": app.reverse_url("{}:list".format(resource_name)),
                    "schema": self._resource_schema(resource),
                },
            }
        except KeyError:
            raise NotFound

        return app.render_template("apistar_crud/admin_list.html", **context)

    def detail(self, app: App, resource_name: str, resource_id: str):
        """
        Admin page presenting a detailed view of a resource object.
        """
        try:
            resource = self.resources[resource_name]
            context = {
                "resources": self._resource_admin_urls(app),
                "resource": {
                    "name": resource.verbose_name,
                    "url": app.reverse_url("{}:list".format(resource_name)),
                    "schema": self._resource_schema(resource),
                    "id": resource_id,
                    "obj": resource.retrieve(resource_id),
                },
            }
        except KeyError:
            raise NotFound

        return app.render_template("apistar_crud/admin_detail.html", **context)

    @property
    def routes(self) -> typing.List[Route]:
        return [
            Route("/", "GET", self.main, name="main", documented=False),
            Route("/metadata/", "GET", self.metadata, name="metadata", documented=False),
            Route("/{resource_name}/", "GET", self.list, name="list", documented=False),
            Route("/{resource_name}/{resource_id}/", "GET", self.detail, name="detail", documented=False),
        ]
