<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.landing-page {
font-family: 'Poppins', sans-serif;
color: #333;
}

/* Header Styling */
header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 20px;
background-color: white;
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 1000;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
display: flex;
align-items: center;
justify-content: flex-start;
}

.logo-image {
max-height: 35px;
margin-right: 10px;
}

.logo-text {
font-size: 20px;
font-weight: bold;
color: black;
}

.center-nav {
flex-grow: 1;
text-align: center;
}

/* Navigation Links */
nav ul {
display: flex;
justify-content: center;
list-style-type: none;
padding: 0;
gap: 20px;
}

nav ul li {
position: relative;
font-size: 18px;
color: #155861;
cursor: pointer;
transition: color 0.3s ease;
}

nav ul li a {
color: #155861;
text-decoration: none;
transition: color 0.3s ease;
}

nav ul li.active a {
color: #333;
}

/* Underline Effect on Hover and Active State */
nav ul li::after {
content: '';
position: absolute;
bottom: -5px;
left: 50%;
transform: translateX(-50%);
width: 0;
height: 3px;
background-color: #155861;
transition: width 0.3s ease;
}

nav ul li:hover::after {
width: 100%;
}

nav ul li.active::after {
width: 100%;
}

/* Change text color on hover */
nav ul li:hover a {
color: #333;
}

/* Auth Buttons */
.auth-buttons {
display: flex;
align-items: center;
gap: 20px;
}

.sign-in, .sign-up {
font-family: 'Poppins', sans-serif;
padding: 5px 15px;
font-size: 18px;
border-radius: 5px;
cursor: pointer;
}

.sign-in {
background-color: transparent;
border: 2px solid #155861;
color: #155861;
}

.sign-in:hover {
background-color: #155861;
color: white;
}

.sign-up {
background-color: transparent;
border: 2px solid #155861;
color: #155861;
}

.sign-up:hover {
background-color: #155861;
color: white;
}

/* Hero Section */
.hero {
background-image: url('/src/img/heroBg.jpg');
background-size: cover;
background-position: center;
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
color: white;
padding: 0 20px;
}

.hero h1 {
font-size: 50px; 
margin-bottom: 20px;
}

.hero p {
font-size: 20px; 
margin-bottom: 40px;
}

/* Search Bar */
.search-bar {
position: relative;
display: flex;
max-width: 500px;
width: 100%;
}

/* Search Input */
.search-bar input {
font-family: 'Poppins', sans-serif;
flex-grow: 1;
padding: 10px 15px;
font-size: 16px;
border: 1px solid #ccc;
border-right: none;
border-radius: 4px 0 0 4px;
outline: none;
}

/* Search Button */
.search-bar button {
padding: 10px 15px;
font-size: 16px;
background-color: #64b8b1;
color: white;
border: none;
border-radius: 0 4px 4px 0;
cursor: pointer;
}

.search-bar button:hover {
background-color: #2c3e50;
}

/* Dropdown Menu */
.dropdown {
position: absolute;
top: 100%; /* Position below the input */
left: 0;
width: 100%; /* Full width to match the search bar */
margin-top: 5px;
list-style-type: none;
background-color: #ffffff;
border: 1px solid #ddd;
border-radius: 0 0 4px 4px;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
z-index: 1000;
padding: 0;
overflow: hidden;
}


/* Dropdown List Items */
.dropdown li {
padding: 15px;
font-size: 16px;
color: #333;
text-align: center;
border-bottom: 1px solid #ddd;
transition: background-color 0.2s;
}

.dropdown li:hover {
background-color: #eee;
}

/* Remove bottom border for the last item */
.dropdown li:last-child {
border-bottom: none;
}




/* Tabs Styling */
.tabs {
display: flex;
justify-content: center;
margin: 20px 0;
gap: 20px;
}

.tabs span {
cursor: pointer;
padding: 10px 20px;
font-size: 18px;
font-weight: 500;
color: #555;
}

.tabs span.active {
font-weight: bold;
color: #000;
border-bottom: 2px solid #000;
}

/* Gallery Styling */

/* Center the title inside content-gallery */
.content-gallery h2 {
text-align: center;
font-size: 4em; /* Adjust font size as needed */
margin: 20px 0; /* Add margin for spacing */
font-weight: bold;
color: #333; /* Adjust color as needed */
}

.gallery-container {
display: flex;
gap: 20px;
justify-content: center;
padding: 20px;
position: relative; /* Needed for arrow positioning */
max-width: 100%;
margin: 0 auto;
overflow: hidden;
}

.content-gallery {
background-color: #ffffff;

}

.gallery-item {
position: relative;
width: 400px;
height: 300px;
border-radius: 10px;
overflow: hidden;
transition: transform 0.3s ease;
}

.gallery-item img {
width: 100%;
height: 100%;
object-fit: cover;
transition: transform 0.3s ease;
}

.gallery-item:hover {
transform: scale(1.05);
}

.gallery-item .overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.6);
color: #f9f9f9;
display: flex;
align-items: center;
justify-content: center;
opacity: 0;
transition: opacity 0.3s ease;
text-align: center;
padding: 25px;
box-sizing: border-box;
flex-direction: column;
font-size: 1.1em; /* Increased font size for overlay text */
}

.gallery-item:hover .overlay {
opacity: 1;
}

.overlay h1 {
font-size: 24px;
margin: 0;
}

.overlay p {
font-size: 18px;
margin: 5px 0 0;
}





.about-us {
text-align: center;
padding: 60px 20px;
background-color: #f9f9f9;
}

.about-us h2 {
font-size: 45px;
margin-bottom: 20px;
color: #333;
}

.about-description {
font-size: 20px;
color: #666;
max-width: 1000px;
margin: 0 auto 40px;
line-height: 1.6;
}

.about-wrapper {
display: flex;
justify-content: space-between;
align-items: center;
max-width: 1400px;
margin: 0 auto;
gap: 40px;
}

.about-image {
flex: 1;
display: flex;
justify-content: center;
}

.about-image img {
max-width: 100%;
height: auto;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mission-vision-wrapper {
flex: 1;
display: flex;
flex-direction: column;
gap: 20px;
}


/* Hover Card Style for Mission and Vision */
.hover-card {
padding: 20px;
background-color: #d0e7e4; /* Light teal background */
border-radius: 8px;
transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-card:hover {
transform: translateY(-10px);
background-color: #b3d1ce;
box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.mission-section h3, .vision-section h3 {
font-size: 24px;
color: #155861;
margin-bottom: 10px;
text-align: left;
}

.mission-section p, .vision-section p {
font-size: 16px;
color: #333;
line-height: 1.6;
text-align: left;
margin: 0;
}


/* Hover Card Style for Mission and Vision */
.hover-card {
padding: 20px;
background-color: #d0e7e4;
border-radius: 8px;
transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-card:hover {
transform: translateY(-10px);
background-color: #b3d1ce;
box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

/* Trusted Section */
.trusted-section {
display: flex;
padding: 50px;
background-color: white;
}

.image-container img {
width: 100%;
height: auto;
border-radius: 10px;
}

.text-content {
flex: 1;
}

.text-content h2 {
font-size: 36px;
margin-bottom: 20px;
}

.explore-section {
padding: 50px 20px;
background-color: #f4f4f4;
text-align: center;
}

.explore-section h2 {
font-size: 3em;
margin-bottom: 50px;
margin-top: 40px;
color: #333;
}

.explore-description p {
font-size: 1.3rem;
color: #555;
line-height: 1.6;
max-width: 1450px;
margin: 0 auto 20px;
}

.footer {
font-family: 'Poppins', sans-serif;
background-color: #155861;
color: white;
padding: 15px 15px; 
margin-left: -10px ;
margin-right: -10px ;
} 

.footer-logo {
display: flex;
flex-direction: column;
align-items: flex-start;
}

.footer-logo-image {
max-width: 100px;
margin-bottom: 10px;
margin-top: 25px;
padding-top: 25px;
}

.footer-content {
display: flex;
flex-wrap: wrap;
justify-content: space-around; 
max-width: 1150px;
margin: 0 auto;
gap: 100px; 
padding-left: 10px;
padding-right: 10px;
}

.footer-section {
flex: 1;
min-width: 150px;
}

.footer-section h3 {
font-size: 20px;
margin-bottom: 20px; 
font-weight: 600;
}

.footer-section p,
.footer-section li {
font-size: 14px;
line-height: 1.8;
margin: 0;
padding-bottom: 5px; 
}

.footer-section ul {
list-style-type: none;
padding: 0;
}

.footer-section ul li {
margin-bottom: 2px;
}

.footer-section ul li a {
color: white;
text-decoration: none;
transition: color 0.3s ease;
}

.footer-section ul li a:hover {
color: #64b8b1;
}

.social-icons {
display: flex;
gap: 15px; 
margin-top: 20px; 
}

.social-icon {
display: inline-block;
width: 35px;
height: 35px;
background-color: white;
color: #155861;
text-align: center;
line-height: 35px;
border-radius: 50%;
font-size: 16px;
text-decoration: none;
transition: background-color 0.3s ease, color 0.3s ease;
}

.social-icon:hover {
background-color: #64b8b1;
color: white;
}

.footer-bottom {
text-align: center;
margin-top: 15px;
padding-top: 30px;
border-top: 1px solid rgba(255, 255, 255, 0.2);
font-size: 15px;
color: white 
}

/* Media Queries */
@media (max-width: 768px) {
header {
flex-direction: column;
padding: 20px;
}

nav ul {
margin-top: 20px;
}

.gallery-item {
flex: 0 0 100%;
}

.hero h1 {
font-size: 36px;
}

.about-wrapper {
flex-direction: column;
}

.about-us h2 {
font-size: 36px;
}

.about-description {
font-size: 18px;
}

.footer-content {
flex-direction: column;
}

.footer-section {
margin-bottom: 50px;
}

}

html {
scroll-behavior: smooth;
}
</style>