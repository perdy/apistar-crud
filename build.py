#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

from clinner.run import Main


class Build(Main):
    commands = (
        "clinner.run.commands.black.black",
        "clinner.run.commands.flake8.flake8",
        "clinner.run.commands.isort.isort",
        "clinner.run.commands.pytest.pytest",
        "clinner.run.commands.tox.tox",
    )


def main():
    return Build().run()


if __name__ == "__main__":
    sys.exit(main())
