const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const total = (sum, blog) => {
		return sum + blog.likes;
	};

	return blogs.reduce(total, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return {};
	const favorite = blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best));

	return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return {};

	const authors = new Map();

	blogs.forEach((blog) => {
		const auth = blog.author;
		authors.set(auth, (authors.get(auth) ?? 0) + 1);
	});

	let most = {
		author: "",
		blogs: 0,
	};
	authors.forEach((value, key) => {
		if (value > most.blogs) {
			most = {
				author: key,
				blogs: value,
			};
		}
	});

	return most;
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return {};

	const authors = new Map();

	blogs.forEach((blog) => {
		const auth = blog.author;
		authors.set(auth, (authors.get(auth) ?? 0) + (blog.likes ?? 0));
	});

	const [author, likes] = [...authors].reduce((best, entry) => (entry[1] > best[1] ? entry : best));

	return { author, likes };
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
