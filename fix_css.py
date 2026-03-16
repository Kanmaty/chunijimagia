import re

with open("src/components/BattleBoard.tsx", "r") as f:
    text = f.read()

# Add a space before ${ if it is preceded by a letter, number, ] or }
# e.g. "border${" -> "border ${"
# We only want to do this inside className strings, but safely we can just do it everywhere 
# since in JSX, usually there's a space before ${ in classNames.
# Actually, wait, doing it blindly might break standard string interpolation like `prefix${value}`.
# So let's only do it inside className={`...`}

def fix_className(m):
    inner = m.group(1)
    # find [A-Za-z0-9\]\}]\$\{
    fixed = re.sub(r'([A-Za-z0-9\]\}])\$\{', r'\1 ${', inner)
    return f'className={{`{fixed}`}}'

with open("src/components/BattleBoard.tsx", "w") as f:
    f.write(re.sub(r'className=\{`([^`]+)`\}', fix_className, text))
