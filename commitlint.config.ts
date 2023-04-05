const scopes = [
  "app",
  "api",
  "workspace",
  "rn-mpc",
  "mpc-common",
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
