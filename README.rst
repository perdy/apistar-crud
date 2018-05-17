API Star CRUD
=============
|build-status| |coverage| |version|

:Version: 0.3.0
:Status: Production/Stable
:Author: José Antonio Perdiguero López,
         Chen Rotem Levy

API Star tools to create CRUD resources.

Features
--------
The resources are classes with a default implementation for **methods**:

* `create`: Create a new element for this resource.
* `retrieve`: Retrieve an element of this resource.
* `update`: Update (partially or fully) an element of this resource.
* `delete`: Delete an element of this resource.
* `list`: List resource collection.
* `drop`: Drop resource collection.

----

The **routes** for these methods are:

======== ====== ==============
Method   Verb   URL
======== ====== ==============
create   POST   /
retrieve GET    /{element_id}/
update   PUT    /{element_id}/
delete   DELETE /{element_id}/
list     GET    /
drop     DELETE /
======== ====== ==============

Quick start
-----------
Install API star CRUD:

.. code:: bash

    pip install apistar-crud

Create a **model** for your resource:

.. code:: python

    # Example using SQL Alchemy

    class PuppyModel(Base):
        __tablename__ = "Puppy"

        id = Column(Integer, primary_key=True)
        name = Column(String)

Assuming you have some an **authentication** module:

.. code:: python

    from apistar import Component, exceptions, http

    def verify(self, authorization: http.Header,
                             expected_user, expected_password) -> bool:
        if authorization is None:
            return False

        scheme, token = authorization.split()
        if scheme.lower() != 'basic':
            return False

        username, password = base64.b64decode(token).decode('utf-8').split(':')
        # Just an example here. You'd normally want to make a database lookup,
        # and check against a hash of the password.
        return username == expected_user and password == expected_password

    class User:
        pass

    class UserComponent(Component):
        def resolve(self: authorization: http.Header) -> User:
            if verify(authorization, 'user', 'secret'):
                return User()
            else:
                raise exceptions.Forbidden

    class Admin:
        pass

    class AdminComponent(Component):
        def resolve(self: authorization: http.Header) -> User:
            if verify(authorization, 'admin', 'super secret'):
                return Admin()
            else:
                raise Forbidden

Create an **input type** and **output_type** for your resource:

.. code:: python

    class PuppyInputType(types.Type):
        name = validators.String()

    class PuppyOutputType(types.Type):
        id = validators.Integer()
        name = validators.String()

Now create your **resource**:

.. code:: python

    from apistar_crud.sqlalchemy import Resource
    from authentication import User, Admin

    class PuppyResource(metaclass=Resource):
        model = PuppyModel
        input_type = PuppyInputType
        output_type = PuppyOutputType
        # Here ask for no authorization for retrieve and list, only allow User
        # to create and update, and allow only Admin to drop:
        methods = {'create': {'auth': User}, 'retrieve': {}, 'update': {'auth': User},
                   'delete': {'auth': User}, 'list': {}, 'drop': {'auth': Admin}}

The resource generates his own **routes**, so you can add it to your main routes list:

.. code:: python

    from apistar import Include

    routes = [
        Include('/puppy/', PuppyResource.routes, namespace='puppy'),
    ]


.. |build-status| image:: https://travis-ci.org/PeRDy/apistar-crud.svg?branch=master
    :alt: build status
    :scale: 100%
    :target: https://travis-ci.org/PeRDy/apistar-crud
.. |coverage| image:: https://codecov.io/gh/PeRDy/apistar-crud/branch/master/graph/badge.svg
    :alt: coverage
    :scale: 100%
    :target: https://codecov.io/gh/PeRDy/apistar-crud/branch/master/graph/badge.svg
.. |version| image:: https://badge.fury.io/py/apistar-crud.svg
    :alt: version
    :scale: 100%
    :target: https://badge.fury.io/py/apistar-crud
