const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')

const multer = require('multer')

const app = express()

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)



const fileStorageEngine = multer.diskStorage({
	destination: (res, file, cb) => {
		cb(null, './images')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "--" + file.originalname)
	},
});

const upload = multer({ storage: fileStorageEngine})

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "upload.ejs"))
});

app.post("/single", upload.single("image"), (req, res) => {
	console.log(req.file);
	res.send("Single File upload success")
});

app.post("/multiple", upload.array("images", 3),
(req, res) => {
	console.log(req.files);
	res.send("Multiple File Upload Success")
})



app.listen(5000)