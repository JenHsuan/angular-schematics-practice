# Desciption
# Usages
1. Install the package
2. Execute the customized Schematics with `schematics-cli` command
```
cd my-component
schematics .:my-component --debug=false
```

3. Execute the customized Schematics in `angular cli workspace`
```
cd test-angular-project
npm link ../my-component
ng g my-component:my-component
```