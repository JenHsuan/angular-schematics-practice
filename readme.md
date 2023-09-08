# Desciption
# Usages
1. Install the package
```
npm install -g @angular-devkit/schematics-cli
```

2. Build the package
```
cd my-component
npm install
npm run build-watch
```

3. Execute the customized Schematics with `schematics-cli` command
```
cd scaffolding-tool
schematics .:scaffolding-tool --debug=false
```

4. Execute the customized Schematics in `angular cli workspace`
```
cd test-angular-project
npm link ../scaffolding-tool
schematics scaffolding-tool:scaffolding-tool --debug=false

ng add scaffolding-tool --name=e (will generate files at the root folder)
ng g scaffolding-tool:scaffolding-tool (will generate files at the root folder)
```