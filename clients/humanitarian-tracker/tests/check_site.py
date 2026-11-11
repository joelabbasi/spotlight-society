"""Validate the draft's safety boundary and local navigation without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
import unittest
import json
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.elements=[];self.feed(path.read_text())
 def handle_starttag(self,tag,attrs): self.elements.append((tag,dict(attrs)))
class SiteTests(unittest.TestCase):
 def test_local_links_and_assets_exist(self):
  for path in ROOT.glob('*.html'):
   page=Page(path);ids={a['id'] for _,a in page.elements if 'id' in a}
   for tag,a in page.elements:
    for key in ('src','href'):
     url=a.get(key,'')
     if not url or ':' in url:continue
     if url.startswith('#'):self.assertIn(url[1:],ids,f'{path}: {url}')
     else:self.assertTrue((path.parent/url.split('#')[0]).exists(),url)
 def test_checkout_cannot_accept_payments(self):
  page=Page(ROOT/'donate.html')
  checkout=[a for tag,a in page.elements if tag=='button' and a.get('class')=='checkout']
  self.assertEqual(len(checkout),1);self.assertIn('disabled',checkout[0])
  self.assertFalse(any(t in ('form','iframe') for t,_ in page.elements))
  self.assertFalse(any(a.get('name') in ('card','email','cardNumber','cvc') for _,a in page.elements))
  for script in ROOT.glob('*.js'):
   self.assertNotIn('fetch(',script.read_text());self.assertNotIn('Stripe(',script.read_text())
 def test_external_links_use_safe_rel(self):
  for path in ROOT.glob('*.html'):
   for tag,a in Page(path).elements:
    if a.get('target')=='_blank':self.assertIn('noopener',a.get('rel',''))
 def test_no_placeholder_navigation(self):
  for path in ROOT.glob('*.html'):
   for tag,a in Page(path).elements:
    if tag=='a':self.assertNotEqual(a.get('href'),'#')
class ArchiveTests(unittest.TestCase):
 def test_complete_archive_categories(self):
  class Counts(HTMLParser):
   def __init__(self):super().__init__();self.category=None;self.counts=Counter()
   def handle_starttag(self,tag,attrs):
    a=dict(attrs)
    if tag=='section' and 'data-category' in a:self.category=a['data-category']
    if 'data-entry' in a and self.category:self.counts[self.category]+=1
   def handle_endtag(self,tag):
    if tag=='section':self.category=None
  p=Counts();p.feed((ROOT/'archive.html').read_text())
  self.assertEqual({k:p.counts[k] for k in ['projects','recognitions','coverage','publications','videos']},{'projects':9,'recognitions':6,'coverage':62,'publications':69,'videos':8})
 def test_public_indexes_exclude_long_source_excerpts(self):
  news=json.loads((ROOT/'data/news-catalog.json').read_text())
  pubs=json.loads((ROOT/'data/publications-catalog.json').read_text())
  self.assertEqual(len(news),62);self.assertEqual(sum(bool(x['source_url']) for x in news),61)
  self.assertEqual(len(pubs),69)
  self.assertTrue(all('description' not in x for x in news))
  self.assertTrue(all('original_listing' not in x for x in pubs))
if __name__=='__main__':unittest.main()
