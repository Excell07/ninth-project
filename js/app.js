// =============================================================================
// VARIABLE DECLARATION
// =============================================================================

const wrapper = document.getElementsByClassName('wrapper')[0];
const body = document.body;
let modalNumber = 0;

// Notifications
const notification = document.getElementById('notification');
const notifications = document.getElementById('notifications');
const bell = document.getElementById('bell');

// Alert
const cookieAlert = document.getElementById('cookie-alert');
const closeAlert = document.getElementById('close-alert');

// Statistics
const statFilterButtons = document.getElementsByClassName('stat-filter');
const trafficChartCanvas = document.getElementById('traffic-line-chart');
const dailyTrafficChartCanvas = document.getElementById('daily-traffic-bar-chart');
const mobileUsersChartCanvas = document.getElementById('mobile-users-doughnut-chart');
const trafficChart = newTrafficChart(['week 1', 'week 2', 'week 3', 'week 4', 'week 5', 'week 6', 'week 7', 'week 8', 'week 9', 'week 10'], [500, 1000, 750, 1250, 1750, 1250, 1500, 1000, 1500, 1750]);

// Search
const userSearchField = document.querySelector('input[id="user-search"]');
const userDatalist = document.getElementById('matching-users');
let searchResult = [];

// Users
let users = null;

// Message
const sendButton = document.getElementById('send');
const messageDiv = document.getElementById('message-user');
let message = "";
let messageNotification = document.createElement('p');

// =============================================================================
// ALERT & NOTIFICATIONS
// =============================================================================
bell.addEventListener('click', function(){
  if(notifications.style.visibility === "hidden"){
    notifications.style.visibility = "visible";
    notification.style.visibility = "hidden";
  } else {
    notifications.style.visibility = "hidden";  
  }
});

document.addEventListener("click", function(e) {
  if (e.target !== bell && closeAlert){
    notifications.style.visibility = "hidden";
  }
});

closeAlert.addEventListener('click', function(){
  cookieAlert.setAttribute('style', 'display: none');
});

// =============================================================================
// TRAFFIC CHARTS
// =============================================================================

// Create a new line chart
function newTrafficChart(labels, data){
  new Chart(trafficChartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#e2e3f6',
        borderColor: '#7477bf',
        borderWidth: 0.5,
        radius: 5
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      elements: {
          line: {
            tension: 0, // disables bezier curves
          }
      }
    }
  });
}

// Traffic filter
for (let button of statFilterButtons){
  button.addEventListener('click', function(e){
    for (let button of statFilterButtons){
      button.classList.remove('active-filter');
    }
    this.classList.add('active-filter');
    const clickedButton = this.innerHTML;
    let chart = null;

    if (clickedButton === 'Hourly'){
      chart = newTrafficChart(['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm'], [580, 350, 200, 500, 775, 900, 450, 300, 175, 600]);
    } else if (clickedButton === 'Daily'){
      chart = newTrafficChart(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], [1250, 1500, 1300, 800, 950, 475, 1750]);
    } else if (clickedButton === 'Weekly'){
      chart = newTrafficChart(['1', '2', '3', '4'], [500, 1000, 750, 1000, 750, 1250]);
    } else if (clickedButton === 'Monthly'){
      chart = newTrafficChart(['January', 'February', 'March', 'April', 'May', 'June'], [3000, 1700, 5000, 2500, 1300, 4750]);
    }
  });
}

// DAILY TRAFFIC CHART
const dailyTrafficChart = new Chart(dailyTrafficChartCanvas, {
  type: 'bar',
  data: {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [{
      data: [50, 75, 150, 100, 200, 175, 75],
      backgroundColor: '#7477bf',
      borderColor: '#7477bf',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// MOBILE USERS CHART
const mobileUserChart = new Chart(mobileUsersChartCanvas, {
  type: 'doughnut',
  data: {
    labels: ['Phones', 'Tablets', 'Desktop'],
    datasets: [{
      data: [15, 15, 70],
      backgroundColor: ['#74b1bf', '#81c98f', '#7477fb'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    legend: {
      position: 'right',
      labels: {
        boxWidth: 10,
      }
    },
    rotation: -0.65 * Math.PI
  }
});

// =============================================================================
// MEMBERS
// =============================================================================
$.ajax({
  url: 'https://randomuser.me/api/?results=8&inc=name,picture,email,registered',
  dataType: 'json',
  error: function(){
    console.error("Could'n get random users from API");
  },
  success: function(data){
    users = data.results;
    populate(users);
  }
});

// Change first character to uppercase
function firstUp(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Populate member sections using random users API
function populate(randomUsers){
  // Variable declaration
  const newMembersDiv = document.getElementById('new-members');
  const recentActivityDiv = document.getElementById('recent-activity');
  const membersActivity = ["posted YourApp's SEO Tips", "commented on Facebook's Changes for 2018", "liked the post Facebook's Change for 2018", "commented on YourApp's SEO Tips"];
  const activityTime = ['1 day ago', '5 hours ago', '5 hours ago', '4 hours ago'];

  // Loop through random users to populate member sections
  for (let i = 0; i < randomUsers.length; i++){
    const member = randomUsers[i];

    // Wrapper div for user info
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-info';

    // Image avatar
    const imageDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = member.picture.thumbnail;
    img.alt = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
    img.className = 'avatar';
    imageDiv.appendChild(img);
    memberDiv.appendChild(imageDiv);

    // Use the 4 first users to populate "New Members" specific info
    if (i <= 3){
      // Wrapping div
      const detailsDiv = document.createElement('div');

      // Name
      const name = document.createElement('p');
      name.className = 'member-name';
      name.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
      detailsDiv.appendChild(name);

      // Email
      const email = document.createElement('p');
      email.innerHTML = member.email;
      email.className = 'member-email';
      detailsDiv.appendChild(email);
      memberDiv.appendChild(detailsDiv);

      // Signup Date
      const dateDiv = document.createElement('div');
      dateDiv.className = 'flex-item-last';
      const signupDate = document.createElement('p');
      const dateOptions = {month: '2-digit', day: '2-digit', year: '2-digit'};
      signupDate.innerHTML = new Date(member.registered.date).toLocaleDateString('en-US', dateOptions);
      signupDate.className = 'member-signup';
      dateDiv.appendChild(signupDate);

      memberDiv.appendChild(dateDiv);

      // Line break between members
      newMembersDiv.appendChild(memberDiv);
      if (i < 3){
        const line = document.createElement('hr');
        line.className = "max-length";
        newMembersDiv.appendChild(line);
      }
    }
    // The 4 last users populates "Recent Activity" specific info
    else {
      // Wrapping div
      const activityDiv = document.createElement('div');
      memberDiv.appendChild(activityDiv);

      // Activity
      const activity = document.createElement('p');
      activity.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last) + membersActivity[i -4];
      activityDiv.appendChild(activity);

      // Time
      const time = document.createElement('p');
      time.innerHTML = activityTime[i -4];
      time.className = 'activity-time';
      activityDiv.appendChild(time);

      // Signup Date
      const arrowDiv = document.createElement('div');
      arrowDiv.className = 'flex-item-last';
      const arrow = document.createElement('p');
      arrow.innerHTML = '›'
      arrow.className = 'activity-arrow';
      arrowDiv.appendChild(arrow);
      memberDiv.appendChild(arrowDiv);

      // Add linebreak if not the last one
      recentActivityDiv.appendChild(memberDiv);
      if (i < 7){
        const line = document.createElement('hr');
        recentActivityDiv.appendChild(line);
      }
    }
  }
}

// =============================================================================
// MESSAGE USER
// =============================================================================

// Search for user
userSearchField.onkeyup = function(){

// Variable declaration
  const input = userSearchField.value;
  searchResult = [];
  let options = '';

// Refresh datalist for every character added or removed input field
  while (userDatalist.firstChild){
    userDatalist.removeChild(userDatalist.firstChild);
  }

// Only look for a match if it's not an empty string
  if (input !== ''){
    // if match save to search result
    for (let i = 0; i < users.length; i++){
      if (users[i].name.first.includes(input) || users[i].name.first.includes(input)){
        searchResult.push(users[i]);
      }
    }

// Add datalist options with search result
    for (let i = 0; i < searchResult.length; i++){
      const name = firstUp(searchResult[i].name.first) + ' ' + firstUp(searchResult[i].name.last);
      options += '<option value="' + name + '"/>';
      userDatalist.innerHTML = options;
    }
  }
};

// Send Button
sendButton.addEventListener('click', function(e){
  const writtenMessage = document.getElementById('message').value;
  let validUser = false;
  // for (let i = 0; i < searchResult.length; i++){
  //   var searchTerm = firstUp(searchResult[i].name.first) + ' ' + firstUp(searchResult[i].name.last); 
  // }

  if (userSearchField.value){   
    validUser = true;
  }

  // Validate and display message
  if (writtenMessage !== '' && validUser == true){
    message = "Your message has been sent!";
    messageNotification.innerHTML = message;
    messageDiv.appendChild(messageNotification);
  } else {
    message = 'Oops! You have to choose an existing user and write a message.';
    messageNotification.innerHTML = message;
    messageDiv.appendChild(messageNotification);
    validUser = false;
  }
});

// =============================================================================
// SETTINGS
// =============================================================================

// Test if the window object contains localStorage props
if ('localStorage' in window && window['localStorage'] !== null){
  const emailSwitch = document.getElementById('switch-email');
  const publicSwitch = document.getElementById('switch-public');
  const timeZone = document.getElementById('time-zone');
  const saveButton = document.getElementById('save-settings');
  // const cancelButton = document.getElementById('cancel-settings');

// Add event listener to save button and save settings to local storage
  saveButton.addEventListener('click', function(){
    localStorage.publicState = publicSwitch.checked;
    localStorage.emailState = emailSwitch.checked
    localStorage.selectedIndex = timeZone.selectedIndex;
    localStorage.exists = true;
  });

// Make sure saved settings shows as displayed
  if (localStorage.exists){
    publicSwitch.checked = JSON.parse(localStorage.publicState);
    emailSwitch.checked = JSON.parse(localStorage.emailState);
    timeZone.selectedIndex = localStorage.selectedIndex;
  }
}