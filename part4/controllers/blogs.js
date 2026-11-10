const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
	Blog.find({}).then((blogs) => {
		response.json(blogs);
	});
});

blogRouter.post("/", (request, response, next) => {
	const blog = new Blog(request.body);

	blog.save()
		.then((result) => {
			response.status(201).json(result);
		})
		.catch((error) => next(error));
});

blogRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
	const { title, author, url, likes } = request.body;

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		{ title, author, url, likes },
		{ new: true, runValidators: true },
	);

	if (updatedBlog) {
		response.json(updatedBlog);
	} else {
		response.status(404).end();
	}
});

module.exports = blogRouter;
