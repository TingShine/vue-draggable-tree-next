export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(commit) => /Merge/.test(commit)],
  defaultIgnores: true,
};
