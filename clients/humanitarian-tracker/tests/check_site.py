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
  for script in [ROOT/'donate.js']:
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
class ClientReviewTests(unittest.TestCase):
 def test_approved_homepage_and_team(self):
  s=(ROOT/'index.html').read_text()
  self.assertEqual(s.count('Humanitarian Tracker empowers citizens to turn local knowledge into lasting impact. We use crowdsourcing and AI across humanitarian reporting, global health, education, and sustainable development. Our AI-enhanced platform, Global Action Mosaic, helps community-led initiatives gain visibility, share knowledge, and connect with impact projects worldwide. We are a U.S.-based 501(c)(3) nonprofit in consultative status with the UN Economic and Social Council, with no political or religious affiliation.'),1)
  for phrase in ['data-count="346"','data-count="79"','<strong>One</strong>','Jeni Craswell','Austin Holmes','Mina Aziz','Hend Alhinnawi','Safaa Aldib','Commit to Data Campaign','In collaboration with Open Data Watch and PARIS21']:
   self.assertIn(phrase,s)
  for phrase in ['A HUMANITARIAN TRACKER INITIATIVE','The original mosaic','id="intro"','id="approach"','Warisha Soomro','Dana Ghazi','Lauren Wolfe','Majd Isreb','John Page','David Scales','Karolos Talvis']:
   self.assertNotIn(phrase,s)
  self.assertNotIn('<p class="eyebrow">Global Action Mosaic',s)
  self.assertNotIn('Bio to be provided.',s)
  self.assertNotIn('Humanitarian Tracker is a U.S.-based',(ROOT/'about.html').read_text())
  for name in ['index.html','donate.html','archive.html','gallery.html']:
   page=(ROOT/name).read_text()
   self.assertEqual(page.count('EIN | 46-3356967'),1)
   self.assertIn('class="footer-ein"',page[page.index('<footer>'):])
 def test_all_gallery_photos_are_local(self):
  page=Page(ROOT/'gallery.html');photos=[a for t,a in page.elements if 'data-photo' in a]
  self.assertEqual(len(photos),156)
  self.assertEqual(len({p['data-album'] for p in photos}),7)
  for photo in photos:
   self.assertTrue(photo['href'].startswith('assets/'))
   self.assertTrue((ROOT/photo['href']).is_file())
  self.assertEqual(len(json.loads((ROOT/'data/gallery-videos.json').read_text())),2)
 def test_simplified_archive_hero(self):
  s=(ROOT/'archive.html').read_text()
  self.assertIn('Tracker Archive',s)
  self.assertNotIn('Years of listening.',s)
  self.assertNotIn('archive-totals',s)
if __name__=='__main__':unittest.main()
