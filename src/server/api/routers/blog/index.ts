import { mergeRouters, createTRPCRouter } from "@/server/api/trpc";
import { postsRouter } from "./posts";
import { tagsRouter } from "./tags";
import { searchRouter } from "./search";
import { viewsRouter } from "./views";
import { commentsRouter } from "./comments";
import { newsletterRouter } from "./newsletter";

export const blogRouter = mergeRouters(
  postsRouter,
  tagsRouter,
  searchRouter,
  viewsRouter,
  commentsRouter,
  newsletterRouter
);
