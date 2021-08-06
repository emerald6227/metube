import express from "express";
import { registerView, createComment, deleteComment } from '../controllers/videoController';
import { getSubscribedList, createSubscribe, deleteSubscribe} from '../controllers/subscribeController';

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.route("/videos/:id([0-9a-f]{24})/comment").post(createComment).delete(deleteComment);
apiRouter.get("/subscribedList", getSubscribedList);
apiRouter.route("/subscribe/:id([0-9a-f]{24})").post(createSubscribe).delete(deleteSubscribe);

export default apiRouter;