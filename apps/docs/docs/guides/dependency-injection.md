---
sidebar_position: 7
title: Dependency Injection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dependency Injection

As your application grows, managing the dependencies between your controllers and services (like database clients, logger instances, or configuration objects) can become complex.

`@electron-ipc-bridge` provides a flexible **resolver** bridge that allows you to integrate any Dependency Injection (DI) container or custom factory logic into your IPC setup.

## Why use Dependency Injection?

1.  **Testability**: Easily swap real services for mocks during unit tests.
2.  **Modularity**: Decouple your controller logic from the implementation details of its dependencies.
3.  **Singleton Management**: Ensure that services like a Database connection are only instantiated once.

## The Resolver Bridge

The `createIpcApp` function accepts a `resolver` object. This object acts as a factory for your controller instances.

### Using a Simple Factory

If you don't need a full DI container, you can use a simple anonymous function to instantiate your classes:

```ts title="src/main/index.ts"
import UserController from "./users/user.controller";

const userController = new UserController();

const instances = {
  [UserController.name]: userController,
};

const app = createIpcApp({
  controllers: [UserController],
  resolver: {
    resolve: (ControllerClass) => instances[ControllerClass.name],
  },
});
```

### Common DI Library Bridges

Most DI containers have a way to resolve a class. The examples below are a starting point for integrating with your project's DI container:

<Tabs>
  <TabItem value="inversify" label="InversifyJS">
    ```ts title="src/main/index.ts"
    import { container } from './inversify.config';
    import UserController from './users/user.controller';

    const app = createIpcApp({
      controllers: [UserController],
      resolver: {
        resolve: (token) => container.get(token),
      },
    });
    ```

  </TabItem>
  <TabItem value="typedi" label="TypeDI">
    ```ts title="src/main/index.ts"
    import { Container } from 'typedi';
    import UserController from './users/user.controller';

    const app = createIpcApp({
      controllers: [UserController],
      resolver: {
        resolve: (token) => Container.get(token),
      },
    });
    ```

  </TabItem>
  <TabItem value="tsyringe" label="tsyringe">
    ```ts title="src/main/index.ts"
    import { container } from 'tsyringe';
    import UserController from './users/user.controller';

    const app = createIpcApp({
      controllers: [UserController],
      resolver: {
        resolve: (token) => container.resolve(token),
      },
    });
    ```

  </TabItem>
    <TabItem value="nest" label="NestJS">
    ```typescript title="src/main/index.ts"
    import { NestFactory } from '@nestjs/core';
    import { createIpcApp, isIpcController } from '@electron-ipc-bridge/core';
    import { IpcModule } from './ipc.module';

    /** Helper to extract IPC controller classes registered as providers */
    const getIpcControllersFromModule = (ModuleClass: new (...args: unknown[]) => unknown) => {
      const providers = (Reflect.getMetadata('providers', ModuleClass) as unknown[] | undefined) ?? []
      return providers.filter(isIpcController)
    }

    async function bootstrap() {
      const nestContext = await NestFactory.createApplicationContext(IpcModule);

      const ipcApp = createIpcApp({
        controllers: getIpcControllersFromModule(IpcModule),
        resolver: {
          resolve: (Token) => nestContext.get(Token),
        },
      });
    }
    ```

  </TabItem>
</Tabs>

We have a full example demonstrating [TypeDI integration](https://github.com/metacurb/electron-ipc-bridge/tree/main/apps/examples/electron-vite-typedi) in the repository.
