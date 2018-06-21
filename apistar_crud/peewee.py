import typing

from apistar import http, types, validators
from apistar.exceptions import NotFound
from peewee import DoesNotExist

from apistar_crud.base import BaseResource


class Resource(BaseResource):
    @classmethod
    def add_create(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def create(element: input_type) -> output_type:
            """
            Create a new element for this resource.
            """
            record = model.create(**element)
            return http.JSONResponse(output_type(record), status_code=201)

        namespace["create"] = create

    @classmethod
    def add_retrieve(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def retrieve(element_id: str) -> output_type:
            """
            Retrieve an element of this resource.
            """
            try:
                record = model.get_by_id(element_id)
            except DoesNotExist:
                raise NotFound

            return output_type(record)

        namespace["retrieve"] = retrieve

    @classmethod
    def add_update(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def update(element_id: str, element: input_type) -> output_type:
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

        namespace["update"] = update

    @classmethod
    def add_delete(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def delete(element_id: str):
            """
            Delete an element of this resource.
            """
            try:
                record = model.get_by_id(element_id)
            except DoesNotExist:
                raise NotFound

            record.delete_instance()

            return http.JSONResponse(None, status_code=204)

        namespace["delete"] = delete

    @classmethod
    def add_list(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def list_() -> typing.List[output_type]:
            """
            typing.List resource collection.
            """
            return [output_type(record) for record in model.select()]

        namespace["list"] = list_

    @classmethod
    def add_drop(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        class DropOutput(types.Type):
            deleted = validators.Integer(title="deleted", description="Number of deleted elements", minimum=0)

        def drop() -> DropOutput:
            """
            Drop resource collection.
            """
            num_records = model.delete().execute()
            return http.JSONResponse(DropOutput({"deleted": num_records}), status_code=204)

        namespace["drop"] = drop
