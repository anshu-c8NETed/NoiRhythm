# 🎵 NoiRhythm

**A personalized interactive and completely responsive music streaming web application that delivers a sleek and intuitive user interface designed to enhance your listening experience with clean and minimalist design.** 
          
  *Inspired by Spotify and YouTube Music*

## 🚀 Setup Instructions

### **Step 1: Organize Your Music Files**
1. Inside the `songs` folder, create or replace individual `playlists` folders with descriptive names (e.g., "Rock Classics", "Chill Vibes", "Workout Mix")
2. Inside the `img` folder, create or replace individual images `.jpg` 
3. For each playlist folder, add:
   - All songs belonging to that playlist
4. For each images folder, add:
   - All images with their specific names 

### **Step 2: Update HTML Cards**
1. Open your HTML file and locate the `<div class="card-container">` section
2. For each playlist card:
   - Update the `<img src="">` attribute with your cover image filename
   - Modify the `<div data-folder="">` attribute with your exact playlist folder name
3. **Important**: Ensure the folder names match exactly between your file system and HTML code

### **Step 3: Dynamic Loading**
The JavaScript code will automatically:
- Detect your playlist folders
- Load songs from each folder
- Display them in the corresponding cards

### **Step 4: Launch & Enjoy**
Your personal music streaming website is ready! Experience a sleek, ***Spotify-inspired interface*** with your own curated playlists.

> **Note:** 
> ```added hamburger functionality for other devices to improve responsiveness.```

## 🛠️ Technologies Used
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**


