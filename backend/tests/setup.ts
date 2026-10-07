import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

dotenv.config({
  path: path.resolve(
    __dirname,
    "../.env.test"
  ),
  override: true
});

if (
  process.env.DB_NAME !==
  "gymtrack_test"
) {
  throw new Error(
    `Tests must run against gymtrack_test. Current DB_NAME: ${process.env.DB_NAME}`
  );
}