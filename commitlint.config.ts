const scopes = [
  "app",
  "api",
  "workspace",
  "mpc-common",
  "rn-mpc",
  "rn-encrypt",
  "rn-client",
  "ci",
];

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "lower-case"],
    "scope-enum": [2, "always", scopes],
  },
};
