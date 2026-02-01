const Slide = require('../models/Slide');

// @desc    Get active slides for public view
// @route   GET /api/slides
// @access  Public
exports.getSlides = async (req, res, next) => {
    try {
        const slides = await Slide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: slides.length,
            slides
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all slides (Admin)
// @route   GET /api/slides/admin
// @access  Private/Admin
exports.getAllSlides = async (req, res, next) => {
    try {
        const slides = await Slide.find({}).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: slides.length,
            slides
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new slide
// @route   POST /api/slides
// @access  Private/Admin
exports.createSlide = async (req, res, next) => {
    try {
        const slideData = { ...req.body };

        if (req.file) {
            slideData.image = `/uploads/covers/${req.file.filename}`;
        }

        const slide = await Slide.create(slideData);

        res.status(201).json({
            success: true,
            slide
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update slide
// @route   PUT /api/slides/:id
// @access  Private/Admin
exports.updateSlide = async (req, res, next) => {
    try {
        const slideData = { ...req.body };

        if (req.file) {
            slideData.image = `/uploads/covers/${req.file.filename}`;
        }

        const slide = await Slide.findByIdAndUpdate(req.params.id, slideData, {
            new: true,
            runValidators: true
        });

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
        }

        res.status(200).json({
            success: true,
            slide
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete slide
// @route   DELETE /api/slides/:id
// @access  Private/Admin
exports.deleteSlide = async (req, res, next) => {
    try {
        const slide = await Slide.findByIdAndDelete(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Slide deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
