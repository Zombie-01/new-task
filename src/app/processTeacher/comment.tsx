// components/CommentSection.tsx

import API from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface Comment {
  id: number;
  stepId: number;
  userId: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    // Add other user properties as needed
  };
}

interface Props {
  stepId: number;
}

const CommentSection: React.FC<Props> = ({ stepId }) => {
  const [commentText, setCommentText] = useState("");
  async function post({ text }: { text: string }) {
    try {
      const response = await API({
        url: "/comments/create",
        method: "POST",
        body: { stepId, text: text }
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response.data.message || "An error occurred");
    }
  }
  const { mutate } = useMutation({ mutationFn: post });

  const handlePostComment = () => {
    mutate({ text: commentText });
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      <div className="new-comment">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add your comment..."
        />
        <button onClick={handlePostComment}>Post</button>
      </div>
    </div>
  );
};

export default CommentSection;
