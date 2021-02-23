app.controller('indexController',['$scope', 'indexFactory' ,($scope , indexFactory) => {

    $scope.messages = [ ];

    $scope.init = () => {
      const username = prompt('Please enter username');
      if(username)
          initSocket(username);
      else
          return false;
    };

    function initSocket(username) {
        indexFactory.connectSocket('http://localhost:3000/', {
            reconnectionAttempts : 3,
            reconnectionDelay : 600
        }).then((socket) => {
            console.log('bağlantı gerçekleşti',socket);
            socket.emit('newUser',{username});

            socket.on('newUser',(data) => {
                const messageData = {
                    type :{
                        code : 0, // server or user message
                        message : 1 // login or disconnect message
                    } , //info
                    username : data.username
                };

                $scope.messages.push(messageData);
                $scope.$apply();
            });

            socket.on('disUser',(data) => {
                const messageData = {
                    type : {
                        code : 0,
                        message : 0
                    },
                    username : data.username
                };

                $scope.messages.push(messageData);
                $scope.$apply();
            });



        }).catch((err) => {
            console.log(err);
        });
    }


}]);