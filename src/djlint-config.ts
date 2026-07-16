import type { JsonObject } from "type-fest";

import { fileURLToPath } from "node:url";
import { arrayIncludes, arrayJoin } from "ts-extras";

import angularConfig from "../presets/angular.json" with { type: "json" };
import djangoConfig from "../presets/django.json" with { type: "json" };
import embeddedConfig from "../presets/embedded.json" with { type: "json" };
import golangConfig from "../presets/golang.json" with { type: "json" };
import handlebarsConfig from "../presets/handlebars.json" with { type: "json" };
import htmlConfig from "../presets/html.json" with { type: "json" };
import jinjaConfig from "../presets/jinja.json" with { type: "json" };
import nunjucksConfig from "../presets/nunjucks.json" with { type: "json" };

/** Portable djLint configuration. */
export type DjlintConfig = Readonly<JsonObject>;

/** Bundled template-language policy choices. */
export type DjlintPreset =
    | "angular"
    | "django"
    | "embedded"
    | "golang"
    | "handlebars"
    | "html"
    | "jinja"
    | "nunjucks";

/** All bundled preset names in stable display order. */
export const djlintPresets: readonly DjlintPreset[] = Object.freeze([
    "html",
    "django",
    "jinja",
    "nunjucks",
    "handlebars",
    "angular",
    "golang",
    "embedded",
]);

const presetConfigs: Readonly<Record<DjlintPreset, DjlintConfig>> = {
    angular: angularConfig,
    django: djangoConfig,
    embedded: embeddedConfig,
    golang: golangConfig,
    handlebars: handlebarsConfig,
    html: htmlConfig,
    jinja: jinjaConfig,
    nunjucks: nunjucksConfig,
};

const presetPaths: Readonly<Record<DjlintPreset, string>> = {
    angular: fileURLToPath(new URL("../presets/angular.json", import.meta.url)),
    django: fileURLToPath(new URL("../presets/django.json", import.meta.url)),
    embedded: fileURLToPath(
        new URL("../presets/embedded.json", import.meta.url)
    ),
    golang: fileURLToPath(new URL("../presets/golang.json", import.meta.url)),
    handlebars: fileURLToPath(
        new URL("../presets/handlebars.json", import.meta.url)
    ),
    html: fileURLToPath(new URL("../presets/html.json", import.meta.url)),
    jinja: fileURLToPath(new URL("../presets/jinja.json", import.meta.url)),
    nunjucks: fileURLToPath(
        new URL("../presets/nunjucks.json", import.meta.url)
    ),
};

const isPreset = (value: unknown): value is DjlintPreset =>
    arrayIncludes(djlintPresets, value);

/** Create a preset with consumer overrides. */
export function createDjlintConfig(
    preset: DjlintPreset = "html",
    overrides: DjlintConfig = {}
): DjlintConfig {
    return structuredClone({ ...presetConfigs[preset], ...overrides });
}

/**
 * Return the absolute path to one bundled `.djlintrc`-format preset.
 *
 * @throws {@link RangeError} If `preset` is not bundled.
 */
export function getDjlintConfigPath(preset: DjlintPreset = "html"): string {
    if (!isPreset(preset)) {
        throw new RangeError(
            `Unknown djLint preset: ${String(valueForMessage(preset))}. Expected one of: ${arrayJoin(djlintPresets, ", ")}.`
        );
    }
    return presetPaths[preset];
}

/** Load a fresh copy of one bundled preset. */
export function loadDjlintConfig(
    preset: DjlintPreset = "html"
): Promise<DjlintConfig> {
    return Promise.resolve(structuredClone(presetConfigs[preset]));
}

function valueForMessage(value: unknown): unknown {
    return value;
}

/** Recommended HTML policy. */
const defaultConfig: DjlintConfig = Object.freeze(createDjlintConfig());

export default defaultConfig;
