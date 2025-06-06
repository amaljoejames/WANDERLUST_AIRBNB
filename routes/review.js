const express = require('express');
const router = express.Router( {mergeParams: true} );
const wrapAsync= require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const {validateReviews,isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController= require("../controllers/reviews.js");


//post route for reviews
router.post("/", isLoggedIn,validateReviews, wrapAsync(reviewController.createReview));

//delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));
module.exports= router;