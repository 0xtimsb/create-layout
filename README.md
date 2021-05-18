## create-layout

- To create layout for directory

```
npx create-layout
```

- To create layout for sub directory

```
npx create-layout sub-direcotry
```

- To create layout with bullet list

```
npx create-layout --bullet
```
or
```
npx create-layout -b
```

- To create layout with numbered list

```
npx create-layout --numbered
```
or
```
npx create-layout -n
```

## Example

Default layout

```
├─.git
├─.gitignore
├─.prettierignore
├─.prettierrc
├─README.md
├─bin
│ └─layout.js
├─node_modules
├─package-lock.json
├─package.json
└─src
  └─cli.js
```

Bullet List

- .git
- .gitignore
- .prettierignore
- .prettierrc
- README.md
- bin
  - create-layout.js
- layout.md
- node_modules
- package-lock.json
- package.json
- src
  - cli.js

Numbered List

1. .git
2. .gitignore
3. .prettierignore
4. .prettierrc
5. README.md
6. bin
    1. create-layout.js
7. layout.md
8. node_modules
9. package-lock.json
10. package.json
11. src
    1. cli.js