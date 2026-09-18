/*** === BAYONE SERVICES PAGE services.js =================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    /* ========= INTERNATIONAL PHONE INPUT ============== */

const phoneInput = document.getElementById("phone");
const countryCodeInput = document.getElementById("countryCode");
const phoneFullInput = document.getElementById("phoneFull");
let phoneInstance = null;
if (phoneInput && typeof intlTelInput !== "undefined") {
    phoneInstance = intlTelInput(phoneInput, {
        initialCountry: "in",
        preferredCountries: [
            "in",
            "us",
            "gb",
            "ae",
            "sg",
            "au"
        ],
        separateDialCode: true,
        nationalMode: true,
        autoPlaceholder: "polite",
        formatOnDisplay: true,
       
    });
    /* Update country code whenever the user changes country. */

    phoneInput.addEventListener(
        "countrychange",
        function () {
            const countryData =
                phoneInstance.getSelectedCountryData();
            if (countryData) {
                countryCodeInput.value =
                    `+${countryData.dialCode}`;
            }
        }
    );
}
    /* ==== 01. AOS INITIALIZATION ======== */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 80
        });
    }
   
    /* ===== 03. BROCHURE FORM ========== */
    const brochureForm =
        document.getElementById("bayoneBrochureForm");
    if (!brochureForm) {
        return;
    }
    /* ======= FORM ELEMENTS ========== */
    const firstName =
        document.getElementById("firstName");
    const lastName =
        document.getElementById("lastName");
    const businessEmail =
        document.getElementById("businessEmail");
    const countrySelector =
        document.getElementById("countrySelector");
    const countryCode =
        document.getElementById("countryCode");
    const phone =
        document.getElementById("phone");
    const companyName =
        document.getElementById("companyName");
    const jobTitle =
        document.getElementById("jobTitle");
    const consentCheckbox =
        document.getElementById("consentCheckbox");
    const consentValue =
        document.getElementById("consentValue");
    const submitButton =
        document.getElementById("brochureSubmitButton");
    const formSuccess =
        document.getElementById("formSuccess");
    const formFailure =
        document.getElementById("formFailure");

    /* ======  04. COUNTRY CODE ======= */
    if (countrySelector) {
        countrySelector.addEventListener(
            "change",
            function () {
                countryCode.value =
                    countrySelector.value;
            }
        );
    }

    /* ======== 05. CONSENT VALUE =========== */
    if (consentCheckbox) {
        consentCheckbox.addEventListener(
            "change",
            function () {
                consentValue.value =
                    consentCheckbox.checked
                        ? "true"
                        : "false";
                clearError(
                    consentCheckbox,
                    "consentError"
                );
            }
        );
    }

    /* ====== 06. VALIDATION HELPERS ========== */
    function showError(
        input,
        errorId,
        message
    ) {
        const errorElement =
            document.getElementById(errorId);
        const formField =
            input.closest(".form-field");
        if (formField) {
            formField.classList.add("has-error");
        }
        if (errorElement) {
            errorElement.textContent =
                message;
            errorElement.style.display =
                "block";
        }
    }
    function clearError(
        input,
        errorId
    ) {
        const errorElement =
            document.getElementById(errorId);
        const formField =
            input.closest(".form-field");
        if (formField) {
            formField.classList.remove(
                "has-error"
            );
        }
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display =
                "none";
        }
    }
    function clearAllErrors() {
        const errors =
            brochureForm.querySelectorAll(
                ".form-error"
            );
        errors.forEach(function (error) {
            error.textContent = "";
            error.style.display = "none";
        });
        const fields =
            brochureForm.querySelectorAll(
                ".form-field"
            );
        fields.forEach(function (field) {
            field.classList.remove(
                "has-error"
            );
        });
    }
    /* ====== 07. NAME VALIDATION ============== */
    function validateName(
        input,
        errorId,
        fieldName
    ) {
        const value =
            input.value.trim();
        if (!value) {
            showError(
                input,
                errorId,
                `Please enter ${fieldName}.`
            );
            return false;
        }
        
        const namePattern =
            /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
        if (!namePattern.test(value)) {
            showError(
                input,
                errorId,
                `${fieldName} must contain only alphabetic characters.`
            );
            return false;
        }
        clearError(
            input,
            errorId
        );
        return true;
    }
    /* ========= 08. EMAIL VALIDATION ============ */
    function validateEmail() {
        const email =
            businessEmail.value.trim().toLowerCase();
        if (!email) {
            showError(
                businessEmail,
                "emailError",
                "Please enter your Business Email."
            );
            return false;
        }
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(email)) {
            showError(
                businessEmail,
                "emailError",
                "Please enter a valid Business Email."
            );
            return false;
        }
        const blockedDomains = [
            "gmail.com",
            "yahoo.com",
            "yahoo.co.in",
            "hotmail.com",
            "outlook.com",
            "live.com",
            "icloud.com",
            "msn.com",
            "rediffmail.com",
            "test.com",
            "dummy.com",
            "test.in",
            "example.com",
            "example.in",
            "yopmail.com"
        ];
        const domain =
            email.split("@")[1];
        if (
            domain &&
            blockedDomains.includes(domain)
        ) {
            showError(
                businessEmail,
                "emailError",
                "Please enter a valid Corporate Email Address."
            );
            return false;
        }
        clearError(
            businessEmail,
            "emailError"
        );
        return true;
    }

    /* ==== 09. PHONE VALIDATION ============== */

function validatePhone() {
    const value = phoneInput.value.trim();

    if (!value) {
        showError(
            phoneInput,
            "phoneError",
            "Please enter your Contact Number."
        );
        return false;
    }

    if (!phoneInstance) {
        showError(
            phoneInput,
            "phoneError",
            "Please enter a valid phone number."
        );
        return false;
    }

    const countryData =
        phoneInstance.getSelectedCountryData();

    if (!countryData) {
        showError(
            phoneInput,
            "phoneError",
            "Please select a country."
        );
        return false;
    }

    const dialCode =
        countryData.dialCode;

    /*
     * Remove spaces, brackets, hyphens
     * and keep only numbers.
     */
    const cleanNumber =
        value.replace(/\D/g, "");

    /*
     * India (+91)
     * Valid mobile numbers:
     * 10 digits and start from 6, 7, 8 or 9.
     */
    if (dialCode === "91") {
        if (
            !/^[6-9]\d{9}$/.test(cleanNumber)
        ) {
            showError(
                phoneInput,
                "phoneError",
                "Please enter a valid 10-digit mobile number."
            );
            return false;
        }
    } else {
        /*
         * Basic validation for other countries.
         * International numbers normally contain
         * 7 to 15 digits.
         */
        if (
            cleanNumber.length < 7 ||
            cleanNumber.length > 15
        ) {
            showError(
                phoneInput,
                "phoneError",
                "Please enter a valid phone number."
            );
            return false;
        }
    }

    countryCodeInput.value =
        `+${dialCode}`;

    phoneFullInput.value =
        `+${dialCode}${cleanNumber}`;

    clearError(
        phoneInput,
        "phoneError"
    );

    return true;
}
    /* ====== 10. COMPANY VALIDATION ======== */
    function validateCompany() {
        const value =
            companyName.value.trim();
        if (!value) {
            showError(
                companyName,
                "companyError",
                "Please enter Company Name."
            );
            return false;
        }
        clearError(
            companyName,
            "companyError"
        );
        return true;
    }
    /* ======== 11. CONSENT VALIDATION ========== */
    function validateConsent() {
        if (!consentCheckbox.checked) {
            const error =
                document.getElementById(
                    "consentError"
                );
            if (error) {
                error.textContent =
                    "Please select the consent option.";
                error.style.display =
                    "block";
            }
            return false;
        }
        const error =
            document.getElementById(
                "consentError"
            );
        if (error) {
            error.textContent = "";
            error.style.display =
                "none";
        }
        return true;
    }
   /* ======= 12. COMPLETE VALIDATION ==================== */

async function validateForm() {

    clearAllErrors();

    let isValid = true;

    if (
        !validateName(
            firstName,
            "firstNameError",
            "First Name"
        )
    ) {
        isValid = false;
    }

    if (
        !validateName(
            lastName,
            "lastNameError",
            "Last Name"
        )
    ) {
        isValid = false;
    }

    if (!validateEmail()) {
        isValid = false;
    }

    if (!(await validatePhone())) {
        isValid = false;
    }

    if (!validateCompany()) {
        isValid = false;
    }

    if (!validateConsent()) {
        isValid = false;
    }

    return isValid;
}
    /* ========== 13. SET LOADING STATE ========== */
    function setLoadingState(
        loading
    ) {
        if (!submitButton) {
            return;
        }
        submitButton.disabled =
            loading;
        if (loading) {
            submitButton.classList.add(
                "is-loading"
            );
        } else {
            submitButton.classList.remove(
                "is-loading"
            );
        }
    }

    /* ====== 14. SHOW SUCCESS ========= */
    function showSuccess() {
        formFailure.style.display =
            "none";
        formSuccess.style.display =
            "block";
    }
    /* ======= 15. SHOW FAILURE ========== */
    function showFailure(
        message
    ) {
        formSuccess.style.display =
            "none";
        formFailure.textContent =
            message ||
            "Something went wrong while submitting the form. Please try again.";
        formFailure.style.display =
            "block";
    }
    /* ======= 16. FORM SUBMISSION ============= */
    brochureForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();
            formSuccess.style.display =
                "none";
            formFailure.style.display =
                "none";
            /** Validate before sending. **/
            const isValid =
                await validateForm();
            if (!isValid) {
                const firstError =
                    brochureForm.querySelector(
                        ".has-error input, .has-error select"
                    );
                if (firstError) {
                    firstError.focus();
                }
                return;
            }
            /** Make sure hidden values * are synchronized.*/

           if (countryCodeInput && phoneInstance) {
    const countryData =
        phoneInstance.getSelectedCountryData();

    if (countryData) {
        countryCodeInput.value =
            `+${countryData.dialCode}`;
    }
}

if (consentValue && consentCheckbox) {
    consentValue.value =
        consentCheckbox.checked
            ? "true"
            : "false";
}
            /** FormData collects all  * named fields. */
            const formData =
    new FormData(brochureForm);
            /** Convert FormData to * a normal JavaScript object. */
            const data =
                Object.fromEntries(
                    formData.entries()
                );
            /** Add useful metadata. */
            data.page_url =
                window.location.href;
            data.page_title =
                document.title;
            data.submitted_at =
                new Date().toISOString();
            /** ======= * IMPORTANT
             * * Replace this with the actual * BayOne backend endpoint after
             * IT provides it. * ==========*/
            const API_URL =
                 "http://localhost:5000/api/brochure-request";
            try {
                setLoadingState(true);
                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(data)
                        }
                    );
                /* * Try to parse JSON response. */
                let result = {};
                try {
                    result =
                        await response.json();
                } catch (jsonError) {
                    result = {};
                }
                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Unable to submit the form."
                    );
                }
                /* SUCCESS */
                showSuccess();
                /* Reset form. */
                brochureForm.reset();
                /** Restore default country.*/
                countrySelector.value =
                    "+91";
                countryCode.value =
                    "+91";
                consentValue.value =
                    "false";
                /*If backend sends a  brochure URL, open it.
                 Example response:
                 
                  {
                    "success": true,
                    "brochureUrl": "..."
                 } */

                if (
                    result.brochureUrl
                ) {
                    window.open(
                        result.brochureUrl,
                        "_blank"
                    );
                }
            } catch (error) {
                console.error(
                    "Brochure form error:",
                    error
                );
                showFailure(
                    error.message
                );
            } finally {
                setLoadingState(false);
            }
        }
    );
    /** Script Main function  end here **/
});