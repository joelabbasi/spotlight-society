"""Preserve reviewed original project text at its original public address."""
from pathlib import Path
from html import escape
from urllib.parse import urlsplit
import re
ROOT=Path(__file__).resolve().parents[1]
for source in (ROOT/'references/legacy-pages').glob('*.md'):
    text=source.read_text();title=text.splitlines()[0].removeprefix('# ')
    body=text.split('HTTP status: 200',1)[1].split('## Links',1)[0].strip()
    lines=body.splitlines()
    if lines and lines[0].strip() in [title,'Development Tracker']:lines=lines[1:]
    # The audited extraction retains inline 'here' anchors in document order.
    # Reconnect only where counts agree, rather than guessing an association.
    inline_urls=re.findall(r'^- \[here\]\((.*)\)$',text,re.M)
    inline_count=len(re.findall(r'\bhere\b','\n'.join(lines)))
    inline=iter(inline_urls) if inline_count==len(inline_urls) else iter([])
    def linked_paragraph(line):
        safe=escape(line.strip())
        if inline_count==len(inline_urls):
            safe=re.sub(r'\bhere\b',lambda m:'<a href="'+escape(next(inline),quote=True)+'" target="_blank" rel="noopener noreferrer">here</a>',safe)
        return '<p>'+safe+'</p>'
    content=''.join(linked_paragraph(line) for line in lines if line.strip())
    links=[];seen=set()
    for label,url in re.findall(r'^- \[(.*)\]\((.*)\)$',text,re.M):
        domain=urlsplit(url).netloc.lower()
        if not domain or domain in ['humanitariantracker.org','www.humanitariantracker.org'] or domain.endswith('facebook.com') or domain.endswith('twitter.com') or url in seen:continue
        seen.add(url)
        if label.lower() in ['here','untitled link'] or not label.strip('\ufeff '):label=url
        links.append('<li><a href="'+escape(url,quote=True)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a></li>')
    refs='<h2>Original references</h2><ul>'+''.join(links)+'</ul>' if links else ''
    page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'''+escape(title)+''' | Humanitarian Tracker Archive</title><link rel="canonical" href="https://www.humanitariantracker.org/'''+source.stem+'''/"><link rel="icon" href="../assets/ht-logo.png"><link rel="stylesheet" href="../styles.css"><style>.legacy-record{max-width:1050px;margin:auto;padding-top:80px;padding-bottom:100px}.legacy-record h1{font-size:clamp(2.5rem,6vw,5rem);margin:25px 0}.legacy-record h2{font-size:2rem;margin-top:45px}.legacy-record p,.legacy-record li{font-size:1.1rem;line-height:1.8;max-width:80ch;margin:18px 0}.legacy-record a{color:#005f73;text-decoration:underline;text-underline-offset:4px;overflow-wrap:anywhere}.legacy-record .eyebrow{color:#43636c}.legacy-record .legacy-note{color:#f3f7f8}.legacy-note{border-left:3px solid #f9e846;padding:12px 22px;background:#0d2a3b}.legacy-record ul{padding-left:24px}.legacy-record .legacy-summary{font-size:1.2rem}</style></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="../index.html"><img src="../assets/ht-logo.png" width="46" height="46" alt=""><span>HUMANITARIAN<br><b>TRACKER</b></span></a><a href="../archive.html#projects">Back to the archive</a></header><main id="main" class="legacy-record section"><p class="eyebrow">FROM THE HUMANITARIAN TRACKER ARCHIVE</p><h1>'''+escape(title)+'''</h1><p class="legacy-note">Historical project record preserved from Humanitarian Tracker’s previous website. Descriptions, dates, and references reflect the original record; they do not establish that a service is currently operating.</p>'''+content+refs+'''<p><a href="../archive.html#projects">Explore more projects in the archive</a></p></main><footer><div class="footer-identity"><a class="brand" href="../index.html"><img src="../assets/ht-logo.png" width="46" height="46" alt=""><span>HUMANITARIAN<br><b>TRACKER</b></span></a><p class="footer-ein">EIN | 46-3356967</p></div><p>Technology for Social Good</p><a href="../donate.html">Donate</a><small>© 2026 Humanitarian Tracker · Historical records retain their source context.</small></footer></body></html>'''
    out=ROOT/'dist'/source.stem/'index.html';out.parent.mkdir(exist_ok=True);out.write_text(page)
    print(source.stem)
