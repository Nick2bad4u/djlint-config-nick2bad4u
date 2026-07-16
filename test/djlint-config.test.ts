import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import defaultConfig, {
    createDjlintConfig,
    type DjlintPreset,
    djlintPresets,
    getDjlintConfigPath,
    loadDjlintConfig,
} from "../src/djlint-config.js";

interface PythonCommand {
    readonly args: readonly string[];
    readonly executable: string;
}

function findPython(): PythonCommand {
    // eslint-disable-next-line n/no-process-env -- optional test-only interpreter override
    const configuredPython = process.env["DJLINT_PYTHON"];
    const candidates: readonly PythonCommand[] = [
        ...(typeof configuredPython === "string" && configuredPython.length > 0
            ? [{ args: [], executable: configuredPython }]
            : []),
        ...(process.platform === "win32"
            ? [{ args: ["-3"], executable: "py" }]
            : []),
        { args: [], executable: "python3" },
        { args: [], executable: "python" },
    ];

    for (const candidate of candidates) {
        const result = spawnSync(
            candidate.executable,
            [
                ...candidate.args,
                "-m",
                "djlint",
                "--version",
            ],
            { encoding: "utf8" }
        );
        if (result.status === 0) return candidate;
    }

    throw new Error(
        "djLint is required for tests. Install Python and run `python -m pip install djlint==1.40.7`."
    );
}

const python = findPython();
const fixture = { root: "" };

beforeAll(async () => {
    fixture.root = await mkdtemp(path.join(tmpdir(), "djlint-config-"));
});

afterAll(async () => {
    await rm(fixture.root, { force: true, recursive: true });
});

describe("djLint presets", () => {
    it.each(djlintPresets)("loads the %s preset", async (preset) => {
        const configPath = getDjlintConfigPath(preset);

        await expect(loadDjlintConfig(preset)).resolves.toStrictEqual(
            JSON.parse(await readFile(configPath, "utf8"))
        );
    });

    it("keeps the default export aligned with html", async () => {
        expect(defaultConfig).toStrictEqual(await loadDjlintConfig("html"));
    });

    it("uses actual tag lists instead of ineffective true strings", async () => {
        const django = await loadDjlintConfig("django");

        expect(django["blank_line_after_tag"]).toBe("extends,load,include");
        expect(django["blank_line_before_tag"]).not.toBe("true");
    });

    it("keeps embedded formatting opt-in", async () => {
        expect((await loadDjlintConfig("html"))["format_css"]).toBeUndefined();
        expect((await loadDjlintConfig("embedded"))["format_css"]).toBe(true);
        expect((await loadDjlintConfig("embedded"))["format_js"]).toBe(true);
    });

    it("lets consumers override flat options", () => {
        const config = createDjlintConfig("html", { indent: 2 });

        expect(config["indent"]).toBe(2);
        expect(config["profile"]).toBe("html");
    });

    it("rejects invented profiles", () => {
        expect(() => getDjlintConfigPath("react" as DjlintPreset)).toThrow(
            RangeError
        );
    });

    it.each(djlintPresets)(
        "runs the real djLint CLI with %s",
        async (preset) => {
            const htmlPath = path.join(fixture.root, `${preset}.html`);
            await writeFile(
                htmlPath,
                '<!doctype html>\n<html lang="en">\n    <head>\n        <meta name="description" content="Fixture page" />\n        <meta name="keywords" content="fixture" />\n        <title>Fixture</title>\n    </head>\n    <body>\n        <p>Fixture</p>\n    </body>\n</html>\n'
            );
            const result = spawnSync(
                python.executable,
                [
                    ...python.args,
                    "-m",
                    "djlint",
                    "--configuration",
                    getDjlintConfigPath(preset),
                    "--lint",
                    htmlPath,
                ],
                { encoding: "utf8" }
            );

            expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
        }
    );
});
