# Lilly Technical Challenge Documentation Template
## Approach
I worked through the objectives in the order they are given. I used external resources including MDN Web Docs for JavaScript DOM manipulation and FastAPI documentation for understanding the existing backend structure as I had not worked with it before. I also used CSS Grid guide for creating the responsive layout. I used Youtube tutorials to push my work to my Github, as I had minimal prior experience with Git.

## Objectives - Innovative Solutions
### Objective 1: Fetch and Display Data
What it was before: The script.js file was completely empty, and index.html had only a header with no content area.
What I implemented:

- Created a loadMedicines() function that fetches data from http://localhost:8000/medicines using the Fetch API
- Built a showMedicines() function that dynamically creates card elements for each medicine
- Added a grid-based card layout to display medicines in an organised, visually appealing way

Why this approach: I chose cards over a simple list or table because they're more modern, visually engaging, and provide better separation between items. The grid layout automatically adapts to screen size, making it responsive.

**Key Code Section**
```
function loadMedicines() {
    //using JS' Fetch API to get data from the backend
    fetch('http://localhost:8000/medicines')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Loaded medicines:', data.medicines.length); //checking data
            showMedicines(data.medicines);
        })
        .catch(function(error) {
            //error handling to show if server is down
            console.log('Error loading medicines:', error);
            showError('Could not load medicines. Check if server is running.');
        });
}
```
How it works: The JS fetch() function sends an HTTP GET request to the backend server (which uses FastAPI to handle requests). The backend responds with JSON data, which is then displayed on the page. If the request fails (for example, server isn't not running), the .catch() block handles the error and displays a user-friendly message.

### Objective 2: Handling Missing/Invalid Data
The problem: In the data.json file, there are two entries with missing information:

- A medicine with an empty name: {"name": "", "price": 15.49}
- A medicine with a null price: {"name": "Tonicast", "price": null

What I implemented:

Name validation: Check if medicine name exists and is not empty before displaying
```
if (!med.name || med.name === '') {
       continue; // Skip this medicine
   }
```
Price validation: Display "Price unavailable" for null/undefined prices instead of crashing
```
if (med.price === null || med.price === undefined) {
       priceText.textContent = 'Price unavailable';
       priceText.className = 'med-price unavailable';
   } else {
       priceText.textContent = '£' + med.price.toFixed(2);
   }
```
Why this approach: My code ensures the application never crashes due to bad data. Users will see a functional interface with clear indicators when data is missing, rather than errors or blank screens.

What I'm proud of: The validation logic filters out incomplete data at display time while still keeping the original data intact in the backend, which is important for data integrity.

### Objective 3: User-Friendly Data Input

What it was before: The backend had a /create endpoint that accepted form data, but there was no way for users to interact with it through the interface.

What I implemented:

- Created an HTML form with labeled input fields for medicine name and price
- Added client-side validation (required fields, number type for price, minimum value of 0)
- Implemented form submission handler that sends data to the backend via POST request
- Added success/error message feedback that appears after submission
- Automatic form and medicine list refresh after successful submission

Why this approach:

- The form is positioned at the top of the page so it's immediately visible to the user
- Input validation prevents bad data from being submitted
- Visual feedback (success/error messages) confirms to users that their action worked, improves user experience
- Auto-refresh means users immediately see their new medicine appear in the list

Key implementation:
```
function addNewMedicine(medicineName, medicinePrice) {
    const formData = new FormData();
    formData.append('name', medicineName);
    formData.append('price', medicinePrice);
    
    fetch('http://localhost:8000/create', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        showMessage('Medicine added successfully!', 'success');
        nameInput.value = '';
        priceInput.value = '';
        loadMedicines(); // refresh the list
    })
}
```
### Objective 4: Design Improvements
What it was before: The CSS file only contained the basic reset and disclaimer styles. The page had no colors, no layout, and no visual hierarchy.

What I did:
- Improved the colour scheme
- Interactive elements
- Improved layout structure
- Improved typography and spacing

### Optional Objective: Average Price Function
What I implemented:

**Backend endpoint (/average-price):**

- Iterates through all medicines in the database
- Sums up prices for medicines that have both a valid name and valid price
- Calculates and returns the average with count


**Frontend integration:**

- Added a button in the stats section
- Fetch request to get average data
- Display result in a styled message area
- Auto-hide after 10 seconds

**My approach**
```
@app.get("/average-price")
def get_average_price():
    with open('data.json') as meds:
        data = json.load(meds)
        
        total = 0
        count = 0
        
        #loop through and sum valid prices
        #excluding medicines without names to match frontend display
        for med in data['medicines']:
            if med.get('price') is not None and med.get('name'):
                total += med['price']
                count += 1
        
        if count > 0:
            avg = total / count
            return {
                "average_price": round(avg, 2),
                "count": count
            }
        else:
            return {
                "average_price": 0,
                "count": 0
            }
```
Why this approach: I only included medicines with valid names to be consistent with what's displayed on the frontend (7 medicines).

## Problems Faced
### Problem 1: Server Not Reflecting New Changes
Issue: After adding the /average-price endpoint to main.py, I got a 404 error when trying to access it, but the function was definitely in the code.
Solution: I learned that FastAPI loads all endpoints when the server starts, so I had to restart the server (Ctrl+C and run start script again) whenever I modified the Python backend code.

### Problem 2: Handling Null vs Empty String
Issue: Initially my validation only checked for null prices, but the empty name was an empty string "", not null.
Solution: Updated validation to check both conditions

### Problem 3: Consistency Between Display and Calculations
Issue: Initially calculated average from all 8 medicines (including the unnamed one) but only displayed 7 on screen. This created confusion about the count.
Solution: Modified the average calculation to match the frontend display logic so only include medicines with valid names. This makes the numbers consistent: both show 7 medicines.

## Evaluation
**What I went well:**
- Core functionality: All required objectives were completed successfully
- Code organisation: The code is separated into functions which are clearly named and have single responsibilities
- Error handling: The application handles missing data gracefully without crashes
- User experience: The interface is simple and provides good feedback
- Optional objective: Successfully implemented the average price feature

**What I think could be improved:**
#### 1. Delete option
Current state: Users can add medicines but cannot remove them.
How I would implement it:

- Add a delete button (X icon or "Delete" text) to each medicine card
- When clicked, send a DELETE request to the existing /delete endpoint
- Refresh the medicine list after successful deletion
- Add a confirmation button to prevent accidental deletions

#### 2. Edit/Update option
Current state: If a medicine's price changes, there's no way to update it without deleting and re-adding.
How I would implement it:

- Add an "Edit" button to each card
- When clicked, populate the form with the medicine's current data
- Change the form submission button to "Update" instead of "Add"
- Send data to the /update endpoint instead of /create
- After update, reset form back to "Add" mode

#### 3. Medicine Details View
Current state: Cards only show name and price, but medicines might have additional information.
How I would implement it:

- Make cards clickable
- When clicked, expand the card to show full details
- Could display additional fields like: description, manufacturer, stock quantity
- Would need to extend the backend data structure to store this information

There are of course more ways to improve the code such as sorting and filtering, better data visualisation, but if I had more time I would focus on the improvements I mentioned above first.

I found this challenge to be well-structured and practical. It was a good reminder of JavaScript fundamentals since I hadn't worked with JavaScript in a while as most of my recent coding has been in Python and Java. Getting back into DOM manipulation and the Fetch API was useful practice.

The existing backend API made it straightforward to focus on the frontend, though I still needed to understand how the two sides communicate. The optional objective was a nice touch as it let me work on both the backend and frontend.

The most valuable takeaway was learning to handle missing and invalid data properly. The database had medicines with empty names and null prices, which forced me to think about validation and error handling from the start. This is something I'll definitely carry forward. 

Although it's simpel, I'm particularly pleased with how the design turned out - the consistent red branding throughout and the immediate user feedback makes it feel polished. The code is also reasonably clean and could be extended with features like delete functionality or editing medicines without having to change the code too much.

If I'm being honest, I would have liked more time to add some of the extra features I mentioned, like the ability to delete medicines or search through the list. But I'm happy with what I accomplished.

