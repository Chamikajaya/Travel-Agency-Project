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


const updateSingleDoc = (Model) => asyncWrapper(async (req, res, next) => {
    // findByIdAndUpdate --> refer mongoose docs

    //  ! when we use findByIdAndUpdate, the pre save hooks we implemented will not work.

    const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
    )

    if (!doc) {
        return next(new AppError('Requested document not found', 404))
    }
    res.status(200)
        .json({
            status: "successfully updated",
            updatedDoc: doc

        })

});



const createSingleDoc = (Model) => asyncWrapper(async (req, res, next) => {
    // here create method returns a promise so we can use async await to handle it
    const doc = await Model.create(req.body)

    res.status(201)
        .json({
            status: "Successful",
            data: doc
        })
})


module.exports = { deleteSingleDoc, updateSingleDoc, createSingleDoc };