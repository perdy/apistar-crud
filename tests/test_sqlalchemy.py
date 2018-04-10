import pytest
from apistar import Include, TestClient, typesystem
from apistar.backends import sqlalchemy_backend
from apistar.frameworks.asyncio import ASyncIOApp
from apistar.frameworks.wsgi import WSGIApp
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

from apistar_crud.sqlalchemy import Resource

Base = declarative_base()


class PuppyModel(Base):
    __tablename__ = "Puppy"
    id = Column(Integer, primary_key=True)
    name = Column(String)


class PuppyType(typesystem.Object):
    properties = {
        'id': typesystem.Integer,
        'name': typesystem.String
    }


class PuppyResource(metaclass=Resource):
    model = PuppyModel
    type = PuppyType
    methods = ('create', 'retrieve', 'update', 'delete', 'list', 'replace', 'drop')


routes = [
    Include('/puppy', PuppyResource.routes, namespace='puppy'),
]

settings = {
    "DATABASE": {
        "URL": 'sqlite://',
        "METADATA": Base.metadata
    }
}

wsgi_app = WSGIApp(
    routes=routes,
    settings=settings,
    commands=sqlalchemy_backend.commands,
    components=sqlalchemy_backend.components
)

async_app = ASyncIOApp(
    routes=routes,
    settings=settings,
    commands=sqlalchemy_backend.commands,
    components=sqlalchemy_backend.components
)


class TestCaseSQLAlchemyCRUD:
    @pytest.fixture(scope='function')
    def client(self, request):
        app = request.param
        app.main(['create_tables'])
        yield TestClient(app)
        app.main(['drop_tables'])

    @pytest.fixture
    def puppy(self):
        return {'name': 'canna'}

    @pytest.fixture
    def another_puppy(self):
        return {'name': 'puppito'}

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_create(self, client, puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [created_puppy]

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_retrieve(self, client, puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # Retrieve same record
        response = client.get('/puppy/{}'.format(created_puppy['id']))
        assert response.status_code == 200
        assert response.json() == created_puppy

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_retrieve_not_found(self, client):
        # retrieve wrong record
        response = client.get('/puppy/foo/')
        assert response.status_code == 404

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_update(self, client, puppy, another_puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # Update record
        response = client.put('/puppy/{}/'.format(created_puppy['id']), json=another_puppy)
        assert response.status_code == 200
        updated_puppy = response.json()
        assert updated_puppy['name'] == 'puppito'

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [updated_puppy]

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_update_not_found(self, client, puppy):
        # retrieve wrong record
        response = client.put('/puppy/foo/', json=puppy)
        assert response.status_code == 404

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_delete(self, client, puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # Retrieve same record
        response = client.get('/puppy/{}/'.format(created_puppy['id']))
        assert response.status_code == 200
        assert response.json() == created_puppy

        # Delete record
        response = client.delete('/puppy/{}/'.format(created_puppy['id']))
        assert response.status_code == 204

        # Retrieve deleted record
        response = client.get('/puppy/{}'.format(created_puppy['id']))
        assert response.status_code == 404

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_list(self, client, puppy, another_puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # Successfully create another new record
        response = client.post('/puppy/', json=another_puppy)
        assert response.status_code == 201
        created_second_puppy = response.json()
        assert created_second_puppy['name'] == 'puppito'

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [created_puppy, created_second_puppy]

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_replace(self, client, puppy, another_puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # Successfully create another new record
        response = client.post('/puppy/', json=another_puppy)
        assert response.status_code == 201
        created_second_puppy = response.json()
        assert created_second_puppy['name'] == 'puppito'

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [created_puppy, created_second_puppy]

        # Replace collection
        response = client.put('/puppy/', json=[puppy])
        assert response.status_code == 200
        assert response.json() == [created_puppy]

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [created_puppy]

    @pytest.mark.parametrize('client', [wsgi_app, async_app], indirect=['client'])
    def test_drop(self, client, puppy):
        # Successfully create a new record
        response = client.post('/puppy/', json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy['name'] == 'canna'

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == [created_puppy]

        # Drop collection
        response = client.delete('/puppy/', json=[puppy])
        assert response.status_code == 204
        assert response.json() == {'deleted': 1}

        # List all the existing records
        response = client.get('/puppy/')
        assert response.status_code == 200
        assert response.json() == []
