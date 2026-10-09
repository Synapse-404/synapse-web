import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterProjects, filterPublications, isExternalResource } from "../src/lib/research-directory.ts";

const projects = JSON.parse(await readFile(new URL("../src/data/projects.json", import.meta.url), "utf8"));
const publications = JSON.parse(await readFile(new URL("../src/data/publications.json", import.meta.url), "utf8"));

test("catálogo de proyectos conserva registros y orden", () => {
  assert.equal(filterProjects(projects, "todos", "").length, projects.length);
  assert.deepEqual(filterProjects(projects, "todos", "").map(({id}) => id), projects.map(({id}) => id));
});

test("proyectos se filtran por estado y tecnología sin acentos", () => {
  assert.equal(filterProjects(projects, "activo", "").length, projects.filter((item) => item.status === "activo").length);
  assert.equal(filterProjects(projects, "todos", "analitica").length, 2);
  assert.equal(filterProjects(projects, "finalizado", "").length, projects.filter((item) => item.status === "finalizado").length);
});

test("publicaciones se filtran por formato, nombre y año", () => {
  assert.equal(filterPublications(publications, "todas", "").length, publications.length);
  assert.equal(filterPublications(publications, "artículo", "2025").length, 1);
  assert.equal(filterPublications(publications, "software", "atratoalert").length, 1);
  assert.equal(filterPublications(publications, "todas", "PREDICCION").length, 1);
});

test("enlaces ficticios no se interpretan como recursos públicos", () => {
  assert.equal(isExternalResource("#"), false);
  assert.equal(isExternalResource(""), false);
  assert.equal(isExternalResource("javascript:alert(1)"), false);
  assert.equal(isExternalResource("https://github.com/synapse/atratoalert"), true);
});
