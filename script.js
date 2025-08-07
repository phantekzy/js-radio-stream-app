// ======================= DOM Elements =======================
const searchInput = document.getElementById('search-bar');
const clearBtn = document.getElementById('clear-btn');
const searchIcon = document.getElementById('search-icon');
const menuToggle = document.querySelector('.menu-toggle');
const categoriesNav = document.querySelector('.categories-nav');
const tabButtons = document.querySelectorAll('button[data-category]');
const tabContents = document.querySelectorAll('.tab-content');
const slideMenu = document.getElementById('slide-menu')
const closeBtn = document.getElementById('close-menu')

const topCarousel = document.getElementById('top-carousel');
const trendingCarousel = document.getElementById('trending-carousel');
const votedCarousel = document.getElementById('voted-carousel');
const addedCarousel = document.getElementById('added-carousel');
const podcastCarousel = document.getElementById('podcast-carousel');

// ======================= Current Audio (Only one plays at a time) =======================
let currentAudio = null;


// ======================= Create Station Card Function =======================
function createStationCard(station) {
	const card = document.createElement('div');
	card.classList.add('station-card');

	// Use fallback image if favicon is missing
	const imgSrc = station.favicon && station.favicon !== 'null' ? station.favicon : 'img/radio.jpg';

	card.innerHTML = `
		<img class="station-img" src="${imgSrc}" alt="${station.name}" onerror="this.onerror=null;this.src='img/radio.jpg';">
		<div class="station-name">${station.name}</div>
		<button class="play-btn"><i class='fa fa-play'></i></button>
		<audio src="${station.url_resolved}" preload="none"></audio>
	`;

	const playBtn = card.querySelector('.play-btn');
	const audio = card.querySelector('audio');
	const icon = playBtn.querySelector('i');

	playBtn.addEventListener('click', () => {
		// Pause previous audio if another station is playing
		if (currentAudio && currentAudio !== audio) {
			currentAudio.pause();
			const prevCard = currentAudio.closest('.station-card');
			if (prevCard) {
				const prevIcon = prevCard.querySelector('.play-btn i');
				if (prevIcon) prevIcon.classList.replace('fa-pause', 'fa-play');
			}
		}

		// Toggle play/pause
		if (audio.paused) {
			audio.play().catch(err => {
				console.error('Radio not working :', err);
				icon.classList.replace('fa-pause', 'fa-play');
				return;
			});
			icon.classList.replace('fa-play', 'fa-pause');
			currentAudio = audio;
		} else {
			audio.pause();
			icon.classList.replace('fa-pause', 'fa-play');
			if (currentAudio === audio) currentAudio = null;
		}
	});

	return card;
}


// ======================= Fetch & Load Functions =======================

// Top clicked stations
async function loadTopStations() {
	try {
		const res = await fetch('https://de1.api.radio-browser.info/json/stations/topclick/100');
		const data = await res.json();
		topCarousel.innerHTML = '';
		data.forEach(station => topCarousel.appendChild(createStationCard(station)));
	} catch (error) {
		console.error('Failed to load top stations:', error);
	}
}

// Last clicked (trending)
async function loadTrendingStations() {
	try {
		const res = await fetch('https://de1.api.radio-browser.info/json/stations/lastclick/100');
		const data = await res.json();
		trendingCarousel.innerHTML = '';
		data.forEach(station => trendingCarousel.appendChild(createStationCard(station)));
	} catch (error) {
		console.error('Failed to load trending stations:', error);
	}
}

// Most voted
async function loadTopVotedStations() {
	const res = await fetch('https://de1.api.radio-browser.info/json/stations/topvote/100');
	const data = await res.json();
	votedCarousel.innerHTML = '';
	data.forEach(station => votedCarousel.appendChild(createStationCard(station)));
}

// Recently added
async function loadRecentlyAddedStations() {
	const res = await fetch('https://de1.api.radio-browser.info/json/stations/lastchange/100');
	const data = await res.json();
	addedCarousel.innerHTML = '';
	data.forEach(station => addedCarousel.appendChild(createStationCard(station)));
}

// Podcasts by tag
async function loadTopPodcasts() {
	const res = await fetch('https://de1.api.radio-browser.info/json/stations/bytag/podcast');
	const data = await res.json();
	podcastCarousel.innerHTML = '';
	data.forEach(station => podcastCarousel.appendChild(createStationCard(station)));
}


// ======================= Event Listeners =======================

// Tab category switching (e.g. All, Top, Voted, etc.)
tabButtons.forEach(btn => {
	btn.addEventListener('click', () => {
		tabButtons.forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const selectedCategory = btn.dataset.category;

		// Show only selected category
		if (selectedCategory === 'all') {
			tabContents.forEach(c => c.style.display = 'block');
			document.querySelectorAll('.carousel').forEach(c => c.classList.remove('list-view'));
		} else {
			tabContents.forEach(c => c.style.display = 'none');
			document.getElementById(selectedCategory).style.display = 'block';
			document.querySelectorAll('.carousel').forEach(c => c.classList.add('list-view'));
		}

		// Show corresponding paragraph
		document.querySelectorAll('p[data-para]').forEach(p => p.style.display = 'none');
		const para = document.querySelector(`p[data-para="${selectedCategory}"]`);
		if (para) para.style.display = 'block';
	});
});

// Clear search input
clearBtn.addEventListener('click', () => {
	searchInput.value = '';
	searchInput.placeholder = '';
	searchInput.focus();
	clearBtn.style.display = 'none';
	searchIcon.style.color = '#00e676';

	document.getElementById('search-results').style.display = 'none';
	document.getElementById('search-carousel').innerHTML = '';
	document.getElementById('search-status').textContent = 'Enter the radio you want to listen to...';

	tabContents.forEach(content => content.style.display = 'block');
});

// Show/hide clear button based on input
searchInput.addEventListener('input', () => {
	clearBtn.style.display = searchInput.value ? 'block' : 'none';
	searchIcon.style.color = '#fff';
	clearBtn.style.color = '#fff';
});


// ======================= Live Search =======================

searchInput.addEventListener('input', async () => {
	const query = searchInput.value.trim().toLowerCase();
	const resultsContainer = document.getElementById('search-results');
	const resultsCarousel = document.getElementById('search-carousel');
	const searchStatus = document.getElementById('search-status');

	// If empty, show default carousels
	if (!query) {
		resultsContainer.style.display = 'none';
		tabContents.forEach(content => content.style.display = 'block');
		return;
	}

	// Start searching
	tabContents.forEach(content => content.style.display = 'none');
	resultsContainer.style.display = 'block';
	searchStatus.textContent = 'Searching Radios';
	resultsCarousel.innerHTML = '';

	try {
		const apiUrl = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=20`;
		const res = await fetch(apiUrl);
		if (!res.ok) throw new Error('Network Error');
		const data = await res.json();

		if (data.length === 0) {
			searchStatus.textContent = 'Radio not found';
		} else {
			searchStatus.textContent = '';
			data.forEach(station => resultsCarousel.appendChild(createStationCard(station)));
		}
	} catch (error) {
		searchStatus.textContent = 'Sorry we cannot find your favorite radio';
		resultsCarousel.innerHTML = '';
	}
});


// ========== Mobile Menu Toggle ==========
menuToggle.addEventListener('click',() => {
	slideMenu.classList.add('active')
})

closeBtn.addEventListener('click',() => {
	slideMenu.classList.remove('active')
})

// Close the menu when a link is clicked
	slideMenu.querySelectorAll('a').forEach(link => {
		link.addEventListener('click',() => {
		slideMenu.classList.remove('active')
		})
	})


// ======================= Initial Load =======================
loadTopStations();
loadTrendingStations();
loadTopVotedStations();
loadRecentlyAddedStations();
loadTopPodcasts();

