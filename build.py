#!/usr/bin/env python3
import sys

from clinner.run import Main


class Build(Main):
    commands = (
        'clinner.run.commands.pytest.pytest',
        'clinner.run.commands.prospector.prospector',
        'clinner.run.commands.sphinx.sphinx',
        'clinner.run.commands.tox.tox',
        'clinner.run.commands.dist.dist',
    )


def main():
    return Build().run()


if __name__ == '__main__':
    sys.exit(main())
