---
sidebar_position: 1
title: 开发者教程总览
---

# 开发者教程

面向想要参与 CCB 开发、编译游戏、或制作模组的贡献者。

## 包含内容

- **[编译游戏](./build)** —— 从源码构建 CCB
- **[贡献流程](./contributing)** —— 同步上游、提交 PR 的工作流

## 项目结构

CCB 基于 CDDA，主要源码在 `src/`，游戏数据为 JSON，位于 `data/`。

```mermaid
flowchart TD
    Root[Cataclysm-Cleanwater-Bomb] --> Src[src/ C++ 源码]
    Root --> Data[data/ JSON 游戏数据]
    Root --> Tools[tools/ 工具脚本]
    Root --> CI[.github/workflows CI]
    Data --> JSON[items / monsters / mapgen ...]
    Data --> Mods[mods/ 官方模组]
```

## 上游关系

```mermaid
flowchart LR
    CDDA[CleverRaven/Cataclysm-DDA] -->|定期同步| CCB[CCB master]
    CBN[Cataclysm-BN] -.->|移植特性| CCB
    CCB --> Release[发布版本]
```
