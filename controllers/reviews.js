const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
module.exports.createReview=async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully created a new review");
  res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview=async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/listings/${id}`);

}