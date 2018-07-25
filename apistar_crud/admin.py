import typing

from apistar import App, Route, types, validators


class Metadata(types.Type):
    resources = validators.Object(title="resources", description="Resource list")
    schema = validators.String(title="schema", description="OpenAPI schema")


class Admin:
    def __init__(self, *resources):
        self.resources = {resource.name: resource for resource in resources}

    def main(self, app: App, path: str = ""):
        """
        Admin main page presenting a list of resources.
        """
        return app.render_template("apistar_crud/admin.html")

    def metadata(self, app: App) -> Metadata:
        """
        Admin metadata.
        """
        return Metadata(
            {
                "resources": {resource.verbose_name: resource.name for resource in self.resources.values()},
                "admin": app.reverse_url("admin:main"),
                "schema": app.reverse_url("serve_schema"),
            }
        )

    @property
    def routes(self) -> typing.List[Route]:
        return [
            Route("/", "GET", self.main, name="main", documented=False),
            Route("/metadata/", "GET", self.metadata, name="metadata", documented=False),
            Route("/{+path}", "GET", self.main, name="main-path", documented=False),
        ]
