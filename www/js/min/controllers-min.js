angular.module("starter.controllers",[]).controller("AppCtrl",function(o,e,t){o.loginData={},e.fromTemplateUrl("templates/login.html",{scope:o}).then(function(e){o.modal=e}),o.closeLogin=function(){o.modal.hide()},o.login=function(){o.modal.show()},o.doLogin=function(){console.log("Doing login",o.loginData),t(function(){o.closeLogin()},1e3)}}).controller("AJAXCtrl",function(o,e){o.doRefresh=function(){e.get("http://www.the-hybrid.co.uk/api.php?request=get_lore_posts").then(function(o){console.log("Success",o),drawLore(o.data)},function(o){console.log("ERR",o)}),o.$broadcast("scroll.refreshComplete")}}).controller("LoginCtrl",function(o,e){o.data={},o.showPopup=function(o,t){e.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";var n="d55194bead47cbdd71591b73f6465e53",l="admin@the-hybrid.co.uk",i=encodeURIComponent(n),a=encodeURIComponent(l);e({method:"POST",url:"http://www.the-hybrid.co.uk/api.php",data:$.param({request:"get_user_data",username:a,password:i}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,e,t,n){console.log(n.data),console.warn(o)}),e({method:"POST",url:"http://www.jamesrwilliams.co.uk/hybrid/api.php",data:$.param({request:"user_data",username:a,password:i}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,e,t,n){console.log("James' "+o)})}}).controller("MapCtrl",function(o,e,t){initialise()}).controller("PlaylistsCtrl",function(o){o.playlists=[{title:"Zombies",id:1},{title:"70px",id:2},{title:"Dubstep",id:3},{title:"Indie",id:4},{title:"Rap",id:5},{title:"Cowbell",id:6}]}).controller("PlaylistCtrl",function(o,e){});