import re

with open("src/components/BattleBoard.tsx", "r") as f:
    text = f.read()

def unpad(m):
    inner = m.group(1)
    # Remove spaces around slashes and hyphens and curly braces inside the string
    inner = re.sub(r'\s+-\s+', '-', inner)
    inner = re.sub(r'\s+/\s+', '/', inner)
    inner = re.sub(r'\s+\$\{', '${', inner)
    inner = re.sub(r'\}\s+', '}', inner)
    
    # but be careful about className.
    return m.group(0).replace(m.group(1), inner)

# Fix id={`...`}
text = re.sub(r'id=\{`([^`]+)`\}', unpad, text)

# Fix key={`...`}
text = re.sub(r'key=\{`([^`]+)`\}', unpad, text)

# Fix id: `...`
text = re.sub(r'id:\s*`([^`]+)`', unpad, text)

with open("src/components/BattleBoard.tsx", "w") as f:
    f.write(text)

