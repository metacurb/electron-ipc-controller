---
sidebar_position: 9
title: Security & Sandbox Compatibility
---

# Security & Sandbox Compatibility

Security is a first-class citizen in `@electron-ipc-bridge`. Modern Electron applications should always run with `contextIsolation: true` and the sandbox enabled to minimize the impact of potential vulnerabilities in the renderer process.

This library is designed to work seamlessly with these security features while providing a developer experience that feels like working in a unified environment.

## Design for Security

The framework helps you maintain a secure bridge between processes by following these principles:

- **Minimal Exposure**: Only classes decorated with `@IpcController()` and methods decorated with `@IpcHandle()`, `@IpcHandleOnce()`, `@IpcOn()`, or `@IpcOnce()` are exposed to the renderer.
- **No Leaked Internals**: The `ipcRenderer` module is never exposed directly. Instead, a minimal, safe API bridge is generated and attached to `window.ipc`.
- **Sandbox Compatibility**: The generated preload logic is compatible with Electron's sandbox mode, ensuring that your bridge doesn't become a point of escape.
- **Type Safety as a Shield**: Because the API is typed, you can catch invalid calls at build time before they hit the main process.

## Hardening Your Application

While the library manages the communication layer, you are still responsible for validating parameters and enforcing permissions within your controllers.

:::tip
Always treat data coming from the renderer via `@IpcHandle` arguments as untrusted. Use validation logic or libraries to ensure inputs are sane before processing.
:::

For a comprehensive guide on production hardening, we recommend the official [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security).

## Best Practices

When using `@electron-ipc-bridge`, keep these library-specific tips in mind:

- **Validate Inputs**: The library handles type checking, but you must validate the _content_ of arguments (e.g. check if a file path is safe).
- **Context Awareness**: Use `@Sender()` to inspect the `WebContents` if you need to authorize requests based on the caller.
- **Error Leakage**: Be careful not to throw raw internal errors from your controllers, as message strings may be serialized to the renderer.
- **Correlation**: Enable `correlation: true` to track requests across logs, which is vital for auditing privileged actions.
