import typing
from collections import namedtuple

from apistar import Include

from apistar_crud.admin import Admin

__all__ = ["routes"]

RouteOptions = namedtuple("RouteOptions", ("url", "admin"))


class Routes:
    def __init__(self):
        self.resources = {}

    def register(self, resource, url: str = None, admin: bool = True):
        """
        Register a resource.

        :param resource: Resource.
        :param url: Route url.
        :param admin: True if should be added to admin site.
        """
        url = url or "/{}".format(resource.name)
        self.resources[resource] = RouteOptions(url, admin)

    def routes(self, admin="/admin") -> typing.List[Include]:
        """
        Generate the list of routes for all resources and admin views.

        :param admin: Admin path, disabled if None.
        :return: List of routes.
        """
        r = [Include(opts.url, r.name, r.routes) for r, opts in self.resources.items()]

        private_routes = []

        if admin:
            a = Admin(*[r for r, opts in self.resources.items() if opts.admin])
            r.append(Include(admin, "admin", a.routes, documented=False))
            private_routes += a.metadata_routes

        if private_routes:
            r.append(Include("/_crud", "crud", private_routes, documented=False))

        return r


routes = Routes()
