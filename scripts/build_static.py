#!/usr/bin/env python3
"""Build the static Cascadia site into dist/ for Vercel.

Vercel should publish only deployable web assets, not the whole repository.
This script validates the site first, then copies the HTML pages, public
assets, sitemap, and robots file into a clean dist directory.
"""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
FILES = [
    'index.html',
    '404.html',
    'client-registration.html',
    'robots.txt',
    'sitemap.xml',
]
DIRECTORIES = [
    'assets',
    'blog',
    'locations',
    'services',
]


def copy_file(relative_path: str) -> None:
    source = ROOT / relative_path
    target = DIST / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def copy_directory(relative_path: str) -> None:
    source = ROOT / relative_path
    target = DIST / relative_path
    shutil.copytree(source, target)


def main() -> int:
    subprocess.run([sys.executable, str(ROOT / 'scripts' / 'check_site.py')], check=True)
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    for relative_path in FILES:
        copy_file(relative_path)
    for relative_path in DIRECTORIES:
        copy_directory(relative_path)
    print(f'Built static site into {DIST.relative_to(ROOT)}/')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
