API Star CRUD
=============
|build-status| |coverage| |version|

:Version: 0.2.3
:Status: Production/Stable
:Author: José Antonio Perdiguero López

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

    class PuppyResource(metaclass=Resource):
        model = PuppyModel
        input_type = PuppyInputType
        output_type = PuppyOutputType
        methods = ('create', 'retrieve', 'update', 'delete', 'list', 'drop')

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
