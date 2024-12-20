import request from "supertest";
import app from "../app";  // Import your Express app

let token = "";  // Store the JWT token for authentication

beforeAll(async () => {
  // First, log in to get the admin token (use valid credentials)
  const response = await request(app)
    .post("/api/login")
    .send({ email: "admin@example.com", password: "adminpassword" });

  token = response.body.token;  // Save the token
});

describe("Admin Routes", () => {
  it("should get dashboard stats", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalUsers");
    expect(response.body).toHaveProperty("totalTasks");
    expect(response.body).toHaveProperty("completedTasks");
  });

  it("should get users", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a task", async () => {
    const response = await request(app)
      .post("/api/admin/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        description: "Task description",
        assignedTo: "userId",  // Replace with actual userId
        priority: "High",
        deadline: "2024-12-31"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "New Task");
  });

  it("should mark attendance", async () => {
    const response = await request(app)
      .post("/api/admin/attendance")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "userId",  // Replace with actual userId
        date: "2024-12-21",
        status: "Present"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "Present");
  });

  it("should generate report", async () => {
    const response = await request(app)
      .get("/api/admin/reports")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
