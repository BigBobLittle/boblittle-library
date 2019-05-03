const express = require('express'),
        flash = require('express-flash'),
        session = require('express-session'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      jwt = require('jsonwebtoken'),
      path = require('path'),
      mongoose = require('mongoose'),
      Book = require('./models/book');
      User = require('./models/user');
      app = express();
      app.use(bodyParser.urlencoded({extended:false}));
      app.use(bodyParser.json());
      app.use(session({secret:'justsomeseecret', resave:false, saveUninitialized:true, cookie: { maxAge: 60000 }}));
      app.use(flash());


      app.use(methodOverride('_method'));
      app.use((req,res,next) => {
          res.locals.message =  null;
          res.locals.user = req.session.user;
          next();
      });

      function checkSignIn(req,res,next){
          if(!req.session.user){
             res.redirect('/login');
          }else{
              req.flash('error', 'cant access this page');
              next();
          }
      }
      /*** TEMPLATE ENGINE SETUP */
     app.use(express.static(path.join(__dirname, 'public')));
     app.set('views', path.join(__dirname, 'view'));
     app.engine('html', require('ejs').renderFile);
     app.set('view engine', 'html');  
    

     /***SERVE THE APP */
      app.listen(process.env.PORT || 3000);


    //connect to mongoose by passing in ur connection string
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    //mongoose.connect(uri, { useFindAndModify: false });
    let conn = mongoose.connection;
     conn.openUri('mongodb://bigboblittle:pAssw0rd@ds149676.mlab.com:49676/gideon-project',{ useNewUrlParser: true });
  //  conn.openUri('mongodb://localhost/gideon-project',{ useNewUrlParser: true });
   
    conn.on('connected', () => {
        console.log('mongoose connected');
        
    });



      /**** ROUTES */
      app.get('/', (req,res,next)=> {

        movies = [];
        Book.find({})
        .sort('-createdAt')
        .exec((err, movies) => {
            if(err) return next(err);
            if(!movies){
                res.send(`No items in library`);
            }

            res.render('index', {
                movies:movies
            });
        });
       
      });


      /***RENDER LOGIN PAGE */
      app.get('/login', (req,res,next) => {
          res.render('login');
      });

      app.get('/logout', (req,res,next) => {
          req.session.destroy();
          res.redirect('/');
      });

      app.post('/search', (req,res,next)=> {

        search = req.body.what;

          console.log(search);
          res.json(search);
          
        //   Book.find({ $or : [{title:search}, {genre:search}]})
        //         .exec((err, match)=> {
        //             if(err) return next(err);

        //             res.redirect('/search', {book:{title:match.title, genre:match.genre, author:match.author}})
        //            // res.json({book:{title:match.title, genre:match.genre}});
        //         });
      });



      app.get('/dashboard', checkSignIn, (req,res,next) => {

        movies = [];
        Book.find({})
        .sort("-createdAt")
        .exec((err, movies) => {
            if(err) return next(err);
            if(!movies){
                res.send(`No items in library`);
            }

        
       
          res.render('dashboard', {movies:movies, message: req.flash('info', 'Welcome')});
      });

    });
      /*** CREATE A BOOK */
      app.post('/bob/createBook', checkSignIn, (req,res,next) => {
          let frm = req.body;
          title = frm.title;
          author = frm.author;
          genre = frm.genre;

          if(!title){
              req.flash('error', 'Title is required');
             // res.send('Title is required');

          }

          if(!author){
              res.send('Please provide author name');
          }

          if(!genre){
              res.send('Genre is required');
          }

         console.log(req.body)

         req.flash('info', 'Title is required');
          let aBook = new Book({
              title:title,
              author:author,
              genre:genre
          });

          aBook.save((err, bookSaved) => {
              if(err) return next(err);

              req.flash('info', 'You have successfully added a book to the library');
              res.redirect('/dashboard');
             // res.send(`You've successfully added a book to the library`);
            // console.log(bookSaved);
             
          });
      });


      /*** EDIT A BOOK */
      app.put('/edit/:id',  checkSignIn, (req,res,next) => {
          console.log(req.body);
            Book.findOneAndUpdate({_id:req.params.id}, req.body)
                    .exec((err, updated) => {
                        if(err) return next(err);

                       req.flash('info', 'Book edited');
                        res.redirect('/dashboard')
                    });
      });

        /**** DELETE A BOOK */
        app.delete('/bob', checkSignIn, (req,res,next) => {

            id = req.body.id;
           console.log(id);
           res.json(id);
    
         
              
              
            //   Book.findOneAndRemove({_id:req.body.id})
            //         .exec((err, deletedBook)=> {
            //             if(err) return next(err);
    
            //            req.flash('info', 'Book deleted');
            //            res.redirect('/dashboard');
            //         });
    
    
          });

    


      

    
      /*** REGISTER */
      app.post('/register', (req,res,next)=> {
        let frm = req.body;
        username = frm.username;
       
        password = frm.password;
      
    
        if(!username){
            res.json({success:false, statusCode:'NAME-REQUIRED', response:`username is required`});
        }
    
       
    
        if(!password) {
            res.json({success:false, statusCode:'PASSWORD-REQUIRED', response:`Password is required`});
        }
    
    
       let obj = new User({
        username: username,
       
        password:password,
        
       });
    
       obj.save((err, savedObject)=> {
            if(err){
    
               console.log(err);
                
            
            }else{
    
                res.json({success:true, statusCode:'REGISTERED-SUCCESS', response:`Account successfully created`, user:savedObject});
            }
       });

      });
     

      /****LOGIN */
      app.post('/login', (req,res,next) => {
        let  frm  = req.body;
        username = frm.username;
        password = frm.password;
       
   
        User.findOne({
           username:username
        }).exec((err, theUserFound) => {
            if(err) return next(err);
            if(!theUserFound){
                req.flash("error", 'User not found');
                res.redirect('/login');
             //   res.json({success:false, statusCode:'USER-NOT-FOUND', response:`User not registered `});
            }
   
          
            
            else{
   
                   theUserFound.comparePassword(password, (err, passwordMatch) => {
                       if(err) return next(err);
   
                       if(!passwordMatch){

                        req.flash('error', 'Password mismatch, please check and try again');
                        res.redirect('/login');
                          // res.json({success:false, statusCode:'PASSWORD-MISMATCH',  response:`Password mismatch, please check and try again`});
                       }
   
                       if(passwordMatch){
                           //stick user to jwt
                           //const token = jwt.sign({userId:theUserFound.id}, Config.secret,{expiresIn:'24h'});
                           // token:token, 
                           req.session.user = theUserFound.username;
                           res.redirect('/dashboard');
                          // res.json({success:true, response:`Login successful`,payload:{username:theUserFound.username}});
                       }
                   });
            }
   
            
        });
      })