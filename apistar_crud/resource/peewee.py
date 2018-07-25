import operator
import typing
from functools import reduce

from apistar import http, types, validators
from apistar.exceptions import NotFound
from apistar_pagination import PageNumberResponse
from peewee import DoesNotExist

from apistar_crud.resource.base import BaseResource


class Resource(BaseResource):
    @classmethod
    def add_create(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def create(cls, element: input_type) -> output_type:
            """
            Create a new element for this resource.
            """
            record = model.create(**element)
            return http.JSONResponse(output_type(record), status_code=201)

        return {"_create": classmethod(create)}

    @classmethod
    def add_retrieve(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def retrieve(cls, element_id: str) -> output_type:
            """
            Retrieve an element of this resource.
            """
            try:
                record = model.get_by_id(element_id)
            except DoesNotExist:
                raise NotFound

            return output_type(record)

        return {"_retrieve": classmethod(retrieve)}

    @classmethod
    def add_update(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def update(cls, element_id: str, element: input_type) -> output_type:
            """
            Update an element of this resource.
            """
            try:
                record = model.get_by_id(element_id)
            except DoesNotExist:
                raise NotFound

            for k, value in element.items():
                setattr(record, k, value)

            record.save()

            return http.JSONResponse(output_type(record), status_code=200)

        return {"_update": classmethod(update)}

    @classmethod
    def add_delete(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def delete(cls, element_id: str) -> typing.Dict[str, typing.Any]:
            """
            Delete an element of this resource.
            """
            try:
                record = model.get_by_id(element_id)
            except DoesNotExist:
                raise NotFound

            record.delete_instance()

            return http.JSONResponse(None, status_code=204)

        return {"_delete": classmethod(delete)}

    @classmethod
    def add_list(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def filter_(cls, **filters) -> typing.List[output_type]:
            """
            Filtering over a resource collection.
            """
            queryset = model.select()

            filters = {k: v for k, v in filters.items() if v}
            if filters:
                queryset = queryset.where(reduce(operator.and_, [(getattr(model, k) == v) for k, v in filters.items()]))

            return [output_type(record) for record in queryset]

        def list_(cls, page: http.QueryParam = None, page_size: http.QueryParam = None) -> typing.List[output_type]:
            """
            List resource collection.
            """
            return PageNumberResponse(page=page, page_size=page_size, content=cls._filter())  # noqa

        return {"_list": classmethod(list_), "_filter": classmethod(filter_)}

    @classmethod
    def add_drop(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        class DropOutput(types.Type):
            deleted = validators.Integer(title="deleted", description="Number of deleted elements", minimum=0)

        def drop(cls) -> DropOutput:
            """
            Drop resource collection.
            """
            num_records = model.delete().execute()
            return http.JSONResponse(DropOutput({"deleted": num_records}), status_code=204)

        return {"_drop": classmethod(drop)}
