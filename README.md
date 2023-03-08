# auto sync cnpm

## 安装与使用

```bash
pnpm i synccnpm --D -w
```

使用命令 synccnpm 自动同步，可以集成到发布脚本中，也可以添加到 scripts 中

```json
  "scripts": {
    "autosync": "synccnpm"
  },
```

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
