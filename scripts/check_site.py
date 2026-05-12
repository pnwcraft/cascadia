#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
import sys

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.titles = []
        self.meta_descriptions = []
        self.h1 = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'meta' and attrs.get('name') == 'description':
            self.meta_descriptions.append(attrs.get('content', ''))
    def handle_data(self, data):
        pass

root = Path(__file__).resolve().parents[1]
html_files = sorted(
    file for file in root.glob('**/*.html')
    if 'dist' not in file.relative_to(root).parts
)
errors = []
for file in html_files:
    text = file.read_text(encoding='utf-8')
    parser = LinkParser()
    parser.feed(text)
    if '<title>' not in text or '</title>' not in text:
        errors.append(f'{file.relative_to(root)} missing title')
    if 'name="description"' not in text:
        errors.append(f'{file.relative_to(root)} missing meta description')
    if '<h1' not in text:
        errors.append(f'{file.relative_to(root)} missing h1')
    for href in parser.links:
        if href.startswith(('http:', 'https:', 'mailto:', 'tel:', '#')):
            continue
        clean = href.split('#', 1)[0].split('?', 1)[0]
        if not clean:
            continue
        target = (root / clean.lstrip('/')).resolve()
        if href.endswith('/'):
            target = target / 'index.html'
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{file.relative_to(root)} links to missing {href}')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'Checked {len(html_files)} HTML files: titles, descriptions, H1s, and internal links look good.')
