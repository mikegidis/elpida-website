const categoryModel = require("./category.model");

async function getCategories(req, res) {
    try {
        const categories = await categoryModel.getAllCategories();

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve categories",
        });
    }
}

module.exports = {
    getCategories,
};