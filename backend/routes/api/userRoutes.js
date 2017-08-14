const passport = require('passport');
const userRepository = require('../../repositories/userRepository');
const createUserAndEmptyStatistics = require('./../../services/userService');
const isAdmin = require('./../../middleware/isAdminMiddleware');

module.exports = (app) => {
  app.post('/api/user/login/', passport.authenticate('user', {
    successRedirect: '/',
    failureRedirect: '/userregistration',
    failureFlash: true,
    successFlash: 'Welcome!',
  }));

  app.post('/api/user/registration', (req, res) => {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    createUserAndEmptyStatistics(data, () => { // TODO заменить на свою функцию
      passport.authenticate('local')(req, res, () => {
        console.log('before redirect');
        res.redirect('/userlogin');
      });
    });
  });

  app.get('/api/users/', isAdmin, (req, res) => {
    userRepository.getAll((err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).json(data);
      }
    });
  });

  app.get('/api/users/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    userRepository.findOneAndPopulate(id, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).json(data);
      }
    });
  });

  app.post('/api/users/', (req, res) => {
    userRepository.add(req.body, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(201).json(data);
      }
    });
  });

  app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    userRepository.update(id, req.body, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).json(data);
      }
    });
  });

  app.delete('/api/users/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    userRepository.delete(id, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).json(data);
      }
    });
  });
};
