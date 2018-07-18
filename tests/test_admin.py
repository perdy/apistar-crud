from unittest.mock import Mock, call

import pytest
from apistar import Document, types, validators
from apistar.exceptions import NotFound

from apistar_crud.admin import Admin
from apistar_crud.resource.peewee import Resource


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


class TestCaseAdmin:
    @pytest.fixture
    def admin(self):
        return Admin(PuppyResource)

    @pytest.fixture
    def app(self):
        mock = Mock()
        mock.reverse_url.return_value = "/foo"
        mock.document = Document()
        return mock

    @pytest.fixture
    def obj(self):
        return Mock()

    @pytest.fixture
    def resource(self, obj):
        mock = Mock()
        mock.name = "foo"
        mock.verbose_name = "foo"
        mock.retrieve.return_value = obj
        mock.input_type = PuppyInputType
        return mock

    def test_init(self):
        admin = Admin(PuppyResource)

        assert admin.resources == {"puppy": PuppyResource}

    def test_main(self, admin, app):
        expected_calls = [call("apistar_crud/admin_main.html", resources={"Puppy": "/foo"})]

        admin.main(app)

        assert app.render_template.call_args_list == expected_calls

    def test_metadata(self, admin, app):
        response = admin.metadata(app)

        assert "Puppy" in response.resources
        assert response.schema is not None

    def test_list(self, admin, app):
        admin.list(app, "puppy")

        assert app.render_template.call_count == 1
        assert app.render_template.call_args[0][0] == "apistar_crud/admin_list.html"

    def test_list_resource_not_found(self, admin, app):
        with pytest.raises(NotFound):
            admin.list(app, "Foo")

    def test_detail(self, app, resource):
        admin = Admin(resource)

        admin.detail(app, "foo", "1")

        assert app.render_template.call_count == 1
        assert app.render_template.call_args[0][0] == "apistar_crud/admin_detail.html"

    def test_detail_resource_not_found(self, admin, app):
        with pytest.raises(NotFound):
            admin.detail(app, "Puppy", "1")

    def test_routes(self, admin):
        assert admin.routes[0].url == "/"
        assert admin.routes[0].method == "GET"
        assert admin.routes[0].handler == admin.main
        assert admin.routes[0].documented is False

        assert admin.routes[1].url == "/metadata/"
        assert admin.routes[1].method == "GET"
        assert admin.routes[1].handler == admin.metadata
        assert admin.routes[1].documented is False

        assert admin.routes[2].url == "/{resource_name}/"
        assert admin.routes[2].method == "GET"
        assert admin.routes[2].handler == admin.list
        assert admin.routes[2].documented is False

        assert admin.routes[3].url == "/{resource_name}/{resource_id}/"
        assert admin.routes[3].method == "GET"
        assert admin.routes[3].handler == admin.detail
        assert admin.routes[3].documented is False
