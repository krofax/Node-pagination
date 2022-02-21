const express = require("express");
const mongoose = require("mongoose");
const { PostModel } = require("./models/PostModel");
const { PostList } = require("./posts");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/pgtest")
  .then(() => {
    console.log("Connected to MongoDB Successfully");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB");
    console.error(err);
  });

const PORT = process.env.PORT || 2020;

const db = mongoose.connection;

db.once("open", async () => {
  if ((await PostModel.countDocuments().exec()) > 1) return;

  Promise.all(
    PostList.map((post) => {
      return PostModel.create({
        title: post.title,
        body: post.body,
        userId: post.userId,
      });
    })
  )
    .then(() => {
      console.log("Post added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/posts", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const result = {};
    const totalPosts = await PostModel.countDocuments().exec();

    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;

    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await PostModel.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    result.data = await PostModel.find()
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;

    return res.json({ msg: "Post Fetched successfully", data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

app.listen(PORT, () => console.log(`App listenig on port ${PORT}`));

/*
For this tour we'll focus on the core packages of tidyverse we discussed 
earlier: ggplot2, tidyr, readr, dplyr, tibble, purrr, stringr and forcats.

*/
