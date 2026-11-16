"""Publish aggregate counts using the dashboard's public API and counting rules.
Matches MapView: deduplicate postId; prefer location countries, else country row fields.
Never replace the last successful snapshot when upstream is unavailable or malformed.
"""
import json,re,sys,urllib.request
from datetime import datetime,timezone
from pathlib import Path
URL='https://dashboard-endpoint.onrender.com/api/projects'
def aggregate(data):
 if data.get('ok') is not True or data.get('configured') is not True or not isinstance(data.get('projects'),list) or not data['projects']:raise ValueError('Dashboard data unavailable')
 projects={str(p['postId']):p for p in data['projects'] if isinstance(p,dict) and p.get('postId')}
 if len(projects)!=len(data['projects']):raise ValueError('Missing or duplicate project IDs')
 countries=set()
 for p in projects.values():
  names=[loc['country'] for loc in p.get('locations',[]) if isinstance(loc,dict) and loc.get('country')]
  if not names:names=[name.strip() for key,value in p.get('row',{}).items() if re.search('country',key,re.I) and value for name in re.split('[,;|]+',str(value)) if name.strip()]
  countries.update(name.lower() for name in names)
 if not countries:raise ValueError('Country data unavailable')
 return {'projects':len(projects),'countries':len(countries),'updated_at':datetime.now(timezone.utc).isoformat(timespec='seconds'),'source':'https://gam-dashboard.github.io/dashboard/#/','feed':URL}
if __name__=='__main__':
 output=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'dist/data/stats.json'
 with urllib.request.urlopen(URL,timeout=90) as response:result=aggregate(json.load(response))
 output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,indent=2)+'\n');print(f"Dashboard: {result['projects']} projects / {result['countries']} countries")
