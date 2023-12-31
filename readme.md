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
cd angular-example
npm link ../scaffolding-tool
schematics scaffolding-tool:testing --debug=false

ng add my-component --name=e (will generate files at the root folder)
ng g scaffolding-tool:testing (will generate files at the root folder)
```

5. Execute the customized Schematics in `React` application
```
cd react-example
npm link ../scaffolding-tool
schematics scaffolding-tool:rfc --debug=false (functional component)
schematics scaffolding-tool:rce --debug=false (class component)
```