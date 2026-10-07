import { readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const members = JSON.parse(readFileSync(resolve(root, "src/data/team.json"), "utf8"));
const publicDirectory = resolve(root, "public");
const groups = ["docente", "coordinación", "investigación", "desarrollo", "documentación"];
const ids = new Set();
const errors = [];
const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isUrl = (value, protocols) => {
    if (!isText(value)) return false;
    try { return protocols.includes(new URL(value).protocol); }
    catch { return false; }
};

if (!Array.isArray(members)) throw new Error("team.json debe contener un arreglo de integrantes.");

members.forEach((member, index) => {
    const label = `Integrante ${index + 1}`;
    const fail = (message) => errors.push(`${label}: ${message}`);
    if (!isObject(member)) return fail("debe ser un objeto.");
    for (const field of ["id", "name", "role", "bio"]) {
        if (!isText(member[field])) fail(`${field} es obligatorio y debe ser texto.`);
    }
    if (isText(member.id) && !/^[a-zA-Z0-9_-]+$/.test(member.id)) fail("id solo permite letras, números, guiones y guiones bajos.");
    if (ids.has(member.id)) fail(`id duplicado: ${member.id}.`);
    ids.add(member.id);
    if (!groups.includes(member.group)) fail(`group debe ser uno de: ${groups.join(", ")}.`);
    if (member.groupRole !== undefined && !isText(member.groupRole)) fail("groupRole debe ser texto no vacío.");
    if (member.featured !== undefined && typeof member.featured !== "boolean") fail("featured debe ser true o false.");
    if (member.responsibilities !== undefined && (!Array.isArray(member.responsibilities) || !member.responsibilities.every(isText))) {
        fail("responsibilities debe ser un arreglo de textos no vacíos.");
    }
    if (member.image !== undefined && member.image !== null && member.image !== "") {
        if (!isText(member.image)) {
            fail("image debe ser una ruta, una URL HTTPS o null.");
        } else if (member.image.startsWith("/") && !member.image.startsWith("//")) {
            const imagePath = resolve(publicDirectory, member.image.slice(1));
            try {
                if (!imagePath.startsWith(publicDirectory + sep) || !statSync(imagePath).isFile()) throw new Error();
            } catch { fail(`imagen local inexistente o fuera de public: ${member.image}.`); }
        } else if (!isUrl(member.image, ["https:"])) {
            fail("image debe ser una ruta desde public (/equipo/foto.jpg) o una URL HTTPS.");
        }
    }
    if (member.social !== undefined) {
        if (!isObject(member.social)) fail("social debe ser un objeto con nombres de redes y URLs.");
        else for (const [network, url] of Object.entries(member.social)) {
            if (!isText(network) || !isUrl(url, ["https:", "http:"])) fail(`red social inválida: ${network}. Usa una URL HTTP o HTTPS completa, o elimina la entrada.`);
        }
    }
});

if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log(`Equipo válido: ${members.length} integrantes. Rutas locales verificadas; URLs externas comprobadas solo en formato.`);
}
