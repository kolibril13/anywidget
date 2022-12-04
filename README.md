# anywidget

[![PyPI](https://img.shields.io/pypi/v/anywidget.svg?color=green)](https://pypi.org/project/anywidget)
[![License](https://img.shields.io/pypi/l/anywidget.svg?color=green)](https://github.com/manzt/anywidget/raw/main/LICENSE)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/manzt/anywidget/blob/main/examples/Counter.ipynb)

simple, custom jupyter widgets that "just work"

- create widgets **without complicated cookiecutter templates**
- **publish to PyPI** like any other Python package
- prototype **within** `.ipynb` or `.py` files
- run in **Jupyter**, **JupyterLab**, **Google Colab**, **VSCode**, and more
- develop (optionally) with [Vite](https://vitejs.dev/) for **instant HMR**

### installation

```
pip install anywidget
```

### usage

```python
import anywidget
import traitlets

ESM = """
export function render(view) {
    function setCount(update) {
        p.innerText = update;
        view.model.set("count", update);
        view.model.save_changes();
    }
    let root = document.createElement("div");
    Object.assign(root.style, {
        display: "grid",
        gridAutoFlow: "column",
        textAlign: "center",
    })
    let p = Object.assign(document.createElement("p"), {
        innerText: view.model.get("count") ?? 0,
    });
    let decrement = Object.assign(document.createElement("button"), {
        innerText: "-",
        onclick: () => setCount(view.model.get("count") - 1),
    });
    let increment = Object.assign(document.createElement("button"), {
        innerText: "+",
        onclick: () => setCount(view.model.get("count") + 1),
    });
    root.appendChild(decrement);
    root.appendChild(p);
    root.appendChild(increment);
    view.el.appendChild(root);
}
"""

# Alternatively, a URL
# ESM = "http://localhost:5173/index.js"

class CounterWidget(anywidget.AnyWidget):
    _module = traitlets.Unicode(ESM).tag(sync=True) # required, must be ESM
    count = traitlets.Int(0).tag(sync=True)
```

<img alt="Counter with increment and decrement buttons" src="https://user-images.githubusercontent.com/24403730/197911403-88843b90-d905-4877-8cb5-f55b193f2158.png">

### why

**anywidget** simplifies the creation of custom Jupyter widgets – no complicated
build steps or bundling required.

While the official
[cookiecutter templates](https://github.com/jupyter-widgets/?q=cookiecutter&type=all&language=&sort=)
provide the defacto approach for creating a custom Jupyter widget, derived
projects are bootstrapped with complicated packaging and distribution scripts
which must ulitmately be maintained by the widget author. Although this setup
ensures the module is compatabile with various notebook or notebook-like
environments, it places a substantial developer burden on _every_ derived
project to ensure the packaging and distribution code for both Python _and_
JavaScript stays up to date.

Creating custom widgets fun and easy with **anywidget**. You can start
prototyping _within_ a notebook and publish on PyPI like any other Python
module. No need to create a new cookiecutter repo or maintain complicated build
scripts.

### how

Widgets are defined by combining an
[ECMAScript Module](https://nodejs.org/api/esm.html) with a Python class which
derives from `anywidget.AnyWidget`. The provided ECMAScript Module _must_
include a named export called `render` to render the corresponding view. You can
add and sync new properties by adding `traitlets` in your derived Python classes
and subscribing and publishing changes via `view.model` in the client `render`
function.

> **Note** Your JS code _must_ be vaid ESM. You can import dependencies from a
> CDN (e.g., `import * as d3 from "https://esm.sh/d3"`) or use a bundler to
> target ESM.

### development

```bash
pip install -e .
```

If you are using the classic Jupyter Notebook you need to install the
nbextension:

```bash
jupyter nbextension install --py --symlink --sys-prefix anywidget
jupyter nbextension enable --py --sys-prefix anywidget
```

Note for developers:

- the `-e` pip option allows one to modify the Python code in-place. Restart the
  kernel in order to see the changes.
- the `--symlink` argument on Linux or OS X allows one to modify the JavaScript
  code in-place. This feature is not available with Windows.

For developing with JupyterLab:

```
jupyter labextension develop --overwrite anywidget
```

### release

```
npm version [major|minor|patch]
git tag -a vX.X.X -m "vX.X.X"
git push --follow-tags
```
