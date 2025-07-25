// Matrix Intro Variables
let matrixCanvas, matrixCtx;
let matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
let matrixColumns = [];
let matrixDrops = [];

// Initialize Matrix Effect
function initMatrix() {
    matrixCanvas = document.getElementById('matrix-canvas');
    matrixCtx = matrixCanvas.getContext('2d');
    
    // Set canvas size
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    
    // Initialize drops array
    for (let i = 0; i < columns; i++) {
        matrixDrops[i] = Math.floor(Math.random() * matrixCanvas.height / fontSize);
    }
    
    drawMatrix();
}

function drawMatrix() {
    // Black background with fade effect
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = '#00ff00';
    matrixCtx.font = '14px monospace';
    
    for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        matrixCtx.fillText(text, i * 14, matrixDrops[i] * 14);
        
        if (matrixDrops[i] * 14 > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
}

// Matrix Text Animation
function animateMatrixText() {
    const matrixText = document.getElementById('matrix-text');
    const originalText = 'NOIRHYTHM';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let iterations = 0;
    
    const interval = setInterval(() => {
        matrixText.innerHTML = originalText
            .split('')
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
        }
        
        iterations += 1 / 3;
    }, 30);
}

// Start Matrix Intro
function startMatrixIntro() {
    initMatrix();
    
    // Start matrix rain animation
    const matrixInterval = setInterval(() => {
        drawMatrix();
    }, 33);
    
    // Start text animation after a short delay
    setTimeout(() => {
        animateMatrixText();
    }, 500);
    
    // Transition to main app after 3 seconds
    setTimeout(() => {
        const matrixIntro = document.getElementById('matrix-intro');
        const mainApp = document.getElementById('main-app');
        
        // Fade out intro
        matrixIntro.classList.add('fade-out');
        
        // Clear matrix animation
        clearInterval(matrixInterval);
        
        // Show main app after fade out
        setTimeout(() => {
            matrixIntro.style.display = 'none';
            mainApp.style.display = 'flex';
            
            // Trigger smooth entrance animation
            setTimeout(() => {
                mainApp.classList.add('show');
            }, 50);
            
            // Initialize main app
            main();
        }, 800);
    }, 3000);
}

// Resize handler for matrix canvas
window.addEventListener('resize', () => {
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
});

// Original Music Player Code
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
    
    // Use relative path instead of localhost
    let a = await fetch(`./${folder}/`)
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

    // Use relative path for audio source
    currentsong.src = `./${currfolder}/` + encodeURIComponent(rawTrack);

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

function openMobileMenu() {
    const leftPanel = document.querySelector(".left");
    leftPanel.classList.add("show");
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMobileMenu() {
    const leftPanel = document.querySelector(".left");
    leftPanel.classList.remove("show");
    document.body.style.overflow = 'auto'; // Restore background scrolling
}

async function main(){
    // Get list of all songs
    try {
        await getsongs("songs/hindi")
        playmusic(songs[0], true)
        console.log("First song loaded:", songs[0])
    } catch (error) {
        console.error("Error loading songs:", error)
        // Fallback: Set up empty songs array and continue with other functionality
        songs = []
    }

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
    
    // Event listener for hamburger menu - TOGGLE functionality
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        e.stopPropagation();
        const leftPanel = document.querySelector(".left");
        
        console.log("Hamburger clicked"); // Debug log
        
        if (leftPanel.classList.contains("show")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    })
    
    // Event listener for close button
    document.querySelector(".close").addEventListener("click", (e) => {
        e.stopPropagation();
        closeMobileMenu();
    })
    
    // Close mobile menu when clicking on the overlay/background
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
            try {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                playmusic(songs[0])
                
                // Close mobile menu after selecting playlist
                if (window.innerWidth <= 1199) {
                    closeMobileMenu();
                }
            } catch (error) {
                console.error("Error loading playlist:", error)
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

// Start the matrix intro when page loads
window.addEventListener('load', () => {
    startMatrixIntro();
});
