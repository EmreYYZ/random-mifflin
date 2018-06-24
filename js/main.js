/*
To-do:
- Exclude episodes
- affiliate URL systems https://www.geni.us/
- URL based generation with ? and disqus comments based on url.
- Select season: if a season is selected, generate numbers only for that season. Also, disable options for episodes according to the selected season.
- Info links for the episodes: Trakt.TV - IMDB - TVDB
- Streaming Links for the episodes: Netflix - Itunes - Amazon - Google Play Movies
- Google Analytics
- (Maybe) Links for purchasing BoxSet etc.
- (Maybe) Load comments for the episode: Disqus comments can be generated. User can "Load Comments"
- (Maybe) Order of appearance amounts for charaters for that specific episode: Can use couple of APIs to generate. With character portraits.
- (Maybe) 1 advertisement. Amazon Products related to The Office or Google Adsense.
-share buttons
-change page share meta according to the episode (title, description, thumb.)
-redbubble affiliate?
*/

document.getElementById("randomMifflin").addEventListener("click", randomMifflin);
// document.getElementById("randomMifflin").addEventListener("click", showComm);
document.getElementById("fltr").addEventListener("click", filterToggle);
// document.getElementById("loadComments").addEventListener("click", showDisqus);


var seasonNo;
var episodeNo;
var pageURL;
var urlData;
seasonNo = getQueryVariable('s');
episodeNo = getQueryVariable('e');

if (seasonNo && episodeNo !== undefined) {
  getURL() //get and change product urls
  getThumb() //get thumbnail TMDB API
  getInfo() //get episode info TRAKT API
  loadDisqus() //get disqus comments
}

//gets the url and splits it
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
//gets the url and splits it

//Runs the random episode selector.
function randomMifflin() {
// add loader

  seasonNo = Math.ceil(Math.random() * 9);
  if (seasonNo == 1) {
    episodeNo = Math.ceil(Math.random() * 6);
  } else if (seasonNo == 2) {
    episodeNo = Math.ceil(Math.random() * 22);
  } else if (seasonNo == 3) {
    episodeNo = Math.ceil(Math.random() * 23);
    //Phyllis' Wedding - Season 3 Episode 15
    if (document.getElementById('phyllis').checked == true && episodeNo == 15) {
       randomMifflin();
       console.log("Phyllis' Wedding excluded. Rerunning the script.");
    }
  } else if (seasonNo == 4) {
    episodeNo = Math.ceil(Math.random() * 14);
    //Dinner Party - Season 4 Episode 13
    if (document.getElementById('jan').checked == true && episodeNo == 13) {
       randomMifflin();
       console.log("Dinner Party excluded. Rerunning the script.");
    };
  } else if (seasonNo == 5) {
    episodeNo = Math.ceil(Math.random() * 26);
  } else if (seasonNo == 6) {
    episodeNo = Math.ceil(Math.random() * 26);
    //Scott's Tots - Season 6 Episode 12
    if (document.getElementById('scott').checked == true && episodeNo == 12) {
       randomMifflin();
       console.log("Scott's Tots excluded. Rerunning the script.");
    } else if (document.getElementById('scott').checked == true && episodeNo == 14) {
      randomMifflin();
      console.log("The Banker excluded. Rerunning the script.");
    }
    //The Banker - Season 6 Episode 14 (Filler Episode)
  } else if (seasonNo == 7) {
    episodeNo = Math.ceil(Math.random() * 24);
  } else if (seasonNo == 8) {
    episodeNo = Math.ceil(Math.random() * 24);
  } else {
    episodeNo = Math.ceil(Math.random() * 23);
  }

  getURL() //get and change product urls
  changeTitle() //Change Page Title
  changeURL() // Change Page URL
  getThumb() //get thumbnail TMDB API
  getInfo() //get episode info TRAKT API
  loadDisqus() //get disqus comments

}

//gets amazon and itunes urls from db.json
function getURL(){
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET','js/db.json');
  dataRequest.onload = function (){
    urlData = JSON.parse(dataRequest.response);
    document.getElementById('aHREF').href = urlData.season[seasonNo - 1]["0"];
    document.getElementById('iHREF').href = urlData.season[seasonNo - 1][1];
  }
  dataRequest.send();
}
//gets amazon and itunes urls from db.json

//TMDB API generates episode thumbnail
function getThumb(){
  var thumbRequest = new XMLHttpRequest();
  thumbRequest.open('GET', 'https://api.themoviedb.org/3/tv/2316/season/' + seasonNo + '/episode/' + episodeNo + '/images?api_key=c4e0e43db456cb63f04bead90cf06afc');
  thumbRequest.onload = function () {
    var thumbData = JSON.parse(thumbRequest.responseText);
    var imgURL = 'https://image.tmdb.org/t/p/original/' + thumbData.stills['0'].file_path;
    document.getElementById('thumbnail').src = imgURL;
  };
  thumbRequest.send();
}
//TMDB API generates episode thumbnail

// Trakt API - Gets the information of the random episode.
function getInfo(){
  var request = new XMLHttpRequest();

  request.open('GET', 'https://api.trakt.tv/shows/the-office/seasons/' + seasonNo + '/episodes/' + episodeNo + '?extended=full');

  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('trakt-api-version', '2');
  request.setRequestHeader('trakt-api-key', 'c66faa4cdb7c9815a82e9e066821f317ebc6086a6217a1b0934169ea55fbd492');

  request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        document.getElementById('title').innerHTML = response.title;
        document.getElementById('runtime').innerHTML = response.runtime + ' mins.';
        document.getElementById('rating').innerHTML = (response.rating).toFixed(1) + '/10';
        document.getElementById('seasonInfo').innerHTML = response.season;
        document.getElementById('episodeInfo').innerHTML = response.number;
        document.getElementById('overview').innerHTML = response.overview;
        document.getElementById('imdbHREF').href = "https://www.imdb.com/title/" + response.ids.imdb;
        var element = document.getElementById("info");

        if (element.classList.contains('hidden') == true) {
          element.classList.toggle('hidden');
          // remove loader
        }
      }
    };
    request.send();
}
// Trakt API - Gets the information of the random episode.

// Opens the filter menu. // DONE //
function filterToggle() {
  var element = document.getElementById("filters");
  element.classList.toggle('hidden');
}
// Opens the filter menu. // DONE //

//Shows comments button (needs a fix. after clicking again it becomes hidden.)
// function showComm() {
//   var element = document.getElementById("loadCom");
//   if (element.classList.contains('hidden') == true) {
//     element.classList.toggle('hidden');
//   }
// }

//DISQUS
function loadDisqus() {
  var disqus_config = function () {
    this.page.identifier = pageURL; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    console.log(this.page.identifier);
  };

  (function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.src = 'https://randommifflin.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
  })();
};
//DISQUS


// function showDisqus(){
//   var element = document.getElementById("disqus_thread");
//   if (element.classList.contains('hidden') == true) {
//     element.classList.remove('hidden');
//     document.getElementById('loadComments').innerHTML = 'Hide Comments';
//   } else {
//     element.classList.add('hidden')
//     document.getElementById('loadComments').innerHTML = 'Show Comments';
//   }
// }
  //Change Page Title // DONE
function changeTitle(){
  var pageTitle = 'Random Mifflin | ' + 'Season ' + seasonNo + ' Episode ' + episodeNo;
  document.title = pageTitle;
  console.log(pageTitle);
}
//Change Page Title

//change page URL
function changeURL(){
  history.pushState(null, '', '?' + 's=' + seasonNo + '&' + 'e=' + episodeNo);
  pageURL = '?' + 's=' + seasonNo + '&' + 'e=' + episodeNo;
}
//change page URL
