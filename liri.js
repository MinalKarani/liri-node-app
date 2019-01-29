//load required npm packages
require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys=require('./keys.js');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var axios = require("axios");
var fs = require("fs");

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the Command name and Search text
var cmdName=process.argv[2];

var searchText = "";
var artists=[];

// Loop through all the words in the node argument to get searchText
for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {
    searchText = searchText + "+" + nodeArgs[i];
  }
  else {
    searchText += nodeArgs[i];

  }
}
LiriThis();
function logtoFile(text)
{
    fs.appendFile("log.txt", text, function(err) {

        // If an error was experienced we will log it.
        if (err) {
          console.log(err);
        }
      
      });
}

function concertThis()
{
    axios.get("https://rest.bandsintown.com/artists/" + searchText + "/events?app_id=codingbootcamp").then(
        function(response) {
            
            if(response.data.length>0)
            {
                for (i=0; i<response.data.length;i++)
                {
                    
                    var bandResult='========================='+'\r\n'+'Venue name: '+response.data[i].venue.name+'\r\n'+'At: '+response.data[i].venue.city+', '+
                    response.data[i].venue.region+', '+response.data[i].venue.country+'\r\n'+moment(response.data[i].datetime).format('MM-DD-YYYY')
                    +'\r\n'+'========================='+'\r\n';
                    console.log(bandResult);
                    logtoFile(bandResult);
                    
                }
            }
            else{
                var bandResult='========================='+'\r\n'+'Sorry, Bandsintown could not find information, please try again!'+'\r\n'+'========================='+'\r\n';
                console.log(bandResult);
                logtoFile(bandResult);
            }
                
        })
        .catch(function(err) {
            var bandResult='========================='+'\r\n'+'Sorry, Bandsintown could not find information, please try again!'+'\r\n'+'========================='+'\r\n';
            console.log(bandResult);
            logtoFile(bandResult);
        });
        
}

function spotifyThis()
{
    //If no song is provided then program will default to "The Sign" by Ace of Base.
    if(searchText==="")
    searchText="The Sign Ace of Base";

    spotify
    .search({ type: 'track', query: searchText })
    .then(function(data) {
           
        for (var j = 0; j < data.tracks.items[0].artists.length; j++) 
        {
            //console.log("artist: "+data.tracks.items[0].album.artists[j].name);
            artists.push(data.tracks.items[0].album.artists[j].name);
        }
        
        
        var artistResult='============================='+ '\r\n'+'Artist:'+artists+
        '\r\n'+'Song: '+data.tracks.items[0].name+'\r\n'+'Preview link: '+data.tracks.items[0].preview_url+'\r\n'+
        'Album: '+data.tracks.items[0].album.name+'\r\n'+'========================='+'\r\n';
        console.log(artistResult); 
        logtoFile(artistResult);
 
            
    })
    .catch(function(err) {

        var artistResult='========================='+'\r\n'+'Sorry, Spotify could not find information about the title, please try again!'+'\r\n'+'========================='+'\r\n';
        console.log(artistResult); 
        logtoFile(artistResult);
        
    });
   
}

function movieThis()
{
    //If no movie is provided then program will default to "Mr Nobody".
    if(searchText==="")
    searchText='Mr. Nobody.';
    var queryURL="http://www.omdbapi.com/?t=" + searchText +"&y=&plot=short&apikey=trilogy";
    axios.get(queryURL).then(
        function(response) {
            
                var movieResult='========================='+'\r\n'+'Title: '+response.data.Title+','+'\r\n'+'Year: '+response.data.Year+', '+'\r\n'+'IMDB Rating: '+
                response.data.imdbRating+', '+'\r\n'+ 'Rotten Tomatoes Rating: ' + response.data.Ratings[0].Value + ','+'\r\n' + 'Country: ' + response.data.Country
                +','+'\r\n'+ 'Language: ' + response.data.Language +','+'\r\n'+'Plot: ' + response.data.Plot +','+'\r\n'+ 'Actors: ' + response.data.Actors +'\r\n'+'========================='+'\r\n';
                
                console.log(movieResult);
                logtoFile(movieResult);
                           
        })
        .catch(function(err) {
            
            var movieResult='========================='+'\r\n'+'Sorry, OMDB could not find information about the movie title, please try again!'+'\r\n'+'========================='+'\r\n';
            console.log(movieResult);
            logtoFile(movieResult);

        });
        
}

function LiriThis()
{
        var liriInstruction=cmdName + " " + searchText + "\r\n";
        logtoFile(liriInstruction);
        //This will search the Bands in Town Artist Events API for an artist and render 'Name of the venue','Venue location' and 'Date of the Event' about each event
        if(cmdName==="concert-this")
        {
            concertThis();
        }


        //retrieve song information (like Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from) from the Spotify API 
        if(cmdName==="spotify-this-song")
        {
            spotifyThis();
        }

        //This will search the OMDB API for the movie and render Title of the movie,Year the movie came out,IMDB Rating of the movie,Rotten Tomatoes Rating of the movie,Country where the movie was produced,Language of the movie,Plot of the movie,Actors in the movie.
        if(cmdName==="movie-this")
        {
            movieThis();
        }
}

if(cmdName==="do-what-it-says")
{
//LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands
fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // We will then print the contents of data
    
    var dataArr=data.split(",");
    cmdName=dataArr[0];
    searchText=dataArr[1];
    
    LiriThis();

})
}
