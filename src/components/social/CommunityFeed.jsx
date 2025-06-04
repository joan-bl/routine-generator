import React from "react";

// Feed de comunidad para interacción social
function CommunityFeed({ posts }) {
  return (
    <div className="community-feed">
      <h3>Comunidad</h3>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>
            <strong>{post.user}:</strong> {post.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommunityFeed;
