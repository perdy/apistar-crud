from typing import Any, Dict, List

from apistar import Response
from apistar.backends.sqlalchemy_backend import Session
from apistar.exceptions import NotFound

from apistar_crud.base import CRUDResource


class SQLAlchemyCRUDResource(CRUDResource):
    @classmethod
    def add_create(mcs, namespace: Dict[str, Any], model, type_):
        async def create(session: Session, element: type_) -> Response:
            """
            Create a new element for this resource.
            """
            node = model(**element)
            session.add(node)
            session.flush()
            return Response({'id': node.id}, status=201)

        namespace['create'] = create

    @classmethod
    def add_retrieve(mcs, namespace: Dict[str, Any], model, type_):
        async def retrieve(session: Session, element_id: str) -> type_:
            """
            Retrieve an element of this resource.
            """
            node = session.query(model).get(element_id)
            if node is None:
                raise NotFound

            return type_(node)

        namespace['retrieve'] = retrieve

    @classmethod
    def add_update(mcs, namespace: Dict[str, Any], model, type_):
        async def update(session: Session, element_id: str, element: type_) -> Response:
            """
            Update an element of this resource.
            """
            node = session.query(model).filter(id=element_id).update(element)
            session.flush()
            return Response({'id': node.id}, status=200)

        namespace['update'] = update

    @classmethod
    def add_delete(mcs, namespace: Dict[str, Any], model, type_):
        async def delete(session: Session, element_id: str):
            """
            Delete an element of this resource.
            """
            session.query(model).filter(id=element_id).delete()

        namespace['delete'] = delete

    @classmethod
    def add_list(mcs, namespace: Dict[str, Any], model, type_):
        def list(session: Session) -> List[type_]:
            """
            List resource collection.
            """
            return [type_(node) for node in session.query(model).all()]

        namespace['list'] = list

    @classmethod
    def add_replace(mcs, namespace: Dict[str, Any], model, type_):
        async def replace(session: Session, collection: List[type_]) -> List[type_]:
            """
            Replace resource entire collection with a new one.
            """
            session.query(model).delete()
            session.add_all([model(**element) for element in collection])
            session.flush()
            return [type_(node) for node in session.query(model).all()]

        namespace['replace'] = replace

    @classmethod
    def add_drop(mcs, namespace: Dict[str, Any], model, type_):
        async def drop(session: Session) -> Dict[str, int]:
            """
            Drop resource entire collection.
            """
            num_nodes = session.query(model).count()
            session.query(model).delete()
            return {'deleted': num_nodes}

        namespace['drop'] = drop
