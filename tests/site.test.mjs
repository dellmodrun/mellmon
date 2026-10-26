import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");

test("public page presents the complete outcome-company lifecycle", () => {
  for (const concept of ["OUTCOME", "COMPANY", "MACHINE", "CHIP", "RECEIPT", "TREASURY", "DISSOLVE"]) {
    assert.match(html, new RegExp(concept, "i"), concept);
  }
  assert.match(html, /Outcome-native agent companies/);
  assert.match(html, /SOLANA/i);
});

test("formation console is wired to a real local planning interaction", () => {
  for (const id of ["formationForm", "outcomeInput", "budgetInput", "deadlineInput", "planNodes"]) {
    assert.match(html, new RegExp(`id="${id}"`), id);
    assert.match(app, new RegExp(`#${id}`), id);
  }
  assert.match(app, /renderPlan\(\)/);
  assert.match(css, /\.plan-node/);
});

test("old frontend identity and unsupported deployment claims are absent", () => {
  assert.doesNotMatch(html, /backplane|hairline|lab note|source browser|why i'm building/i);
  assert.doesNotMatch(html, /Robinhood|EIP.712|ERC.1271|EVM/i);
  assert.doesNotMatch(html, /mainnet live|live mainnet/i);
  assert.match(html, /CA: TBA/);
  assert.doesNotMatch(html, /pump$/im);
});
