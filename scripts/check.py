"""Validate public links and structure using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.references = []
        self.headings = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f"Duplicate id: {attrs['id']}")
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.references.append(attrs[key])
        if tag in ('h1', 'h2', 'h3'):
            self.headings.append(int(tag[1]))
        if tag == 'img' and 'alt' not in attrs:
            self.errors.append('Image missing alt attribute')

pages = {}
for path in Path('.').glob('*.html'):
    parser = SiteParser()
    parser.feed(path.read_text())
    pages[path.name] = parser

errors = []
for name, parser in pages.items():
    for reference in parser.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc:
            continue
        if url.path:
            if url.path.startswith('/'):
                parser.errors.append(f"Root-relative link: {reference}")
            elif not Path(url.path).is_file():
                parser.errors.append(f"Missing asset: {reference}")
        target = pages.get(url.path or name)
        if url.fragment and target and url.fragment not in target.ids:
            parser.errors.append(f"Missing fragment: {reference}")
    if parser.headings.count(1) != 1:
        parser.errors.append('Expected exactly one h1')
    for previous, current in zip(parser.headings, parser.headings[1:]):
        if current > previous + 1:
            parser.errors.append(f'Heading skips level: h{previous} to h{current}')
    for number, line in enumerate(Path(name).read_text().splitlines(), 1):
        if len(line) > 80:
            parser.errors.append(f'Line {number} exceeds 80 characters')
    errors.extend(f'{name}: {error}' for error in parser.errors)
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Validated {len(pages)} pages, their links, assets, IDs and line lengths.')
