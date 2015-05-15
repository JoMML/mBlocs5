user = "nouser";
selectedTicket = {};
todosBloc = {};
todosPAP = {};
selectedUser = '';
selectedCom = {};
selectedCuenta = {};

var People = "[]";
var d = new Date();

var myProfile = "[]";
todos = {};
selectedChat = {};
var module = ons.bootstrap('my-app', ['onsen'], function($httpProvider) {
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	/**
	 * The workhorse; converts an object to x-www-form-urlencoded serialization.
	 * @param {Object} obj
	 * @return {String}
	 */
	var param = function(obj) {
		var query = '',
		    name,
		    value,
		    fullSubName,
		    subName,
		    subValue,
		    innerObj,
		    i;

		for (name in obj) {
			value = obj[name];

			if ( value instanceof Array) {
				for ( i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if ( value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [
	function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
});
module.controller('AppController', function($scope, $http) {

	$scope.miPerfil = function() {
		$http.get('http://empowerlabs.com/proyectos/helpDesk/getUserData.php?user=' + user).success(function(data, status, headers, config) {
			//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
			$myDataProfile = data;
			myProfile = data;
			$scope.mydata = $myDataProfile;
			//ons.notification.alert({message: ''+user, title:"Intellibanks"});
		}).error(function(data, status, headers, config) {

		});
	};
});

module.controller('PageController', function($scope) {

	ons.ready(function() {
		// Init code here

	});

	$scope.miPerfil();
});

module.controller('MensajeController', function($scope, $timeout, $http) {

	if (user == "nouser") {
		menu.setMainPage('login2.html');
	}
	$scope.timeInMs = 0;
	$scope.res = {};
	$scope.mensajeBox = {};
	$scope.size = 0;
	$scope.previa = selectedChat;
	$scope.getMensajes = function() {
		$http.get('http://alexrojas.cloudapp.net/web/chat/getChat.php?chat=' + selectedChat.who).success(function(data) {
			if ($scope.size == data.detail.length) {

			} else {

				for ( i = 0; i < data.detail.length; i++) {
					if (data.detail[i].from == user)
						data.detail[i].clase = "derecha";
					else
						data.detail[i].clase = "izquierda";
				}
				$scope.res = data.detail.reverse();
				$scope.size = $scope.res.length;
			}

		});
	};
	$scope.getMensajes();
	var countUp = function() {
		$scope.timeInMs += 500;
		$scope.getMensajes();
		$timeout(countUp, 500);
	};
	$timeout(countUp, 500);
	$scope.enviarMensaje = function() {
		//$scope.ons.notification.alert({title:'EmpowerLabsIntra', message:'Enviando ...'});
		$http.get('http://alexrojas.cloudapp.net/web/chat/send.php?from=' + user + '&to=' + selectedChat.who2 + '&message=' + $scope.mensajeBox.message + '&who=' + selectedChat.who + '&date=' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '&time=' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()).success(function(data) {
			$scope.getMensajes();
			$scope.mensajeBox = {};

		});
	};
}).config(['$httpProvider',
function($httpProvider) {
	$httpProvider.defaults.timeout = 5000;
}]);

module.controller('ChatsController', function($scope, $timeout, $http) {

	if (user == "nouser") {
		menu.setMainPage('login2.html');
	}
	$scope.res = {};
	$scope.mensajeBox = {};
	$scope.size2 = 0;

	$scope.getChats = function() {
		$http.get('http://alexrojas.cloudapp.net/web/chat/myChats.php?me=' + user).success(function(data) {
			if ($scope.size == data.detail.length) {

			} else {
				for ( i = 0; i < data.detail.length; i++) {
					data.detail[i].who2 = data.detail[i].who.replace("-", " ").replace(user, " ");
				}
				$scope.res = data.detail.reverse();
				$scope.size = $scope.res.length;
			}

		});
	};
	$scope.getChats();
	var countUp2 = function() {
		$scope.getChats();
		$timeout(countUp2, 500);
	};
	$timeout(countUp2, 500);
	$scope.nuevoMensaje = function() {
		$scope.ons.navigator.pushPage('nuevoMensaje.html', {
			animation : 'lift'
		});
	};
	$scope.showChat = function(r) {
		selectedChat = r;
		$scope.ons.navigator.pushPage('mensajes.html');
	};
}).config(['$httpProvider',
function($httpProvider) {
	$httpProvider.defaults.timeout = 5000;
}]);

module.controller('newMessageController', function($scope, $dataPeople, $http) {
	$http.get('http://empowerlabs.com/proyectos/helpDesk/getUsers.php').success(function(data, status, headers, config) {
		//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
		$dataPeople = data;
		People = data;
		$scope.data = $dataPeople;
		$scope.newMessage = function(i) {
			selectedUser = i;
			arr = [user, selectedUser];
			arr.sort();
			arr.reverse();
			$http.get('http://alexrojas.cloudapp.net/web/chat/newChat.php?from=' + user + '&to=' + selectedUser + '&who=' + arr[0] + '-' + arr[1] + '&message=' + user + ' ha iniciado chat' + '&date=' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '&time=' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()).success(function(data, status, headers, config) {

				$scope.ons.navigator.popPage('chats.html', {
					title : i
				});
			});
		};
	}).error(function(data, status, headers, config) {

	});
});
module.factory('$dataPeople', function() {
	var dataPeople;
	dataPeople = People;

	return dataPeople;
});

module.controller('TicketsController', function($scope, $dataTickets, $http) {
	$scope.items = todos;
	$http.get('http://empowerlabs.com/proyectos/trackersAPI/EmpowerLabsIntra/tickettracker/todos.php').success(function(data, status, headers, config) {

		data.reverse();
		$dataTickets.items = data;
		todos = data;
		$scope.items = $dataTickets.items;
	});
	$scope.showTicket = function(item) {
		$dataTickets.selectedItem = item;
		$scope.ons.navigator.pushPage('ticket.html');
	};
});

module.factory('$dataTickets', function() {
	var dataTickets = {};
	dataTickets.items = todos;

	return dataTickets;
});

module.controller('NewTicketController', function($scope) {
});

module.controller('TicketIndividualController', function($scope, $dataTickets) {
	$scope.item = $dataTickets.selectedItem;
});

module.controller('LoginController', function($scope, $http) {
	$scope.formLogin = {};
	$scope.login = function() {
		$http.get('http://empowerlabs.com/landing-pages/Martin/Usuarios/ingreso.php?nombre=' + $scope.formLogin.nombre + '&pass=' + $scope.formLogin.pass).success(function(data, status, headers, config) {
			if (data.code == "OK") {
				user = data.user;
				//ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
				$scope.miPerfil();
				menu.setMainPage('chats.html');
			} else {
				ons.notification.alert({
					message : '' + data.respuesta,
					title : "Intellibanks"
				});
			}
		});
	};

});
module.factory('$myDataProfile', function() {
	var myDataProfile;
	myDataProfile = myProfile;

	return myDataProfile;
});
module.controller('ECommunicator', function($scope, $http) {
	$http.get("http://empowerlabs.com/intellibanks/data/EmpowerLabsIntra/DBTXTjson.php").success(function(response) {
		$scope.names = response.arr;
	});
	$scope.showCom = function(name) {
		selectedCom = name;
		$scope.ons.navigator.pushPage('detailComunicado.html');
	};
});

module.controller('DetailComunicadoController', function($scope) {
	$scope.com = selectedCom;
});

module.controller('videoController', function($scope, $dataBloc) {
	$scope.item=$dataBloc.selectedItem;
	$scope.urlVideo = $dataBloc.selectedItem.Url;
	videos = document.querySelectorAll("video");
	video = videos[0];
	video.src = ''+$dataBloc.selectedItem.Url;
});

module.controller('AudioController', function($scope, $dataBloc) {
	$scope.item=$dataBloc.selectedItem;
	$scope.urlAudio = $dataBloc.selectedItem.Url;
	audios = document.querySelectorAll("Audio");
	audio = audios[0];
	audio.src = ''+$dataBloc.selectedItem.Url;
});

module.controller('ImagenController', function($scope, $dataBloc) {
    $scope.item=$dataBloc.selectedItem;
	$scope.urlImagen = $dataBloc.selectedItem.Url;
	Imagenes = document.querySelectorAll("img");
	Imagen = Imagenes[0]; 
	Imagen.src = ''+$dataBloc.selectedItem.Url;
});

module.controller('BlocController', function($scope, $dataBloc, $http) {
	$scope.items = todosBloc;
	$http.get('http://empowerlabs.com/proyectos/trackersAPI/mblocs2/todos.php').success(function(data, status, headers, config) {
		data.reverse();
		$dataBloc.items = data;
		todosBloc = data;
		$scope.items = $dataBloc.items;
		$scope.showBloc = function(item) {
			var selectedItem = item;
			$dataBloc.selectedItem = selectedItem;
			if (item.Format == 'Video') {
				//alert(''+item.Format);
				$scope.ons.navigator.pushPage('video.html');
			}
			else if(item.Format == 'Audio')
			{
				$scope.ons.navigator.pushPage('Audio.html');
			}
			else if(item.Format == 'Imagen')
			{
				$scope.ons.navigator.pushPage('Imagen.html');
			}
			else
			{}

		};
	}).error(function(data, status, headers, config) {

	});
});

module.factory('$dataBloc', function() {
	var data = {};

	data.items = todosBloc;

	return data;
});

module.controller('DetailBlocController', function($scope, $dataBloc) {
	$scope.item = $dataBloc.selectedItem;
	//navigator.notification.vibrate(2000); //milliseconds
	//navigator.notification.beep(2); // numbr of times
});

module.controller('PAPController', function($scope, $dataPAP, $http) {
	$scope.items = todosPAP;
	$http.get('http://empowerlabs.com/landing-pages/Leonel/prueba/pap.php').success(function(data, status, headers, config) {
		data.reverse();
		$dataPAP.items = data;
		todosPAP = data;
		$scope.items = $dataPAP.items;
		$scope.showPap = function(item) {
			var selectedItem = item;
			$dataPAP.selectedItem = selectedItem;
			$scope.ons.navigator.pushPage('PAPdetail.html', {
				title : selectedItem.title
			});
		};
	}).error(function(data, status, headers, config) {

	});
});

module.factory('$dataPAP', function() {
	var data = {};

	data.items = todosPAP;

	return data;
});

module.controller('DetailPAPController', function($scope, $dataPAP) {
	$scope.item = $dataPAP.selectedItem;
	//navigator.notification.vibrate(2000); //milliseconds
	//navigator.notification.beep(2); // numbr of times
});

module.controller('WorkflowController', function($scope) {
	$scope.cuentas = function() {
		$scope.ons.navigator.pushPage('modCuentas.html');
	};
	$scope.contactos = function() {
		$scope.ons.navigator.pushPage('modContactos.html');
	};
	$scope.pipeline = function() {
		$scope.ons.navigator.pushPage('modPipeline.html');
	};
});

module.controller('modCuentasController', function($scope, $http) {
	$scope.base = {};
	$http.get('http://www.empowerlabs.com/intellibanks/data/Sandbox/JSonCuentas.php').success(function(data) {
		$scope.base = data;
	});
	$scope.cuentaOne = function(b) {
		selectedCuenta = b;
		$scope.ons.navigator.pushPage('cuentas.html');
	};
});

module.controller('modContactosController', function($scope, $http) {
	$scope.base = {};
	$http.get('http://www.empowerlabs.com/intellibanks/data/Sandbox/JSonContactos.php').success(function(data) {
		$scope.base = data;
	});
	$scope.contactoOne = function(b) {
		selectedContacto = b;
		$scope.ons.navigator.pushPage('contactos.html');
	};
});

module.controller('modPipelineController', function($scope, $http) {
	$scope.base = {};
	$http.get('http://www.empowerlabs.com/intellibanks/data/Sandbox/JSonPipeline.php').success(function(data) {
		$scope.base = data;
	});
	$scope.pipelineOne = function(b) {
		selectedPipeline = b;
		$scope.ons.navigator.pushPage('pipeline.html');
	};
});

module.controller('cuentasController', function($scope) {
	$scope.b = selectedCuenta;
});

module.controller('contactosController', function($scope) {
	$scope.b = selectedContacto;
});

module.controller('pipelineController', function($scope) {
	$scope.b = selectedPipeline;
});

module.controller('HomeController', function($scope) {

});

	Imagen.src = ''+$dataBloc.selectedItem.Url;