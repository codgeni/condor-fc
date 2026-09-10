import json
import os

transcript_path = r"c:\Users\mered\.gemini\antigravity\brain\449ac2b5-8aa8-42f4-925b-e582ded65faf\.system_generated\logs\transcript.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

found_page = False
found_news = False
found_tv = False
found_shop = False
found_club = False
found_teams = False

for line in reversed(lines):
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for call in data['tool_calls']:
                if 'write_to_file' in call.get('name', '') or 'write_to_file' in call.get('tool_name', ''):
                    args = call.get('arguments', call.get('tool_args', {}))
                    target = args.get('TargetFile', '')
                    content = args.get('CodeContent', '')
                    
                    if not found_page and target.endswith('page.tsx') and not 'news' in target and not 'tv' in target and not 'shop' in target and not 'club' in target and not 'teams' in target:
                        # Wait, the last one was my French one. I need the one BEFORE that.
                        # So I will save them incrementally
                        pass
    except Exception as e:
        pass

# Actually, just extract ALL writes to page.tsx into an array and save them as page_1.tsx, page_2.tsx, etc.
writes = []
for line in lines:
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for call in data['tool_calls']:
                name = call.get('name', call.get('tool_name', ''))
                if 'write_to_file' in name:
                    args = call.get('arguments', call.get('tool_args', {}))
                    target = args.get('TargetFile', '')
                    if target.endswith(r'src\app\page.tsx') or target.endswith('src/app/page.tsx'):
                        writes.append(args.get('CodeContent', ''))
    except Exception as e:
        pass

for i, content in enumerate(writes):
    with open(f"c:\\Users\\mered\\Desktop\\condor-nextjs\\page_{i}.tsx", 'w', encoding='utf-8') as out:
        out.write(content)
    print(f"Saved page_{i}.tsx")
