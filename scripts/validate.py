import json,re,sys
from pathlib import Path
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'assets/course-data.json').read_text())['courses']
supplements=json.loads((ROOT/'assets/course-supplements.json').read_text())
errors=[]
catalog=json.loads((ROOT/'assets/catalog.json').read_text())
topics=json.loads((ROOT/'assets/subject-topics.json').read_text())
if {c['semester'] for c in catalog} != {1,2,3,4}: errors.append('Catalogue must cover all four semesters')
if len({c['code'] for c in catalog}) != len(catalog): errors.append('Duplicate catalogue course code')
for c in catalog:
    if not (ROOT/c.get('folder','')/'README.md').is_file(): errors.append(f"Missing course README: {c['code']}")
    if not topics.get(c['code']): errors.append(f"Missing subject overview: {c['code']}")
    if not c.get('title') or not c.get('category') or not 1 <= c.get('page',0) <= 49: errors.append(f"Invalid catalogue entry: {c.get('code')}")
    if c.get('guide') and not (ROOT/c['guide']/'index.html').exists(): errors.append(f"Missing catalogue guide: {c['guide']}")
if len(data)!=5: errors.append(f'Expected 5 courses, found {len(data)}')
for c in data:
    d=ROOT/c['slug'];required=[d/'index.html',d/'README.md',d/f"{c['code']}-{c['slug']}.pdf",ROOT/'assets'/c['diagram']]
    for p in required:
        if not p.exists() or p.stat().st_size==0: errors.append(f'Missing or empty: {p.relative_to(ROOT)}')
    md=(d/'README.md').read_text() if (d/'README.md').exists() else ''
    for m in c['modules']:
        for topic in m['topics']:
            if topic not in md: errors.append(f"README missing topic '{topic}' in {c['code']}")
    pdf=d/f"{c['code']}-{c['slug']}.pdf"
    if pdf.exists():
        pages=len(PdfReader(str(pdf)).pages)
        if pages < len(c['modules'])+2: errors.append(f'{pdf.name} too short: {pages} pages')
    guide=supplements.get(c['slug'])
    if not guide: errors.append(f"Missing mastery guide: {c['slug']}")
    else:
        minimums={'objectives':5,'glossary':10,'types':8,'formulas':8,'comparisons':2,'pitfalls':8,'practice':8,'applications':3,'visuals':4}
        for key,minimum in minimums.items():
            if len(guide.get(key,[])) < minimum: errors.append(f"{c['code']} mastery section '{key}' has fewer than {minimum} entries")
        for visual in guide.get('visuals',[]):
            image=(d/visual.get('src','')).resolve()
            if not image.exists() or image.stat().st_size==0: errors.append(f"Missing or empty course visual: {visual.get('src','(missing src)')}")
            if visual.get('afterModule') not in range(1,len(c['modules'])+1): errors.append(f"Invalid visual placement in {c['code']}: {visual.get('afterModule')}")
for html in ROOT.rglob('*.html'):
    text=html.read_text()
    for ref in re.findall(r'(?:href|src)="([^"]+)"',text):
        if ref.startswith(('http:','https:','#')): continue
        target=(html.parent/re.split(r'[?#]',ref)[0]).resolve()
        if not target.exists(): errors.append(f'Broken link in {html.relative_to(ROOT)}: {ref}')
if errors:
    print('\n'.join('ERROR: '+e for e in errors));sys.exit(1)
print(f'Validated {len(data)} courses, {sum(len(c["modules"]) for c in data)} study blocks, 4 text mind maps per course, 8 mastery sections per course, all required files, topic coverage, PDF lengths, and local links.')
