import { Cookie, Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";


const app = new Elysia()
  .use(staticPlugin({
    assets: './uploads',
    prefix: '/uploads'
  }))
  .use(jwt({
    name: "jwt",
    secret: "secret from elysia",
  }))

  .get("/", () => "Elysia Framework")
  .get("/hello", () => {
    return { message: "Hello World" }
  })

  .get("/hello/:name", ({ params }: {
    params: {
      name: string
    }
  }) => {
    return { message: `Hello ${params.name}` }
  })

  .get("/hello/:name/:age", ({ params }: {
    params: {
      name: string,
      age: number
    }
  }) => {
    const name = params.name;
    const age = params.age;
    return { message: `Hello ${name}, you are ${age} years old` }
  })

  .get("/customers/:id", ({ params }: {
    params: {
      id: number
    }
  }) => {
    const customers = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane", age: 25 },
      { id: 3, name: "Alice", age: 35 },
    ]
    const customer = customers.find((customer) => customer.id === params.id);
    if (!customer) {
      return { message: "Customer not found" }
    }
    return customer;
  })
  // http://localhost:3000/customers/query?name=A&age=20
  .get("/customers/query", ({ query }) => {
    const name = query.name;
    const age = query.age;
    return { message: `Hello ${name}, you are ${age} years old` }
  })

  .post("/customers/create", ({ body }: {
    body: {
      name: string,
      age: number
    }
  }) => {
    const name = body.name;
    const age = body.age;
    return { message: `Hello ${name}, you are ${age} years old` }
  })

  .put("/customers/update/:id", ({ params, body }: {
    params: {
      id: number
    },
    body: {
      name: string,
      age: number
    }
  }) => {
    const id = params.id;
    const name = body.name;
    const age = body.age;
    return { message: `Customer ${id} updated: ${name}, ${age}` }
  })

  .delete("/customers/delete/:id", ({ params }: {
    params: {
      id: number
    }
  }) => {
    const id = params.id;
    return { message: `Customer ${id} deleted` }
  })

  .post("/user/signin", async ({ jwt, set, body }: {
    jwt: any,
    set: any
    body: {
      username: string,
      password: string
    }
  }) => {
    try {
      const { username, password } = body;

      if (username !== "admin" || password !== "1234") {
        set.status = 401; // Unauthorized
        return { message: "Invalid username or password" }
      }

      const token = await jwt.sign({ username }, { expiresIn: "1d" });
      return { token };
    } catch (error: any) {
      set.status = 500;
      return { error: error.message }
    }
  })

  .get("/user/profile", async ({ jwt, cookie: { auth } }: {
    jwt: any,
    cookie: any
  }) => {
    const { username } = await jwt.verify(auth.value);
    return { message: `Hello ${username}` }
  })

  .get("user/profileFromToken", async ({ jwt, request }: {
    jwt: any,
    request: Request
  }) => {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1];
    const { username } = await jwt.verify(token);
    return { message: `Hello ${username}` }
  })

  .post("/upload-file", async ({ body }: {
    body: {
      file: File
    }
  }) => {
    const file = body.file;
    Bun.write("uploads/" + file.name, file);
    return { message: "File uploaded successfully" }
  })

  .get("write-file", () => {
    Bun.write("uploads/test.txt", "Hello World");
    return { message: "File written successfully" }
  })

  .get("read-file", () => {
    const file = Bun.file("uploads/test.txt");
    return file.text();
  })

  // listen to port 3000
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);