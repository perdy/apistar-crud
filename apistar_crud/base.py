from typing import Any, Dict, Iterable

from apistar import Route
from apistar_crud.signature import Annotations


class BaseResource(type):
    METHODS = {
        'list': ('/', 'GET'),  # List resource collection
        'drop': ('/', 'DELETE'),  # Drop resource entire collection
        'create': ('/', 'POST'),  # Create a new element for this resource
        'retrieve': ('/{element_id}/', 'GET'),  # Retrieve an element of this resource
        'update': ('/{element_id}/', 'PUT'),  # Update an element of this resource
        'delete': ('/{element_id}/', 'DELETE'),  # Delete an element of this resource
    }
    AVAILABLE_METHODS = tuple(METHODS.keys())
    DEFAULT_METHODS = {method: {} for method in ('create', 'retrieve', 'update', 'delete', 'list')}

    def __new__(mcs, name, bases, namespace):
        try:
            model = namespace['model']
            input_type = namespace['input_type']
            output_type = namespace['output_type']
        except KeyError as e:
            raise AttributeError('{} needs to define attribute: "{}"'.format(name, e))

        methods = namespace.get('methods', mcs.DEFAULT_METHODS)

        mcs.add_methods(namespace, methods, model, input_type, output_type)
        mcs.add_routes(namespace, methods.keys())

        return type(name, bases, namespace)

    @classmethod
    def add_routes(mcs, namespace: Dict[str, Any], methods: Iterable[str]):
        routes = [Route(*mcs.METHODS[method], namespace[method], name=method) for method in methods]
        namespace['routes'] = routes

    @classmethod
    def add_methods(mcs, namespace: Dict[str, Any], methods: Dict[str, Annotations],
                    model, input_type, output_type):
        for name, extra_params in methods.items():
            try:
                add_method = getattr(mcs, 'add_{}'.format(name))
                add_method(namespace, model, input_type, output_type, extra_params)
            except AttributeError:
                raise AttributeError('Invalid method "{}", must be one of: {}.'.format(
                    name, ', '.join(mcs.AVAILABLE_METHODS)))

    @classmethod
    def add_create(mcs, namespace: Dict[str, Any], model,
                   input_type, output_type, extra_params: Annotations):
        raise NotImplementedError

    @classmethod
    def add_retrieve(mcs, namespace: Dict[str, Any], model,
                     input_type, output_type, extra_params: Annotations):
        raise NotImplementedError

    @classmethod
    def add_update(mcs, namespace: Dict[str, Any], model,
                   input_type, output_type, extra_params: Annotations):
        raise NotImplementedError

    @classmethod
    def add_delete(mcs, namespace: Dict[str, Any], model,
                   input_type, output_type, extra_params: Annotations):
        raise NotImplementedError

    @classmethod
    def add_list(mcs, namespace: Dict[str, Any], model,
                 input_type, output_type, extra_params: Annotations):
        raise NotImplementedError

    @classmethod
    def add_drop(mcs, namespace: Dict[str, Any], model,
                 input_type, output_type, extra_params: Annotations):
        raise NotImplementedError
