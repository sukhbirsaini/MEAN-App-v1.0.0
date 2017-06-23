const express = require('express');
const router = express.Router();

//
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect("mongodb://sukhbirsaini:ztOSgIgz2LqJsQzm@inventory-shard-00-00-5c6mc.mongodb.net:27017,inventory-shard-00-01-5c6mc.mongodb.net:27017,inventory-shard-00-02-5c6mc.mongodb.net:27017/inventory?ssl=true&replicaSet=Inventory-shard-0&authSource=admin");

autoIncrement.initialize(connection);
var openConnection = function () {
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback() {
    console.log("connection open");
  });
}

var inventorySchema = new Schema({
  productName: String,
  type: String,
  isOffer: Boolean,
  price: Number,
  available: Boolean,
  inCart: Boolean,
  discountPercentage: Number,
  imageUrl: String
});
// inventorySchema.plugin(autoIncrement.plugin, 'productId');
inventorySchema.plugin(autoIncrement.plugin, {
  model: 'productId',
  field: 'productId'
});
var inventory = mongoose.model("product", inventorySchema);

//filter product on price range and discount
router.get('/filterProducts', (req, res) => {

  // openConnection();
  var minPrice = parseInt(req.query.minprice) || 1;
  var minDis = parseInt(req.query.minDiscount) || 1;
  var maxPrice = parseInt(req.query.maxprice) || 100;
  var maxDiscount = parseInt(req.query.maxDiscount) || 100;

  inventory.find({
      $and: [{
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        }
      }, {
        discountPercentage: {
          $gte: minDis,
          $lte: maxDiscount,
        }
      }]
    })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

//filter product on name, type and availbility
router.get('/filterProductWithTypeName', (req, res) => {

  // openConnection();
  var type = req.query.type || '';
  var name = req.query.name || '';
  var availbility = req.query.availbility || true;
  filterObject = {
    $or: [{
      type: '/' + type + '/'
    }, {
      name: '/' + name + '/'
    }, {
      available: '/' + availbility + '/'
    }]
  };
  inventory.find(filterObject)
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/getProducts', (req, res) => {
  // openConnection();

  inventory.find()
    .then(products => {
      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.put('/updateProduct', (req, res) => {
  // openConnection();
  inventory.findById(req.body._id, function (err, inventory) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(req.body);
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      inventory.productName = req.body.productName || inventory.title;
      inventory.type = req.body.type || inventory.type;
      inventory.price = req.body.price || inventory.price;
      inventory.discountPercentage = req.body.discountPercentage || inventory.discountPercentage;
      inventory.isOffer = req.body.isOffer;
      inventory.available = req.body.available;
      console.log(inventory);
      // Save the updated document back to the database
      inventory.save(function (err, inventory) {
        if (err) {
          res.status(500).send(err)
        }
        console.log("save");
        res.send(inventory);
      });
    }
  });
});

router.put('/saveProduct', (req, res) => {
  var product = new inventory(req.body);

  product.save(function (err, obj) {
    if (err) {
      res.send(err);
    }
    res.send(obj);
  });

});

openConnection();
module.exports = router;
