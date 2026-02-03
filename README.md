# electron-ipc-controller

## Overview

This library provides a **class-based IPC abstraction for Electron**, inspired by NestJS-style controllers. It transforms Electron's string-based IPC into a structured, observable, type-safe API system.

## Project Architecture

```mermaid
graph TB
    subgraph Main Process
        CTRL["@IpcController"]
        HANDLER["@IpcHandle / @IpcOn"]
        META["Metadata Layer"]
        REGISTER["registerHandlers()"]
        APP["createIpcApp()"]
    end

    subgraph Preload Process
        EMIT["emitIpcContract()"]
        GEN["generatePreloadApi()"]
        CTX["contextBridge.expose()"]
    end

    subgraph Renderer Process
        API["window.ipc.*"]
    end

    CTRL --> META
    HANDLER --> META
    META --> REGISTER
    REGISTER --> APP
    APP --> EMIT
    EMIT --> GEN
    GEN --> CTX
    CTX --> API
```
