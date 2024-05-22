import React, { useState } from "react";

export default function CommentForm(props) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleFormSubmit(props.ans, inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button disabled={!inputValue} type="submit">
        Post Comment
      </button>
    </form>
  );
}
