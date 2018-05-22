import pytest
from apistar import types, validators

from apistar_crud.sqlalchemy import Resource


class PuppyModel:
    id = 1
    name = "Canna"


class PuppyInputType(types.Type):
    name = validators.String()


class PuppyOutputType(types.Type):
    id = validators.Integer()
    name = validators.String()


class TestCaseBaseCRUDResource:

    @pytest.fixture(scope="function")
    def resource(self, request):
        if hasattr(request, "param"):

            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                input_type = PuppyInputType
                output_type = PuppyOutputType
                methods = request.param

        else:

            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                input_type = PuppyInputType
                output_type = PuppyOutputType

        return PuppyResource

    def test_new_default_methods(self, resource):
        assert hasattr(resource, "create")
        assert hasattr(resource, "retrieve")
        assert hasattr(resource, "update")
        assert hasattr(resource, "delete")
        assert hasattr(resource, "list")
        assert len(resource.routes) == 5
        assert [route.handler for route in resource.routes] == [
            resource.create,
            resource.retrieve,
            resource.update,
            resource.delete,
            resource.list,
        ]

    @pytest.mark.parametrize(
        "resource", [("create", "retrieve", "update", "delete", "list", "drop")], indirect=["resource"]
    )
    def test_new_explicit_methods(self, resource):
        assert hasattr(resource, "create")
        assert hasattr(resource, "retrieve")
        assert hasattr(resource, "update")
        assert hasattr(resource, "delete")
        assert hasattr(resource, "list")
        assert hasattr(resource, "drop")
        assert len(resource.routes) == 6
        assert [route.handler for route in resource.routes] == [
            resource.create,
            resource.retrieve,
            resource.update,
            resource.delete,
            resource.list,
            resource.drop,
        ]

    def test_overriden_method(self, resource):

        class SpecializedPuppyResource(resource):

            def list(self):
                return []

        assert hasattr(SpecializedPuppyResource, "create")
        assert hasattr(SpecializedPuppyResource, "retrieve")
        assert hasattr(SpecializedPuppyResource, "update")
        assert hasattr(SpecializedPuppyResource, "delete")
        assert hasattr(SpecializedPuppyResource, "list")
        assert len(SpecializedPuppyResource.routes) == 5
        assert [route.handler for route in SpecializedPuppyResource.routes] == [
            resource.create,
            resource.retrieve,
            resource.update,
            resource.delete,
            SpecializedPuppyResource.list,
        ]

    def test_new_no_model(self):
        with pytest.raises(AttributeError):

            class PuppyResource(metaclass=Resource):
                input_type = PuppyInputType
                output_type = PuppyOutputType

    def test_new_no_input_type(self):
        with pytest.raises(AttributeError):

            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                output_type = PuppyOutputType

    def test_new_no_output_type(self):
        with pytest.raises(AttributeError):

            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                input_type = PuppyInputType

    def test_new_wrong_methods(self):
        with pytest.raises(AttributeError):

            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                input_type = PuppyInputType
                output_type = PuppyOutputType
                methods = ("foo",)
