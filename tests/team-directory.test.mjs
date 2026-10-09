import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterTeamMembers, normalizeTeamQuery } from "../src/lib/team-directory.ts";

const team = JSON.parse(readFileSync(new URL("../src/data/team.json", import.meta.url), "utf8"));

test("directorio muestra todos los integrantes sin alterar los datos", () => {
  assert.equal(filterTeamMembers(team, "todos", "").length, team.length);
  assert.equal(team.length, 14);
});

test("filtros usan las áreas registradas", () => {
  assert.equal(filterTeamMembers(team, "docente", "").length, 2);
  assert.equal(filterTeamMembers(team, "investigación", "").length, 4);
  assert.equal(filterTeamMembers(team, "desarrollo", "").length, 5);
  assert.equal(filterTeamMembers(team, "documentación", "").length, 3);
  assert.equal(filterTeamMembers(team, "coordinación", "").length, 0);
});

test("búsqueda tolera tildes, mayúsculas y espacios", () => {
  assert.equal(normalizeTeamQuery("  InvestigACIÓN  "), "investigacion");
  assert.ok(filterTeamMembers(team, "todos", "  JOSSER  ").some(member => member.name.includes("Josser")));
  assert.equal(filterTeamMembers(team, "desarrollo", "docente").length, 0);
  assert.equal(filterTeamMembers(team, "todos", "perfil-inexistente-xyz").length, 0);
});
