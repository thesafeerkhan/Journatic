document.addEventListener('DOMContentLoaded', () => {
    users = Store.getUsers();
});

// Varibles
let counter = 0;
let users = [];
let currentUser = null;
let journalArray = [];

// DOM Objects
const accountState = document.querySelector("#account");
const logInHeader = document.querySelector("#log-in-header");
const logInForm = document.querySelector("#log-in-form");
const logInButton = document.querySelector("#log-in-button");
let logInUserName = document.querySelector("#log-in-user-name");
let logInPassword =document.querySelector("#log-in-password");
let logInStatus = document.querySelector(".log-in-status");

const signUpHeader = document.querySelector("#sign-up-header");
const signUpForm = document.querySelector("#sign-up-form");
const signUpButton = document.querySelector("#sign-up-button");
let signUpUserName = document.querySelector("#sign-up-user-name");
let signUpPassword = document.querySelector("#sign-up-password");
let signUpName = document.querySelector("#sign-up-name");
let signUpBio = document.querySelector("#sign-up-bio");
let signUpStatus = document.querySelector(".sign-up-status");

const mainState = document.querySelector("#main");
const journalState = document.querySelector("#journal");
const newEntryState = document.querySelector("#entry-form");
const viewEntryState = document.querySelector("#view-entry");
const status = document.querySelector("#status");

const addNewEntry = document.querySelector("#add-entry");
const editEntry = document.querySelector("#edit-entry");
const entryDate = document.querySelector("#entry-date");
const entryTitle = document.querySelector("#entry-title");
const entryContent = document.querySelector("#entry-content");
const entryTags = document.querySelector("#entry-tags");
const backButtons = document.querySelectorAll(".back-button");

const viewDeleteButton = document.querySelector("#entry-delete");
const viewEditButton = document.querySelector("#entry-edit");

const profileName = document.querySelector('#profile-name'); 
const profileBio = document.querySelector('#profile-bio'); 
const signOutButton = document.querySelector(`#signout-button`);

// Classes
class Entry { // Represent a Journal Entry
    constructor(date, title, content, tags){
        this.id = counter++;
        this.date = date;
        this.title = title;
        this.content = content;
        this.tags = tags;
    }
}

class User { // Represent a User
    constructor(username, password, name, bio){
        this.userName = username;
        this.password = password;
        this.name = name;
        this.bio = bio;
        this.userJournal = [];
    }
}

// Handle Local Storage
class Store {
    static getUsers() { //Get Users from Local Storage
        let users;
        if(localStorage.getItem('users') === null){
            // SAMPLE USER
            // let user = new User('JohnSmith', 'Password1!', "John Smith", "I love photography");
            users = [];
        } else {
            users = JSON.parse(localStorage.getItem('users'));
        } 
        return users
    }

    static addUser(user){ //Add User to Local Storage
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    static updateJournal(username, journal){ //Update User's Journal
        const users = Store.getUsers();
        users.forEach(u => {
            if(u.userName == username){
                u.userJournal = journal;
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

class Account { // Handle Account Creation
    static createNewUser(userName, userPassword, name, bio) {
        let user = new User(userName, userPassword, name, bio);
        users.push(user);
        Store.addUser(user);
    }
      
    static checkUserLogin(userName, userPassword) {
        let user = null;
        users.forEach((element) => {
            if (userName === element.userName && userPassword === element.password) {
                user = element;
            }
        });
        if (user != null) {
          return user;
        } else {
          return false;
        }
    }

    /*
    Password Validation
    A password is correct if it contains:
    At least 1 uppercase character.
    At least 1 lowercase character.
    At least 1 digit.
    At least 1 special character.
    Minimum 8 characters.
    */
    static accountSignUp(userName, password, name, bio){
        if(userName == "" || password == "" || name == "" || bio == ""){
            signUpStatus.textContent = "Please fill in all fields."
        } else {
            let found = false;
            users.forEach(element => {
                if(element.userName == userName) {
                    found = true;
                }
            });
        
            if(found) {
                signUpStatus.textContent = `Account ${userName} already exists.`;
            } else {
                if(password.match(/[a-z]/g) && password.match( 
                    /[A-Z]/g) && password.match( 
                    /[0-9]/g) && password.match( 
                    /[^a-zA-Z\d]/g) && password.length >= 8){
                    this.createNewUser(userName, password, name, bio);
                    signUpUserName.value = "";
                    signUpPassword.value = "";
                    signUpName.value = "";
                    signUpBio.value = "";
                    signUpStatus.textContent = "";
                    signUpStatus.textContent = "Account creation successful."
                } else {
                    signUpStatus.textContent = "Please use a stronger password."
                }
            }
        }
    }

    static accountLogIn(userName, password){
        let user = this.checkUserLogin(userName, password);
        if(user != false){
            logInUserName.value = "";
            logInPassword.value = "";
            logInStatus.textContent = "";
            logInStatus.textContent = "Login valid. Please wait.";

            // Mimic Login Time
            setTimeout(function() {
            accountState.style.display = "none";
            mainState.setAttribute("account-id", `${userName}`);
            JournalUI.init();
            logInStatus.textContent = "";
            }, 1000);
        } else {
            logInStatus.textContent = "Login invalid. Please try again.";
        }
    }
}

class JournalUI { // Handle Journal UI Tasks

    static init(){ // Initialize Global Variables
        users = Store.getUsers();
        users.forEach(element => {
            if(mainState.getAttribute("account-id") == element.userName){
                currentUser = element;
                journalArray = currentUser.userJournal;
            }
        });
        profileName.textContent = `${currentUser.name}`;
        profileBio.textContent = `${currentUser.bio}`;
        journalState.innerHTML = `<i id="new-entry" class="entry btn fas fa-pencil-alt fa-6x"></i>`;
        journalArray.forEach(element => {
            this.addEntryToJournal(element);
        });
        mainState.style.display = "flex";
    }

    // Gets current journalArray entries and display on UI
    static getEntries(){
        this.init();
    }

    // Displays preview of passed in entry to UI
    static addEntryToJournal(entry) {
        journalState.innerHTML += `
        <div class="entry entryElement" entry-id = "${entry.id}">
            <div class="delete-container entryElement">
                <i class="fas fa-trash fa-2x delete-entry"></i>
            </div>
            <h5 class="entryElement">${entry.date.substring(0,30)}</h5>
            <h1 class="entryElement">${entry.title.substring(0,25)}</h1>
            <div class="entry-container entryElement">
                <h3 class="entryElement">${entry.content.substring(0,100)+"..."}</h3>
            </div>
            <h6 class="entryElement"><i class="fas fa-angle-down fa-3x entryElement"></i></h6>
        </div> 
        `
    }

    // Removes Entry from journalArray
    static deleteEntry(element){
        if(element.classList.contains('delete-entry')){
            let id = element.parentElement.parentElement.getAttribute('entry-id');
            for(let i = 0; i < journalArray.length; i++){
                if(journalArray[i].id == `${id}`){
                    journalArray.splice(i,1);
                }
            }
            if(document.querySelector("#view-entry").classList.contains('active')){
                viewEntryState.classList.toggle("active");
                journalState.classList.toggle("active"); 
            }
            this.showAlert("Journal entry removed", "error");
        }
        Store.updateJournal(currentUser.userName, journalArray);
        this.getEntries();
    }

    // Shows UI Alert
    static showAlert(message, className){
        document.querySelector("#status-container").classList.toggle("active");
        status.classList.toggle(className);
        status.textContent = message;
        // Clear after 3 seconds
        setTimeout(function () {
            document.querySelector("#status-container").classList.toggle("active");
            status.classList.toggle(className);
        }, 2000);
        
    }

    // Clears Form Fields
    static clearFields() {
        entryDate.value = "";
        entryTitle.value = "";
        entryContent.value = "";
        entryTags.value = "";
    }

    // Display's Entire Entry on UI
    static viewEntry(element){
        // Check if Entry Clicked
        if(!element.classList.contains('delete-entry') && 
        (element.classList.contains('entryElement'))){
            let id;
            // Get ID
            if(element.hasAttribute('entry-id')){
                id = element.getAttribute('entry-id');
            } else if(element.parentElement.hasAttribute('entry-id')){
                id = element.parentElement.getAttribute('entry-id');
            } else if(element.parentElement.parentElement.hasAttribute('entry-id')){
                id = element.parentElement.parentElement.getAttribute('entry-id');
            }
            // Get Object with specific ID
            let entry;
            for(let i = 0; i < journalArray.length; i++){
                if(journalArray[i].id == `${id}`){
                     entry = journalArray[i];
                }
            }
            // Toggle Object Info on View Screen
            document.querySelector("#view-entry").setAttribute("entry-id", `${entry.id}`);
            document.querySelector("#view-date").textContent = entry.date;
            document.querySelector("#view-title").textContent = entry.title;
            document.querySelector("#view-content").textContent = entry.content;
            document.querySelector("#view-tags").textContent = entry.tags;
            document.querySelector("#journal").classList.toggle("active");
            document.querySelector("#view-entry").classList.toggle("active");
        } 
    }
}

// Event Handlers
// Account Creation State
logInHeader.addEventListener("click", function() {  
    logInHeader.classList.toggle("active");
    logInForm.classList.toggle("active");
    signUpHeader.classList.toggle("active");
    signUpForm.classList.toggle("active");
    
    signUpUserName.value = "";
    signUpPassword.value = "";
    signUpName.value = "";
    signUpBio.value = "";
    signUpStatus.textContent = "";
});

signUpHeader.addEventListener("click", function() {
    signUpHeader.classList.toggle("active");
    signUpForm.classList.toggle("active");
    logInHeader.classList.toggle("active");
    logInForm.classList.toggle("active");
    
    logInUserName.value = "";
    logInPassword.value = "";
    logInStatus.textContent = "";
});

signUpButton.addEventListener("click", function () {
   Account.accountSignUp(signUpUserName.value, signUpPassword.value,  signUpName.value, signUpBio.value);
  });
  
  logInButton.addEventListener("click", function () {
    Account.accountLogIn(logInUserName.value, logInPassword.value);
  });

//   Sign Out Button
signOutButton.addEventListener("click", function(){
    mainState.style.display = "none";
    accountState.style.display = "flex";
});

// Journal State
document.addEventListener('click',function(e){ // New Entry Button Clicked
    // Toggle to New Entry Screen
    if(e.target && e.target.id== 'new-entry'){
        journalState.classList.toggle("active");
        newEntryState.classList.toggle("active");
        document.querySelector("#add-form-buttons").classList.toggle("active");
     }
 });

addNewEntry.addEventListener("click", function(){ // Add Entry Button
    // Validate
    if( entryTitle.value === "" || entryContent.value == "" || entryDate.value == ""){
        JournalUI.showAlert("Please fill in Title, Content, and Date", "error");
    } else {
        // Add to Journal
        const entry = new Entry(entryDate.value,entryTitle.value,entryContent.value,entryTags.value);
        journalArray.push(entry);
        Store.updateJournal(currentUser.userName, journalArray);
        JournalUI.getEntries();

        // Clear Form
        JournalUI.clearFields();

        // Toggle to Journal
        document.querySelector("#add-form-buttons").classList.toggle("active");
        journalState.classList.toggle("active");
        newEntryState.classList.toggle("active");
        JournalUI.showAlert("Journal entry added", "success");
    }
});

// Event: Remove Entry
journalState.addEventListener('click', (e) => {
    JournalUI.deleteEntry(e.target);
});

viewDeleteButton.addEventListener('click', (e) => {
    JournalUI.deleteEntry(e.target);
});

// Event: View Entry
journalState.addEventListener('click', (e) => {
    JournalUI.viewEntry(e.target);
});

// Event: Edit Entry Button
viewEditButton.addEventListener('click', (e) => {
    let id = e.target.parentElement.parentElement.getAttribute('entry-id');
    for(let i = 0; i < journalArray.length; i++){
        if(journalArray[i].id == `${id}`){
            // Set Input Values
            newEntryState.setAttribute('entry-index', `${i}`);
            entryDate.value = journalArray[i].date;
            entryTitle.value = journalArray[i].title;
            entryContent.value = journalArray[i].content;
            entryTags.value = journalArray[i].tags;
    
            // Toggle to Form Mode
            viewEntryState.classList.toggle("active");
            document.querySelector("#edit-form-buttons").classList.toggle("active");
            newEntryState.classList.toggle("active");
        }
    }
});

editEntry.addEventListener("click", function(){
    // Get Entry ID
    const i = document.querySelector("#entry-form").getAttribute('entry-index');

    // Update journalArray entry with new values
    journalArray[i].date = entryDate.value;;
    journalArray[i].title = entryTitle.value;;
    journalArray[i].content = entryContent.value;;
    journalArray[i].tags = entryTags.value;;

     // Clear Form
    Store.updateJournal(currentUser.userName, journalArray);
    JournalUI.getEntries();
    JournalUI.clearFields();

    // Toggle to Journal
    document.querySelector("#edit-form-buttons").classList.toggle("active");
    newEntryState.classList.toggle("active");
    journalState.classList.toggle("active");
    JournalUI.showAlert("Changes made to journal entry", "success");
});

// Event: Back Button
for (let i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", function() {
        journalState.classList.toggle("active");
        newEntryState.classList.remove("active");
        viewEntryState.classList.remove("active");
        JournalUI.clearFields();
        document.querySelector("#add-form-buttons").classList.remove("active");
        document.querySelector("#edit-form-buttons").classList.remove("active");
    });
}
