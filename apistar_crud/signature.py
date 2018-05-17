import inspect
from itertools import chain
from typing import Callable, Dict, Iterable

Annotations = Dict[str, type]


def params(annoations: Annotations) -> Iterable[inspect.Parameter]:
    return (inspect.Parameter(name, kind=inspect._POSITIONAL_OR_KEYWORD, annotation=annotation)
            for name, annotation in annoations.items())


def add_params(sig: inspect.Signature, annoations: Annotations) -> inspect.Signature:
    return sig.replace(parameters=chain(sig.parameters.values(), params(annoations)))


def inject_params(fn: Callable, annotated_params: Annotations):
    fn.__annotations__.update(annotated_params)
    fn.__signature__ = add_params(inspect.signature(fn), annotated_params)
