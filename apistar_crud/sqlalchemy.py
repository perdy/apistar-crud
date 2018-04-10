from typing import Any, Dict, List

from apistar import Response, typesystem
from apistar.backends.sqlalchemy_backend import Session
from apistar.exceptions import NotFound

from apistar_crud.base import BaseResource


class Resource(BaseResource):
    @classmethod
    def add_create(mcs, namespace: Dict[str, Any], model, type_):
        def create(session: Session, element: type_) -> Response:
            """
            Create a new element for this resource.
            """
            record = model(**element)
            session.add(record)
            session.flush()
            return Response(type_(record), status=201)

        namespace['create'] = create

    @classmethod
    def add_retrieve(mcs, namespace: Dict[str, Any], model, type_):
        def retrieve(session: Session, element_id: str) -> type_:
            """
            Retrieve an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            return type_(record)

        namespace['retrieve'] = retrieve

    @classmethod
    def add_update(mcs, namespace: Dict[str, Any], model, type_):
        def update(session: Session, element_id: str, element: type_) -> Response:
            """
            Update an element of this resource.
            """
            record = session.query(model).get(element_id)
            if record is None:
                raise NotFound

            for k, value in element.items():
                setattr(record, k, value)

            return Response(type_(record), status=200)

        namespace['update'] = update

    @classmethod
    def add_delete(mcs, namespace: Dict[str, Any], model, type_):
        def delete(session: Session, element_id: str):
            """
            Delete an element of this resource.
            """
            session.query(model).filter_by(id=element_id).delete()

        namespace['delete'] = delete

    @classmethod
    def add_list(mcs, namespace: Dict[str, Any], model, type_):
        def list_(session: Session) -> List[type_]:
            """
            List resource collection.
            """
            return [type_(record) for record in session.query(model).all()]

        namespace['list'] = list_

    @classmethod
    def add_replace(mcs, namespace: Dict[str, Any], model, type_):
        def replace(session: Session, collection: typesystem.array(items=type_)) -> List[type_]:
            """
            Replace resource collection with a new one.
            """
            print(collection)
            session.query(model).delete()
            session.add_all([model(**element) for element in collection])
            session.flush()
            return [type_(record) for record in session.query(model).all()]

        namespace['replace'] = replace

    @classmethod
    def add_drop(mcs, namespace: Dict[str, Any], model, type_):
        def drop(session: Session) -> Response:
            """
            Drop resource collection.
            """
            num_records = session.query(model).count()
            session.query(model).delete()
            return Response({'deleted': num_records}, status=204)

        namespace['drop'] = drop
