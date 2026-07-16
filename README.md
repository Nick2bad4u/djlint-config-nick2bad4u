# djlint-config-nick2bad4u

[![Continuous Integration](https://github.com/Nick2bad4u/djlint-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/djlint-config-nick2bad4u/actions/workflows/ci.yml)

Portable configuration data for [djLint](https://djlint.com/), covering its
supported HTML template-language profiles.

## Important installation boundary

djLint is a Python application. Installing this npm package does **not** install
djLint. Install the tool independently, for example:

```sh
uv tool install djlint==1.40.7
npm install --save-dev djlint-config-nick2bad4u
```

`pipx install djlint==1.40.7` is an equivalent tool installation.

## Presets

| Preset       | djLint profile/use                                 |
| ------------ | -------------------------------------------------- |
| `html`       | Recommended plain HTML policy.                     |
| `django`     | Django templates and useful tag-group blank lines. |
| `jinja`      | Jinja/Jinja2 templates.                            |
| `nunjucks`   | Nunjucks/Twig-like templates.                      |
| `handlebars` | Handlebars and Mustache templates.                 |
| `angular`    | Angular HTML templates.                            |
| `golang`     | Go HTML/template files.                            |
| `embedded`   | Plain HTML plus opt-in embedded CSS/JS formatting. |

Embedded CSS/JavaScript formatting is intentionally opt-in because it may
conflict with Prettier, Biome, or framework compilers.

## CLI usage

```sh
djlint --configuration node_modules/djlint-config-nick2bad4u/presets/django.json --lint templates
djlint --configuration node_modules/djlint-config-nick2bad4u/presets/django.json --check templates
```

The compatibility path `recommended.json` selects the `html` policy.

## JavaScript API

The JavaScript API resolves data paths for Node-based automation; it does not
wrap or install Python:

```js
import {
 createDjlintConfig,
 getDjlintConfigPath,
 loadDjlintConfig,
} from "djlint-config-nick2bad4u";

const configPath = getDjlintConfigPath("jinja");
const config = await loadDjlintConfig("django");
const twoSpaces = createDjlintConfig("html", { indent: 2 });
```

## Design notes

- Presets use `extend_exclude` so djLint's own default excludes remain active.
- Blank-line options contain actual template tag lists; the string `"true"`
  would only name a nonexistent tag and is not a Boolean setting.
- No preset silently ignores the linter's rule catalog.

## Requirements

- Node.js `^22.22.3`, `^24.16.0`, or `>=26.3.0` for the package API
- Python and djLint `1.40.7` for linting/formatting

## License

[MIT](LICENSE)
