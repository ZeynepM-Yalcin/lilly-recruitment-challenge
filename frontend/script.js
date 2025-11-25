//get element references
const medicineForm = document.getElementById('medicine-form');
const nameInput = document.getElementById('name-input');
const priceInput = document.getElementById('price-input');
const messageArea = document.getElementById('message-area');
const cardsContainer = document.getElementById('cards-container');

document.addEventListener('DOMContentLoaded', function() {
    loadMedicines();
    setupFormHandler();
    setupAverageButton();
});

function loadMedicines() {
    fetch('http://localhost:8000/medicines')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Loaded medicines:', data.medicines.length); // checking data
            showMedicines(data.medicines);
        })
        .catch(function(error) {
            console.log('Error loading medicines:', error);
            showError('Could not load medicines. Check if server is running.');
        });
}

function showMedicines(medList) {
    cardsContainer.innerHTML = '';
    
    let validCount = 0;
    
    for (let i = 0; i < medList.length; i++) {
        const med = medList[i];
        
        //skip medicines without names - there's one in the data with empty name
        if (!med.name || med.name === '') {
            continue;
        }
        
        validCount++;
        
        const card = document.createElement('div');
        card.className = 'med-card';
        
        const nameText = document.createElement('h3');
        nameText.textContent = med.name;
        card.appendChild(nameText);
        
        const priceText = document.createElement('p');
        priceText.className = 'med-price';
        
        //handle null prices - one medicine has price: null in the data
        if (med.price === null || med.price === undefined) {
            priceText.textContent = 'Price unavailable';
            priceText.className = 'med-price unavailable';
        } else {
            priceText.textContent = '£' + med.price.toFixed(2);
        }
        
        card.appendChild(priceText);
        cardsContainer.appendChild(card);
    }
    
    if (validCount === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No medicines to display';
        emptyMsg.className = 'empty-message';
        cardsContainer.appendChild(emptyMsg);
    }
}

function setupFormHandler() {
    medicineForm.onsubmit = function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const price = priceInput.value;
        
        if (name === '') {
            showMessage('Please enter a medicine name', 'error');
            return;
        }
        
        if (price === '' || price < 0) {
            showMessage('Please enter a valid price', 'error');
            return;
        }
        
        addNewMedicine(name, price);
    };
}

function addNewMedicine(medName, medPrice) {
    const formData = new FormData();
    formData.append('name', medName);
    formData.append('price', medPrice);
    
    fetch('http://localhost:8000/create', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        showMessage('Medicine added successfully!', 'success');
        
        //clear form
        nameInput.value = '';
        priceInput.value = '';
        
        loadMedicines(); //refresh list
    })
    .catch(function(error) {
        console.log('Error adding medicine:', error);
        showMessage('Failed to add medicine', 'error');
    });
}

function setupAverageButton() {
    const avgBtn = document.getElementById('calc-average-btn');
    if (avgBtn) {
        avgBtn.addEventListener('click', function() {
            calculateAverage();
        });
    }
}

function calculateAverage() {
    fetch('http://localhost:8000/average-price')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            const avgDisplay = document.getElementById('average-display');
            
            if (avgDisplay) {
                avgDisplay.textContent = `Average Price: £${data.average_price} (from ${data.count} medicines)`;
                avgDisplay.className = 'message-area success';
                avgDisplay.style.display = 'block';
                
                //hide after 10 seconds
                setTimeout(function() {
                    avgDisplay.textContent = '';
                    avgDisplay.className = 'message-area';
                }, 10000);
            } else {
                console.error('Average display element not found');
            }
        })
        .catch(function(error) {
            console.log('Error calculating average:', error);
            const avgDisplay = document.getElementById('average-display');
            if (avgDisplay) {
                avgDisplay.textContent = 'Failed to calculate average price';
                avgDisplay.className = 'message-area error';
                avgDisplay.style.display = 'block';
            }
        });
}

function showMessage(text, type) {
    messageArea.textContent = text;
    messageArea.className = 'message-area ' + type;
    
    setTimeout(function() {
        messageArea.textContent = '';
        messageArea.className = 'message-area';
    }, 3000);
}

function showError(text) {
    const errorBox = document.createElement('div');
    errorBox.className = 'error-box';
    errorBox.textContent = text;
    cardsContainer.appendChild(errorBox);
}