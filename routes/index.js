var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'abc123';

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:root@localhost:5432/test_checklist')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST REGISTER. */
router.post('/register', function(req, res, next) {
  const { username, password, email } = req.body;
  
  db.none('INSERT INTO checklist_user(user_id, username, password, email) VALUES(${user_id}, ${username}, ${password}, ${email})', {
      user_id: username,
      username: username,
      password: password,
      email: email
  }).then((req) =>{
    res.json('Register Success');
  }).catch((error) => {
    res.json('Register Failed, duplicate username');
  });
});

/* POST LOGIN. */
router.post('/login', function(req, res, next) {  
  const { username, password } = req.body;

  db.one('SELECT * FROM checklist_user WHERE username = $1', username)
  .then((data) => {
    // res.send(password);
    if(data.password == password)
    {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.json('Invalid credentials');
    }
  })
  .catch((error) => {
    res.json("User Not Found");
  })
});

/* GET CHECKLIST DATA. */
router.get('/checklist', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const query = "SELECT * FROM checklist_header WHERE user_id = $1";
  db.any(query, user_id)
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.json(error);
  })
});


/* INSERT CHECKLIST DATA. */
router.post('/checklist', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const { name } = req.body;
  const query = "INSERT INTO checklist_header(header,status, user_id) VALUES(${name}, ${status}, ${user_id})";
  db.none(query, {
    name: name,
    status: 1,
    user_id: user_id
  }).then((data) => {
    res.json('Checklist Header Inserted');
  })
  .catch((error) => {
    res.json('Insert Checklist Failed');
    // res.json(error);
  })
});

/* SOFT DELETE CHECKLIST DATA. */
router.post('/checklist/:id', authenticateToken, function(req, res, next) {
  const user_id = req.user.username;
  const id = req.params.id;
  const query = "UPDATE checklist_header SET status=0 WHERE checklist_id = $1 AND user_id = $2 AND status=1";
  db.result(query, [id, user_id])
  .then((result) => {
    if (result.rowCount === 0) {
      res.json('No checklist found, check user or already (soft) deleted.');
    } else {
      res.json('Checklist Header Deleted.');
    }
  })
  .catch((error) => {
    res.json('Checklist Deletion Failed, check user.');
  });
});


/* GET CHECKLIST ALL DETAIL DATA. */
router.get('/checklist/:id/item', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const id = req.params.id;
  const query = `SELECT cd.* FROM checklist_detail cd
                  JOIN checklist_header ch ON ch.checklist_id = cd.checklist_id
                  WHERE ch.user_id = $1 AND ch.checklist_id = $2`;
  db.any(query, [user_id, id])
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.json("Error, check ID and user login");
  })
});

/* INSERT CHECKLIST ALL DETAIL DATA. */
router.post('/checklist/:id/item', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const { itemName } = req.body;
  const id = req.params.id;
  const query = "INSERT INTO checklist_detail(text,status,checklist_id) VALUES(${itemName}, ${status}, ${checklist_id})";
  db.result(query, {
    itemName: itemName,
    status: 0,
    checklist_id: id
  }).then((data) => {
    res.json('Checklist Detail Inserted');
  })
  .catch((error) => {
    res.json('Insert Checklist Detail Failed');
    // res.json(error);
  })
});

/* GET CHECKLIST ONE DETAIL DATA. */
router.get('/checklist/:id/item/:d_id', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const id = req.params.id;
  const detail_id = req.params.d_id;
  const query = `SELECT cd.* FROM checklist_detail cd
                  JOIN checklist_header ch ON ch.checklist_id = cd.checklist_id
                  WHERE ch.user_id = $1 AND ch.checklist_id = $2 AND cd.uid = $3`;
  db.one(query, [user_id, id, detail_id])
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.json("Error, check ID and user login");
  })
});

/* UPDATE CHECKLIST ONE DETAIL DATA. */
router.put('/checklist/:id/item/:d_id', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const id = req.params.id;
  const detail_id = req.params.d_id;
  const query = "UPDATE checklist_detail SET status=1 WHERE checklist_id = $1 AND uid = $2 AND status=0";
  db.result(query, [id, detail_id])
  .then((result) => {
    if (result.rowCount === 0) {
      res.json('No checklist found, check id or status.');
    } else {
      res.json('Checklist Detail Updated.');
    }
  })
  .catch((error) => {
    res.json("Error, check ID or Status");
  })
});

/* DELETE CHECKLIST ONE DETAIL DATA. */
router.delete('/checklist/:id/item/:d_id', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const id = req.params.id;
  const detail_id = req.params.d_id;
  const query = "DELETE FROM checklist_detail WHERE uid = $1";
  db.result(query, [detail_id])
  .then((result) => {
    if (result.rowCount === 0) {
      res.json('No checklist found, check id or status.');
    } else {
      res.json('Checklist Detail DELETED.');
    }
  })
  .catch((error) => {
    res.json("Error, check ID or Status");
  })
});

/* RENAME CHECKLIST ONE DETAIL DATA. */
router.put('/checklist/:id/item/rename/:d_id', authenticateToken, function(req, res, next) {  
  const user_id = req.user.username;
  const id = req.params.id;
  const detail_id = req.params.d_id;
  const { itemName } = req.body;
  const query = "UPDATE checklist_detail SET text='"+itemName+"' WHERE checklist_id = $1 AND uid = $2";
  db.result(query, [id, detail_id])
  .then((result) => {
    if (result.rowCount === 0) {
      res.json('No checklist found, check id.');
    } else {
      res.json('Checklist Detail Updated.');
    }
  })
  .catch((error) => {
    res.json(error);
  })
});

module.exports = router;
