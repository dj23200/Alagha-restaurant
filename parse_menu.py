from pathlib import Path
import json
text = Path('public/data/menu.txt').read_text(encoding='utf-8')
entries=[]
category=None
special_lines={'المقبلات والسلطات','Vorspeisen & Beilage','شاورما','shawarma','(Nur Samstags = فقط أيام السبت)'}
for line in text.splitlines():
    s=line.strip()
    if not s:
        continue
    if s in special_lines:
        if s == '(Nur Samstags = فقط أيام السبت)':
            category='فقط أيام السبت'
        else:
            if s in ('shawarma','Vorspeisen & Beilage'):
                continue
            category=s
        continue
    if s.startswith('•'):
        item=s[1:].strip()
        if '—' in item:
            name_en, price = item.rsplit('—',1)
            name_en=name_en.strip()
            price=price.strip()
            if name_en.startswith('_'):
                name_en=name_en[1:]
            name_en=name_en.replace('_',' ')
            entries.append({'name_en':name_en,'price':price,'category':category,'name_ar':None,'description':None})
            continue
    if entries and entries[-1]['name_ar'] is None:
        entries[-1]['name_ar']=s
        entries[-1]['description']=s
for e in entries:
    if not e['category']:
        ne=e['name_en']
        if ne.startswith(('Fried Chicken','Crispy Chicken','Gegrilltes Huhn')):
            e['category']='دجاج'
        elif ne.startswith(('Syrische Teller','Mexikanische Teller','Mexikanische Rolle','Hähnchen Leber Teller','Hähnchen Leber Rolle','Falafel Teller','Falafel Rolle')):
            e['category']='أطباق مختلطة ومميزة'
        else:
            e['category']='مشاوي'
for i,e in enumerate(entries,1):
    if e['name_ar'] is None:
        raise ValueError(f'Missing Arabic name for entry {i}: {e}')
print(json.dumps(entries, ensure_ascii=False, indent=2))
print('count', len(entries))
