module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{json,md,mdx,html}": ["prettier --write"],
  "*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit --incremental false",
};