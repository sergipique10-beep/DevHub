const express = require("express");
const router = express.Router();
const { crearReview, getReviewsPorFreelancer } = require("../controllers/reviewController");
const protegerRuta = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");
const { reviewValidator } = require("../utils/validators");

router.post("/", protegerRuta, permitirRoles("Cliente"), reviewValidator, crearReview);
router.get("/:freelancer_id", getReviewsPorFreelancer);

module.exports = router;
