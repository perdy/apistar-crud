import typing

from apistar import App, Route
from apistar.exceptions import NotFound


class Admin:
    def __init__(self, *resources):
        self.resources = {resource.name: resource for resource in resources}

    def main(self, app: App):
        """
        Admin main page presenting a list of resources.
        """
        context = {
            "resources": {
                resource.verbose_name: app.reverse_url("{}:list".format(resource.name))
                for resource in self.resources.values()
            }
        }

        return app.render_template("apistar_crud/admin_main.html", **context)

    def list(self, app: App, resource_name: str):
        """
        Admin page presenting a list view of resource objects.
        """
        try:
            resource = self.resources[resource_name]
            context = {"resource": resource.verbose_name, "url": app.reverse_url("{}:list".format(resource_name))}
        except KeyError:
            raise NotFound

        return app.render_template("apistar_crud/admin_list.html", **context)

    def detail(self, app: App, resource_name: str, resource_id: int):
        """
        Admin page presenting a detailed view of a resource object.
        """
        try:
            resource = self.resources[resource_name]
            context = {
                "resource": resource.verbose_name,
                "url": app.reverse_url("{}:list".format(resource_name)),
                "id": resource_id,
                "obj": resource.retrieve(resource_id),
            }
        except KeyError:
            raise NotFound

        return app.render_template("apistar_crud/admin_detail.html", **context)

    @property
    def routes(self) -> typing.List[Route]:
        return [
            Route("/", "GET", self.main, name="main", documented=False),
            Route("/{resource_name}/", "GET", self.list, name="list", documented=False),
            Route("/{resource_name}/{resource_id}/", "GET", self.detail, name="detail", documented=False),
        ]
