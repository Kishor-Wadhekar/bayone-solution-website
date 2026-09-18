// ==========================================================
// BAYONE SOLUTIONS
// BROCHURE API ROUTE
// ==========================================================

const express = require("express");

const router = express.Router();

const {
    sendBrochureEmails
} = require("../services/emailService");

const db = require("../database/database");


// ==========================================================
// POST
// /api/brochure-request
// ==========================================================

router.post("/", async (req, res) => {

    try {

        // ==================================================
        // GET FORM DATA
        // ==================================================

        const {
            first_name,
            last_name,
            email,
            phone,
            country_code,
            phone_full,
            company_name,
            designation,
            consent
        } = req.body;


        // ==================================================
        // REQUIRED VALIDATION
        // ==================================================

        if (!first_name || !first_name.trim()) {

            return res.status(400).json({

                success: false,

                field: "first_name",

                message: "First Name is required."

            });

        }


        if (!last_name || !last_name.trim()) {

            return res.status(400).json({

                success: false,

                field: "last_name",

                message: "Last Name is required."

            });

        }


        if (!email || !email.trim()) {

            return res.status(400).json({

                success: false,

                field: "email",

                message: "Business Email is required."

            });

        }


        if (!phone || !phone.trim()) {

            return res.status(400).json({

                success: false,

                field: "phone",

                message: "Contact Number is required."

            });

        }


        if (!company_name || !company_name.trim()) {

            return res.status(400).json({

                success: false,

                field: "company_name",

                message: "Company Name is required."

            });

        }


        if (!consent) {

            return res.status(400).json({

                success: false,

                field: "consent",

                message:
                    "Please provide your consent to receive communications."

            });

        }


        // ==================================================
        // EMAIL VALIDATION
        // ==================================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email.trim())) {

            return res.status(400).json({

                success: false,

                field: "email",

                message:
                    "Please enter a valid business email."

            });

        }


        // ==================================================
        // NAME VALIDATION
        // ==================================================

        const nameRegex =
            /^[A-Za-zÀ-ÿ\s'-]+$/;


        if (!nameRegex.test(first_name.trim())) {

            return res.status(400).json({

                success: false,

                field: "first_name",

                message:
                    "Please enter a valid First Name."

            });

        }


        if (!nameRegex.test(last_name.trim())) {

            return res.status(400).json({

                success: false,

                field: "last_name",

                message:
                    "Please enter a valid Last Name."

            });

        }


        // ==================================================
        // PREPARE FORM DATA
        // ==================================================

        const formData = {

            first_name:
                first_name.trim(),

            last_name:
                last_name.trim(),

            email:
                email.trim().toLowerCase(),

            phone:
                phone.trim(),

            country_code:
                country_code
                    ? country_code.trim()
                    : "",

            phone_full:
                phone_full
                    ? phone_full.trim()
                    : phone.trim(),

            company_name:
                company_name.trim(),

            designation:
                designation
                    ? designation.trim()
                    : "",

            consent:
                true

        };


        // ==================================================
        // SERVER LOG
        // ==================================================

        console.log("");

        console.log(
            "----------------------------------------"
        );

        console.log(
            "New brochure request received"
        );

        console.log(
            "Name:",
            `${formData.first_name} ${formData.last_name}`
        );

        console.log(
            "Email:",
            formData.email
        );

        console.log(
            "Company:",
            formData.company_name
        );

        console.log(
            "----------------------------------------"
        );


        // ==================================================
        // SEND EMAILS
        // ==================================================

        await sendBrochureEmails(
            formData
        );


        // ==================================================
        // SAVE VISITOR TO SQLITE DATABASE
        // ==================================================

        const insertVisitor = db.prepare(`

            INSERT INTO visitors (

                first_name,

                last_name,

                email,

                phone,

                country_code,

                phone_full,

                company_name,

                designation,

                consent

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

        `);


        const visitorResult =
            insertVisitor.run(

                formData.first_name,

                formData.last_name,

                formData.email,

                formData.phone,

                formData.country_code,

                formData.phone_full,

                formData.company_name,

                formData.designation,

                formData.consent ? 1 : 0

            );


        console.log(
            "Visitor saved successfully. ID:",
            visitorResult.lastInsertRowid
        );


        // ==================================================
        // SUCCESS RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            message:
                "Thank you. The brochure has been sent to your email."

        });


        } catch (error) {
        console.error(
            "Brochure API Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
            error: error.code || null
        });
    }
});


// ==========================================================
// EXPORT ROUTER
// ==========================================================

module.exports = router;