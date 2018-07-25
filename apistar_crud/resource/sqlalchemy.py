import typing

from apistar import http, types, validators
from apistar.exceptions import NotFound
from apistar_pagination import PageNumberResponse
from sqlalchemy.orm import Session

from apistar_crud.resource.base import BaseResource


class Resource(BaseResource):
    @classmethod
    def add_create(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def create(cls, session: Session, element: input_type) -> output_type:
            """
            Create a new element for this resource.
            """
            record = model(**element)
            session.add(record)
            session.flush()
            return http.JSONResponse(output_type(record), status_code=201)

        return {"_create": classmethod(create)}

    @classmethod
    def add_retrieve(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def retrieve(cls, session: Session, element_id: str) -> output_type:
            """
            Retrieve an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            return output_type(record)

        return {"_retrieve": classmethod(retrieve)}

    @classmethod
    def add_update(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def update(cls, session: Session, element_id: str, element: input_type) -> output_type:
            """
            Update an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            for k, value in element.items():
                setattr(record, k, value)

            return http.JSONResponse(output_type(record), status_code=200)

        return {"_update": classmethod(update)}

    @classmethod
    def add_delete(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def delete(cls, session: Session, element_id: str) -> typing.Dict[str, typing.Any]:
            """
            Delete an element of this resource.
            """
            if session.query(model).filter_by(id=element_id).count() == 0:
                raise NotFound

            session.query(model).filter_by(id=element_id).delete()
            return http.JSONResponse(None, status_code=204)

        return {"_delete": classmethod(delete)}

    @classmethod
    def add_list(mcs, model, input_type, output_type) -> typing.Dict[str, typing.Any]:
        def filter_(cls, session: Session, **filters) -> typing.List[output_type]:
            """
            Filter resource collection.
            """
            filters = {k: v for k, v in filters.items() if v}
            if filters:
                queryset = session.query(model).filter_by(**filters)
            else:
                queryset = session.query(model).all()

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

        def drop(cls, session: Session) -> DropOutput:
            """
            Drop resource collection.
            """
            num_records = session.query(model).count()
            session.query(model).delete()
            return http.JSONResponse(DropOutput({"deleted": num_records}), status_code=204)

        return {"_drop": classmethod(drop)}
