# -*- coding: utf-8 -*-

import inspect
from collections import OrderedDict
from apistar_crud import signature


PARAMS = OrderedDict([('f', float), ('s', str)])


def foo(i: int) -> int:
    return i + 1


def test_params():
    params = signature.params(PARAMS)
    assert str(list(params)) == '[<Parameter "f:float">, <Parameter "s:str">]'


def test_add_params():
    foo_sig = inspect.signature(foo)
    new_sig = signature.add_params(foo_sig, PARAMS)
    assert str(new_sig) == '(i:int, f:float, s:str) -> int'


def test_inject_params():
    # when
    signature.inject_params(foo, OrderedDict([('f', float), ('s', str)]))
    # than
    assert str(inspect.signature(foo)) == '(i:int, f:float, s:str) -> int'
    assert foo.__annotations__ == {'i': int, 'f': float, 's': str, 'return': int}
