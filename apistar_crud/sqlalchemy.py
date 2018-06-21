import typing

from apistar import http, types, validators
from apistar.exceptions import NotFound
from sqlalchemy.orm import Session

from apistar_crud.base import BaseResource


class Resource(BaseResource):
    @classmethod
    def add_create(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def create(session: Session, element: input_type) -> output_type:
            """
            Create a new element for this resource.
            """
            record = model(**element)
            session.add(record)
            session.flush()
            return http.JSONResponse(output_type(record), status_code=201)

        namespace["create"] = create

    @classmethod
    def add_retrieve(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def retrieve(session: Session, element_id: str) -> output_type:
            """
            Retrieve an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            return output_type(record)

        namespace["retrieve"] = retrieve

    @classmethod
    def add_update(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def update(session: Session, element_id: str, element: input_type) -> output_type:
            """
            Update an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            for k, value in element.items():
                setattr(record, k, value)

            return http.JSONResponse(output_type(record), status_code=200)

        namespace["update"] = update

    @classmethod
    def add_delete(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def delete(session: Session, element_id: str):
            """
            Delete an element of this resource.
            """
            if session.query(model).filter_by(id=element_id).count() == 0:
                raise NotFound

            session.query(model).filter_by(id=element_id).delete()
            return http.JSONResponse(None, status_code=204)

        namespace["delete"] = delete

    @classmethod
    def add_list(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        def list_(session: Session) -> typing.List[output_type]:
            """
            typing.List resource collection.
            """
            return [output_type(record) for record in session.query(model).all()]

        namespace["list"] = list_

    @classmethod
    def add_drop(mcs, namespace: typing.Dict[str, typing.Any], model, input_type, output_type):
        class DropOutput(types.Type):
            deleted = validators.Integer(title="deleted", description="Number of deleted elements", minimum=0)

        def drop(session: Session) -> DropOutput:
            """
            Drop resource collection.
            """
            num_records = session.query(model).count()
            session.query(model).delete()
            return http.JSONResponse(DropOutput({"deleted": num_records}), status_code=204)

        namespace["drop"] = drop
