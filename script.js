let currentsong = new Audio()
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for(let i=0;i<as.length;i++){
        const element = as[i]
        if(element.href.endsWith(".mp3")){
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]))
        }
    }
    
    // Show songs in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML+`<li> 
            <img class="invert" src ="svg/music.svg" alt="">
                <div class="info">
                <div>${decodeURIComponent(song).replace(/\.mp3$/i, "").trim()}</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                        <img class="invert" style="width: 26px;height: 26px;" src="svg/play.svg" alt="">
                </div>
        </li>`
    }
    
    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            // Close mobile menu after selecting a song
            if (window.innerWidth <= 1199) {
                closeMobileMenu();
            }
        })
    })
    return songs
}

const playmusic = (track, pause = false) => {
    // Ensure it has .mp3
    const rawTrack = track.trim().endsWith(".mp3") ? track.trim() : `${track.trim()}.mp3`;

    // Set the correct audio source
    currentsong.src = `/${currfolder}/` + encodeURIComponent(rawTrack);

    if (!pause) {
        currentsong.play();
        play.src = "svg/pause.svg";
    }

    // Update UI display
    const displayName = rawTrack.replace(/\.mp3$/i, "").trim();
    document.querySelector(".songinfo").innerHTML = displayName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Function to play the next song automatically
const playNextSong = () => {
    let currentTrack = decodeURIComponent(currentsong.src.split("/").slice(-1)[0]);
    let index = songs.indexOf(currentTrack);
    
    // Check if there's a next song in the playlist
    if ((index + 1) < songs.length) {
        playmusic(songs[index + 1]);
    } else {
        // Optional: Loop back to the first song when playlist ends
        // Uncomment the line below if you want the playlist to loop
        // playmusic(songs[0]);
        
        // Or just stop and reset play button
        play.src = "svg/play.svg";
        console.log("Playlist ended");
    }
}

// Enhanced mobile menu functions
function openMobileMenu() {
    const leftPanel = document.querySelector(".left");
    leftPanel.classList.add("show");
    document.body.style.overflow = 'hidden';
    
    // Add a small delay to ensure the animation works on mobile
    setTimeout(() => {
        leftPanel.style.transform = 'translateX(0)';
    }, 10);
}

function closeMobileMenu() {
    const leftPanel = document.querySelector(".left");
    leftPanel.classList.remove("show");
    document.body.style.overflow = 'auto';
    leftPanel.style.transform = '';
}

// Enhanced hamburger menu functionality for mobile
function setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const closeBtn = document.querySelector(".close");
    const leftPanel = document.querySelector(".left");
    
    // Add both click and touchstart events for better mobile support [[1](https://www.w3schools.com/howto/howto_js_mobile_navbar.asp)]
    function addMobileListeners(element, handler) {
        element.addEventListener("click", handler);
        element.addEventListener("touchstart", handler, { passive: true });
    }
    
    // Hamburger menu toggle with touch support [[2](https://dev.to/ljcdev/easy-hamburger-menu-with-js-2do0)]
    addMobileListeners(hamburger, (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (leftPanel.classList.contains("show")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close button with touch support
    addMobileListeners(closeBtn, (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
    
    // Enhanced click outside to close (mobile-friendly)
    document.addEventListener("touchstart", (e) => {
        if (window.innerWidth <= 1199 && 
            leftPanel.classList.contains("show") && 
            !leftPanel.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    }, { passive: true });
    
    // Prevent menu from closing when touching inside
    leftPanel.addEventListener("touchstart", (e) => {
        e.stopPropagation();
    }, { passive: true });
}

async function main(){
    // Get list of all songs
    await getsongs("songs/hindi")
    playmusic(songs[0], true)
    console.log("First song loaded:", songs[0])

    // Setup mobile menu functionality [[4](https://www.geeksforgeeks.org/html/how-to-create-hamburger-menu-for-mobile-devices/)]
    setupMobileMenu();

    // Attach eventlistener to play/pause
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "svg/pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "svg/play.svg"
        }
    })

    // For timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
    })
    
    // AUTO-PLAY FEATURE: Event listener for when song ends
    currentsong.addEventListener("ended", () => {
        console.log("Song ended, playing next song...");
        playNextSong();
    });
    
    // Event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    
    // Legacy click outside to close for desktop
    document.addEventListener("click", (e) => {
        const leftPanel = document.querySelector(".left");
        const hamburger = document.querySelector(".hamburger");
        
        // Only close if menu is open and click is outside the left panel and not on hamburger
        if (window.innerWidth <= 1199 && 
            leftPanel.classList.contains("show") && 
            !leftPanel.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Prevent clicks inside the left panel from closing the menu
    document.querySelector(".left").addEventListener("click", (e) => {
        e.stopPropagation();
    });
    
    // Event listener for previous and next
    previous.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentsong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentTrack);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentsong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentTrack);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
    });

    // Event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume",e.target.value)
        currentsong.volume = parseInt(e.target.value)/100
    })
    
    currentsong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML =
            `00:00 / ${secondsToMinutesSeconds(currentsong.duration)}`
    });

    // Load playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
            
            // Close mobile menu after selecting playlist
            if (window.innerWidth <= 1199) {
                closeMobileMenu();
            }
        })
    })
    
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("svg/volume.svg")){
            e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    
    // Handle window resize - close mobile menu if screen becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1199) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.innerWidth <= 1199) {
            closeMobileMenu();
        }
    });
}

main()
