import os
import typing
from importlib.util import find_spec

import peewee
from apistar import App, http, types, validators
from apistar_pagination import PageNumberResponse
from apistar_peewee_orm import Model, PeeweeDatabaseComponent, PeeweeTransactionHook

from apistar_crud.resource.peewee import Resource
from apistar_crud.routes import routes as resource_routes


class PuppyModel(Model):
    name = peewee.CharField()
    number = peewee.IntegerField()
    time = peewee.DateTimeField()
    float = peewee.FloatField()
    bool = peewee.BooleanField()
    # array = peewee.IntegerField()


class PuppyInputType(types.Type):
    name = validators.String(title="name", description="Name")
    number = validators.Integer(title="number", description="Number", default=0)
    time = validators.DateTime(title="time", description="Time")
    float = validators.Number(title="float", description="Float", allow_null=True)
    bool = validators.Boolean(title="bool", description="Boolean", default=False)
    # array = validators.Array(validators.String(), title="array", description="Array")


class PuppyOutputType(types.Type):
    id = validators.Number(title="id", description="ID")
    name = validators.String(title="name", description="Name")
    number = validators.Integer(title="number", description="Number")
    time = validators.DateTime(title="time", description="Time")
    float = validators.Number(title="float", description="Float", allow_null=True)
    bool = validators.Boolean(title="bool", description="Boolean")
    # array = validators.Array(validators.String(), title="array", description="Array")


class PuppyResource(metaclass=Resource):
    name = "puppy"
    verbose_name = "Puppy"
    columns = ("id", "name", "time")

    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")

    @classmethod
    def list(
        cls, name: http.QueryParam, page: http.QueryParam, page_size: http.QueryParam
    ) -> typing.List[PuppyOutputType]:
        return PageNumberResponse(content=cls._filter(name=name), page=page, page_size=page_size)


resource_routes.register(PuppyResource, "/puppy")

components = [PeeweeDatabaseComponent(url="sqlite:///demo.db")]
event_hooks = [PeeweeTransactionHook]
packages = ("apistar_crud",)

app = App(routes=resource_routes.routes(), components=components, event_hooks=event_hooks, packages=packages)

if __name__ == "__main__":
    with components[0].database:
        components[0].database.create_tables([PuppyModel])

    # Patching for autorefresh
    app.statics.whitenoise.autorefresh = True
    for package in packages or []:
        package_dir = os.path.dirname(find_spec(package).origin)
        package_dir = os.path.join(package_dir, "static")
        package_prefix = "/static/" + package
        app.statics.whitenoise.add_files(package_dir, prefix=package_prefix)

    app.document.title = "Demo"
    app.document.description = "API Star CRUD Demo"
    app.serve("0.0.0.0", 8000, debug=True)
