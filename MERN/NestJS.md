Here are commonly asked **NestJS interview questions and answers**, ranging from beginner to advanced.

# Beginner Level

### 1. What is NestJS?

**Answer:**
NestJS is a progressive Node.js framework for building scalable, maintainable, and efficient server-side applications. It is built with TypeScript and follows Angular-inspired architecture using modules, controllers, services, and dependency injection.

---

### 2. Why use NestJS?

**Answer:**

* Modular architecture
* Dependency Injection (DI)
* TypeScript support
* Easy testing
* Built-in validation
* Middleware, Guards, Pipes, Interceptors
* Supports REST, GraphQL, WebSockets, and Microservices
* Easy integration with databases like TypeORM, Prisma, and Mongoose

---

### 3. What are the main building blocks of NestJS?

**Answer:**

* Modules
* Controllers
* Providers (Services)
* Middleware
* Pipes
* Guards
* Interceptors
* Exception Filters

---

### 4. What is a Module?

**Answer:**
A module organizes related components into a single unit.

```typescript
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

---

### 5. What is a Controller?

**Answer:**
Controllers handle incoming HTTP requests and return responses.

```typescript
@Controller('users')
export class UserController {

  @Get()
  findAll() {
    return [];
  }

}
```

---

### 6. What is a Provider?

**Answer:**
Providers are classes annotated with `@Injectable()` that can be injected into controllers or other providers using Dependency Injection.

```typescript
@Injectable()
export class UserService {
  getUsers() {
    return [];
  }
}
```

---

### 7. Explain Dependency Injection.

**Answer:**
Dependency Injection allows NestJS to automatically create and inject required objects.

```typescript
constructor(private readonly userService: UserService) {}
```

Benefits:

* Loose coupling
* Easier testing
* Better maintainability

---

# Intermediate Level

### 8. What is Middleware?

**Answer:**
Middleware executes before the request reaches the route handler.

Uses:

* Logging
* Authentication
* Request modification

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log(req.url);
    next();
  }
}
```

---

### 9. What are Pipes?

**Answer:**
Pipes transform and validate incoming data.

Example:

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return id;
}
```

Built-in Pipes:

* ValidationPipe
* ParseIntPipe
* ParseBoolPipe
* ParseUUIDPipe

---

### 10. What are Guards?

**Answer:**
Guards determine whether a request is allowed to proceed.

Commonly used for:

* JWT Authentication
* Role-based Authorization

```typescript
@UseGuards(AuthGuard)
@Get()
findAll() {}
```

---

### 11. What are Interceptors?

**Answer:**
Interceptors execute before and after route handlers.

Uses:

* Logging
* Response transformation
* Caching
* Timeout handling

```typescript
@UseInterceptors(LoggingInterceptor)
```

---

### 12. What are Exception Filters?

**Answer:**
Exception Filters catch exceptions and customize error responses.

```typescript
@Catch(HttpException)
export class HttpExceptionFilter {}
```

---

### 13. What is DTO?

**Answer:**
DTO (Data Transfer Object) defines the structure of data transferred between client and server.

Example:

```typescript
export class CreateUserDto {
  name: string;
  email: string;
}
```

---

### 14. How do you validate DTOs?

**Answer:**

Install:

```bash
npm install class-validator class-transformer
```

Example:

```typescript
export class CreateUserDto {

  @IsEmail()
  email: string;

  @IsString()
  name: string;

}
```

Enable globally:

```typescript
app.useGlobalPipes(new ValidationPipe());
```

---

### 15. What is the difference between Interface and DTO?

| Interface                 | DTO                 |
| ------------------------- | ------------------- |
| Compile-time only         | Runtime object      |
| Cannot validate           | Supports validation |
| Removed after compilation | Exists at runtime   |

---

# Advanced Level

### 16. Explain the NestJS request lifecycle.

**Answer:**

```
Request
   ↓
Middleware
   ↓
Guards
   ↓
Interceptors (before)
   ↓
Pipes
   ↓
Controller
   ↓
Service
   ↓
Interceptors (after)
   ↓
Exception Filter
   ↓
Response
```

---

### 17. Singleton vs Request Scope

**Singleton (Default)**

One instance for the whole application.

```typescript
@Injectable()
export class UserService {}
```

**Request Scope**

New instance per request.

```typescript
@Injectable({ scope: Scope.REQUEST })
```

---

### 18. What is Custom Provider?

```typescript
{
  provide: 'CONFIG',
  useValue: {
    db: 'mysql'
  }
}
```

Other provider types:

* useClass
* useFactory
* useExisting

---

### 19. Explain Dynamic Modules.

Dynamic modules allow configuration during module import.

```typescript
@Module({})
export class DatabaseModule {

  static forRoot(options): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [],
    };
  }

}
```

---

### 20. What are Custom Decorators?

Example:

```typescript
export const User = createParamDecorator(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Usage:

```typescript
@Get()
find(@User() user) {}
```

---

### 21. How do you implement JWT authentication?

Steps:

1. Install Passport and JWT packages.
2. Create a JWT strategy.
3. Configure `JwtModule`.
4. Generate tokens on login.
5. Protect routes with `AuthGuard('jwt')`.

---

### 22. Difference between Guards, Middleware, and Interceptors

| Feature            | Middleware | Guard | Interceptor |
| ------------------ | ---------- | ----- | ----------- |
| Before request     | ✅          | ✅     | ✅           |
| Authorization      | ❌          | ✅     | ❌           |
| Transform response | ❌          | ❌     | ✅           |
| Logging            | ✅          | ❌     | ✅           |
| Execution control  | ❌          | ✅     | ✅           |

---

### 23. What databases does NestJS support?

* PostgreSQL
* MySQL
* MongoDB
* MariaDB
* SQLite
* MSSQL
* Oracle

Using:

* TypeORM
* Prisma
* Sequelize
* Mongoose

---

### 24. Explain Microservices in NestJS.

NestJS supports transport layers such as:

* TCP
* Redis
* RabbitMQ
* Kafka
* NATS
* gRPC

---

### 25. What is the difference between `@Injectable()` and `@Module()`?

| `@Injectable()`               | `@Module()`                                 |
| ----------------------------- | ------------------------------------------- |
| Marks a class as a provider   | Groups related components                   |
| Used for services             | Used to organize the application            |
| Supports dependency injection | Defines imports, controllers, and providers |

---

### 26. How do you implement caching in NestJS?

Using the cache manager:

```typescript
@UseInterceptors(CacheInterceptor)
@Get()
findAll() {}
```

---

### 27. How do you handle file uploads?

Using the interceptor:

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {}
```

---

### 28. How do you implement global exception handling?

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

---

### 29. How do you configure environment variables?

Using `@nestjs/config`:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
});
```

Access values:

```typescript
constructor(private configService: ConfigService) {}

const dbHost = this.configService.get('DB_HOST');
```

---

### 30. What are some NestJS best practices?

* Keep controllers thin; place business logic in services.
* Use DTOs for validation and request shaping.
* Apply global `ValidationPipe`.
* Use dependency injection instead of manual instantiation.
* Organize features into modules.
* Centralize configuration with `ConfigModule`.
* Handle errors with exception filters.
* Write unit and integration tests.
* Use authentication guards for protected routes.
* Follow consistent naming conventions.

## Frequently Asked Practical Interview Questions

1. Explain the NestJS request lifecycle.
2. How does dependency injection work in NestJS?
3. What are the differences between Middleware, Guards, Pipes, and Interceptors?
4. How would you implement JWT authentication and role-based authorization?
5. How do you validate request payloads using DTOs?
6. How do you structure a large NestJS project?
7. When would you use request-scoped providers instead of singleton providers?
8. How do you implement custom decorators?
9. How do you connect NestJS with Prisma or TypeORM?
10. How do you handle global error handling and logging?

These questions cover the topics most commonly discussed in NestJS interviews for developers with **2–5 years of experience**.
