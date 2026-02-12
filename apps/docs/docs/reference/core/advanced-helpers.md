---
title: Advanced Helpers
sidebar_position: 5
---

# Advanced Helpers

These helpers are exported and useful for advanced integrations.

## `isIpcController(value: unknown): value is Constructor`

- Returns `true` when a value is a class with IPC controller metadata
- Useful when integrating with external DI/module metadata systems

Example use case: filtering framework providers to only IPC controllers before passing to `createIpcApp`.

## `getCorrelationId(): string | undefined`

- Returns current request correlation ID when correlation is enabled and execution is in active request scope
- Returns `undefined` otherwise

## Stability guidance

- Prefer `createIpcApp` + decorators for app code
- Use helper metadata APIs only when building framework integrations or tooling
