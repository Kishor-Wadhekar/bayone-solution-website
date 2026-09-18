// ==========================================================
// BAYONE SOLUTIONS
// VISITORS ADMIN PAGE
// ==========================================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==================================================
        // CONFIGURATION
        // ==================================================

        const API_URL =
            "http://localhost:5000/api/visitors";


        const RECORDS_PER_PAGE = 10;


        // ==================================================
        // DOM ELEMENTS
        // ==================================================

        const tableBody =
            document.getElementById(
                "visitorTableBody"
            );


        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const totalVisitors =
            document.getElementById(
                "totalVisitors"
            );


        const displayedVisitors =
            document.getElementById(
                "displayedVisitors"
            );


        const lastUpdated =
            document.getElementById(
                "lastUpdated"
            );


        const paginationInfo =
            document.getElementById(
                "paginationInfo"
            );


        const previousButton =
            document.getElementById(
                "previousButton"
            );


        const nextButton =
            document.getElementById(
                "nextButton"
            );


        const refreshButton =
            document.getElementById(
                "refreshButton"
            );


        const refreshButtonTop =
            document.getElementById(
                "refreshButtonTop"
            );


        const exportCsvButton =
            document.getElementById(
                "exportCsvButton"
            );


        const exportJsonButton =
            document.getElementById(
                "exportJsonButton"
            );


        const currentYear =
            document.getElementById(
                "currentYear"
            );


        // ==================================================
        // STATE
        // ==================================================

        let visitors = [];

        let filteredVisitors = [];

        let currentPage = 1;


        // ==================================================
        // CURRENT YEAR
        // ==================================================

        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();

        }


        // ==================================================
        // LOAD VISITORS
        // ==================================================

        async function loadVisitors() {

            showLoading();


            try {

                const response =
                    await fetch(API_URL);


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to load visitors."
                    );

                }


                visitors =
                    Array.isArray(result.data)
                        ? result.data
                        : [];


                filteredVisitors =
                    [...visitors];


                currentPage = 1;


                updateStatistics();

                renderTable();

                updateLastUpdated();


            } catch (error) {

                console.error(
                    "Visitor API Error:",
                    error
                );


                showError(
                    "Unable to load visitor data. Please make sure the BayOne API server is running."
                );

            }

        }


        // ==================================================
        // LOADING STATE
        // ==================================================

        function showLoading() {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="loading-state"
                    >

                        Loading visitors...

                    </td>

                </tr>

            `;

        }


        // ==================================================
        // ERROR STATE
        // ==================================================

        function showError(message) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="empty-state"
                    >

                        <div class="empty-state-icon">
                            ⚠
                        </div>

                        <div>
                            ${escapeHtml(message)}
                        </div>

                    </td>

                </tr>

            `;

            totalVisitors.textContent = "0";

            displayedVisitors.textContent = "0";

            paginationInfo.textContent =
                "Unable to load records.";

        }


        // ==================================================
        // UPDATE STATISTICS
        // ==================================================

        function updateStatistics() {

            totalVisitors.textContent =
                visitors.length;


            displayedVisitors.textContent =
                filteredVisitors.length;

        }


        // ==================================================
        // LAST UPDATED
        // ==================================================

        function updateLastUpdated() {

            const now =
                new Date();


            lastUpdated.textContent =
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        // ==================================================
        // SEARCH
        // ==================================================

        function searchVisitors() {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchTerm) {

                filteredVisitors =
                    [...visitors];

            } else {

                filteredVisitors =
                    visitors.filter(
                        function (visitor) {

                            const searchableText = [

                                visitor.first_name,

                                visitor.last_name,

                                visitor.email,

                                visitor.phone,

                                visitor.phone_full,

                                visitor.company_name,

                                visitor.designation

                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                            return searchableText.includes(
                                searchTerm
                            );

                        }
                    );

            }


            currentPage = 1;

            updateStatistics();

            renderTable();

        }


        // ==================================================
        // RENDER TABLE
        // ==================================================

        function renderTable() {

            if (!filteredVisitors.length) {

                tableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="9"
                            class="empty-state"
                        >

                            <div class="empty-state-icon">
                                👥
                            </div>

                            <div>
                                No visitor records found.
                            </div>

                        </td>

                    </tr>

                `;


                paginationInfo.textContent =
                    "Showing 0 records";


                previousButton.disabled =
                    true;


                nextButton.disabled =
                    true;


                return;

            }


            const totalPages =
                Math.ceil(
                    filteredVisitors.length /
                    RECORDS_PER_PAGE
                );


            if (currentPage > totalPages) {

                currentPage =
                    totalPages;

            }


            const startIndex =
                (currentPage - 1) *
                RECORDS_PER_PAGE;


            const endIndex =
                startIndex +
                RECORDS_PER_PAGE;


            const pageVisitors =
                filteredVisitors.slice(
                    startIndex,
                    endIndex
                );


            tableBody.innerHTML =
                pageVisitors
                    .map(
                        function (
                            visitor,
                            index
                        ) {

                            return createVisitorRow(
                                visitor,
                                startIndex + index
                            );

                        }
                    )
                    .join("");


            updatePagination(
                startIndex,
                endIndex
            );


            previousButton.disabled =
                currentPage === 1;


            nextButton.disabled =
                currentPage === totalPages;

        }


        // ==================================================
        // CREATE TABLE ROW
        // ==================================================

        function createVisitorRow(
            visitor,
            index
        ) {

            const fullName = [

                visitor.first_name,

                visitor.last_name

            ]
                .filter(Boolean)
                .join(" ");


            const phone =
                visitor.phone_full ||
                visitor.phone ||
                "-";


            const company =
                visitor.company_name ||
                "-";


            const designation =
                visitor.designation ||
                "-";


            const consent =
                Number(visitor.consent) === 1
                    ? `<span class="visitor-badge">Yes</span>`
                    : `<span class="badge text-bg-secondary">No</span>`;


            const createdDate =
                formatDate(
                    visitor.created_at
                );


            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <strong>
                            ${escapeHtml(fullName || "-")}
                        </strong>

                    </td>


                    <td>

                        <a
                            href="mailto:${escapeAttribute(visitor.email || "")}"
                        >

                            ${escapeHtml(visitor.email || "-")}

                        </a>

                    </td>


                    <td>

                        ${escapeHtml(phone)}

                    </td>


                    <td>

                        ${escapeHtml(company)}

                    </td>


                    <td>

                        ${escapeHtml(designation)}

                    </td>


                    <td>

                        ${consent}

                    </td>


                    <td>

                        ${escapeHtml(createdDate)}

                    </td>


                    <td>

                        <div class="action-buttons">

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger delete-button"
                                data-id="${visitor.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }


        // ==================================================
        // PAGINATION
        // ==================================================

        function updatePagination(
            startIndex,
            endIndex
        ) {

            const actualEnd =
                Math.min(
                    endIndex,
                    filteredVisitors.length
                );


            paginationInfo.textContent =
                `Showing ${startIndex + 1}-${actualEnd} of ${filteredVisitors.length} records`;

        }


        // ==================================================
        // DELETE VISITOR
        // ==================================================

        async function deleteVisitor(id) {

            const visitor =
                visitors.find(
                    function (item) {

                        return Number(item.id) ===
                            Number(id);

                    }
                );


            if (!visitor) {

                return;

            }


            const fullName = [

                visitor.first_name,

                visitor.last_name

            ]
                .filter(Boolean)
                .join(" ");


            const confirmed =
                window.confirm(
                    `Are you sure you want to delete the visitor "${fullName}"?`
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to delete visitor."
                    );

                }


                await loadVisitors();


            } catch (error) {

                console.error(
                    "Delete Visitor Error:",
                    error
                );


                window.alert(
                    error.message ||
                    "Unable to delete visitor."
                );

            }

        }


        // ==================================================
        // EXPORT CSV
        // ==================================================

        function exportCSV() {

            if (!filteredVisitors.length) {

                window.alert(
                    "There are no visitor records to export."
                );

                return;

            }


            const headers = [

                "ID",

                "First Name",

                "Last Name",

                "Email",

                "Phone",

                "Country Code",

                "Phone Full",

                "Company Name",

                "Designation",

                "Consent",

                "Created At"

            ];


            const rows =
                filteredVisitors.map(
                    function (visitor) {

                        return [

                            visitor.id,

                            visitor.first_name,

                            visitor.last_name,

                            visitor.email,

                            visitor.phone,

                            visitor.country_code,

                            visitor.phone_full,

                            visitor.company_name,

                            visitor.designation,

                            Number(visitor.consent) === 1
                                ? "Yes"
                                : "No",

                            visitor.created_at

                        ];

                    }
                );


            const csvContent = [

                headers,

                ...rows

            ]
                .map(
                    function (row) {

                        return row
                            .map(
                                escapeCsvValue
                            )
                            .join(",");

                    }
                )
                .join("\r\n");


            downloadFile(

                csvContent,

                `bayone-visitors-${getDateStamp()}.csv`,

                "text/csv;charset=utf-8;"

            );

        }


        // ==================================================
        // EXPORT JSON
        // ==================================================

        function exportJSON() {

            if (!filteredVisitors.length) {

                window.alert(
                    "There are no visitor records to export."
                );

                return;

            }


            const jsonContent =
                JSON.stringify(
                    filteredVisitors,
                    null,
                    4
                );


            downloadFile(

                jsonContent,

                `bayone-visitors-${getDateStamp()}.json`,

                "application/json;charset=utf-8;"

            );

        }


        // ==================================================
        // DOWNLOAD FILE
        // ==================================================

        function downloadFile(
            content,
            filename,
            mimeType
        ) {

            const blob =
                new Blob(
                    [content],
                    {
                        type: mimeType
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download = filename;

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

        }


        // ==================================================
        // CSV ESCAPE
        // ==================================================

        function escapeCsvValue(value) {

            if (
                value === null ||
                value === undefined
            ) {

                return '""';

            }


            const stringValue =
                String(value);


            return `"${stringValue.replace(
                /"/g,
                '""'
            )}"`;

        }


        // ==================================================
        // DATE FORMAT
        // ==================================================

        function formatDate(dateValue) {

            if (!dateValue) {

                return "-";

            }


            const date =
                new Date(
                    dateValue.replace(
                        " ",
                        "T"
                    ) + "Z"
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return dateValue;

            }


            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }


        // ==================================================
        // DATE STAMP
        // ==================================================

        function getDateStamp() {

            const now =
                new Date();


            const year =
                now.getFullYear();


            const month =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            return `${year}-${month}-${day}`;

        }


        // ==================================================
        // HTML ESCAPE
        // ==================================================

        function escapeHtml(value) {

            if (
                value === null ||
                value === undefined
            ) {

                return "";

            }


            return String(value)

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        // ==================================================
        // ATTRIBUTE ESCAPE
        // ==================================================

        function escapeAttribute(value) {

            return escapeHtml(value);

        }


        // ==================================================
        // EVENT: SEARCH
        // ==================================================

        searchInput.addEventListener(
            "input",
            searchVisitors
        );


        // ==================================================
        // EVENT: REFRESH
        // ==================================================

        refreshButton.addEventListener(
            "click",
            loadVisitors
        );


        refreshButtonTop.addEventListener(
            "click",
            loadVisitors
        );


        // ==================================================
        // EVENT: PREVIOUS
        // ==================================================

        previousButton.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    renderTable();

                }

            }
        );


        // ==================================================
        // EVENT: NEXT
        // ==================================================

        nextButton.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        filteredVisitors.length /
                        RECORDS_PER_PAGE
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderTable();

                }

            }
        );


        // ==================================================
        // EVENT: DELETE
        // ==================================================

        tableBody.addEventListener(
            "click",
            function (event) {

                const deleteButton =
                    event.target.closest(
                        ".delete-button"
                    );


                if (!deleteButton) {

                    return;

                }


                const id =
                    deleteButton.dataset.id;


                deleteVisitor(id);

            }
        );


        // ==================================================
        // EVENT: EXPORT CSV
        // ==================================================

        exportCsvButton.addEventListener(
            "click",
            exportCSV
        );


        // ==================================================
        // EVENT: EXPORT JSON
        // ==================================================

        exportJsonButton.addEventListener(
            "click",
            exportJSON
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadVisitors();

    }
);