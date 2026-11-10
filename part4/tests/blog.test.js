const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const listHelper = require("../utils/list_helper");
const app = require("../app");
const Blog = require("../models/blog");
const { blogsInDb, listWithManyBlog, listWithOneBlog } = require("./test_helper");

const api = supertest(app);

describe("blog api", () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
		await Blog.insertMany(listWithManyBlog);
	});

	describe("retrieving blogs", () => {
		test("returns all the blogs", async () => {
			const response = await api.get("/api/blogs");

			assert.strictEqual(response.body.length, listWithManyBlog.length);
		});

		test("blogs have an id property and no _id", async () => {
			const response = await api.get("/api/blogs");

			response.body.forEach((blog) => {
				assert.ok(blog.id);
				assert.strictEqual(blog._id, undefined);
			});
		});
	});

	describe("adding a blog", () => {
		test("a valid post can be added", async () => {
			const newBlog = {
				title: "how to program",
				author: "alan",
				url: "http://example.com/how-to-program",
				likes: 0,
			};

			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const blogsAtEnd = await blogsInDb();
			assert.strictEqual(blogsAtEnd.length, listWithManyBlog.length + 1);

			const title = blogsAtEnd.map((n) => n.title);

			assert(title.includes("how to program"));
		});

		test("likes defaults to 0 when missing", async () => {
			const newBlog = {
				title: "Without likes",
				author: "Someone",
				url: "http://example.com/no-likes",
			};

			const response = await api.post("/api/blogs").send(newBlog).expect(201);

			assert.strictEqual(response.body.likes, 0);
		});

		test("fails with status 400 if url is missing", async () => {
			const newBlog = {
				title: "URL is missing",
				author: "Someone",
			};

			await api.post("/api/blogs").send(newBlog).expect(400);
		});

		test("fails with status 400 if title is missing", async () => {
			const newBlog = {
				author: "Someone",
				url: "http://example.com/no-title",
			};

			await api.post("/api/blogs").send(newBlog).expect(400);

			const blogsAtEnd = await blogsInDb();
			assert.strictEqual(blogsAtEnd.length, listWithManyBlog.length);
		});
	});

	describe("deletion of a blog", () => {
		test("succeeds with status code 204", async () => {
			const blogsAtStart = await blogsInDb();
			const blogToDelete = blogsAtStart[0];

			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

			const blogsAtEnd = await blogsInDb();

			assert.strictEqual(blogsAtEnd.length, listWithManyBlog.length - 1);

			const titles = blogsAtEnd.map((b) => b.title);
			assert(!titles.includes(blogToDelete.title));
		});
	});

	describe("updating a blog", () => {
		test("succeeds with status 200 and the new likes", async () => {
			const blogsAtStart = await blogsInDb();
			const blogToUpdate = blogsAtStart[0];

			const response = await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send({ likes: blogToUpdate.likes + 1 })
				.expect(200)
				.expect("Content-Type", /application\/json/);

			assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

			const blogsAtEnd = await blogsInDb();
			const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
			assert.strictEqual(updated.likes, blogToUpdate.likes + 1);
			assert.strictEqual(updated.title, blogToUpdate.title);
		});

		test("fails with status 404 if the blog does not exist", async () => {
			const validNonExistingId = new mongoose.Types.ObjectId().toString();

			await api.put(`/api/blogs/${validNonExistingId}`).send({ likes: 1 }).expect(404);
		});

		test("fails with status 400 if the id is malformed", async () => {
			await api.put("/api/blogs/not-a-valid-id").send({ likes: 1 }).expect(400);
		});
	});
});

describe("list helper", () => {
	describe("total likes", () => {
		test("when list has only one blog, equals the likes of that", () => {
			const result = listHelper.totalLikes(listWithOneBlog);
			assert.strictEqual(result, 5);
		});

		test("when empty", () => {
			assert.strictEqual(listHelper.totalLikes([]), 0);
		});

		test("when many blogs", () => {
			assert.strictEqual(listHelper.totalLikes(listWithManyBlog), 36);
		});
	});

	describe("favorite blog", () => {
		test("when list has only one blog, equals the likes of that", () => {
			const result = listHelper.favoriteBlog(listWithOneBlog);
			assert.deepStrictEqual(result, {
				title: "Go To Statement Considered Harmful",
				author: "Edsger W. Dijkstra",
				likes: 5,
			});
		});

		test("when empty", () => {
			assert.deepStrictEqual(listHelper.favoriteBlog([]), {});
		});

		test("when many blogs", () => {
			assert.deepStrictEqual(listHelper.favoriteBlog(listWithManyBlog), {
				title: "Canonical string reduction",
				author: "Edsger W. Dijkstra",
				likes: 12,
			});
		});
	});

	describe("most blogs author", () => {
		test("when list has only one blog", () => {
			const result = listHelper.mostBlogs(listWithOneBlog);
			assert.deepStrictEqual(result, {
				author: "Edsger W. Dijkstra",
				blogs: 1,
			});
		});

		test("when empty", () => {
			assert.deepStrictEqual(listHelper.mostBlogs([]), {});
		});

		test("when many blogs", () => {
			assert.deepStrictEqual(listHelper.mostBlogs(listWithManyBlog), {
				author: "Robert C. Martin",
				blogs: 3,
			});
		});
	});

	describe("most likes author", () => {
		test("when list has only one blog", () => {
			const result = listHelper.mostLikes(listWithOneBlog);
			assert.deepStrictEqual(result, {
				author: "Edsger W. Dijkstra",
				likes: 5,
			});
		});

		test("when empty", () => {
			assert.deepStrictEqual(listHelper.mostLikes([]), {});
		});

		test("when many blogs", () => {
			assert.deepStrictEqual(listHelper.mostLikes(listWithManyBlog), {
				author: "Edsger W. Dijkstra",
				likes: 17,
			});
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
