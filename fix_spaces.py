import re

with open("src/components/BattleBoard.tsx", "r") as f:
    text = f.read()

# Fix className={`...`} by removing spaces around -, /, [, ]
def fix_match(m):
    inner = m.group(1)
    # Remove spaces around hyphens in words like bg - blue - 900
    inner = re.sub(r' - ', '-', inner)
    # Remove spaces around brackets like [ 0.95 ]
    inner = re.sub(r' \[ ', '[', inner)
    inner = re.sub(r' \] ', ']', inner)
    inner = re.sub(r'text - \[', 'text-[', inner)
    inner = re.sub(r'scale - \[', 'scale-[', inner)
    inner = re.sub(r' } ', '}', inner)
    inner = re.sub(r' \$\{', '${', inner)
    return 'className={`' + inner + '`}'

text = re.sub(r'className=\{`([^`]+)`\}', fix_match, text)

# Fix image paths: `/ images / roles / ${card.role}.png` -> `/images/roles/${card.role}.png`
def fix_image(m):
    inner = m.group(1)
    inner = inner.replace(' / ', '/')
    inner = inner.replace('/ ', '/')
    inner = inner.replace(' /', '/')
    inner = inner.replace(' ${', '${')
    inner = inner.replace('} .', '}.')
    return 'src={`' + inner + '`}'

text = re.sub(r'src=\{`([^`]+)`\}', fix_image, text)

# Fix IDs: `attacker - ${index} ` -> `attacker-${index}`
def fix_id(m):
    inner = m.group(1)
    inner = inner.replace(' - ', '-')
    inner = inner.replace(' ${', '${')
    return 'id={`' + inner.strip() + '`}'

text = re.sub(r'id=\{`([^`]+)`\}', fix_id, text)

with open("src/components/BattleBoard.tsx", "w") as f:
    f.write(text)

