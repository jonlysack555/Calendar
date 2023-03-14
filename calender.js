document.getElementById("newNote").style.fontSize = 38400/screen.width + "px";

var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthAbrv = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var dayAbrv = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
var year = 0;
var month = 0;
var date = 0;
var day = 0;
var minute = 0;
var now;
var calData = {};
var today;

function getTouches(evt) {
  return evt.touches ||             // browser API
  evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
  console.log("touch");
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  console.log("move");
  if ( ! xDown || ! yDown ) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
    if ( xDiff > 0 ) { //change value
      console.log(evt);
    } else {
      /* left swipe */
    }
  } else {
    if ( yDiff > 0 ) {
      /* down swipe */
    } else {
      /* up swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
};

var xDown = null;
var yDown = null;

function addSwiper(elm) {
  elm.addEventListener('touchstart', handleTouchStart, false);
  elm.addEventListener('touchmove', handleTouchMove, false);
}

function newNote(curDate = today) {
  var entText = window.prompt("New note:", "");
  if (entText != null) {
    curDate.addNote(entText);
  }
}

function editNote(num, curDate = today) {
  num = num.srcElement.param;
  var pNode = document.getElementById(JSON.stringify(num)).firstChild;
  var prevText = pNode.innerHTML;
  prevText = window.prompt("Edit note:", prevText);
  if (prevText != null) {
    curDate.notes[num] = prevText;
    pNode.innerHTML = prevText;
  }
}

function text(jon, em, message) {
  var numbers = [];
  if (jon) {
    numbers.push('+12047245612');
  }
  if (em) {
    numbers.push('+12047611121');
  }
  const data = JSON.stringify({
    include_phone_numbers: numbers,
    sms_from: '+15075015629',
    contents: {
      en: message
    },
    name: 'Calender Text',
    app_id: '57ae0e85-f2a5-44ed-9456-7a1e7b0ef3e5'
  });

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });

  xhr.open('POST', 'https://onesignal.com/api/v1/notifications');
  xhr.setRequestHeader('accept', 'application/json');
  xhr.setRequestHeader('Authorization', 'Basic \u003cNjQzZjM0Y2QtYjVjOC00MGQyLTgwNzktYWVhNWQwOWVjMDc1\u003e');
  xhr.setRequestHeader('content-type', 'application/json');

  xhr.send(data);
}

class Day {
  constructor(fullDate) {
    this.date = fullDate;
    this.events = [];
    this.tasks = [];
    this.notes = [];
  }

  day() {
    var temp = new Date(this.date[1] + " " + this.date[2] + ", " + this.date[0] + " 00:00:01");
    return(temp.getDay());
  }

  date() {
    return(this.date[2]);
  }

  month() {
    return(this.date[1]);
  }

  year() {
    return(this.date[0]);
  }

  addEvent(namee, startt, endd, descriptionn, reoccuree) {
    //add to all days by reoccure
    //include reoccurance and length in description
    this.events.push({"name":namee, "start":startt, "end":endd, "description":descriptionn, "reoccure":reoccuree});
    display();
  }

  addTask(namee, startt, endd, descriptionn) {
    //include reoccurance and length in description
    this.tasks.push({"name":namee, "start":startt, "end":endd, "description":descriptionn, "complete":false});
    display();
  }

  addNote(note) {
    this.notes.push(note);
    display();
  }

  delEvent(name) {
    //do for all reoccurances
    for (var i = 0; i < this.events.length(); i++) {
      if (this.events[i].name == name) {
        return(this.events.splice(i, i));
        i--;
      }
    }
    display();
  }

  delTask(name) {
    for (var i = 0; i < this.tasks.length(); i++) {
      if (this.tasks[i].name == name) {
        return(this.tasks.splice(i, i));
        i--;
      }
    }
    display()
  }

  delNote(index) {
    return(this.notes.splice(index, index));
    display();
  }

  complete(name) {
    for (var i = 0; i < this.tasks.length(); i++) {
      if (this.tasks[i].name == name) {
        this.tasks[i].complete = true;
      }
    }
    display();
  }
}

initiate();

function display() {
  while (document.getElementById("notes").firstChild) {
    document.getElementById("notes").removeChild(document.getElementById("notes").firstChild);
  }
  var height = (document.getElementById("notes").clientHeight-(today.notes.length-1)*4)/today.notes.length;
  console.log(height);
  for (var i = 0; i < today.notes.length; i++) {
    var tempDiv = document.createElement("div");
    tempDiv.id = JSON.stringify(i);
    tempDiv.addEventListener("dblclick", editNote, i); //add real date
    addSwiper(tempDiv);
    tempDiv.param = i;
    tempDiv.className = "noteDiv";
    tempDiv.style.height = height+"px";
    tempDiv.style.top = (i*height-4+i*4)+"px";
    var tempP = document.createElement("p");
    tempDiv.append(tempP);
    tempP.innerHTML = today.notes[i];
    tempP.param = i;
    tempP.className = "noteP";
    document.getElementById("notes").append(tempDiv);
  }
  document.getElementById("0").style.borderTopLeftRadius = "5vw";
  document.getElementById("0").style.borderTopRightRadius = "5vw";
  document.getElementById(JSON.stringify(today.notes.length-1)).style.borderBottomLeftRadius = "5vw";
  document.getElementById(JSON.stringify(today.notes.length-1)).style.borderBottomRightRadius = "5vw";
}

function timeUpdate() {
  now = new Date();
  year = now.getFullYear();
  month = now.getMonth();
  date = now.getDate();
  day = now.getDay();
  minute = 60*now.getHours() + now.getMinutes();
  today = calData[JSON.stringify(year)][JSON.stringify(month)][JSON.stringify(date)];
  setTimeout(timeUpdate, 60000);
}

function initiate() {
  now = new Date();
  year = now.getFullYear();
  month = now.getMonth();
  date = now.getDate();
  day = now.getDay();
  minute = 60*now.getHours() + now.getMinutes();
  setTimeout(timeUpdate, 60000);
  var save = []; //getlocaldata
  for (var i = year; i < year + 5; i++) {
    if (save[JSON.stringify(i)] != undefined) {
      calData[JSON.stringify(i)] = save[JSON.stringify(i)];
    } else {
      calData[JSON.stringify(i)] = [];
      for (var j = 0; j < 12; j++) {
        calData[JSON.stringify(i)][j] = [];
        var temp = new Date(months[j] + " 1, " + i + " 00:00:01");
        var k = 1;
        while (temp.getMonth() == j) {
          calData[JSON.stringify(i)][j][k] = new Day([i, j, k]);
          k++;
          temp.setDate(k);
        }
      }
    }
  }
  today = calData[JSON.stringify(year)][JSON.stringify(month)][JSON.stringify(date)];
}
