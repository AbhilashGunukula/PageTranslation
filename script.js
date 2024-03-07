function calculateAddress() {
    
    var virtualIndex = document.getElementById('virtualIndexInput').value;
  
    var physicalAddress = document.getElementById('physicalAddressInput').value;
    var physicalAddressSize = Math.log2(virtualIndex/2) + 10;
    var VirtualAddressSize = Math.log2(virtualIndex) + 10;
    var virtualPagesize = Math.log2(virtualIndex/physicalAddress);
    var physicalPagesize = Math.log2(virtualIndex/(2*physicalAddress));
    var type = '';

    
    var calculatePhysicalAddress = document.getElementById('calculatePhysicalAddress').checked;
    
    var calculateVirtualAddress = document.getElementById('calculateVirtualAddress').checked;

 
 var addressInputVal = '';

 
 if (calculatePhysicalAddress) {
     
     console.log(document.getElementById('virtualAddressInput').value);
     addressInputVal = document.getElementById('virtualAddressInput').value;
     type ='virtualToPhysical';
     
 } 


 else if (calculateVirtualAddress) {
     
     console.log(document.getElementById('physicalAddressInputs').value);
     addressInputVal = document.getElementById('physicalAddressInputs').value;
     type ='physicalToVirtual';
 }

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

    var binaryInput = hexToBinary(addressInputVal);
    console.log(binaryInput);
    var resultingAddress = "";
    if(binaryInput !="Invalid hexadecimal input!"){

    if(type === "virtualToPhysical"){
        resultingAddress = virtualToPhysical(binaryInput,tableData,virtualPagesize,VirtualAddressSize)


    }else if(type === "physicalToVirtual"){
        resultingAddress = physicalToVirtual(binaryInput,tableData,physicalPagesize,physicalAddressSize)

    }

    if((resultingAddress[1].includes("Invalid") || resultingAddress[1].includes("Virtual index") || resultingAddress[1].includes("physical index")||resultingAddress[1].includes("As the first bit") )){
        document.getElementById('resultingBinaryAddressLabel').innerText = resultingAddress[0];
        document.getElementById('resultingAddressLabel').innerText = resultingAddress[1];
        resultContainer.classList.remove('show-green');
        resultContainer.classList.add('show-red');
    }
    else{
        resultContainer.classList.remove('show-red');

        if(type === "virtualToPhysical"){
            document.getElementById('resultingBinaryAddressLabel').innerText = "Binary Value of Physical Address is: " + resultingAddress[0];
            document.getElementById('resultingAddressLabel').innerText = "Hexa decimal value of Physical Address is: " + resultingAddress[1];
           // resultContainer.classList.add('show-green');
        }
        else if(type === "physicalToVirtual"){
            document.getElementById('resultingBinaryAddressLabel').innerText = "Binary Value of Virtual Address is: " + resultingAddress[0];
            document.getElementById('resultingAddressLabel').innerText = "Hexa decimal value of Virtual Address is: " + resultingAddress[1];
           // resultContainer.classList.add('show-green');
        }

        resultContainer.classList.add('show-green');

        
    }
    
}
else{
    /*let resultingAddress=[];
    resultingAddress.push(addressInputVal);
    resultingAddress.push("Invalid hexadecimal input!");
    console.log("Invalid hexadecimal input!");
    console.log(resultingAddress[1].length);
    console.log(typeof resultingAddress[1]);*/

    document.getElementById('resultingBinaryAddressLabel').innerText = "Invalid Hexa decimal input";
    document.getElementById('resultingAddressLabel').innerText = "cant be translated";
    resultContainer.classList.remove('show-green');
    resultContainer.classList.add('show-red');
    
}

    
   /* if(resultingAddress[1] && (resultingAddress[1].includes("Invalid") || resultingAddress[1].includes("Virtual index") || resultingAddress[1].includes("physical index")||resultingAddress[1].includes("As the first bit") )){
        document.getElementById('resultingBinaryAddressLabel').innerText = resultingAddress[0];
        document.getElementById('resultingAddressLabel').innerText = resultingAddress[1];
        resultContainer.classList.remove('show-green');
        resultContainer.classList.add('show-red');
    }
    else{
        resultContainer.classList.remove('show-red');

        if(type === "virtualToPhysical"){
            document.getElementById('resultingBinaryAddressLabel').innerText = "Binary Value of Physical Address is: " + resultingAddress[0];
            document.getElementById('resultingAddressLabel').innerText = "Hexa decimal value of Physical Address is: " + resultingAddress[1];
           // resultContainer.classList.add('show-green');
        }
        else if(type === "physicalToVirtual"){
            document.getElementById('resultingBinaryAddressLabel').innerText = "Binary Value of Virtual Address is: " + resultingAddress[0];
            document.getElementById('resultingAddressLabel').innerText = "Hexa decimal value of Virtual Address is: " + resultingAddress[1];
           // resultContainer.classList.add('show-green');
        }

        resultContainer.classList.add('show-green');

        
    }*/
    
}
function hexToBinary(hexValue) {
    const hexToBinaryMap = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
        'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
    };

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
    const binaryToHexMap = {
        '0000': '0', '0001': '1', '0010': '2', '0011': '3',
        '0100': '4', '0101': '5', '0110': '6', '0111': '7',
        '1000': '8', '1001': '9', '1010': 'A', '1011': 'B',
        '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F'
    };

    if (binaryValue.length % 4 !== 0) {
        binaryValue = '0'.repeat(4 - (binaryValue.length % 4)) + binaryValue;
    }

   
    let hexResult = '';
    for (let i = 0; i < binaryValue.length; i += 4) {
        const nibble = binaryValue.substring(i, i + 4);
        if (binaryToHexMap.hasOwnProperty(nibble)) {
            hexResult += binaryToHexMap[nibble];
        } else {
            return "Invalid binary input!";
        }
    }
    let result=[];
    result.push(binaryValue);
    result.push(hexResult)
    return result;
}




function virtualToPhysical(binaryInput, tableData, virtualPagesize,addressSize) {
    var binaryString = binaryInput.substring(binaryInput.length - addressSize)
    const virtualIndex = parseInt(binaryString.substring(0, virtualPagesize), 2);
    console.log(virtualIndex+"here");
    if(virtualIndex != 'NaN' && virtualIndex<tableData.length){
            if (tableData[virtualIndex].presentBit === '1') {
                return binaryToHex(tableData[virtualIndex].physicalAddress + binaryString.substring(virtualPagesize));
                
            }else{
                let result=[];
                result.push("Address translation failed:");
                result.push("Virtual index is absent in page table.");
                return result;
            }
        }

    let result=[];
    result.push("Address translation failed:");
    result.push("Virtual index not found.");
    return result;

}

function physicalToVirtual(binaryInput, tableData,physicalPagesize,VirtualAddressSize) {
    var checkBit = binaryInput.substring(0, (binaryInput.length - VirtualAddressSize))
    console.log("length"+checkBit.length)
   // var binaryString = binaryInput.substring(binaryInput.length - VirtualAddressSize)
    if (checkBit.includes("1") ) {
        let result=[];
        result.push("Invalid physical address.");
        result.push("As the first bit is 1");
        return result;
    }
    var binaryString = binaryInput.substring(binaryInput.length - VirtualAddressSize)

    const physicalIndex = binaryString.substring(0, physicalPagesize);
    console.log(physicalIndex);
    console.log(physicalPagesize);

    for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].physicalAddress === physicalIndex && tableData[i].presentBit === '1') {
           
            console.log(i);
            const virtualIndexBinary = ("0000" + i.toString(2)).slice(-physicalPagesize);
            console.log(virtualIndexBinary);

            
            return binaryToHex(virtualIndexBinary + binaryString.substring(physicalPagesize));
        }
        else if (tableData[i].physicalAddress === physicalIndex && tableData[i].presentBit === '0'){
            let result=[];
            result.push("physical index is present in table but present bit is 0");
            result.push("Address translation failed: physical index is absent in page table.");
            return result;
        }
    }
    let result=[];
    result.push("Address translation failed:");
    result.push("physical index not found");
    return result;
}
function generateAddressTable() {
   
    var virtualIndexSize = parseInt(document.getElementById("virtualIndexInput").value);
    var pageSize = parseInt(document.getElementById("physicalAddressInput").value);
    var physicalAddressMaxLength = Math.log2(virtualIndexSize / (2 * pageSize));

  
    var tableBody = document.querySelector("tbody");
    var tcaption = document.getElementById("caption");
    var theading = document.getElementById("attributes");

    tableBody.innerHTML = "";
    tcaption.classList.add('d-none');
    theading.classList.add('d-none');

    if (pageSize > 0 && virtualIndexSize > 0) {
        tcaption.classList.remove('d-none');
        theading.classList.remove('d-none');
    }

    var generatedNumbers = generatePermutations(physicalAddressMaxLength);
    console.log(generatedNumbers);
    
    var usedIndices = new Set();

    for (var i = 0; i < virtualIndexSize / pageSize; i++) {
        var newRow = document.createElement("tr");

        var virtualIndexCell = document.createElement("th");
        virtualIndexCell.setAttribute("scope", "row");
        virtualIndexCell.textContent = i;
        newRow.appendChild(virtualIndexCell);

        var physicalAddressCell = document.createElement("td");
        var physicalAddressValue = document.createElement("input");
        physicalAddressValue.setAttribute("type", "text");
        physicalAddressValue.setAttribute("placeholder", "Enter only " + physicalAddressMaxLength + " bits");
        physicalAddressValue.setAttribute("maxlength", physicalAddressMaxLength);

        if (usedIndices.size < generatedNumbers.length) {
            var index;
            do {
                index = Math.floor(Math.random() * generatedNumbers.length);
            } while (usedIndices.has(index));
            
            physicalAddressValue.value = generatedNumbers[index];
            usedIndices.add(index);
        }
     
        physicalAddressCell.appendChild(physicalAddressValue);
        newRow.appendChild(physicalAddressCell);
        
        var presentBitCell = document.createElement("td");
        var presentBitInput = document.createElement("input");
        presentBitInput.setAttribute("type", "text");
        presentBitInput.setAttribute("pattern", "[01]");
        presentBitInput.setAttribute("placeholder", "Enter 0 or 1");
        presentBitInput.setAttribute("maxlength", "1");

        if(physicalAddressValue.value !== ''){
            presentBitInput.value = 1;
        }else{
            presentBitInput.value = 0;
        }
        presentBitCell.appendChild(presentBitInput);
        newRow.appendChild(presentBitCell);

        tableBody.appendChild(newRow);
    }
}





function toggleAddressInput(addressType) {
    var physicalCheckbox = document.getElementById("calculatePhysicalAddress");
    var virtualCheckbox = document.getElementById("calculateVirtualAddress");
    
    var virtualAddressInputBox = document.getElementById("virtualAddressInputBox");
    var physicalAddressInputBox = document.getElementById("physicalAddressInputBox");

    
    if (addressType === "physical") {
        if (physicalCheckbox.checked) {
            if (!virtualCheckbox.checked && !virtualAddressInputBox) {
               
                virtualAddressInputBox = document.createElement("div");
                virtualAddressInputBox.id = "virtualAddressInputBox";
                virtualAddressInputBox.innerHTML = '<label for="virtualAddressInput">Enter Virtual Address:</label><input type="text" id="virtualAddressInput">';
                
                
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
        virtualCheckbox.checked = false; 
    } 

    else if (addressType === "virtual") {
        if (virtualCheckbox.checked) {
            if (!physicalCheckbox.checked && !physicalAddressInputBox) {
                physicalAddressInputBox = document.createElement("div");
                physicalAddressInputBox.id = "physicalAddressInputBox";
                physicalAddressInputBox.innerHTML = '<label for="physicalAddressInputs">Enter Physical Address:</label><input type="text" id="physicalAddressInputs">';
                
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
        physicalCheckbox.checked = false; 
    }
}

function generatePermutations(physicalAddressMaxLength) {
    
    let permutations = [];

    
    function generate(prefix, length) {
       
        if (length === 0) {
            permutations.push(prefix);
        } else {
            
            generate(prefix + '0', length - 1);
            generate(prefix + '1', length - 1);
        }
    }

   
    generate('', physicalAddressMaxLength);

    
    permutations = shuffle(permutations);

    return permutations;
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



document.getElementById("calculatePhysicalAddress").addEventListener("change", function() {
    toggleAddressInput("physical");
});


document.getElementById("calculateVirtualAddress").addEventListener("change", function() {
    toggleAddressInput("virtual");
});

document.getElementById("physicalAddressInput").addEventListener("input", generateAddressTable);

document.getElementById('virtualIndexInput').addEventListener('input', function() {
    const virtualSpace = parseInt(this.value);
    const isValidInput = !isNaN(virtualSpace) && virtualSpace !== 0; 
    const isPowerOfTwo = isValidInput && (virtualSpace & (virtualSpace - 1)) === 0; 
    
   
    const pageSizeContainer = document.getElementById('pageSizeContainer');
    const message = document.getElementById('message');
    if (isPowerOfTwo) {
        pageSizeContainer.style.display = 'block';
        message.style.display = 'none'; 
    } else if (!isPowerOfTwo && this.value !== '') {
        message.style.display = 'block'; 
        pageSizeContainer.style.display = 'none';
    } else {
        message.style.display = 'none'; 
        pageSizeContainer.style.display = 'none';
    }
});



document.getElementById('physicalAddressInput').addEventListener('input', function() {
    const pageSize = parseInt(this.value);
    const isPowerOfTwo = (pageSize & (pageSize - 1)) === 0 && pageSize !== 0; 
    
    document.querySelector('table').style.display = isPowerOfTwo ? 'table' : 'none';
});
