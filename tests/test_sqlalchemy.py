import pytest
from apistar import App, ASyncApp, Include, TestClient, types, validators
from apistar_sqlalchemy import database
from apistar_sqlalchemy.components import SQLAlchemySessionComponent
from apistar_sqlalchemy.event_hooks import SQLAlchemyTransactionHook
from sqlalchemy import Column, Integer, String

from apistar_crud.sqlalchemy import Resource


class PuppyModel(database.Base):
    __tablename__ = "Puppy"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)


class PuppyInputType(types.Type):
    name = validators.String()


class PuppyOutputType(types.Type):
    id = validators.Integer(allow_null=True, default=None)
    name = validators.String()


class PuppyResource(metaclass=Resource):
    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")


routes = [Include("/puppy", "puppy", PuppyResource.routes)]

sqlalchemy_component = SQLAlchemySessionComponent(url="sqlite://")
components = [sqlalchemy_component]
event_hooks = [SQLAlchemyTransactionHook()]

app = App(routes=routes, components=components, event_hooks=event_hooks)
async_app = ASyncApp(routes=routes, components=components, event_hooks=event_hooks)


class TestCaseSQLAlchemyCRUD:

    @pytest.fixture(scope="function", params=[app, async_app])
    def client(self, request):
        database.Base.metadata.create_all(sqlalchemy_component.engine)
        yield TestClient(request.param)
        database.Base.metadata.drop_all(sqlalchemy_component.engine)

    @pytest.fixture
    def puppy(self):
        return {"name": "canna"}

    @pytest.fixture
    def another_puppy(self):
        return {"name": "puppito"}

    def test_create(self, client, puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # List all the existing records
        response = client.get("/puppy/")
        assert response.status_code == 200
        assert response.json() == [created_puppy]

    def test_retrieve(self, client, puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # Retrieve same record
        response = client.get("/puppy/{}".format(created_puppy["id"]))
        assert response.status_code == 200
        assert response.json() == created_puppy

    def test_retrieve_not_found(self, client):
        # retrieve wrong record
        response = client.get("/puppy/foo/")
        assert response.status_code == 404

    def test_update(self, client, puppy, another_puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # Update record
        response = client.put("/puppy/{}/".format(created_puppy["id"]), json=another_puppy)
        assert response.status_code == 200
        updated_puppy = response.json()
        assert updated_puppy["name"] == "puppito"

        # List all the existing records
        response = client.get("/puppy/")
        assert response.status_code == 200
        assert response.json() == [updated_puppy]

    def test_update_not_found(self, client, puppy):
        # retrieve wrong record
        response = client.put("/puppy/foo/", json=puppy)
        assert response.status_code == 404

    def test_delete(self, client, puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # Retrieve same record
        response = client.get("/puppy/{}/".format(created_puppy["id"]))
        assert response.status_code == 200
        assert response.json() == created_puppy

        # Delete record
        response = client.delete("/puppy/{}/".format(created_puppy["id"]))
        assert response.status_code == 204

        # Retrieve deleted record
        response = client.get("/puppy/{}".format(created_puppy["id"]))
        assert response.status_code == 404

    def test_list(self, client, puppy, another_puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # Successfully create another new record
        response = client.post("/puppy/", json=another_puppy)
        assert response.status_code == 201
        created_second_puppy = response.json()
        assert created_second_puppy["name"] == "puppito"

        # List all the existing records
        response = client.get("/puppy/")
        assert response.status_code == 200
        assert response.json() == [created_puppy, created_second_puppy]

    def test_drop(self, client, puppy):
        # Successfully create a new record
        response = client.post("/puppy/", json=puppy)
        assert response.status_code == 201
        created_puppy = response.json()
        assert created_puppy["name"] == "canna"

        # List all the existing records
        response = client.get("/puppy/")
        assert response.status_code == 200
        assert response.json() == [created_puppy]

        # Drop collection
        response = client.delete("/puppy/", json=[puppy])
        assert response.status_code == 204
        assert response.json() == {"deleted": 1}

        # List all the existing records
        response = client.get("/puppy/")
        assert response.status_code == 200
        assert response.json() == []
