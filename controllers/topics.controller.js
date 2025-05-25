const { selectTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  console.log("POST BODY", req.body);
  const { slug, description, img_url } = req.body;

  //data validation
  if (!slug || !description) {
    return res.status(400).send({ msg: "Missing required fields" });
  }
  insertTopic({ slug, description, img_url })
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
