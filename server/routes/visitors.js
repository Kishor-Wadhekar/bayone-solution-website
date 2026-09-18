// ==========================================================
// BAYONE SOLUTIONS
// VISITORS API ROUTES
// ==========================================================

const express = require("express");

const router = express.Router();

const db = require("../database/database");


// ==========================================================
// GET ALL VISITORS
// GET /api/visitors
// ==========================================================

router.get("/", (req, res) => {

    try {

        const visitors = db.prepare(`
            SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                country_code,
                phone_full,
                company_name,
                designation,
                consent,
                created_at
            FROM visitors
            ORDER BY id DESC
        `).all();


        res.status(200).json({

            success: true,

            count: visitors.length,

            data: visitors

        });


    } catch (error) {

        console.error(
            "Get Visitors Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load visitor data."

        });

    }

});


// ==========================================================
// GET SINGLE VISITOR
// GET /api/visitors/:id
// ==========================================================

router.get("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid visitor ID."

            });

        }


        const visitor =
            db.prepare(`
                SELECT
                    id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    country_code,
                    phone_full,
                    company_name,
                    designation,
                    consent,
                    created_at
                FROM visitors
                WHERE id = ?
            `).get(id);


        if (!visitor) {

            return res.status(404).json({

                success: false,

                message:
                    "Visitor not found."

            });

        }


        res.status(200).json({

            success: true,

            data: visitor

        });


    } catch (error) {

        console.error(
            "Get Single Visitor Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load visitor."

        });

    }

});


// ==========================================================
// DELETE VISITOR
// DELETE /api/visitors/:id
// ==========================================================

router.delete("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid visitor ID."

            });

        }


        const result =
            db.prepare(`
                DELETE FROM visitors
                WHERE id = ?
            `).run(id);


        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Visitor not found."

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Visitor deleted successfully."

        });


    } catch (error) {

        console.error(
            "Delete Visitor Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to delete visitor."

        });

    }

});


module.exports = router;