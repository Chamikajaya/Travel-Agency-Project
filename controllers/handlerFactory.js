const asyncWrapper = require('../utils/asyncWrapper')
const AppError = require('../utils/appError');

const deleteSingleDoc = (Model) => asyncWrapper(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('Could not perform the deletion. No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})







module.exports = deleteSingleDoc;