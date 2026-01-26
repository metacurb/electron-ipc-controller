/* eslint-disable */
const path = require("path");

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(" ")}`;

module.exports = {
  "*.{js,ts}": ["prettier --write", buildEslintCommand],
  "*.{json,md,html,css}": ["prettier --write"],
};
