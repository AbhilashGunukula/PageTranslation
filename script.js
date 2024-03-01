// script.js
function calculateAddress() {
    // Collect data from input fields above the table
    var virtualIndex = document.getElementById('virtualIndexInput').value;
   // var addressType = document.getElementById('addressTypeDropdown').value;
    var physicalAddress = document.getElementById('physicalAddressInput').value;
    var virtualPagesize = Math.log2(virtualIndex/physicalAddress);
    var physicalPagesize = Math.log2(virtualIndex/(2*physicalAddress));
    var type = '';

    // Get the value of the checkbox for calculating physical address
    var calculatePhysicalAddress = document.getElementById('calculatePhysicalAddress').checked;
    // Get the value of the checkbox for calculating virtual address
    var calculateVirtualAddress = document.getElementById('calculateVirtualAddress').checked;

 // Initialize the result variable
 var addressInputVal = '';
 //var physicalAddressInputVal = '';

 // If the checkbox for calculating physical address is checked
 if (calculatePhysicalAddress) {
     // Get the value of the physical address input
     console.log(document.getElementById('virtualAddressInput').value);
     addressInputVal = document.getElementById('virtualAddressInput').value;
     type ='virtualToPhysical';
     
 } 

 // If the checkbox for calculating virtual address is checked
 else if (calculateVirtualAddress) {
     // Get the value of the virtual address input
     console.log(document.getElementById('physicalAddressInputs').value);
     addressInputVal = document.getElementById('physicalAddressInputs').value;
     type ='physicalToVirtual';
 }

 

    var inputData = {
        virtualIndex: virtualIndex,
       // addressType: addressType,
        physicalAddress: physicalAddress
    };

    // Collect data from the table
    var tableData = [];
    var tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(function(row) {
        var rowIndex = row.querySelector('th').value;
        var presentBit = row.querySelector('td:nth-child(3) input').value;
        var physicalAddress = row.querySelector('td:nth-child(2) input').value;

        tableData.push({
            rowIndex: rowIndex,
            presentBit: presentBit,
            physicalAddress: physicalAddress,
            
        });
    });

    // Combine the input data and table data
   /* var finalData = {
        inputData: inputData,
        tableData: tableData,
        addressInputVal:addressInputVal,
        type:type
    };*/

    // Send the collected data to another JavaScript file or perform any other actions
    //console.log(finalData);
    // You can send data to another JavaScript file or perform any other actions here

    var binaryInput = hexToBinary(addressInputVal);
    console.log(binaryInput);
    var resultingAddress = "";
    if(binaryInput !="Invalid hexadecimal input!"){

    if(type === "virtualToPhysical"){
       /* var physicalValue =virtualToPhysical(binaryInput,tableData,virtualPagesize)
        console.log(physicalValue);
        resultingAddress = binaryToHex(physicalValue);
        console.log(resultingAddress); */
        resultingAddress = virtualToPhysical(binaryInput,tableData,virtualPagesize)


    }else if(type === "physicalToVirtual"){
       /* var virtualValue =physicalToVirtual(binaryInput,tableData,physicalPagesize)
        console.log(virtualValue);
        resultingAddress = binaryToHex(virtualValue);
        console.log(resultingAddress);*/
        resultingAddress = physicalToVirtual(binaryInput,tableData,physicalPagesize)

    }
}else{
    resultingAddress = "Invalid hexadecimal input!";
}

    
    if(resultingAddress.length > 10){
        document.getElementById('resultingAddressLabel').innerText = resultingAddress;
        resultContainer.classList.add('show-red');
    }
    else{
        if(type === "virtualToPhysical"){
            document.getElementById('resultingAddressLabel').innerText = "Physical Address is: " + resultingAddress;
        }
        else if(type === "physicalToVirtual"){
            document.getElementById('resultingAddressLabel').innerText = "Virtual Address is: " + resultingAddress;
        }

        
        resultContainer.classList.add('show-green');
    }
    
}
function hexToBinary(hexValue) {
    // Define a map for converting hexadecimal digits to binary
    const hexToBinaryMap = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
        'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
    };

    // Convert each hexadecimal digit to its binary representation
    let binaryResult = '';
    for (let i = 0; i < hexValue.length; i++) {
        const hexDigit = hexValue[i].toUpperCase();
        if (hexToBinaryMap.hasOwnProperty(hexDigit)) {
            binaryResult += hexToBinaryMap[hexDigit];
        } else {
            return "Invalid hexadecimal input!";
        }
    }

    return binaryResult;
}

function binaryToHex(binaryValue) {
    // Define a map for converting binary nibbles to hexadecimal
    const binaryToHexMap = {
        '0000': '0', '0001': '1', '0010': '2', '0011': '3',
        '0100': '4', '0101': '5', '0110': '6', '0111': '7',
        '1000': '8', '1001': '9', '1010': 'A', '1011': 'B',
        '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F'
    };

    // Ensure binary string length is a multiple of 4
    if (binaryValue.length % 4 !== 0) {
        // Add leading zeros to make the length a multiple of 4
        binaryValue = '0'.repeat(4 - (binaryValue.length % 4)) + binaryValue;
    }

    // Convert binary string to hexadecimal
    let hexResult = '';
    for (let i = 0; i < binaryValue.length; i += 4) {
        const nibble = binaryValue.substring(i, i + 4);
        if (binaryToHexMap.hasOwnProperty(nibble)) {
            hexResult += binaryToHexMap[nibble];
        } else {
            return "Invalid binary input!";
        }
    }

    return hexResult;
}




function virtualToPhysical(binaryInput, tableData, virtualPagesize) {
    // Extract the first 4 bits from the binary result
    const virtualIndex = parseInt(binaryInput.substring(0, virtualPagesize), 2);
    console.log(virtualIndex);
    //console.log(tableData[virtualIndex].rowIndex);
    //console.log(tableData[virtualIndex].presentBit);
    if(virtualIndex != 'NaN' && virtualIndex<tableData.length){
            if (tableData[virtualIndex].presentBit === '1') {
                return binaryToHex(tableData[virtualIndex].physicalAddress + binaryInput.substring(virtualPagesize));
                
            }else{
                return "Address translation failed: Virtual index is absent in page table.";
            }
        }
        
    return "Address translation failed: Virtual index not found.";
}

function physicalToVirtual(binaryInput, tableData,physicalPagesize) {
    // Check if first bit is 1 (invalid physical address)
    if (binaryInput.charAt(0) === '1') {
        return "Invalid physical address.";
    }

    // Extract bits 2, 3, and 4 from the binary result
    const physicalIndex = binaryInput.substring(1, physicalPagesize+1);
    console.log(physicalIndex);
    console.log(physicalPagesize);
    // Search for the physical index in the table data
    for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].physicalAddress === physicalIndex) {
            // Convert virtual index to 4-bit binary
            console.log(i);
            const virtualIndexBinary = ("0000" + i.toString(2)).slice(-physicalPagesize-1);
            console.log(virtualIndexBinary);

            // Attach virtual index to the binary result and remove the first 4 bits
            return binaryToHex(virtualIndexBinary + binaryInput.substring(physicalPagesize+1));
        }
    }
    return "Address translation failed: Physical index not found.";
}
function generateAddressTable() {
    // Get the values of virtualIndexInput and physicalAddressInput
    var virtualIndexSize = parseInt(document.getElementById("virtualIndexInput").value);
    var pageSize = parseInt(document.getElementById("physicalAddressInput").value);
    var physicalAddressMaxLength = Math.log2(virtualIndexSize/(2*pageSize));

    

    // Reference to the table body
    var tableBody = document.querySelector("tbody");
    var tcaption = document.getElementById("caption");
    var theading = document.getElementById("attributes");

    // Clear existing rows
    tableBody.innerHTML = "";
    tcaption.classList.add('d-none');
    theading.classList.add('d-none');

    if(pageSize > 0 && virtualIndexSize > 0){
        
        tcaption.classList.remove('d-none');
        theading.classList.remove('d-none');
    }

    

    // Generate new rows based on input values
    for (var i = 0; i < (virtualIndexSize / pageSize); i++) {
        var newRow = document.createElement("tr");

        // Virtual Index cell
        var virtualIndexCell = document.createElement("th");
        virtualIndexCell.setAttribute("scope", "row");
        virtualIndexCell.textContent = i;
        newRow.appendChild(virtualIndexCell);

       
        var physicalAddressCell = document.createElement("td");
        var physicalAddressInput = document.createElement("input");
        physicalAddressInput.setAttribute("type", "text");
        physicalAddressInput.setAttribute("placeholder", "enter only "+physicalAddressMaxLength+" bits");
        physicalAddressInput.setAttribute("maxlength", physicalAddressMaxLength);
        physicalAddressCell.appendChild(physicalAddressInput);
        newRow.appendChild(physicalAddressCell);
        
        physicalAddressInput.setAttribute("oninput", "this.setCustomValidity(/^\d{0,4}$/g.test(this.value) ? '' : 'Only 0\'s and 1\'s are allowed.')");

         // Present Bit cell
         var presentBitCell = document.createElement("td");
         var presentBitInput = document.createElement("input");
         presentBitInput.setAttribute("type", "text");
         presentBitInput.setAttribute("pattern", "[01]");
         presentBitInput.setAttribute("placeholder", "enter 0 or 1");
         presentBitInput.setAttribute("maxlength", "1");
         presentBitCell.appendChild(presentBitInput);
         newRow.appendChild(presentBitCell);
 

        // Append the row to the table body
        tableBody.appendChild(newRow);
    }
    
}

// Function to toggle address input based on checkbox selection
/* function toggleAddressInput(addressType) {
    var physicalCheckbox = document.getElementById("calculatePhysicalAddress");
    var virtualCheckbox = document.getElementById("calculateVirtualAddress");

    if (addressType === "physical") {
        if (physicalCheckbox.checked) {
            var virtualIndexInput = prompt("Enter Virtual Address:");
            // Use the virtualIndexInput value as needed
        }
    } else if (addressType === "virtual") {
        if (virtualCheckbox.checked) {
            var physicalAddressInput = prompt("Enter Physical Address:");
            // Use the physicalAddressInput value as needed
        }
    }
}*/
// Function to toggle address input based on checkbox selection
// Function to toggle address input based on checkbox selection
// Function to toggle address input based on checkbox selection
function toggleAddressInput(addressType) {
    var physicalCheckbox = document.getElementById("calculatePhysicalAddress");
    var virtualCheckbox = document.getElementById("calculateVirtualAddress");
    
    var virtualAddressInputBox = document.getElementById("virtualAddressInputBox");
    var physicalAddressInputBox = document.getElementById("physicalAddressInputBox");

    // Check if the physical checkbox is checked and toggle input boxes accordingly
    if (addressType === "physical") {
        if (physicalCheckbox.checked) {
            if (!virtualCheckbox.checked && !virtualAddressInputBox) {
                // Create input box and label for virtual address
                virtualAddressInputBox = document.createElement("div");
                virtualAddressInputBox.id = "virtualAddressInputBox";
                virtualAddressInputBox.innerHTML = '<label for="virtualAddressInput">Enter Virtual Address:</label><input type="text" id="virtualAddressInput">';
                
                // Append input box to the container
                document.getElementById("physical").appendChild(virtualAddressInputBox);
            }
            if (physicalAddressInputBox) {
                physicalAddressInputBox.parentNode.removeChild(physicalAddressInputBox);
            }
        } else {
            if (virtualAddressInputBox) {
                virtualAddressInputBox.parentNode.removeChild(virtualAddressInputBox);
            }
        }
        virtualCheckbox.checked = false; // Uncheck the virtual checkbox
    } 
    // Check if the virtual checkbox is checked and toggle input boxes accordingly
    else if (addressType === "virtual") {
        if (virtualCheckbox.checked) {
            if (!physicalCheckbox.checked && !physicalAddressInputBox) {
                // Create input box and label for physical address
                physicalAddressInputBox = document.createElement("div");
                physicalAddressInputBox.id = "physicalAddressInputBox";
                physicalAddressInputBox.innerHTML = '<label for="physicalAddressInputs">Enter Physical Address:</label><input type="text" id="physicalAddressInputs">';
                
                // Append input box to the container
                document.getElementById("virtual").appendChild(physicalAddressInputBox);
            }
            if (virtualAddressInputBox) {
                virtualAddressInputBox.parentNode.removeChild(virtualAddressInputBox);
            }
        } else {
            if (physicalAddressInputBox) {
                physicalAddressInputBox.parentNode.removeChild(physicalAddressInputBox);
            }
        }
        physicalCheckbox.checked = false; // Uncheck the physical checkbox
    }
}


// Event listener for calculatePhysicalAddress checkbox
document.getElementById("calculatePhysicalAddress").addEventListener("change", function() {
    toggleAddressInput("physical");
});

// Event listener for calculateVirtualAddress checkbox
document.getElementById("calculateVirtualAddress").addEventListener("change", function() {
    toggleAddressInput("virtual");
});
document.addEventListener('DOMContentLoaded', function() {
    generateAddressTable();
});
document.getElementById("virtualIndexInput").addEventListener("input", generateAddressTable);
document.getElementById("physicalAddressInput").addEventListener("input", generateAddressTable);

document.getElementById('virtualIndexInput').addEventListener('input', function() {
    const virtualSpace = parseInt(this.value);
    const isValidInput = !isNaN(virtualSpace) && virtualSpace !== 0; // Check if input is not NaN and not 0
    const isPowerOfTwo = isValidInput && (virtualSpace & (virtualSpace - 1)) === 0; // Check if virtualSpace is a power of 2
    
    // Show/hide the "Page Size" label and input based on whether "Virtual Space" is a valid power of 2
    const pageSizeContainer = document.getElementById('pageSizeContainer');
    if (isPowerOfTwo) {
        pageSizeContainer.style.display = 'block';
    } else {
        pageSizeContainer.style.display = 'none';
    }
});



document.getElementById('physicalAddressInput').addEventListener('input', function() {
    const pageSize = parseInt(this.value);
    const isPowerOfTwo = (pageSize & (pageSize - 1)) === 0 && pageSize !== 0; // Check if pageSize is a power of 2
    
    // Show/hide the table based on whether "Page Size" is a valid power of 2
    document.querySelector('table').style.display = isPowerOfTwo ? 'table' : 'none';
});
