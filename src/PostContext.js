import { createContext, useContext, useMemo, useState } from "react";
import createRandomPost from "./CreateRandomPost";

// 1) create a Context
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    // 2) Provide Value to the child component
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("PostContext is used outside PostProvider");
  }
  return context;
}

export { usePosts, PostProvider };
