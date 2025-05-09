//INITIALIZING LIBRARIES 
const express= require('express');
const {z}= require('zod');
const jwt= require('jsonwebtoken')
const mongoose= require ('mongoose')
const bcrypt = require('bcrypt')
const { User, Blog } = require('./Models/model');
const app= express()
app.use(express.json());
mongoose.connect("mongodb+srv://dkdarshkashyap07:OpvhehPg4zpGRil8@cluster0.ai0fklv.mongodb.net/newUsers!")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
const SECRET_KEY="mysecretkey"

//MIDDLEWARES
const checkuserlogin = function (req, res, next) {
 //get token from req auth headers
 const token = req.headers.authorization?.split(" ")[1];
 if (!token) return res.status(401).send("Token required");

 //verify it with secret key
 try {
  const decoded = jwt.verify(token, SECRET_KEY);
  req.user = decoded;
  next();
} catch {
  res.status(403).send("Invalid or expired token");
}
};

// ZOD VALIDATION
const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});



app.get('/',(req,res)=>{
  res.send("Hello world")
})

//AUTHENTICATION ROUTES
app.post('/signup',async(req,res)=>{
  const{username,password}=req.body;
  //check if username is already present in db
  const existingUser= await User.findOne({username:username})
  if (existingUser) {
    return res.status(400).send("Username Already Exists")
  }
  //save username and pass in db
const user= new User({
  username:username, 
  password:password
})
user.save();
res.json({msg:"User created succesfully"})
})

app.post('/signin',async(req,res)=>{
  
  //compare username and password from db
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).send("Invalid credentials")
  //token generate
  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: "Login successful", token });
})

//BLOG ROUTES
app.post('/create',checkuserlogin,async(req,res)=>{
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.user.username
  });

  await blog.save();
  res.send("Blog created");
})


app.get('/blogs',checkuserlogin,async(req,res)=>{
//fetch all the blogs from dbconst blogs = await Blog.find();
const blogs = await Blog.find();
//return the output in json format
res.json(blogs);

})

app.get('/blogs/ :id',checkuserlogin,async(req,res)=>{
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});



app.put('/blogs/:id', checkuserlogin, async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    content: req.body.content
  });
  res.send("Blog updated");
});

app.delete('/blogs/:id', checkuserlogin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.send("Blog deleted");
});


app.listen(3001);   
