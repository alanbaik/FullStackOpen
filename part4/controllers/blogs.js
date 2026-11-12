const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
	response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
	const body = request.body;
	const user = request.user;

	const blog = new Blog({
		...body,
		user: user.id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (!blog) {
		return response.status(404).end();
	}

	if (blog.user?.toString() !== request.user.id) {
		return response.status(403).json({ error: "only the creator can delete a blog" });
	}

	await blog.deleteOne();
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
