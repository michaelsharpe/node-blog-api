const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { BlogPosts } = require("./models");

// create dummy posts
BlogPosts.create(
  "My Post 1",
  "This is the content of my first post",
  "Joe Smith"
);
BlogPosts.create(
  "My Post 2",
  "This is the content of my second post",
  "Joe Smith"
);

// send back JSON representation of all posts
router.get("/", (req, res) => {
  res.json(BlogPosts.get());
});

// Curried helper function for reuse
const checkFields = required => fields => {
  return required.filter(reqField => !fields.includes(reqField));
};

// middleware we can add to any endpoint to check for required fields and return appropriate response
const requireFields = required => (req, res, next) => {
  const missingFields = checkFields(required)(req.body);

  if (missingFields.length === 0) {
    const message = `Missing \`${missingFields.join(", ")}\` in request body`;
    console.error(message);
    return res.status(400).send(message);
  }

  next();
};

// add post, ensure has required fields
router.post(
  "/",
  jsonParser,
  requireFields(["title", "content", "author"]),
  (req, res) => {
    const item = BlogPosts.create(
      req.body.title,
      req.body.content,
      req.body.author
    );

    res.status(201).json(item);
  }
);

// Delete post by ID
router.delete("/:id", (req, res) => {
  // How might we expand this to include error handling?  What if the given ID doesnt exist?
  BlogPosts.delete(req.params.id);
  console.log(`Deleted post \`${req.params.ID}\``);
  res.status(204).end();
});

// update post
router.put(
  "/:id",
  jsonParser,
  requireFields(["title", "content", "author", "publishDate"]),
  (req, res) => {
    if (req.params.id !== req.body.id) {
      const message = `Request path id (${
        req.params.id
      }) and request body id ``(${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }

    console.log(`Updating blog post \`${req.params.id}\``);

    // Also would want to check if the item even exists first before trying to update
    // Finally, consider to other possible error cases here.
    // I might send the updated item back in a 200 request in case the client needs it for something
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(200).send(updatedItem);
  }
);

module.exports = router;
