// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const mongoose = require('mongoose');
// const path = require('path');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/sso-example', { useNewUrlParser: true, useUnifiedTopology: true });

// // Create a user schema
// const User = mongoose.model('User', new mongoose.Schema({
//   profileId: String,
//   email: String,
//   loginTime: Date,
//   logoutTime: Date
// }));

// passport.use(new GoogleStrategy({
//   clientID: '',
//   clientSecret: '',
//   callbackURL: 'http://localhost:3000/auth/google/callback'
// }, (accessToken, refreshToken, profile, done) => {
//     process.nextTick(() => {
//         User.findOne({ profileId: profile.id })
//           .then(user => {
//             if (user) {
//               // User already exists, update login time
//               user.loginTime = new Date();
//             } else {
//               // Create new user
//               user = new User({
//                 profileId: profile.id,
//                 email: profile.emails[0].value,
//                 loginTime: new Date()
//               });
//             }
//             return user.save();
//           })
//           .then(user => {
//             return done(null, user);
//           })
//           .catch(err => {
//             return done(err);
//           });
//       });
// }));

// passport.use(new GitHubStrategy({
//   clientID: '',
//   clientSecret: '',
//   callbackURL: 'http://localhost:3000/auth/github/callback'
// }, (accessToken, refreshToken, profile, done) => {
//   process.nextTick(() => {
//     User.findOne({ profileId: profile.id })
//       .then(user => {
//         if (user) {
//           // User already exists, update login time
//           user.loginTime = new Date();
//         } else {
//           // Create new user
//           user = new User({
//             profileId: profile.id,
//             email: profile.username + '@github.com',
//             loginTime: new Date()
//           });
//         }
//         return user.save();
//       })
//       .then(user => {
//         return done(null, user);
//       })
//       .catch(err => {
//         return done(err);
//       });
//   });
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // passport.deserializeUser((id, done) => {
// //   User.findById(id, (err, user) => {
// //     done(err, user);
// //   });
// // });
// passport.deserializeUser((id, done) => {
//     User.findById(id)
//       .then(user => {
//         done(null, user);
//       })
//       .catch(err => {
//         done(err);
//       });
//   });
  

// const app = express();

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Set the path to the views directory
// app.set('views', path.join(__dirname, 'public'));
// app.set('view engine', 'ejs');

// // Initialize passport and session
// app.use(session({ secret: 'ELON', resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Google authentication route
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google authentication callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   });

// // GitHub authentication route
// app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// // GitHub authentication callback route
// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   });

// // Logout route
// // app.get('/logout', (req, res) => {
// //   req.logout();
// //   res.redirect('/');
// // });
// // Logout route
// app.get('/logout', (req, res) => {
//     req.logout(() => {
//       res.redirect('/');
//     });
//   });
  

// // Render the index.ejs file
// app.get('/', (req, res) => {
//   res.render('index', { user: req.user });
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const User = require('./Model/SSO model.js');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
var mongodb = require("./Config/Mongoconfig.js");
require('dotenv').config();


const mongo = mongoose.connect(mongodb.url1);
mongo.then(
  () => {
    console.log("Mongo_DB Connected Successfully");
  },
  (error) => {
    console.log(
      error,
      "Error, While connecting to Mongo_DB something went wrong"
    );
  }
);

// Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/sso-example', { useNewUrlParser: true, useUnifiedTopology: true });



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://ssologin.onrender.com/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        User.findOne({ profileId: profile.id })
          .then(user => {
            if (user) {
              // User already exists, update login time
              user.loginTime = new Date();
            } else {
              // Create new user
              user = new User({
                profileId: profile.id,
                email: profile.emails[0].value,
                loginTime: new Date()
              });
            }
            return user.save();
          })
          .then(user => {
            return done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      });
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
 clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://ssologin.onrender.com/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    User.findOne({ profileId: profile.id })
      .then(user => {
        if (user) {
          // User already exists, update login time
          user.loginTime = new Date();
        } else {
          // Create new user
          user = new User({
            profileId: profile.id,
            email: profile.username + '@github.com',
            loginTime: new Date()
          });
        }
        return user.save();
      })
      .then(user => {
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });
  

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


// Initialize passport and session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'Google authentication successful' });
  });

// GitHub authentication route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub authentication callback route
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'GitHub authentication successful' });
  });

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get("/", (req, res) => res.send("SSO Login "));
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

