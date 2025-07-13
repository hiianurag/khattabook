const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.render("index", { files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/createhisaab", (req, res) => {
  const currentDate = new Date();
  const date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  fs.writeFile(
    `./files/${req.body.title} (${date}).txt`,
    req.body.content,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.redirect("/");
    }
  );
});

app.get(`/edit/:filename`, (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("edit", { data, filename: req.params.filename });
  });
});

app.post(`/update/:filename`, (req, res) => {
  fs.writeFile(`./files/${req.params.filename}`, req.body.content, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect("/");
  });
});

app.listen(3000);
