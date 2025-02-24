import { Elysia } from "elysia";

const app = new Elysia()
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

  // listen to port 3000
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);