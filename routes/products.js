const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/chech-auth');
const Product = require("../Models/product");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

router.get('/', checkAuth, (req, res, next) => {
	Product
		.find()
		.exec()
		.then(products => {
			const response = {
				count: products.length,
				products: products.map(product => {
					return {
						_id: product._id,
						name: product.name,
						price: product.price,
						productImage: product.productImage
					}
				})
			};
			res.status(200).json(response);
		})
		.catch(error => {
			next(error);
		})
});

router.post('/', checkAuth, upload.single('productImage'),  (req, res, next) => {
    const product = createProduct(req);
	product
		.save()
		.then(product => {
			res.status(200).json({
				message: 'Product Created Successfully!',
				product: {
					_id: product._id,
					name: product.name,
					price: product.price,
					productImage: product.productImage
				}
			});
		})
		.catch(error => {
			next(error);
		});
});

router.get('/:productId', checkAuth,(req, res, next) => {
	const id = req.params.productId;
	Product
		.findById(id)
		.select('_id name price productImage')
		.exec()
		.then(product => {
			if (product) {
				res.status(200).json(product);
			}
			else {
				res.status(404).json({
					message: 'Product Not Found!'
				});
			}
		})
		.catch(error => {
			next(error);
		});
});

router.patch('/:productId', checkAuth, (req, res, next) => {
	const productId = req.params.productId;
	Product
		.update({ _id: productId }, { $set: req.body })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Updated Product Successfully!',
				result: result
			});
		})
		.catch(error => {
			next(error);
		})
});

router.delete('/:productId', checkAuth, (req, res, next) => {
	const productId = req.params.productId;
	Product
		.remove({ _id: productId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Deleted Product Successfully!',
				result: result
			});
		})
		.catch(error => {
			next(error);
		});
});

function createProduct(req) {
	return new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
}

module.exports = router;