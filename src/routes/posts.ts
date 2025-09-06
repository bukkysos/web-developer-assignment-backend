import { Router, Request, Response } from "express";
import { addPost, deletePostById, getPosts } from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).send({ status: false, error: "userId is required" });
    return;
  }
  const posts = await getPosts(userId);
  res.send(posts);
});

router.post("/", async (req: Request, res: Response) => {
  const { title, body, userId } = req.body;
  if (!title || !body) {
    res.status(400).send({ status: false, error: "title and body are required" });
    return;
  }
  const created_at = new Date().toISOString();
  const post = await addPost(userId, title, body, created_at);
  res.status(201).send({ status: true, message: "Post added successfully", post });
});

router.delete("/:postId", async (req: Request, res: Response) => {
  const postId = req.params.postId;

  if (!postId) {
    res.status(400).send({ status: false, error: "postId is required" });
    return;
  }
  await deletePostById(postId);
  res.send({ status: true, message: "Post deleted successfully" });
});

export default router;
