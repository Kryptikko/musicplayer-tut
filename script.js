document.addEventListener("DOMContentLoaded", function(event) {
	//template function
	var addSongsToList = function (songList) {
		var songListEl = document.querySelector("#song-list");
		for(song in songList) {
			var item = songList[song]
			var listItemEl = document.createElement('li');
			listItemEl.innerHTML = `${item.name}`;
			listItemEl.id = song;
			listItemEl.classList.add('list-group-item');
			listItemEl.addEventListener('click', onItemClick);
			songListEl.appendChild(listItemEl);
		}
	}
	var onItemClick = function (clickEvent) {
		var song = SONGLIST[clickEvent.target.id];
		playSong(song);
		displaySongInfo(song);
		displayAsActive(clickEvent.target);
	}

	var displayAsActive = function (newActive) {
		var children = document.querySelector("#song-list").children;
		Array.prototype.forEach.call(children,function(item){
			item.classList.remove("active");
		});
		newActive.classList.add("active");
	}

	var playSong = function (song) {
		PLAYER = document.querySelector("#player");
		var track = document.createElement('source');
		track.src = song.src;
		PLAYER.innerHTML = "";//clear old <source> tag
		PLAYER.appendChild(track); //add new source
		PLAYER.load();//reloads the player
		PLAYER.play();
	}

	var displaySongInfo = function (song) {
		document.querySelector("#song-name").innerHTML = song.name;
		document.querySelector("#song-artist").innerHTML = song.artist;
		document.querySelector("#song-url").innerHTML = song.src;
		document.querySelector("#song-description").innerHTML = song.info;
	}

	var loadSongsRequest = new XMLHttpRequest();

	//we attach our response logic
	loadSongsRequest.onreadystatechange = function (responseEvent) {
		//check if we've recieved data succesfully
		if(loadSongsRequest.readyState == 4 && loadSongsRequest.status == 200) {
			//we turn the raw text we recieve in JavaScript Objects
			SONGLIST = JSON.parse(loadSongsRequest.responseText);
			//we feed those objects to our template function
			addSongsToList(SONGLIST);
		}
	}

	//configure the where the request is send
	loadSongsRequest.open('GET', 'songs.json', true);
	//send the request
	loadSongsRequest.send();
});
