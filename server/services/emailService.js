// ========= // BAYONE SOLUTIONS // EMAIL SERVICE // ============

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// ===== / SMTP TRANSPORTER // =======

const transporter =
    nodemailer.createTransport({
        host:
            process.env.SMTP_HOST,
        port:
            Number(process.env.SMTP_PORT) || 587,
        secure:
            process.env.SMTP_SECURE === "true",
        auth: {
            user:
                process.env.SMTP_USER,
            pass:
                process.env.SMTP_PASSWORD
        }
    });

// ======== // EMAIL TEMPLATE PATHS // =========
const visitorTemplatePath = path.resolve(
    __dirname,
    "../templates/visitor-email.html"
);

const marketingTemplatePath = path.resolve(
    __dirname,
    "../templates/marketing-email.html"
);

// ===== // BROCHURE PATH // =============
//
// Project structure:
//
// bayone-solutions/
// ├── html/
// │   └── assets/
// │       └── brochures/
// │           └── BayOne-Services-Brochure.pdf
// │
// └── server/
//     └── services/
//         └── emailService.js
//
// ==================

const brochurePath =
    path.resolve(
        __dirname,
        "../../html/assets/brochures/dummy-test-file.pdf"
    );

// ========= // LOAD TEMPLATE // =========

function loadTemplate(
    filePath
) {
    return fs.readFileSync(
        filePath,
        "utf8"
    );
}

// ======== // ESCAPE HTML // =============
function escapeHtml(
    value
) {
    if (!value) {
        return "";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ========= // REPLACE TEMPLATE VARIABLES // ============

function replaceVariables(
    template,
    data
) {
    const fullName =
        `${data.first_name} ${data.last_name}`;
    return template
        .replace(
            /{{FIRST_NAME}}/g,
            escapeHtml(data.first_name)
        )
        .replace(
            /{{LAST_NAME}}/g,
            escapeHtml(data.last_name)
        )
        .replace(
            /{{FULL_NAME}}/g,
            escapeHtml(fullName)
        )
        .replace(
            /{{EMAIL}}/g,
            escapeHtml(data.email)
        )
        .replace(
            /{{PHONE}}/g,
            escapeHtml(data.phone)
        )
        .replace(
            /{{PHONE_FULL}}/g,
            escapeHtml(data.phone_full)
        )
        .replace(
            /{{COUNTRY_CODE}}/g,
            escapeHtml(data.country_code)
        )
        .replace(
            /{{COMPANY_NAME}}/g,
            escapeHtml(data.company_name)
        )
        .replace(
            /{{DESIGNATION}}/g,
            escapeHtml(data.designation)
        );
}

// =========== // SEND BROCHURE EMAILS // =================

async function sendBrochureEmails(
    data
) {

    // ======= // CHECK BROCHURE // ===============
    if (!fs.existsSync(brochurePath)) {
        throw new Error(
            `Brochure PDF not found: ${brochurePath}`
        );
    }
    // ======================================================
    // LOAD EMAIL TEMPLATES
    // ======================================================

    const visitorTemplate =
        loadTemplate(
            visitorTemplatePath
        );


    const marketingTemplate =
        loadTemplate(
            marketingTemplatePath
        );


    // ======================================================
    // PREPARE HTML
    // ======================================================

    const visitorHtml =
        replaceVariables(
            visitorTemplate,
            data
        );


    const marketingHtml =
        replaceVariables(
            marketingTemplate,
            data
        );


    // ======================================================
    // INTERNAL EMAIL RECIPIENT
    // ======================================================
    //
    // Development:
    //     TEST_EMAIL
    //
    // Production:
    //     MARKETING_EMAIL
    //
    // This prevents local testing emails from going
    // directly to the Marketing mailbox.
    //
    // ======================================================

    const internalRecipient =
        process.env.NODE_ENV === "production"
            ? process.env.MARKETING_EMAIL
            : process.env.TEST_EMAIL;


    if (!internalRecipient) {

        throw new Error(
            "Internal email recipient is not configured."
        );

    }


    console.log(
        `Internal notification recipient: ${internalRecipient}`
    );


    // ======================================================
    // VISITOR EMAIL
    // ======================================================

    const visitorMail = {

        from:
            `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,

        to:
            data.email,

        subject:
            "BayOne Services Brochure",

        html:
            visitorHtml,

        attachments: [

            {

                filename:
                    "BayOne-Services-Brochure.pdf",

                path:
                    brochurePath,

                contentType:
                    "application/pdf"

            }

        ]

    };


    // ======================================================
    // INTERNAL / MARKETING EMAIL
    // ======================================================

    const marketingMail = {

        from:
            `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,

        to:
            internalRecipient,

        replyTo:
            data.email,

        subject:
            `New BayOne Brochure Request - ${data.company_name}`,

        html:
            marketingHtml

    };


    // ======================================================
    // SEND VISITOR EMAIL
    // ======================================================

    await transporter.sendMail(
        visitorMail
    );


    console.log(
        "Visitor email sent successfully."
    );


    // ======================================================
    // SEND INTERNAL / MARKETING EMAIL
    // ======================================================

    await transporter.sendMail(
        marketingMail
    );


    console.log(
        "Internal notification email sent successfully."
    );


    return true;

}


// ==========================================================
// SMTP CONNECTION TEST
// ==========================================================

async function verifyEmailConnection() {

    try {

        await transporter.verify();

        console.log(
            "SMTP server connection successful."
        );

        return true;

    } catch (error) {

        console.error(
            "SMTP connection failed:",
            error.message
        );

        return false;

    }

}


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {

    sendBrochureEmails,

    verifyEmailConnection

};
