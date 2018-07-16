import typing
from collections import namedtuple

from apistar import Include

from apistar_crud.admin import Admin

__all__ = ["routes"]

RouteOptions = namedtuple("RouteOptions", ("path", "admin"))


class Routes:
    def __init__(self):
        self.resources = {}

    def register(self, resource, path: str = None, admin: bool = True):
        self.resources[resource] = RouteOptions(path or resource.name, admin)

    def routes(self, admin="/admin") -> typing.List[Include]:
        """
        Generate the list of routes for all resources and admin views.

        :param admin: Admin path, disabled if None.
        :return: List of routes.
        """
        r = [Include(opts.path, r.name, r.routes) for r, opts in self.resources.items()]
        a = Admin(*[r for r, opts in self.resources.items() if opts.admin])
        r.append(Include(admin, "admin", a.routes, documented=False))
        return r


routes = Routes()
