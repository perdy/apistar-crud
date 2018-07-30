import re
import typing

from apistar import Route


class BaseResource(type):
    METHODS = {
        "list": ("/", "GET"),  # List resource collection
        "drop": ("/", "DELETE"),  # Drop resource entire collection
        "create": ("/", "POST"),  # Create a new element for this resource
        "retrieve": ("/{element_id}/", "GET"),  # Retrieve an element of this resource
        "update": ("/{element_id}/", "PUT"),  # Update an element of this resource
        "delete": ("/{element_id}/", "DELETE"),  # Delete an element of this resource
    }
    AVAILABLE_METHODS = tuple(METHODS.keys())
    DEFAULT_METHODS = ("create", "retrieve", "update", "delete", "list")

    def __new__(mcs, name, bases, namespace):
        try:
            resource_name = namespace.get("name", name.lower())
            model = namespace["model"]
            input_type = namespace["input_type"]
            output_type = namespace["output_type"]
        except KeyError as e:
            raise AttributeError('{} needs to define attribute: "{}"'.format(name, e))

        # Check resource name validity
        if re.match("[a-zA-Z][-_a-zA-Z]", resource_name) is None:
            raise AttributeError('Invalid resource name "{}"'.format(resource_name))

        # Add valid name and verbose name
        namespace["name"] = resource_name
        namespace["verbose_name"] = namespace.get("verbose_name", namespace["name"])

        # Default columns and order
        namespace["columns"] = namespace.get("columns", ["id"])
        namespace["order"] = namespace.get("order", "id")

        methods = namespace.get("methods", mcs.DEFAULT_METHODS)

        # Create CRUD methods and routes
        mcs.add_methods(namespace, methods, model, input_type, output_type)
        mcs.add_routes(namespace, methods)

        return type(name, bases, namespace)

    @classmethod
    def add_routes(mcs, namespace: typing.Dict[str, typing.Any], methods: typing.Iterable[str]):
        class Routes:
            """Routes descriptor"""

            def __get__(self, instance, owner):
                return [Route(*mcs.METHODS[method], getattr(owner, method), name=method) for method in methods]

        namespace["routes"] = Routes()

    @classmethod
    def add_methods(
        mcs, namespace: typing.Dict[str, typing.Any], methods: typing.Iterable[str], model, input_type, output_type
    ):
        # Generate CRUD methods
        crud_ns = {
            k: v for m in methods for k, v in getattr(mcs, "add_{}".format(m))(model, input_type, output_type).items()
        }

        # Preserve already defined methods
        crud_ns.update({m: crud_ns[f"_{m}"] for m in methods if m not in namespace})

        namespace.update(crud_ns)

    @classmethod
    def add_create(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError

    @classmethod
    def add_retrieve(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError

    @classmethod
    def add_update(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError

    @classmethod
    def add_delete(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError

    @classmethod
    def add_list(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError

    @classmethod
    def add_drop(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        raise NotImplementedError
