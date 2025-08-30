const Listing = require("./models/listing");
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema  } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Only save redirect URL if it's not login/register/logout
    if (req.originalUrl !== "/login" && req.originalUrl !== "/register" && req.originalUrl !== "/logout") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  console.log("Session redirectUrl:", req.session.redirectUrl);
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  console.log("Res.locals.redirectUrl:", res.locals.redirectUrl);
  next();
};


module.exports.isOwner = async (req,res,next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`); // <-- return here!
  }
  next();

}

module.exports.validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
};

module.exports.validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
  let { id,reviewId } = req.params;
  let listing = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`); // <-- return here!
  }
  next();

}