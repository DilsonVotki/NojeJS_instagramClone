var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var app = express();

var objectId = require("mongodb").ObjectId;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = mongodb.Db(
  "instagram",
  new mongodb.Server("localhost", 27017, {}),
  {}
);

console.log("Servidor HTTP esta escutando a porta " + port);

app.get("/", function (req, res) {
  res.send({ msg: "Olá" });
});

//POST
app.post("/api", function (req, res) {
  var dados = req.body;

  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.insert(dados, function (err, records) {
        if (err) {
          res.json(err);
        } else {
          res.json(records);
        }
        mongoclient.close();
      });
    });
  });
});

//GET
app.get("/api", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.find().toArray(function (err, results) {
        if (err) {
          res.json(err);
        } else {
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

//GET por id
app.get("/api/:id", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.find(objectId(req.params.id)).toArray(function (err, results) {
        if (err) {
          res.json(err);
        } else {
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

//PUT (atualizar)
app.put("/api/:id", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.update(
        { _id: objectId(req.params.id) },
        { $set: { titulo: req.body.titulo } },
        {},
        function (err, records) {
          if (err) {
            res.json(err);
          } else {
            res.json(records);
          }
          mongoclient.close();
        }
      );
    });
  });
});

//DELETE por id
app.delete("/api/:id", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("postagens", function (err, collection) {
      collection.remove(
        { _id: objectId(req.params.id) },
        function (err, results) {
          if (err) {
            res.json(err);
          } else {
            res.json(results);
          }
          mongoclient.close();
        }
      );
    });
  });
});
