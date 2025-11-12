const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("Articles service", () => {
  const ARTICLE_ID = "507f1f77bcf86cd799439011";
  const USER_ID = "507f191e810c19729de860ea";

  afterEach(() => {
    mockingoose(Article).reset();
  });

  test("[Articles] Create article", async () => {
    const data = {
      _id: ARTICLE_ID,
      title: "My article",
      content: "Lorem ipsum",
      status: "draft",
      user: USER_ID,
    };

    mockingoose(Article).toReturn(data, "save");

    const result = await articlesService.create({
      title: data.title,
      content: data.content,
      status: data.status,
      user: data.user,
    });

    expect(result.title).toBe(data.title);
    expect(result.user.toString()).toBe(USER_ID);
  });

  test("[Articles] Update article", async () => {
    const updated = {
      _id: ARTICLE_ID,
      title: "Updated title",
      content: "Updated content",
      status: "published",
      user: USER_ID,
    };

    mockingoose(Article).toReturn(updated, "findOneAndUpdate");

    const result = await articlesService.update(ARTICLE_ID, {
      title: updated.title,
      content: updated.content,
      status: updated.status,
    });

    expect(result.status).toBe("published");
    expect(result.title).toBe(updated.title);
  });

  test("[Articles] Delete article", async () => {
    mockingoose(Article).toReturn({ deletedCount: 1 }, "deleteOne");

    const result = await articlesService.delete(ARTICLE_ID);

    expect(result.deletedCount).toBe(1);
  });
});

