// Match the starter's supported engine before copying, installing or building.
export function checkNode(version = process.versions.node) {
  const [major, minor] = version.split('.').map(Number);
  if ((major === 22 && minor >= 12) || major >= 23) return;
  throw new Error(`This starter requires Node 22.12+; current Node is ${version}.`);
}
checkNode();
