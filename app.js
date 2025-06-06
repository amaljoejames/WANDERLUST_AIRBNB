if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path= require('path');
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const session = require("express-session");
const MongoStore= require("connect-mongo");
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const userRouter= require("./routes/user.js");
const dburl= process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dburl); 
}
main()
     .then(()=>{
        console.log("connected to database");
     })
     .catch((err) => {
        console.log(err);
     });


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const store= MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*60*60,
});
store.on("error",(err)=>{
  console.log("session store error",err);
});
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser= req.user;
  next();
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});
 
// app.all('*', (req, res) => {
//   res.status(404).render('error', { message: 'Page Not Found' });
// });
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page Not Found' });
});


app.listen(8080,()=>{
    console.log('server is running on port 8080');
});