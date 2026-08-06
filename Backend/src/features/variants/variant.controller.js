const variantModel = require("./variant.model");

async function getVariants(req, res) {
    try {
        const variants = await variantModel.getAllVariantsForAdmin();

        res.json({
            success: true,
            count: variants.length,
            data: variants,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve variants",
        });
    }
}

function validateVariantInput(req, res) {
    const { product_id, variant_name, price, stock_quantity, is_active } = req.body;

    if (!product_id) {
        res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
        return null;
    }

    if (!variant_name || !variant_name.trim()) {
        res.status(400).json({
            success: false,
            message: "Variant name is required",
        });
        return null;
    }

    if (price === undefined || price < 0) {
        res.status(400).json({
            success: false,
            message: "Valid positive price is required",
        });
        return null;
    }

    if (stock_quantity === undefined || stock_quantity < 0) {
        res.status(400).json({
            success: false,
            message: "Valid positive stock quantity is required",
        });
        return null;
    }

    return {
        product_id: Number(product_id),
        variant_name: variant_name.trim(),
        price: Number(price),
        stock_quantity: Number(stock_quantity),
        is_active: typeof is_active === "boolean" ? is_active : true,
    };
}

async function createVariant(req, res) {
    const variantInput = validateVariantInput(req, res);

    if (!variantInput) {
        return;
    }

    try {
        const variant = await variantModel.createVariant(variantInput);

        return res.status(201).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create variant",
        });
    }
}

async function updateVariant(req, res) {
    const variantInput = validateVariantInput(req, res);

    if (!variantInput) {
        return;
    }

    try {
        const variant = await variantModel.updateVariant(req.params.id, variantInput);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        return res.json({
            success: true,
            data: variant,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update variant",
        });
    }
}

async function deleteVariant(req, res) {
    try {
        const deleted = await variantModel.deleteVariant(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        return res.json({
            success: true,
            message: "Variant deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete variant",
        });
    }
}

module.exports = {
    getVariants,
    createVariant,
    updateVariant,
    deleteVariant,
};
