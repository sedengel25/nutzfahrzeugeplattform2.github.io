// Add this array to store the state of selected checkboxes
let selectedColumnsState = [];

// Function to populate the dynamic columns checkboxes
function populateDynamicColumnsCheckboxes(columns) {
    const dynamicColumnsFilter = document.getElementById("dynamicColumnsFilter");

    // Clear existing checkboxes
    dynamicColumnsFilter.innerHTML = "";

    columns.sort(); // Sort the columns alphabetically

    const columnsPerGroup = 5; // Number of columns per group
    const numGroups = Math.ceil(columns.length / columnsPerGroup);

    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
        const groupContainer = document.createElement("div");
        groupContainer.className = "group-container";

        for (let i = 0; i < columnsPerGroup; i++) {
            const columnIndex = groupIndex * columnsPerGroup + i;
            if (columnIndex < columns.length) {
                const column = columns[columnIndex];
                const checkboxLabel = document.createElement("label");
                checkboxLabel.className = "checkbox-label";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = column;

                // Check if checkbox was previously selected
                checkbox.checked = selectedColumnsState.includes(column);

                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(document.createTextNode(column));
                groupContainer.appendChild(checkboxLabel);
                groupContainer.appendChild(document.createElement("br")); // Line break
            }
        }

        dynamicColumnsFilter.appendChild(groupContainer);
    }
}



// Function to display the images and info box
function displayData(data, columnsToShow) {
    const container = document.getElementById("imageContainer");
    const typeFilter = document.getElementById("typeFilter");
    const selectedType = typeFilter.value;
    console.log(selectedType);
    const selectedWeightClass = weightClassFilter.value;

    container.innerHTML = ""; // Clear previous content

    data.forEach(row => {
        const type = row["Fahrzeugkategorie Mobiwerk"];
        const weightClass = row["Gewichtsklasse"];

        if ((!selectedType || type === selectedType) && (!selectedWeightClass || weightClass === selectedWeightClass)) {
            const imageSrc = row.Bild;
            const fullName = row["Name"];

            const imgElement = document.createElement("img");
            imgElement.src = imageSrc;
            imgElement.style.maxWidth = "100%";
            imgElement.style.width = "200px"; // Adjust the image width as needed
            imgElement.style.height = "auto"; // Maintain aspect ratio

            const infoBox = document.createElement("div");
            infoBox.className = "info-box";

            const infoContent = document.createElement("div");
            infoContent.className = "info-content";

            const nameElement = document.createElement("p");
            nameElement.textContent = `Name: ${fullName}`;
            infoContent.appendChild(nameElement);

            columnsToShow.forEach(column => {
                const value = row[column];
        
                const columnElement = document.createElement("p");
                columnElement.textContent = `${column}: ${value}`;
                infoContent.appendChild(columnElement);
            });

            infoBox.appendChild(imgElement);
            infoBox.appendChild(infoContent);

            const rowContainer = document.createElement("div");
            rowContainer.appendChild(infoBox);

            container.appendChild(rowContainer);
        }
    });
}

// Function to read the Excel file
function readExcelFile(file, columnsToShow) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Populate the dynamic columns checkboxes with available columns
        const columns = Object.keys(jsonData[0]); // Assuming first row contains headers
        populateDynamicColumnsCheckboxes(columns);

        displayData(jsonData, columnsToShow);
    };

    reader.readAsArrayBuffer(file);
}

function test(data) {
    data.forEach(row => {
        const name = row["Name"];
        console.log(name);
    })
}

test;
// Listen for file input change
const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) {
        readExcelFile(file);
    }
});

// Listen for type filter change
const typeFilter = document.getElementById("typeFilter");
typeFilter.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        readExcelFile(fileInput.files[0], selectedColumns);
    }
});


// Listen for weightclass filter change
const weightClassFilter = document.getElementById("weightClassFilter");
weightClassFilter.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        readExcelFile(fileInput.files[0], selectedColumns);
    }
});


// Listen for dynamic columns selection and apply the selected columns
const applyColumnsButton = document.getElementById("applyColumnsButton");
applyColumnsButton.addEventListener("click", () => {
    selectedColumnsState = Array.from(document.querySelectorAll("#dynamicColumnsFilter input:checked"))
        .map(checkbox => checkbox.value);

    if (fileInput.files.length > 0) {
        readExcelFile(fileInput.files[0], selectedColumnsState);
    }
});

// Trigger the initial checkbox population
populateDynamicColumnsCheckboxes([]);

// Trigger the change event initially to display all data
typeFilter.dispatchEvent(new Event('change'));




