const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    console.log("Body:", req.body);

    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.send("Listing not found");

    let newReview = new Review(req.body.review);
    console.log("New review:", newReview);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error while adding review:", err);
    res.send("Something went wrong");
  }
};

module.exports.detroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted!");
  res.redirect(`/listings/${id}`);
};