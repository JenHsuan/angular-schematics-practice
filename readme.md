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
cd my-component
schematics .:my-component --debug=false
```

4. Execute the customized Schematics in `angular cli workspace`
```
cd test-angular-project
npm link ../my-component
schematics my-component:my-component --debug=false

ng add my-component --name=e (will generate files at the root folder)
ng g my-component:my-component (will generate files at the root folder)
```