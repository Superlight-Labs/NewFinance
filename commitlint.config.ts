const scopes = [
  "app",
  "api",
  "workspace",
  "bc-client",
  "mpc-common",
  "rn-mpc",
  "rn-encrypt",
  "rn-client",
  "ci",
  "docs",
  "wip",
  "deps",
];

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "lower-case"],
    "scope-enum": [2, "always", scopes],
  },
};
