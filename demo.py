import typing

import peewee
from apistar import App, http, types, validators
from apistar_peewee_orm import Model, PeeweeDatabaseComponent, PeeweeTransactionHook

from apistar_crud.resource.peewee import Resource
from apistar_crud.routes import routes as resource_routes


class PuppyModel(Model):
    name = peewee.CharField()
    number = peewee.IntegerField()
    time = peewee.DateTimeField()
    float = peewee.FloatField()


class PuppyType(types.Type):
    name = validators.String()
    number = validators.Integer()
    time = validators.DateTime()
    float = validators.Number()


class PuppyResource(metaclass=Resource):
    name = "puppy"
    verbose_name = "Puppy"

    model = PuppyModel
    input_type = PuppyType
    output_type = PuppyType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")

    @classmethod
    def list(cls, name: http.QueryParam) -> typing.List[PuppyType]:
        return cls._list(name=name)


resource_routes.register(PuppyResource, "/puppy")

components = [PeeweeDatabaseComponent(url="sqlite:///demo.db")]
event_hooks = [PeeweeTransactionHook]

app = App(routes=resource_routes.routes(), components=components, event_hooks=event_hooks, packages=("apistar_crud",))


if __name__ == "__main__":

    with components[0].database:
        components[0].database.create_tables([PuppyModel])

    app.serve("0.0.0.0", 8000, debug=True)
