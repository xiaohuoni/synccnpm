# auto sync cnpm

## monorepo

自动更新配置的 workspace 的第一个目录

```yaml
packages:
  - 'packages/*'
  - 'examples/*'
```
和

```json
"workspaces": [
    "packages/*",
    "examples/*"
],
```

会自动读取 cwd/packages 目录下的所有包，进行自动更新

> package.json 中 `"private": true,` 会自动跳过更新

## 普通仓库

自动更新 package.json 中的 name
