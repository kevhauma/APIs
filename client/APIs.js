var App = angular.module('PrikbordApp', []);
      App.controller('MainController', function($scope,$window, $http,$interval) { 
          $scope.cardNumber=4242424242424242;
          $scope.weatherPlace = "antwerp"
          $scope.taskgiver = "";
          //convert from FacebookAPI to useable data
        parseParams = function() {
            var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g,m;
            while (m = regex.exec(queryString)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            return params;
        };
        params = parseParams();
        var GETRandomName = function(){
            
        };              
          //get user from facebook response
        if (params.access_token) {
            $http({
            method: 'GET',
            url: 'https://graph.facebook.com/v2.5/me?fields=id,name&access_token=' + params.access_token
        }).then(function (response){
                $scope.taskgiver = response.data.name;
            }, function (err){
            $scope.LoginStatus = err;
        });
    }   
          //login with facebook
        $scope.login = function(){
         window.location.href="https://www.facebook.com/dialog/oauth?client_id=1744370535873150&response_type=token&redirect_uri=http://localhost:5000/"  
      };           
            //getmessages
        $scope.GETMessages = function(){
	       $http.get('https://prikbord-74c3d.firebaseio.com/messages.json').then
            (function(response){
                $scope.messages = response.data;
            });
        };        
          //try sending message
        $scope.POSTMessage = function(){           
            if ($scope.person){
                if ($scope.descr){
                     if ($scope.taskgiver === ""){
                        $http.get('https://uinames.com/api/')
                        .then
                            (function(response){
                                $scope.RandomName = response.data;
                            })
                        .then
                            (function(response){                   
                                $scope.taskgiver = $scope.RandomName.name + " " + $scope.RandomName.surname
                            })
                         .then
                            (function(){POSTFullMessage();});                    
                    }
                    else {POSTFullMessage();};
                }
                else {alert("no message");};
            }
            else {
                alert("no person");
            };
        };
          //POST message after checks
          var POSTFullMessage = function(){
            $http.post('https://prikbord-74c3d.firebaseio.com/messages.json',
            '{"person":"' + $scope.person + '","description":"' +   $scope.descr + '","taskgiver":"' + $scope.taskgiver + '"}')
            .then
                (function(response){
                    $scope.GETMessages();        
                });
                $scope.person = "";
                $scope.descr = "";
                };
          //attempt to delete
        $scope.DELMessage =function(msgID){
            $http.delete('https://prikbord-74c3d.firebaseio.com/messages/' + msgID  + '.json').then
                (function(response){
                    $scope.GETMessages();
                });
            
        };
        //gettoken Via Stripe
        var GETToken = function(successCb) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/tokens',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer sk_test_UrInNNolW4lo2LNCyQeEWy9X'
            },
            data: 'card[number]=' + $scope.cardNumber + '&card[exp_month]=' + $scope.cardExpMonth + '&card[exp_year]=' + $scope.cardExpYear + '&card[cvc]=' + $scope.cardCvc
          };
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
          $http(request).then(function (data) {
            debugger;
            var StripeToken = data.data.id;
          }, errCb).catch(errCb);
            PostDonation();
        };
        //donation Via stripe
        $scope.POSTDonation = function(StripeToken) {
          var request = {
            method: 'POST',
            url: 'https://api.stripe.com/v1/charges',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'bearer sk_test_UrInNNolW4lo2LNCyQeEWy9X'
            },
            data: 'amount=' + $scope.Amount + '&currency=' + $scope.Currency + '&source=' + StripeToken + '&description=donations!'};
		  //indien error
          var errCb = function(err) {
            alert("Wrong " + JSON.stringify(err));
          };
		  //geen idee
          $http(request).then(function (data) {
            debugger;
              alert("donated successfully!");            
          }, errCb).catch(errCb);
        };
        //get weatherfrom openWeathermap
        $scope.GETWeather = function(){
            $http.get('http://api.apixu.com/v1/current.json?key=2464bf5284554a2384c170718171905&q=' + $scope.weatherPlace).then
                (function(response){
                    $scope.weather = response.data;
                });
        };     
        
        
      });
      