/*
document.addEventListener("DOMContentLoaded", function(event) {
*/
$(document).ready(function() {

	//template function
	/*
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
	*/
	var addSongsToList = function (songList) {
		var songListEl = $("#song-list");
		songListEl.empty();
		$.each(songList, function(key, value){
			var el = $("<li/>")
				.html(value.name)
				.attr("id",key)
				.addClass("list-group-item")
				.click(onItemClick)
				.appendTo(songListEl);

			//alternatively
			/*
				$("<li/>", {
					id: key,
					text: value.name,
					class: "list-group-item"
				})
				.click( onItemClick )
				.appendTo(songListEl);
			*/
		})
	}

	var onItemClick = function (clickEvent) {
		var song = SONGLIST[clickEvent.target.id];
		playSong(song);
		displaySongInfo(song);
		displayAsActive(clickEvent.target);
	}

	/*
	var displayAsActive = function (newActive) {
		var children = document.querySelector("#song-list").children;
		Array.prototype.forEach.call(children,function(item){
			item.classList.remove("active");
		});
		newActive.classList.add("active");
	}
	*/
	var displayAsActive = function (newActive) {
		$(newActive)
			.addClass("active")
			.siblings()
			.removeClass("active");
		//alt
		/*

		$("#song-list")
			.children()
			.removeClass("active");
		$(newActive).addClass("active");

		*/
	}

	/*
	var playSong = function (song) {
		PLAYER = document.querySelector("#player");
		var track = document.createElement('source');
		track.src = song.src;
		PLAYER.innerHTML = "";//clear old <source> tag
		PLAYER.appendChild(track); //add new source
		PLAYER.load();//reloads the player
		PLAYER.play();
	}
	*/
	var playSong = function (song) {
		var player = $("#player")[0];
		var songSource = $("<source/>", {
			src: song.src
		});
		$(player)
			.empty()
			.append(songSource);

		player.load();
		player.play();
		//alt
		/*
		var player = $("#player")[0];
		$(player)
			.empty()
			.append('<source src=" + song.src + " />');
		player.load();
		player.play();
		 */
	}

	/*
	var displaySongInfo = function (song) {
		document.querySelector("#song-name").innerHTML = song.name;
		document.querySelector("#song-artist").innerHTML = song.artist;
		document.querySelector("#song-url").innerHTML = song.src;
		document.querySelector("#song-description").innerHTML = song.info;
	}
	*/
	var displaySongInfo = function (song) {
		$("#song-name").html(song.name);
		$("#song-artist").html(song.artist);
		$("#song-url").html(song.src);
		$("#song-description").html(song.info);
		$("#song-remove").show();
	}

	/*
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
	*/

	var loadContent = function () {
		$.ajax({
			dataType: "json",
			url: "songs.json",
			success: function (data) {
				SONGLIST = data;
				addSongsToList(SONGLIST);
			}
		});
	}
	loadContent();
	//same as
	/*
	$.getJSON('song.json', function () { .. });
	 */

	/* code for second session */
	$("#song-remove").click(function(){
		var song = $("#song-list .active")[0];
		if(!song)
			return false;

		$.ajax({
			dataType: "json",
			url: "removesong.php",
			method: "POST",
			data: {
				song_id: song.id
			}
		}).success(function(data) {
			if(!data.success)
				return false;

			loadContent()
			displaySongInfo({
				"name": "",
				"src": "",
				"artist": "",
				"info": ""
			});
			$("#song-remove").hide();
		});
	});
	$("#song-remove").hide();
});
