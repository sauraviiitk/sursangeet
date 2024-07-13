console.log("hello js");
let songurl=[];
let currentAudio=null;
let playbtn2=document.querySelector("#play");
let formattedSongName;
let isplay=true;
function formatTime(seconds) {
    // Calculate whole minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Ensure both minutes and seconds are two digits
    let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    // Return formatted time in mm:ss format
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs() {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let text = await response.text(); // Get the response as text
    let div = document.createElement("div");
    div.innerHTML = text; // Create a temporary <div> to parse the HTML response
    let as = div.getElementsByTagName("a"); // Get all <a> elements from the response HTML
    console.log(as);

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) { // Check if the href ends with .mp3
            let songName = element.href.split("/songs/")[1]; // Extract the song name from the URL
            // Remove (PagalWorld.com.sb).mp3 from songName
            songName = songName.replace(/\(PagalWorld\.com\.sb\)\.mp3/g, '');
            songurl.push(element.href);
            songs.push({
                url: element.href,
                name: songName
            });
        }
    }

    return songs; // Return the array of song objects {url, name}
}

async function main() {
    
    let songs = await getsongs(); // Call getsongs() to fetch songs asynchronously
    console.log(songs);
    playbtn2.innerHTML='<i class="fa-solid fa-play"></i>';


    let songul = document.querySelector(".songs-card ul"); // Get the <ul> element inside .songs-card

    // Clear existing <li> elements if any
    // songul.innerHTML = '';

    for (let song of songs) {
         formattedSongName = song.name.replaceAll("%20", ' '); // Replace %20 with spaces

        // Create <li> element
        let li = document.createElement("li");
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.border = '1px solid black';
        li.style.alignItems = 'center';
        li.style.padding = '15px';
        li.style.cursor = 'pointer';
        li.style.boxShadow = '0px 0px 2px 0.5px';
        li.style.margin = '15px 0px';

        // Create song image div
        let songImgDiv = document.createElement("div");
        songImgDiv.style.padding='15px';
        songImgDiv.classList.add("songimg", "border1");
        songImgDiv.innerHTML = '<i class="fa-solid fa-music"></i>'; // You may replace this with actual image tag if needed
        li.appendChild(songImgDiv);

        // Create song info div
        let songInfoDiv = document.createElement("div");
        songInfoDiv.classList.add("songinfo");
        li.appendChild(songInfoDiv);

        // Create song name div
        let songNameDiv = document.createElement("div");
        songNameDiv.classList.add("songname");
        songNameDiv.textContent = formattedSongName;
        songInfoDiv.appendChild(songNameDiv);

        // Create play button div
        let playButtonDiv = document.createElement("div");
        playButtonDiv.style.padding='15px';
        playButtonDiv.classList.add("playsong", "border1");
        playButtonDiv.innerHTML = '<i class="fa-solid fa-play"></i>';
        li.appendChild(playButtonDiv);

        // Append <li> to <ul>
        songul.appendChild(li);
       
    }

    // Create an Audio element and play the first song in the list
//     var audio = new Audio(songs[0].url);
//    audio.play();




console.log(songurl);

Array.from(songul.getElementsByTagName("li")).forEach((li, index) => {
    li.addEventListener("click", () => {
        playsong(index); // Call playsong with the index of the clicked song
    });
});
async function playsong(index) {

    if (index >= 0 && index < songurl.length) {
        let audioUrl = songurl[index];
   

        if (currentAudio) {
            // Pause the current song if it's playing

            currentAudio.pause();



        }
       

        // Create new Audio element and play the selected song
        currentAudio = new Audio(audioUrl);
        formattedSongName = audioUrl.split("/songs/")[1].replaceAll("%20", ' ').replace(/\(PagalWorld\.com\.sb\)\.mp3/g, '');
        document.querySelector(".song-info").innerHTML = formattedSongName;
          document.querySelector(".song-time").innerText='00:00/00:00';
        await currentAudio.play();
        playbtn2.innerHTML='<i class="fa-solid fa-pause"></i>';

         


    }
    // listen for time update event
currentAudio.addEventListener("timeupdate",()=>{

   // console.log(currentAudio.currentTime,currentAudio.duration);
    document.querySelector(".song-time").innerHTML=`${formatTime(currentAudio.currentTime)}/
    ${formatTime(currentAudio.duration)}`;
    document.querySelector(".circle").style.left=(currentAudio.currentTime/currentAudio.duration)*100+"%";

});

}

playbtn2.addEventListener('click', () => {
    if (!currentAudio || currentAudio.paused) {
        // If no current audio or it's paused, play the current song or start from index 0
        if (!currentAudio) {
            playsong(0); // Start playing the first song if no current audio
        } else {
            currentAudio.play(); // Continue playing the current song
        }
        playbtn2.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Update button icon
    } else {
        // If audio is playing, pause it
        currentAudio.pause();
        playbtn2.innerHTML = '<i class="fa-solid fa-play"></i>'; // Update button icon
    }
});

document.querySelector(".seekbar").addEventListener("click",(e)=>{
   // console.log(e.target.getBoundingClientRect().width,e.offsetX);
   document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";
   currentAudio.currentTime=((currentAudio.duration)*(e.offsetX/e.target.getBoundingClientRect().width)*100)/100;


});
document.querySelector(".hamburger").addEventListener("click",()=>{
document.querySelector(".left").style.left=0+"%";
});

document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left=-100+"%";

});
let previous = document.querySelector("#prev");
let next = document.querySelector("#Next");

previous.addEventListener('click', () => {
    let currentIndex = songurl.indexOf(currentAudio.src);
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
        newIndex = currentIndex; // Wrap around to the last song if at the beginning
    }
    playsong(newIndex);
});

next.addEventListener('click', () => {
    let currentIndex = songurl.indexOf(currentAudio.src);
   // console.log(songurl.indexOf(currentAudio.src));
    let newIndex = currentIndex + 1;
    if (newIndex >= songurl.length) {
        newIndex = 0; // Wrap around to the first song if at the end
    }
    playsong(newIndex);
});





}



main(); // Call main() to start fetching songs and playing the first one
