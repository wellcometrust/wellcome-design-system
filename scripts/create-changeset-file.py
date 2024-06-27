import sys

file = open(".changeset/changeset.md", "w")

file.write(f"---\n")
file.write(
    f'"wellcome-trust/wellcome-design-system": {sys.argv[1].replace("semver:", "")}\n'
)
file.write(f"---\n")
file.write(f"\n")
file.write(f"- changes\n")
