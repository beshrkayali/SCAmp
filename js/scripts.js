// force cross-site scripting 
jQuery.support.cors = true;

var widgetIframe = document.getElementById('sc-widget'),
    widget       = SC.Widget(widgetIframe)

var newWidgetUrl = 'http://api.soundcloud.com/tracks/',
    CLIENT_ID    = '4239480cae2f5248323140b7c47958e9'


var dummy_data = [
					{'name':'Drum & Base',
					 'selected':true,
					 'currentTrack':0,
					 'description':'Random DnB mixes from SC',
					 'tracks':[
						{'url':'http://api.soundcloud.com/tracks/32974352',
						 'title':'Gone too long [clip] by Fizikz',
						 'action':'Play',},

						{'url':'http://api.soundcloud.com/tracks/33913749',
						 'title':'Electro-House Mini Mix Jan \'12 [DnB² Exclusive]',
						 'action':'Play'},

						{'url':'http://api.soundcloud.com/tracks/28076569',
						 'title':'From The Creator To The Mainframe',
						 'action':'Play'},

						{'url':'http://api.soundcloud.com/tracks/8368998',
						 'title':'Railgun',
						 'action':'Play'},

						{'url':'http://api.soundcloud.com/tracks/49132636',
						 'title':'Bachelors Of Science - Strings Track (Apex Remix)',
						 'action':'Play'},
						 
					 ]
					},

					{'name':'Arabian Dubstep',
					 'selected':false,
					 'currentTrack':0,
					 'description':'Random Arabian Dubstep Clips',
					 'tracks':[
						{'url':'http://api.soundcloud.com/tracks/39852011',
						 'title':'Alican Saygin - Arabic Dubstep',
						 'action':'Play',},

						{'url':'http://api.soundcloud.com/tracks/16690322',
						 'title':'Arabic Dubstep maxime',
						 'action':'Play'},
						 
					 ]
					},
					

				]