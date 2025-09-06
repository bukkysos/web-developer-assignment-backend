// tests/posts.test.ts
import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import bodyParser from "body-parser";
import postsRouter from "../routes/posts"; // adjust path

// Mount the app for testing
const app = express();
app.use(bodyParser.json());
app.use("/posts", postsRouter);

// ✅ Before each test, reset DB (simplified example)
import { Database } from "sqlite3";

beforeEach(async () => {
    const db = new Database("../../test.db");

    await new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run("DROP TABLE IF EXISTS posts");
            db.run(
                `CREATE TABLE posts (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`,
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    });
});


describe("POST /posts", () => {
    it("should create a new post", async () => {
        const res = await request(app).post("/posts").send({
            userId: "user123",
            title: "Test Post",
            body: "This is a test",
        });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.post).toMatchObject({
            userId: "user123",
            title: "Test Post",
            body: "This is a test",
        });
    });

    it("should fail if title/body missing", async () => {
        const res = await request(app).post("/posts").send({
            userId: "user123",
            title: "",
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("title and body are required");
    });
});

describe("GET /posts", () => {
    it("should return posts for a given userId", async () => {
        // insert a row first
        await request(app).post("/posts").send({
            userId: "user123",
            title: "Test Post",
            body: "This is a test",
        });

        const res = await request(app).get("/posts").query({ userId: "user123" });
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(3);
        expect(res.body[0]).toEqual({
            user_id: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String), // if you return it
            id: expect.any(String), // if you return UUID
        });
    });

    it("should fail if userId is missing", async () => {
        const res = await request(app).get("/posts");

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("userId is required");
    });
});

describe("DELETE /posts/:postId", () => {
    it("should delete a post", async () => {
        const createRes = await request(app).post("/posts").send({
            userId: "user123",
            title: "To be deleted",
            body: "delete me",
        });

        const postId = createRes.body.post.id;

        const deleteRes = await request(app).delete(`/posts/${postId}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe("Post deleted successfully");

        // check DB is empty
        const getRes = await request(app).get("/posts").query({ userId: "user123" });
    });

    it("should fail if postId is missing", async () => {
        const res = await request(app).delete("/posts/");

        expect(res.status).toBe(404); // Express treats empty param as not matched route
    });
});
