#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import re

from setuptools import setup


def get_version(package):
    """
    Return package version as listed in `__version__` in `init.py`.
    """
    with open(os.path.join(package, "__init__.py")) as f:
        init_py = f.read()

    return re.search("__version__ = ['\"]([^'\"]+)['\"]", init_py).group(1)


def get_packages(package):
    """
    Return root package and all sub-packages.
    """
    return [
        dirpath
        for dirpath, dirnames, filenames in os.walk(package)
        if os.path.exists(os.path.join(dirpath, "__init__.py"))
    ]


def get_package_data(package):
    """
    Return all files under the root package, that are not in a package themselves.
    """
    walk = [
        (dirpath.replace(package + os.sep, "", 1), filenames)
        for dirpath, dirnames, filenames in os.walk(package)
        if not os.path.exists(os.path.join(dirpath, "__init__.py"))
    ]

    filepaths = []
    for base, filenames in walk:
        filepaths.extend([os.path.join(base, filename) for filename in filenames])
    return {package: filepaths}


def get_long_description(long_description_file):
    """
    Read long description from file.
    """
    with open(long_description_file) as f:
        long_description = f.read()

    return long_description


name = "apistar-crud"
package_name = "apistar_crud"
version = get_version(package_name)

setup(
    name=name,
    version=version,
    description="API Star tools to create CRUD resources.",
    long_description=get_long_description("README.rst"),
    author="José Antonio Perdiguero López",
    author_email="perdy.hh@gmail.com",
    maintainer="José Antonio Perdiguero López",
    maintainer_email="perdy.hh@gmail.com",
    url="https://github.com/PeRDy/apistar-crud",
    download_url="https://github.com/PeRDy/apistar-crud",
    packages=get_packages(package_name),
    package_data=get_package_data(package_name),
    install_requires=["apistar"],
    tests_require=[
        "apistar",
        "apistar-sqlalchemy",
        "aiohttp",
        "clinner",
        "coverage",
        "Django",
        "prospector",
        "pytest",
        "pytest-xdist",
        "pytest-cov",
        "SQLAlchemy",
        "tox",
    ],
    license="GPLv3",
    keywords=" ".join(["python", "apistar", "api", "resource", "crud", "async", "django", "sqlalchemy"]),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Natural Language :: English",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
