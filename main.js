import express from "express";
import config from "config";
import { engine } from "express-handlebars";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: config.get("OPENAI_KEY"),
});
const openai = new OpenAIApi(configuration);

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { prompt, size = "512x512", number = 1 } = req.body;
  try {
    const response = await openai.createImage({
      prompt,
      n: Number(number),
      size,
    });
    console.log(response.data.data);
    res.render("index", {
      images: response.data.data,
    });
  } catch (e) {
    console.log(e.message);
    res.render("index", {
      error: e.message,
    });
  }
});

app.listen(3000, () => console.log("Server started..."));
