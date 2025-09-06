import { connection } from "../connection";
import { deletePostTemplate, insertPostTemplate, selectPostsTemplate } from "./query-tamplates";
import { Post } from "./types";
import { randomUUID } from 'crypto'

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results as Post[]);
    });
  });

export const addPost = (userId: string, title: string, body: string, created_at: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!randomUUID().length) {
      reject('UUID not generated');
    }
    connection.run(insertPostTemplate, [randomUUID(), userId, title, body, created_at], function (error) {
      if (error) {
        reject(error);
      }
      resolve({
        id: this?.lastID,
        userId,
        title,
        body,
        created_at,
      } as unknown as void);
    });
  });

export const deletePostById = (postId: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!postId) {
      reject("Invalid post Id");
    }
    console.log({postId})
    const id = postId;
    connection.run(deletePostTemplate, [id], function (error) {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });