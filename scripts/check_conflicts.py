#!/usr/bin/env python3
"""Fail if the working tree contains unresolved merge conflict artifacts."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'.git', 'dist', 'node_modules'}
MARKERS = ('<<<<<<< ', '=======', '>>>>>>> ')


def tracked_unmerged_paths() -> list[str]:
    result = subprocess.run(
        ['git', 'ls-files', '-u'],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    return [line for line in result.stdout.splitlines() if line.strip()]


def files_to_scan():
    for path in ROOT.rglob('*'):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        yield path


def main() -> int:
    unmerged = tracked_unmerged_paths()
    if unmerged:
        print('Git index contains unmerged paths:')
        print('\n'.join(unmerged))
        return 1

    errors: list[str] = []
    for path in files_to_scan():
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        for number, line in enumerate(text.splitlines(), 1):
            stripped = line.strip()
            if any(stripped.startswith(marker) for marker in MARKERS):
                errors.append(f'{path.relative_to(ROOT)}:{number}: {stripped}')
    if errors:
        print('Unresolved conflict markers found:')
        print('\n'.join(errors))
        return 1
    print('No unmerged git paths or conflict markers found.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
