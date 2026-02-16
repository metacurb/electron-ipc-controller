---
sidebar_position: 10
title: Examples
description: "Example apps: basic, Electron+Vite, TypeDI, NestJS, and kitchen sink—for learning and reference."
---

# Examples

The following example applications demonstrate how to use `@electron-ipc-bridge` in various scenarios, from simple setups to complex integrations with other libraries.

- **[Basic Example](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/basic)**
  A minimal setup using vanilla JavaScript/HTML and the standard Electron bundler. Perfect for understanding the core mechanics without extra noise. There is no frontend type-safety.

- **[Electron & Vite](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/electron-vite)**
  The recommended starting point for most apps. Shows how to use the [Vite](https://vitejs.dev/) plugin for automatic type generation and hot module replacement.

- **[Electron, Vite & TypeDI](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/electron-vite-typedi)**
  Demonstrates advanced dependency injection using the [TypeDI](https://github.com/pleerock/typedi) library.

- **[Electron, Vite & NestJS](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/electron-vite-nest)**
  A proof-of-concept showing how to integrate with [NestJS](https://nestjs.com/) for enterprise-grade architecture.

- **[Kitchen Sink](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/kitchen-sink)**
  A comprehensive example featuring multiple controllers, complex types, and advanced decorator usage.
