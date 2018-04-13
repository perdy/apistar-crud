import pytest
from apistar import types, validators

# Fake model
from apistar_crud.sqlalchemy import Resource


class PuppyModel:
    id = 1
    name = 'Canna'


class PuppyType(types.Type):
    id = validators.Integer,
    name = validators.String


class TestCaseBaseCRUDResource:
    @pytest.fixture(scope='function')
    def resource(self, request):
        if hasattr(request, 'param'):
            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                type = PuppyType
                methods = request.param
        else:
            class PuppyResource(metaclass=Resource):
                model = PuppyModel
                type = PuppyType

        return PuppyResource

    def test_new_default_methods(self, resource):
        assert hasattr(resource, 'create')
        assert hasattr(resource, 'retrieve')
        assert hasattr(resource, 'update')
        assert hasattr(resource, 'delete')
        assert hasattr(resource, 'list')
        assert len(resource.routes) == 5
        assert [route.handler for route in resource.routes] == \
               [resource.create, resource.retrieve, resource.update, resource.delete, resource.list]

    @pytest.mark.parametrize('resource', [('create', 'retrieve', 'update', 'delete', 'list', 'drop')],
                             indirect=['resource'])
    def test_new_explicit_methods(self, resource):
        assert hasattr(resource, 'create')
        assert hasattr(resource, 'retrieve')
        assert hasattr(resource, 'update')
        assert hasattr(resource, 'delete')
        assert hasattr(resource, 'list')
        assert hasattr(resource, 'drop')
        assert len(resource.routes) == 6
        assert [route.handler for route in resource.routes] == \
               [resource.create, resource.retrieve, resource.update, resource.delete, resource.list, resource.drop]

    def test_new_no_model(self):
        with pytest.raises(AttributeError):
            class PuppyResource(metaclass=Resource):
                type = PuppyType

    def test_new_no_type(self):
        with pytest.raises(AttributeError):
            class PuppyResource(metaclass=Resource):
                model = PuppyModel

    def test_new_wrong_methods(self):
        with pytest.raises(AttributeError):
            class PuppyResource(metaclass=Resource):
                type = PuppyType
                model = PuppyModel
                methods = ('foo',)
