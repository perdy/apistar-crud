import pytest
from apistar import types, validators

from apistar_crud.peewee import Resource
from apistar_crud.routes import RouteOptions, Routes


class PuppyModel:
    id = 1
    name = "Canna"


class PuppyInputType(types.Type):
    name = validators.String()


class PuppyOutputType(types.Type):
    id = validators.Integer()
    name = validators.String()


class PuppyResource(metaclass=Resource):
    name = "puppy"
    verbose_name = "Puppy"

    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType


class TestCaseRoutes:
    @pytest.fixture
    def routes(self):
        routes = Routes()
        routes.register(PuppyResource)
        return routes

    def test_init(self):
        routes = Routes()

        assert routes.resources == {}

    def test_register(self):
        routes = Routes()

        routes.register(PuppyResource)

        routes.resources = {PuppyResource: RouteOptions("/puppy", True)}

    def test_routes(self, routes):
        r = routes.routes()

        assert r[0].url == "/puppy/"
        assert r[0].name == "puppy"

        assert r[1].url == "/admin/"
        assert r[1].name == "admin"

    def test_routes_no_admin(self, routes):
        r = routes.routes(admin=None)

        assert r[0].url == "/puppy/"
        assert r[0].name == "puppy"
