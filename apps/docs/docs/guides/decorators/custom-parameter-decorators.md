# Custom Parameter Decorators

While `@electron-ipc-controller` provides several built-in decorators like `@Sender()` and `@Window()`, you can easily create your own **parameter decorators** to inject custom data or services into your handler methods.

## `createParamDecorator`

The `createParamDecorator` utility allows you to define a decorator that extracts data from the `IpcMainInvokeEvent` or other sources at runtime.

### Basic Example

Imagine you want to extract a "User" from a global session manager based on the event sender.

```typescript
import { createParamDecorator } from "@electron-ipc-controller/core";

export const CurrentUser = createParamDecorator((event, data) => {
  // Logic to extract user from event or global state
  // 'data' is the value passed to the decorator, e.g., @CurrentUser('some-argument')
  return { id: 1, name: "Admin", role: data };
});
```

### Usage in Controllers

Once defined, you can use your custom decorator in any controller method just like a built-in one.

```typescript
@IpcController("users")
export class UserController {
  @IpcHandle()
  async getProfile(@CurrentUser() user: UserProfile) {
    // 'user' is injected automatically by your decorator
    console.log(`Fetching profile for ${user.name} with role ${user.role}`);
    return user;
  }
}
```
