from unittest.mock import Mock, call

import pytest
from apistar import Document, types, validators

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

    def test_init(self):
        admin = Admin(PuppyResource)

        assert admin.resources == {"puppy": PuppyResource}

    def test_main(self, admin, app):
        expected_calls = [call("apistar_crud/admin.html")]

        admin.main(app)

        assert app.render_template.call_args_list == expected_calls

    def test_metadata(self, admin, app):
        response = admin.metadata(app)

        assert "puppy" in response.resources
        assert response.schema == app.reverse_url("serve_schema")

    def test_routes(self, admin):
        assert admin.routes[0].url == "/"
        assert admin.routes[0].method == "GET"
        assert admin.routes[0].handler == admin.main
        assert admin.routes[0].documented is False

        assert admin.routes[1].url == "/{+path}"
        assert admin.routes[1].method == "GET"
        assert admin.routes[1].handler == admin.main
        assert admin.routes[1].documented is False
