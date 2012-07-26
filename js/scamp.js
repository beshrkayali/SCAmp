function PlaylistsController($scope){
	
	// init playlists
	$scope.playlists = [];

	if (localStorage['playlists']){
		$scope.playlists = JSON.parse(localStorage['playlists'])
	}else{
		// if there's nothing saved, load some dummy data
		$scope.playlists = dummy_data;
	}

	

	// return total number of playlists
	$scope.getTotalPlaylists = function(){
		return $scope.playlists.length;
	}

	// return total number of tracks in all playlists, with the help of underscore
	$scope.getTotalTracks = function(){
		return _.flatten(_.pluck($scope.playlists, 'tracks'))
	}

	// return the currently selected playlist
	$scope.getCurrentPlaylist = function(){
		return _.filter($scope.playlists, function(playlist){
			return playlist.selected;
		})[0]
	}

	// select a playlist
	$scope.selectPlaylist = function(playlist){

		// Show TracksList container if it's hidden
		$('section#main').css({'visibility':'visible'});

		// unselect any selected playlists
		selected = _.filter($scope.playlists, function(playlist){return playlist.selected;})
		if(selected.length){
			selected[0].selected = false;
		}

		// select our new playlist
		playlist.selected = true;
	}

	

	// play/pause a track
	$scope.toggleTrack = function(track){
		
		// if action is "Play"
		if (track.action == 'Play'){

			// load SC widget
			widget.load(track.url, {
			  show_artwork: false,
			  auto_play:true,
			  show_comments:false,
			  buying:false,
			  liking:false,
			  sharing:false,
			  show_playcount:false,
			  show_user:false,
			});

			// if there's any other track that is playing, turn it off
			anything_playing = _.filter($scope.getTotalTracks(), function(track){return track.action=='Stop'})
			
			if (anything_playing.length){
				anything_playing[0].action='Play';
				anything_playing[0].status='';
			}

			// set the new track to "Playing" mode
			track.action = 'Stop';
			track.status = 'playing';

			// Show the Player
			$('#scplayer').fadeIn();


		} else if (track.action == 'Stop'){ // if the action is "Stop"
			
			// Puase the widget
			widget.pause();

			// Set track to Stopped
			track.action = 'Play';
			track.status = '';

			// Hide the Player
			$('#scplayer').fadeOut();
		}
	}

	// Play a playlist
	$scope.playAllTracks = function(){

		// Get the currently selected playlist
		playlist = $scope.getCurrentPlaylist();	 
		
		// Play the first track in the playlist (currentTrack is inited with 0 always)
		$scope.toggleTrack(playlist.tracks[playlist.currentTrack]);

		// When the player finishes playing, skip the track
		widget.bind(SC.Widget.Events.FINISH, function() {
			$scope.$apply($scope.skipTrack(playlist));
		});
		

	}

	// Skip a track
	$scope.skipTrack = function(playlist){
		
		// Increment currentTrack by 1 (next track)
		playlist.currentTrack = playlist.currentTrack + 1;
		
		// Play currentTrack
		$scope.toggleTrack(playlist.tracks[playlist.currentTrack]);	

		// If last track, reset to -1
		if (playlist.currentTrack == playlist.tracks.length-1){
			$scope.getCurrentPlaylist().currentTrack  = -1;
		}
	}

	// Create a new track
	$scope.addTrack = function(){
		playlist = $scope.getCurrentPlaylist();	 


		url = '';
		// try to get URL via SC API Resolve call

		// Start loader
		$('#new-track-form .loader').fadeIn();
	

		$.ajax({url:'http://api.soundcloud.com/resolve.json',
				type:'GET',
				dataType:'jsonp',
				data:{'url':$scope.formTrackURL, 'client_id':CLIENT_ID},
			    success:function(data){
			    	if(data['kind'] == 'track'){
						
						url = newWidgetUrl + data['id'];

						
						// nudge angular to apply changes on scope
						$scope.$apply(function(){
							// Add track to Playlist
							playlist.tracks.push({'action':'Play', 'title':$scope.formTrackTitle, 'url':url});
							// Empty fields
							$scope.formTrackTitle = ''; $scope.formTrackURL = '';
						});

						// Hide form
						$('#new-track-form .loader').hide();
						$('#new-track-form').fadeOut();
					}
			    },
			    error: function(xhr, textStatus, errorThrown) {
			        alert(errorThrown);
			        // Hide form
					$('#new-track-form .loader').hide();
					$('#new-track-form').fadeOut();
			    }
			});

	}

	// Edit a track
	$scope.editTrack = function(track){
		newTitle = prompt('Edit Track Title: ', track.title);
		if(newTitle){
			track.title = newTitle;
		}
	}

	// Delete a track
	$scope.deleteTrack = function(track){
		if(confirm('Are you sure you want to delete "' + track.title + '"?')){
			// Remove track from playlist.tracks array
			$scope.getCurrentPlaylist().tracks = _.without($scope.getCurrentPlaylist().tracks, track)
		}
	}

	// Create a new playlist
	$scope.addPlaylist = function(){

		// Show TracksList container if it's hidden
		$('section#main').css({'visibility':'visible'});

		// Unselect any selected playlists
		selected = _.filter($scope.playlists, function(playlist){return playlist.selected;})
		if(selected.length){
			selected[0].selected = false;
		}

		// Create playlit and select it
		playlist = $scope.playlists.push({'tracks':[], 'name':$scope.formPlaylistName, 'description':$scope.formPlaylistDesc, 'selected':true,})
		// Reset fields
		$scope.formPlaylistName = ''; $scope.formPlaylistDesc = '';

		// Hide playlist form
		$('#new-playlist-form').fadeOut();
		
	}

	// Edit Playlist Title
	$scope.editPlaylistTitle = function(){
		playlist = $scope.getCurrentPlaylist();
		newTitle = prompt('Edit Playlist Title: ', playlist.name);
		if(newTitle){
			playlist.name = newTitle;
		}
	}


	// Edit Playlist Description
	$scope.editPlaylistDesc = function(){
		playlist = $scope.getCurrentPlaylist();
		newDesc = prompt('Edit Playlist Description: ', playlist.description);
		if(newDesc){
			playlist.description = newDesc;
		}
	}

	// Delete a Playlist
	$scope.deletePlaylist = function(){
		playlist = $scope.getCurrentPlaylist();
		playlist.selected=false;
		if(confirm('Are you sure you want to delete "' + playlist.name + '"?')){
			// Remove playlist from playlists
			$scope.playlists = _.without($scope.playlists, playlist)

			// Fade tracks list because nothing is selected
			$('section#main').css({'visibility':'hidden'});
		}
	}


	$scope.saveLocalStorage = function(){
		localStorage['playlists']=JSON.stringify($scope.playlists);
		alert('Saved!')
	}

	$scope.resetSampleData = function(){
		$scope.playlists = dummy_data;
		localStorage['playlists']=JSON.stringify($scope.playlists);
	}

}