import os
import re

directories = ['c:/Users/tntut/Desktop/exercise1/WOLT/src', 
               'c:/Users/tntut/Desktop/exercise1/WOLT/test', 
               'c:/Users/tntut/Desktop/exercise1/WOLT']

hebrew_pattern = re.compile(r'[\u0590-\u05FF]')

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        return

    changed = False
    new_lines = []
    for line in lines:
        if hebrew_pattern.search(line):
            if filepath.endswith('.yml') or filepath.endswith('.txt'):
                idx = line.find('#')
                if idx != -1:
                    clean_line = line[:idx].rstrip()
                    if clean_line == '' and line.lstrip().startswith('#'):
                        changed = True
                        continue 
                    line = clean_line + '\n'
                    changed = True
            elif filepath.endswith('.cpp') or filepath.endswith('.h'):
                idx = line.find('//')
                if idx != -1:
                    clean_line = line[:idx].rstrip()
                    if clean_line == '' and line.lstrip().startswith('//'):
                        changed = True
                        continue 
                    line = clean_line + '\n'
                    changed = True
                else:
                    idx1 = line.find('/*')
                    idx2 = line.find('*/')
                    if idx1 != -1 and idx2 != -1:
                        clean_line = line[:idx1].rstrip() + line[idx2+2:]
                        if clean_line.strip() == '':
                            changed = True
                            continue
                        line = clean_line
                        changed = True
            if line.strip() != '' or line == '\n':
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f'Processed {filepath}')

for root_dir in directories:
    if root_dir == 'c:/Users/tntut/Desktop/exercise1/WOLT':
        files = os.listdir(root_dir)
        for file in files:
            if os.path.isfile(os.path.join(root_dir, file)) and file.endswith(('.txt', '.yml', '.md')):
                process_file(os.path.join(root_dir, file))
    else:
        for root, dirs, files in os.walk(root_dir):
            if 'build' in root or '.git' in root:
                continue
            for file in files:
                if file.endswith(('.cpp', '.h')):
                    process_file(os.path.join(root, file))

print('Done')
