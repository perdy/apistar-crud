import pytest
from apistar import Route, typesystem

# Fake model
from apistar_crud.sqlalchemy import Resource


class PuppyModel:
    id = 1
    name = 'Canna'


class PuppyType(typesystem.Object):
    properties = {
        'id': typesystem.Integer,
        'name': typesystem.String
    }


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
        assert [route.view for route in resource.routes] == \
               [resource.create, resource.retrieve, resource.update, resource.delete, resource.list]

    @pytest.mark.parametrize('resource', [('create', 'retrieve', 'update', 'delete', 'list', 'replace', 'drop')],
                             indirect=['resource'])
    def test_new_explicit_methods(self, resource):
        assert hasattr(resource, 'create')
        assert hasattr(resource, 'retrieve')
        assert hasattr(resource, 'update')
        assert hasattr(resource, 'delete')
        assert hasattr(resource, 'list')
        assert hasattr(resource, 'replace')
        assert hasattr(resource, 'drop')
        assert len(resource.routes) == 7
        assert [route.view for route in resource.routes] == \
               [resource.create, resource.retrieve, resource.update, resource.delete, resource.list, resource.replace,
                resource.drop]

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
